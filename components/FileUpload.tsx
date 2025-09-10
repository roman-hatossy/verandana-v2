'use client';
import * as React from 'react';

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';
export interface FileData {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: UploadStatus;
  url?: string;
}

type Props = {
  files: FileData[];
  onFilesChange: (files: FileData[] | ((currentFiles: FileData[]) => FileData[])) => void;
  onError?: (message: string, type?: 'error' | 'success') => void;
  accept?: string;
  maxFiles?: number;
  maxSizeBytes?: number;
  className?: string;
};

const DEFAULT_MAX_FILES = 5;
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

function humanSize(n: number) {
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0, s = n;
  while (s >= 1024 && i < u.length - 1) { s /= 1024; i++; }
  const num = s < 10 ? s.toFixed(1) : Math.round(s).toString();
  return `${num} ${u[i]}`;
}

export default function FileUpload({
  files,
  onFilesChange,
  onError,
  accept = 'image/*,application/pdf',
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  className,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | File[]) => {
    const arr = Array.from(list);
    if (files.length + arr.length > maxFiles) {
      onError?.(`Maksymalnie ${maxFiles} plików`);
      return;
    }
    const tooBig = arr.find(f => f.size > maxSizeBytes);
    if (tooBig) {
      onError?.(`Plik za duży: ${tooBig.name} (${humanSize(tooBig.size)})`);
      return;
    }
    const newItems: FileData[] = arr.map(f => ({
      id: crypto.randomUUID(),
      file: f, name: f.name, size: f.size, progress: 0, status: 'uploading',
    }));

    const updatedFiles = [...files, ...newItems];
    onFilesChange(updatedFiles);

    newItems.forEach(item => {
      let ticks = 0;
      const iv = setInterval(() => {
        ticks++;
        onFilesChange(currentFiles => currentFiles.map(f => f.id === item.id ? {
          ...f,
          progress: Math.min(100, f.progress + 10),
          status: f.progress + 10 >= 100 ? 'done' : 'uploading',
        } : f));
        if (ticks >= 10) clearInterval(iv);
      }, 100);
    });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) addFiles(e.currentTarget.files);
    e.currentTarget.value = '';
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); addFiles(e.dataTransfer.files); };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };

  return (
    <div className={className ?? 'w-full'}>
      <input ref={inputRef} type="file" accept={accept} multiple hidden onChange={onInputChange} />
      <div
        onDrop={onDrop} onDragOver={onDragOver} onClick={() => inputRef.current?.click()}
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 text-center hover:bg-gray-50"
      >
        <p className="text-sm">Kliknij, aby wybrać pliki lub upuść je tutaj</p>
        <p className="mt-1 text-xs text-gray-500">Do {maxFiles} plików, max {humanSize(maxSizeBytes)} każdy</p>
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map(f => (
            <li key={f.id} className="rounded-md border border-gray-200 p-2">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{f.name}</div>
                  <div className="text-xs text-gray-500">{humanSize(f.size)}</div>
                </div>
                <div className="ml-3 w-40">
                  <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
                    <div className="h-2 bg-gray-600 transition-all" style={{ width: `${f.progress}%` }} />
                  </div>
                  <div className="mt-1 text-right text-[11px] text-gray-500">{f.progress}%</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
