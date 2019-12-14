import React, {useContext, useState, useMemo} from 'react';
import {Button, KIND, SIZE} from 'baseui/button';
import {RoutePaths} from '../../constants';
import {useFrostedStyletron} from '../util';
import {COUNTRIES} from 'baseui/phone-input';
import {FormControl} from 'baseui/form-control';
import {Input} from 'baseui/input';
import {ClientForm, ClientFormState} from '../events/client-form';
import {VendorKinds} from '../../constants/vendor-kind';
import {VendorsContext} from '../contexts/vendors';
import {EventContext} from '../event/context';
import {Select} from 'baseui/select';

export const NewVendorPage = ({history}) => {
  const [css, theme] = useFrostedStyletron();

  const formStyles = css({
    width: '560px',
    marginLeft: 'auto',
    marginRight: 'auto',
  });
  const formWrapperStyles = css({
    flexGrow: 1,
  });
  const footerStyles = css({
    backgroundColor: '#FFFFFF',
    width: '100%',
    flex: '0 0 72px',
    boxShadow: '1px 0 4px 0 #F1F4F7',
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.sizing.scale1000,
  });
  const buttonSectionStyles = css({
    width: '350px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });
  const buttonStyles = {
    width: '160px',
    ...theme.typography.font300,
  };

  const panelStyles = css({
    background: '#FFFFFF',
    padding: `${theme.sizing.scale800} ${theme.sizing.scale1000}`,
    marginBottom: theme.sizing.scale800,
  });
  const titleStyles = css({...theme.typography.font550});

  const {
    state: {createVendorLoading},
    actions: {createVendor},
  } = useContext(VendorsContext);
  const {event} = useContext(EventContext);

  const vendorKindOptions = useMemo(
    () =>
      Object.keys(VendorKinds).map(kind => ({
        id: kind,
        label: kind,
      })),
    []
  );

  const [vendorName, setVendorName] = useState('');
  const [vendorKind, setVendorKind] = useState([vendorKindOptions[0]]);
  const [vendorLocation, setVendorLocation] = useState('');
  const defaultClientFormState: ClientFormState = {
    name: '',
    email: '',
    phone: '',
    country: COUNTRIES.US,
  };
  const [contactInfo, setContactInfo] = useState(defaultClientFormState);

  return (
    <>
      <div className={formWrapperStyles}>
        <div className={formStyles}>
          <div className={css({...theme.titleFont})}>Add new vendor</div>
          <div className={css({...theme.typography.font300})}>
            Enter important information about your vendor
          </div>
          <div className={css({marginTop: theme.sizing.scale900})}>
            <div>
              <div className={panelStyles}>
                <div className={titleStyles}>Basic Information</div>
                <FormControl label="Vendor Name" caption="">
                  <Input
                    value={vendorName}
                    onChange={(e: any) => setVendorName(e.target.value)}
                  />
                </FormControl>
                <div className={css({display: 'flex'})}>
                  <div
                    className={css({
                      marginRight: theme.sizing.scale700,
                      flexGrow: 1,
                    })}
                  >
                    <FormControl label="Date" caption="">
                      <Select
                        options={vendorKindOptions}
                        value={vendorKind}
                        placeholder="Select color"
                        onChange={params => setVendorKind(params.value as any)}
                        clearable={false}
                      />
                    </FormControl>
                  </div>
                  <div className={css({flexGrow: 1})}>
                    <FormControl label="Location" caption="">
                      <Input
                        value={vendorLocation}
                        onChange={(e: any) => setVendorLocation(e.target.value)}
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className={panelStyles}>
                <ClientForm state={contactInfo} setState={setContactInfo} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={footerStyles}>
        <div className={buttonSectionStyles}>
          <Button
            size={SIZE.compact}
            $style={buttonStyles}
            isLoading={createVendorLoading}
            onClick={async () => {
              await createVendor({
                eventId: event.id,
                name: vendorName,
                location: vendorLocation,
                vendorKind: vendorKind[0].id as VendorKinds,
                contact: {
                  name: contactInfo.name,
                  email: contactInfo.email,
                  phone: contactInfo.country.dialCode + contactInfo.phone,
                },
              });
              history.push(RoutePaths.EventVendors(event.id));
            }}
          >
            Save Changes
          </Button>
          <Button
            size={SIZE.compact}
            $style={buttonStyles}
            kind={KIND.tertiary}
            onClick={() => history.push(RoutePaths.EventVendors(event.id))}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};
