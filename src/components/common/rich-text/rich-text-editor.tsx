import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
  useEffect,
} from 'react';
import {useDebounce} from 'use-debounce';
import {unwrap, safeUnwrap} from '../../../util';
import {useOnChangeEffect, useLatestValue} from '../../util';
import {Prompt} from 'react-router';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  UpsertRichTextMutation,
  UpsertRichTextMutationType,
} from '../../mutations';
import {EventContext} from '../../event/context';
import {RichTextQueryType, RichTextQuery} from '../../queries';
import {QuillEditor, QuillEditorRef} from './quill-editor';

interface Props {
  existingRichTextId: string | null;
  onSave?: (richTextId: string) => void;
  autosave?: {delay: number};
  placeholderText?: string;
  embeddedView?: boolean;
}

export interface RichTextEditorRef {
  save: () => Promise<string>;
}

function RichTextEditorInternal(
  {existingRichTextId, onSave, autosave, placeholderText, embeddedView}: Props,
  ref
) {
  const {data: serverData} = useQuery<RichTextQueryType>(RichTextQuery, {
    variables: {id: existingRichTextId},
    skip: !existingRichTextId,
  });
  const [upsertRichText] = useMutation<UpsertRichTextMutationType>(
    UpsertRichTextMutation
  );

  const {event} = useContext(EventContext);
  const [text, setText] = useState(null);
  const [debouncedText] = useDebounce(text, autosave ? autosave.delay : 0);

  const latestServerDataRef = useLatestValue(serverData);
  const save = async (text): Promise<string> => {
    const newData = JSON.stringify(text);
    const oldData = safeUnwrap(
      latestServerDataRef.current,
      d => d.richText.data
    );
    if (newData === oldData) {
      return unwrap(existingRichTextId);
    }

    const {data} = await upsertRichText({
      variables: {
        richText: {
          id: existingRichTextId,
          eventId: event.id,
          data: newData,
        },
      },
    });
    const newRichTextId = unwrap(data).upsertRichText.id;
    onSave && onSave(newRichTextId);
    return newRichTextId;
  };

  // Provide save as a directly callable function to the parent
  useImperativeHandle(ref, () => ({
    save: async () => {
      return await save(text);
    },
  }));
  // Also save periodically if autosave enabled
  useOnChangeEffect(() => {
    if (autosave) {
      save(debouncedText);
    }
  }, [debouncedText]);

  // Pre-populate the initial state of Quill only on the first load of an existing document
  const quillEditorRef = useRef<QuillEditorRef>();
  const isExistingDocument = useRef(Boolean(existingRichTextId));
  const hasLoadedInitialState = useRef(false);
  useEffect(() => {
    if (
      serverData &&
      isExistingDocument.current &&
      !hasLoadedInitialState.current
    ) {
      unwrap(quillEditorRef.current).loadText(serverData.richText.data);
      hasLoadedInitialState.current = true;
    }
  }, [serverData]);

  return (
    <>
      <QuillEditor
        ref={quillEditorRef}
        onTextChange={text => setText(text)}
        embeddedView={embeddedView}
        placeholderText={placeholderText}
      />
      {autosave && (
        <Prompt
          when={
            !serverData || JSON.stringify(text) !== serverData.richText.data
          }
          message="Your document has not finished saving. Are you sure you want to proceed to another page?"
        />
      )}
    </>
  );
}

export const RichTextEditor = forwardRef(RichTextEditorInternal);
