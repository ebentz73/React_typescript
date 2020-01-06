import React, {useRef, useEffect, useImperativeHandle, forwardRef} from 'react';
import {unwrap} from '../../../util';
import {Helmet} from 'fusion-plugin-react-helmet-async';

let Quill: any;
if (__BROWSER__) {
  Quill = require('quill');
}
type QuillType = import('quill').Quill;
export type QuillText = any;

interface Props {
  embeddedView?: boolean;
  onTextChange: (text: QuillText) => void;
  placeholderText?: string;
}

export interface QuillEditorRef {
  loadText: (text: string) => void;
}

function QuillEditorInternal(
  {embeddedView, onTextChange, placeholderText}: Props,
  ref
) {
  const quillRef = useRef<QuillType>();
  const editorDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const quill = new Quill(unwrap(editorDivRef.current), {
      theme: 'snow',
      placeholder: placeholderText,
      modules: {
        toolbar: [
          [{header: [1, 2, 3, 4, 5, 6, false]}],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{list: 'ordered'}, {list: 'bullet'}],
          [{script: 'sub'}, {script: 'super'}],
          [{color: []}, {background: []}],
          [{font: []}],
          [{align: []}],
          ['clean'],
        ],
      },
    });
    quill.on('text-change', () => onTextChange(quill.getContents()));
    quillRef.current = quill;
  }, []);

  useImperativeHandle(
    ref,
    () =>
      ({
        loadText: text => {
          const contents = JSON.parse(text);
          unwrap(quillRef.current).setContents(contents, 'api');
        },
      } as QuillEditorRef)
  );

  return (
    <>
      {embeddedView && (
        <Helmet>
          <style>{`
            .ql-toolbar.ql-snow {
              border-left: none;
              border-right: none;
            }
            .ql-container.ql-snow {
              border-left: none;
              border-right: none;
              border-bottom: none;
            }
        `}</style>
        </Helmet>
      )}
      <div ref={editorDivRef}></div>
    </>
  );
}

export const QuillEditor = forwardRef(QuillEditorInternal);
