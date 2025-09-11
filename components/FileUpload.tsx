'use client';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export interface FileData {
  url: string;
  filename: string;
  size: number;
}

type Props = {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
};

export default function FileUpload({ files, onFilesChange }: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setIsUploading(true);
    toast.info(`Rozpoczynam wysyłanie ${selectedFiles.length} plików...`);

    try {
      const newBlobs = await Promise.all(
        Array.from(selectedFiles).map(file => 
          upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/upload-blob',
          })
        )
      );
      const newFiles: FileData[] = newBlobs.map((blob, index) => ({
        url: blob.url,
        filename: selectedFiles[index].name,
        size: selectedFiles[index].size,
      }));
      onFilesChange([...files, ...newFiles]);
      toast.success('Wszystkie pliki zostały pomyślnie wysłane!');
    } catch (error) {
      console.error(error);
      toast.error('Wystąpił błąd podczas wysyłania pliku.');
    } finally {
      setIsUploading(false);
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };

  const humanSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${['B', 'KB', 'MB', 'GB'][i]}`;
  }

  return (
    <div>
      <div
        className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 text-center ${isUploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
        onClick={() => !isUploading && inputFileRef.current?.click()}
      >
        <input ref={inputFileRef} type="file" multiple hidden onChange={handleFileChange} disabled={isUploading} />
        <p className="text-sm">{isUploading ? 'Przesyłanie...' : 'Kliknij, aby wybrać pliki'}</p>
        <p className="mt-1 text-xs text-gray-500">Do 5 plików, max 10MB każdy</p>
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file) => (
            <li key={file.url} className="rounded-md border border-gray-200 p-2 flex items-center justify-between">
              <div className="min-w-0">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-blue-600 hover:underline">{file.filename}</a>
                <div className="text-xs text-gray-500">{humanSize(file.size)}</div>
              </div>
              <span className="text-green-500 text-sm">✔</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
