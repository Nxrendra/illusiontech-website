'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';

export default function VideoUploader({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadClick = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // This is the client-side call you were looking for
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload-blob',
      });

      console.log('Upload successful:', newBlob.url);
      onUploadSuccess(newBlob.url);
      alert('Upload completed successfully!');
    } catch (err) {
      console.error('Client-side upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please check server logs.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Upload Service Video</h3>
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="video/mp4,video/webm"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
      >
        {isUploading ? 'Uploading...' : 'Start Upload'}
      </button>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}