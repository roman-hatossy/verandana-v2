'use client';
import * as React from 'react';
import { toast } from 'sonner';

export interface FileData {
  id: string;
  file: File;
  name: string;
  size: number;
}
function humanSize(n: number) {
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0, s = n;
  while (s >= 1024 && i < u.length - 1) { s /= 1024; i++; }
  return `${s.toFixed(1)} ${u[i]}`;
}
export default function FileUpload({ onFilesChange }: { onFilesChange: (files: FileData[]) => void }) {
  const [files, setFiles] = React.useState<FileData[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list);
    const maxFiles = 5;
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (files.length + arr.length > maxFiles) {
      toast.error(`Maksymalnie ${maxFiles} plików`);
      return;
    }
    const tooBig = arr.find(f => f.size > maxSizeBytes);
    if (tooBig) {
      toast.error(`Plik za duży: ${tooBig.name}`);
      return;
    }
    const newItems: FileData[] = arr.map(f => ({
      id: self.crypto.randomUUID(),
      file: f, name: f.name, size: f.size
    }));
    const nextFiles = [...files, ...newItems];
    setFiles(nextFiles);
    onFilesChange(nextFiles);
  };
  
  const removeFile = (id: string) => {
    const nextFiles = files.filter(item => item.id !== id);
    setFiles(nextFiles);
    onFilesChange(nextFiles);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => addFiles(e.currentTarget.files)}
      />
      <div
        onClick={() => inputRef.current?.click()}
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 text-center hover:bg-gray-50"
      >
        <p className="text-sm">Kliknij, aby wybrać pliki lub upuść je tutaj</p>
        <p className="mt-1 text-xs text-gray-500">Do 5 plików, max 10MB każdy</p>
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map(f => (
            <li key={f.id} className="rounded-md border border-gray-200 p-2 flex items-center justify-between">
              <div className="truncate text-sm font-medium">{f.name} ({humanSize(f.size)})</div>
              <button type="button" onClick={() => removeFile(f.id)} className="text-red-500 text-xs">Usuń</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
