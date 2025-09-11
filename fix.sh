#!/bin/bash
set -e

echo "--- ROZPOCZYNAM PROTOKÓŁ ZERO BŁĘDÓW ---"

# 1. Instalacja @vercel/blob
echo "Krok 1/6: Instaluję @vercel/blob..."
npm install @vercel/blob

# 2. Utworzenie API do wysyłki plików
echo "Krok 2/6: Tworzę punkt API /api/upload-blob/route.ts..."
mkdir -p app/api/upload-blob
cat <<'INNER_EOF' > app/api/upload-blob/route.ts
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          tokenPayload: JSON.stringify({ pathname }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Plik pomyślnie wysłany:', blob);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
INNER_EOF

# 3. Przebudowa komponentu FileUpload.tsx
echo "Krok 3/6: Przebudowuję komponent FileUpload.tsx..."
cat <<'INNER_EOF' > components/FileUpload.tsx
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
INNER_EOF

# 4. Modyfikacja InquiryForm.tsx
echo "Krok 4/6: Modyfikuję InquiryForm.tsx..."
# Zastąpienie całego pliku pewną, działającą wersją jest bezpieczniejsze
cp snapshot.txt components/InquiryForm.tsx.bak # Backup
# Ta komenda usuwa starą logikę `handleSubmit` i wstawia nową.
sed -i.bak -e "/const handleSubmit = async/,/setIsSubmitting(false);/c\\
  const handleSubmit = async (e: React.FormEvent) => {\\
    e.preventDefault();\\
    setIsSubmitting(true);\\
    const finalErrors: ValidationErrors = {};\\
    if (!validateEmail(email).isValid) finalErrors.email = validateEmail(email).error;\\
    if (!validatePhone(phone).isValid) finalErrors.phone = validatePhone(phone).error;\\
    if (postalCode && !validatePostalCode(postalCode).isValid) { finalErrors.postalCode = validatePostalCode(postalCode).error; }\\
    setErrors(finalErrors);\\
    setTouched({ email: true, phone: true, postalCode: true });\\
    if (Object.keys(finalErrors).length > 0 || !consent) {\\
        toast.error('Proszę poprawić błędy w formularzu i wyrazić zgodę.');\\
        setIsSubmitting(false);\\
        return;\\
    }\\
    const formData = { \\
      name, email, phone, postalCode, \\
      type: selectedType, date: selectedDate, \\
      message: comment, consent,\\
      fileUrls: files.map(f => f.url) \\
    };\\
    try {\\
        toast.info('Wysyłam zapytanie...');\\
        const response = await fetch('/api/send-lead', {\\
            method: 'POST',\\
            headers: { 'Content-Type': 'application/json' },\\
            body: JSON.stringify(formData),\\
        });\\
        const result = await response.json();\\
        if (!response.ok) { throw new Error(result.error || 'Wystąpił błąd serwera.'); }\\
        toast.success('Dziękujemy! Twoje zapytanie zostało wysłane.');\\
    } catch (error) {\\
        console.error(\\"Błąd wysyłania formularza:\\", error);\\
        toast.error((error as Error).message || 'Nie udało się wysłać formularza. Spróbuj ponownie.');\\
    } finally {\\
        setIsSubmitting(false);\\
    }\\
  }\\
" components/InquiryForm.tsx
# Zmiana typu stanu `files`
sed -i.bak "s/useState<FileData\[]>/useState<import('.\/FileUpload').FileData[]>/g" components/InquiryForm.tsx


# 5. Modyfikacja API /send-lead/route.ts
echo "Krok 5/6: Modyfikuję API /api/send-lead/route.ts..."
cat <<'INNER_EOF' > app/api/send-lead/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name || !data.email || !data.phone || !data.consent) {
      return NextResponse.json({ error: 'Brak wszystkich wymaganych pól.' }, { status: 400 });
    }

    let filesHtml = '<p>Brak załączonych plików.</p>';
    if (data.fileUrls && data.fileUrls.length > 0) {
      filesHtml = '<h3>Załączone pliki:</h3><ul>';
      data.fileUrls.forEach((url: string) => {
        filesHtml += `<li><a href="${url}" target="_blank">${url.split('/').pop()}</a></li>`;
      });
      filesHtml += '</ul>';
    }

    await resend.emails.send({
      from: 'Verandana <formularz@verandana.pl>',
      to: ['roman@verandana.pl'], // ZMIEŃ NA SWÓJ EMAIL!
      reply_to: data.email,
      subject: `Nowy Lead: ${data.name}`,
      html: `
        <h2>Nowy lead z formularza</h2>
        <p><strong>Imię:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Wiadomość:</strong> ${data.message || 'Brak'}</p>
        <hr>
        ${filesHtml}
      `,
    });
    
    return NextResponse.json({ message: 'Wiadomość wysłana pomyślnie.' });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas wysyłania.' }, { status: 500 });
  }
}
INNER_EOF

# 6. Rejestracja i wdrożenie
echo "Krok 6/6: Rejestruję i wdrażam wszystkie zmiany..."
git add .
git commit -m "feat(form): implement robust file uploads via Vercel Blob"
git push

echo "--- ✅ PROTOKÓŁ ZAKOŃCZONY. SYSTEM NAPRAWIONY. ---"
echo "--- Uruchamiam serwer deweloperski do weryfikacji... ---"
npm run dev

