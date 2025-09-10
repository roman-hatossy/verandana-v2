import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';

// Inicjalizacja Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Parsowanie danych
    const data = await req.json();
    
    // Walidacja
    if (!data.name || !data.email || !data.phone || !data.consent) {
      return NextResponse.json(
        { error: 'Brak wszystkich wymaganych pól.' },
        { status: 400 }
      );
    }
    
    // Wysyłanie emaila przez Resend
    const emailResult = await resend.emails.send({
      from: 'Verandana <formularz@verandana.pl>', // ZMIEŃ NA SWOJĄ DOMENĘ!
      to: ['roman@verandana.pl'], // ZMIEŃ NA SWÓJ EMAIL!
      replyTo: data.email, // POPRAWIONE!
      subject: `Nowy Lead: ${data.name}`,
      html: `
        <h2>Nowy lead z formularza</h2>
        <p><strong>Imię:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Typ:</strong> ${data.type || 'Nie wybrano'}</p>
        <p><strong>Kod pocztowy:</strong> ${data.postalCode || 'Brak'}</p>
        <p><strong>Wiadomość:</strong> ${data.message || 'Brak'}</p>
      `,
    });
    
    if (emailResult.error) {
      console.error("RESEND ERROR:", emailResult.error);
      throw new Error(emailResult.error.message);
    }
    
    return NextResponse.json({ 
      message: 'Wiadomość wysłana pomyślnie.' 
    });
    
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania.' },
      { status: 500 }
    );
  }
}