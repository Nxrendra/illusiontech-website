'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef, useCallback, type Ref } from 'react';
import type { default as ReactQuillType, ReactQuillProps } from 'react-quill';
import { toast } from 'sonner';
import 'react-quill/dist/quill.snow.css'; // Import Quill's snow theme styles

// Whitelist of fonts to display in the toolbar.
const FONT_WHITELIST = [
  'sans-serif', 'serif', 'monospace',
  'arial', 'comic-sans-ms', 'courier-new', 'georgia', 'helvetica',
  'lucida-sans-unicode', 'tahoma', 'times-new-roman', 'trebuchet-ms', 'verdana'
];

// Dynamically import ReactQuill to prevent SSR issues, as it needs the `window` object.
// The `ref` prop is not forwarded by `next/dynamic`, so we need to create a wrapper
// that accepts a `forwardedRef` prop and passes it to the underlying `ReactQuill` instance.
const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import('react-quill');

  // Add our desired fonts to Quill's whitelist.
  const Font = RQ.Quill.import('formats/font');
  Font.whitelist = FONT_WHITELIST;
  RQ.Quill.register(Font, true);

  // eslint-disable-next-line react/display-name
  return ({ forwardedRef, ...props }: { forwardedRef: Ref<ReactQuillType> } & ReactQuillProps) => (
    <RQ ref={forwardedRef} {...props} />
  );
}, {
  ssr: false, loading: () => <div className="h-[361px] w-full bg-muted rounded-md animate-pulse" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Define the formats Quill should support.
const formats = [
  'header', 'font',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'color', 'background',
  'list', 'bullet', 'indent',
  'align',
  'link', 'image', 'video'
];

export default function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuillType>(null);

  const imageHandler = useCallback(async () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const toastId = toast.loading('Uploading image...');
      const formData = new FormData();
      formData.append('file', file);

      try {
        // You need to create this API endpoint to handle file uploads
        const response = await fetch('/api/admin/newsletter/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!response.ok) {
          const errorResult = await response.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(errorResult.error);
        }

        const { url } = await response.json(); // Assuming your API returns { url: '...' }

        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', url);
        editor.setSelection(range.index + 1, 0);
        toast.success('Image uploaded successfully!', { id: toastId });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image.';
        console.error('Image upload error:', error);
        toast.error(errorMessage, { id: toastId });
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }, { 'font': FONT_WHITELIST }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), [imageHandler]);

  return (
    <div className="bg-background rounded-md border border-input prose-p:my-0 prose-h1:my-0 prose-h2:my-0 prose-h3:my-0">
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} placeholder={placeholder} readOnly={disabled} className="[&_.ql-editor]:min-h-[300px]"
      />
    </div>
  );
}