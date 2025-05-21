import { useState } from 'react';

export default function PdfUpload({ onTextExtracted }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      onTextExtracted(data.text || '');
    } catch (err) {
      console.error('Upload error:', err);
      onTextExtracted('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {loading && <p className="text-gray-500 mt-2">Parsing PDF...</p>}
    </div>
  );
}