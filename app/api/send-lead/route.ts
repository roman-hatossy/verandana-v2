import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';

// Inicjalizacja Resend. Upewnij się, że zmienna środowiskowa jest ustawiona na produkcji.
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
    console.error("KRYTYCZNY BŁĄD KONFIGURACJI: Brak RESEND_API_KEY.");
}
const resend = new Resend(resendApiKey);

// Uproszczona walidacja (Docelowo należy użyć Zod)
function validateInput(data: any): boolean {
  if (!data.name || !data.email || !data.phone || !data.consent) return false;
  if (!/\S+@\S+\.\S+/.test(data.email)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  // Globalny blok try...catch dla stabilności i logowania
  try {
    // 1. Parsowanie ciała żądania
    const data = await req.json();

    // 2. Honeypot (Security)
    if ((data as any)._honey) {
      console.log("Honeypot triggered.");
      return NextResponse.json({ message: 'Wiadomość wysłana pomyślnie.' }, { status: 200 });
    }

    // 3. Walidacja (Integrity)
    if (!validateInput(data)) {
      console.warn("Błąd walidacji danych.", data);
      // HTTP 400 Bad Request
      return NextResponse.json({ message: 'Niepoprawne dane formularza.' }, { status: 400 });
    }

    // 4. Wykonanie (Email Sending)
    const emailResult = await resend.emails.send({
      from: 'Verandana <onboarding@resend.dev>',
      to: ['roman@verandana.pl'],
      subject: `Nowy Lead z Landing Page Verandana - ${data.name}`,
      html: `
        <strong>Imię:</strong> ${data.name}<br>
        <strong>Email:</strong> ${data.email}<br>
        <strong>Telefon:</strong> ${data.phone}<br>
        <strong>Typ:</strong> ${data.type || 'Brak'}<br>
        <strong>Kod pocztowy:</strong> ${data.postalCode || 'Brak'}<br>
        <strong>Wiadomość:</strong> ${data.message || 'Brak'}<br>
      `,
    });

    // Sprawdzenie odpowiedzi z Resend
    if (emailResult.error) {
      // Logowanie specyficznego błędu Resend
      console.error("RESEND API ERROR:", emailResult.error);
      throw new Error(`Resend failed: ${emailResult.error.message}`);
    }

    // HTTP 200 OK - Sukces
    return NextResponse.json({ message: 'Wiadomość wysłana pomyślnie.', id: emailResult.data?.id }, { status: 200 });

  } catch (error) {
    // Logowanie błędu (Kluczowe dla diagnozy - pojawi się w logach serwera)
    console.error("KRYTYCZNY BŁĄD API /send-lead:", error);
    
    // HTTP 500 Internal Server Error
    return NextResponse.json({ message: 'Wystąpił wewnętrzny błąd serwera.' }, { status: 500 });
  }
}
