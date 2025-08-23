'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill's snow theme styles

// Dynamically import ReactQuill to prevent SSR issues, as it needs the `window` object.
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Define the modules for the Quill editor toolbar to customize its features.
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

// Define the formats Quill should support.
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

export default function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  return (
    <div className="bg-background rounded-md border border-input prose-p:my-0 prose-h1:my-0 prose-h2:my-0 prose-h3:my-0">
      <ReactQuill
        theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} placeholder={placeholder} readOnly={disabled} className="[&_.ql-editor]:min-h-[300px]"
      />
    </div>
  );
}