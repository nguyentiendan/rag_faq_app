'use client';
import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    setStatus({ type: null, message: '' });
    
    const formData = new FormData();
    formData.append('files', e.target.files[0]);

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', message: `Uploaded: ${data.filename} (${data.chunks} chunks)` });
      } else {
        setStatus({ type: 'error', message: data.detail || 'Upload failed' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to connect to server' });
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-lg">Upload Document</h3>
      </div>
      
      <div className="relative group">
        <input 
          type="file" 
          accept=".pdf,.docx" 
          onChange={handleUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-200 group-hover:border-blue-400 group-hover:bg-blue-100'}
        `}>
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Processing document...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <FileText className="w-8 h-8" />
              <p className="font-medium">Click or drag PDF/DOCX here</p>
            </div>
          )}
        </div>
      </div>

      {status.type && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
          status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {status.message}
        </div>
      )}
    </div>
  );
}
