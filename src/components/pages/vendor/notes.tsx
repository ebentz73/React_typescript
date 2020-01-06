import React, {useContext} from 'react';
import {useFrostedStyletron} from '../../util';
import {RichTextEditor} from '../../common/rich-text/rich-text-editor';
import {VendorContext} from '../../contexts/vendor';

export const NotesPage = () => {
  const [css] = useFrostedStyletron();
  const headerStyles = css({
    fontSize: '18px',
    marginLeft: '32px',
    marginTop: '20px',
    marginBottom: '26px',
  });

  const {
    state: {vendor},
    actions: {updateNote},
  } = useContext(VendorContext);

  return (
    <div>
      <div className={headerStyles}>Vendor Notes</div>
      <RichTextEditor
        existingRichTextId={vendor.notesRichTextId}
        autosave={{delay: 2000}}
        onSave={newRichTextId => {
          if (newRichTextId !== vendor.notesRichTextId) {
            updateNote(vendor.id, newRichTextId);
          }
        }}
        placeholderText="Enter notes here"
        embeddedView={true}
      />
    </div>
  );
};
