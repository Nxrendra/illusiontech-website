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

// Whitelist of font sizes to display in the toolbar.
const FONT_SIZES = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '24px', '36px'];

// Predefined color palette for the toolbar.
const COLORS = ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'];

// Dynamically import ReactQuill to prevent SSR issues, as it needs the `window` object.
// The `ref` prop is not forwarded by `next/dynamic`, so we need to create a wrapper
// that accepts a `forwardedRef` prop and passes it to the underlying `ReactQuill` instance.
const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import('react-quill');

  // Add our desired fonts and sizes to Quill's whitelist so they are not stripped.
  const Font = RQ.Quill.import('formats/font');
  Font.whitelist = FONT_WHITELIST;
  RQ.Quill.register(Font, true);

  const Size = RQ.Quill.import('formats/size');
  Size.whitelist = FONT_SIZES;
  RQ.Quill.register(Size, true);

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
  'header', 'font', 'size',
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
        [{ 'header': [1, 2, 3, false] }, { 'font': FONT_WHITELIST }, { 'size': FONT_SIZES }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'color': COLORS }, { 'background': [] }],
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