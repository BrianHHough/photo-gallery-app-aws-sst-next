"use client";
import React, { useState } from 'react';

const SSTUpload: React.FC = () => {
  const [url, setUrl] = useState<string>('');

  const fetchPresignedUrl = async () => {
    const response = await fetch('/api/presigned-url');
    const data = await response.json();
    setUrl(data.url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileInput = (e.target as HTMLFormElement).file as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      await fetchPresignedUrl();

      const response = await fetch(url, {
        body: file,
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
          'Content-Disposition': `attachment; filename="${file.name}"`,
        },
      });

      if (response.ok) {
        window.location.href = response.url.split('?')[0];
      } else {
        console.error('File upload failed');
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input name="file" type="file" accept="image/png, image/jpeg" required />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
};

export default SSTUpload;
