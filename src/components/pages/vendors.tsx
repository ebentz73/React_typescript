import React, {useState, useContext, useRef, useMemo, useCallback} from 'react';
import {useFrostedStyletron, getTableStyles, MoreOptionsButton} from '../util';
import {StyledTable} from 'baseui/table-grid';
import {Button, KIND, SIZE} from 'baseui/button';
import {StatefulMenu} from 'baseui/menu';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import {Overflow} from 'baseui/icon';
import {
  VendorsContext,
  VendorsContextProvider,
  EditingVendorContext,
} from '../contexts/vendors';
import {useHistory} from 'react-router';
import {RoutePaths} from '../../constants';
import {EventContext} from '../event/context';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';
import {unwrap} from '../../util';
import {VendorSchema} from '../../data/schema-types';

export const VendorsPage = () => (
  <VendorsContextProvider>
    <VendorsPageInternal />
  </VendorsContextProvider>
);

const VendorsPageInternal = () => {
  const {
    state: {vendors, loading},
    actions: {deleteVendor},
  } = useContext(VendorsContext);
  const {setEditingVendor} = useContext(EditingVendorContext);
  const {event} = useContext(EventContext);
  const history = useHistory();
  const [css, theme] = useFrostedStyletron();

  const tableStyles = getTableStyles(theme);
  const headerCellStyles = css(tableStyles.header);
  const cellStyles = css(tableStyles.cell);
  const hoveredCellStyles = css({
    backgroundColor: theme.colors.primary100,
    cursor: 'pointer',
  });
  const [hoveredRow, setHoveredRow] = useState(null as any);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletingVendorId = useRef<string | null>(null);

  const menuItems = useMemo(() => [{label: 'Edit'}, {label: 'Delete'}], []);
  return (
    <>
      <div>
        <div
          className={css({
            ...theme.titleFont,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          })}
        >
          <div>Vendors</div>
          <div>
            <Button
              kind={KIND.primary}
              size={SIZE.compact}
              onClick={() => {
                setEditingVendor(null);
                history.push(RoutePaths.NewVendor(event.id));
              }}
            >
              +
            </Button>
          </div>
        </div>
        <div className={css({marginTop: '24px'})}>
          <StyledTable $gridTemplateColumns="20% 10% 15% 15% 19% 15% 6%">
            <div className={headerCellStyles}>VENDOR</div>
            <div className={headerCellStyles}>CATEGORY</div>
            <div className={headerCellStyles}>LOCATION</div>
            <div className={headerCellStyles}>POINT OF CONTACT</div>
            <div className={headerCellStyles}>EMAIL</div>
            <div className={headerCellStyles}>PHONE</div>
            <div className={headerCellStyles}></div>
            {vendors.map(row => {
              const styles =
                hoveredRow === row
                  ? `${cellStyles} ${hoveredCellStyles}`
                  : cellStyles;
              return (
                <div
                  className={css({display: 'contents'})}
                  key={row.id}
                  onMouseEnter={() => setHoveredRow(row)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() =>
                    history.push(RoutePaths.EventVendor(event.id, row.id))
                  }
                >
                  <div className={styles}>{row.name}</div>
                  <div className={styles}>{row.vendorKind}</div>
                  <div className={styles}>{row.location}</div>
                  <div className={styles}>{row.contact.name}</div>
                  <div className={styles}>{row.contact.email}</div>
                  <div className={styles}>{row.contact.phone}</div>
                  <div className={styles} onClick={e => e.stopPropagation()}>
                    <div>
                      <MoreOptionsButton
                        menuItems={menuItems}
                        onItemSelect={item => {
                          if (item.label === 'Delete') {
                            deletingVendorId.current = row.id;
                            setIsDeleting(true);
                          } else if (item.label === 'Edit') {
                            setEditingVendor(row);
                            history.push(RoutePaths.EditVendor(event.id));
                          }
                        }}
                      >
                        <div>
                          <Overflow
                            size={24}
                            color="#B0AFAF"
                            overrides={{Svg: {style: {cursor: 'pointer'}}}}
                          />
                        </div>
                      </MoreOptionsButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </StyledTable>
        </div>
      </div>
      <Modal
        onClose={() => setIsDeleting(false)}
        closeable
        isOpen={isDeleting}
        animate
      >
        <ModalHeader>Delete vendor?</ModalHeader>
        <ModalBody>Are you sure you want to delete this vendor?</ModalBody>
        <ModalFooter>
          <ModalButton onClick={() => setIsDeleting(false)}>Cancel</ModalButton>
          <ModalButton
            isLoading={loading}
            onClick={async () => {
              await deleteVendor(unwrap(deletingVendorId.current));
              setIsDeleting(false);
            }}
          >
            Delete
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
};
