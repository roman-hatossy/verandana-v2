import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name || !data.email || !data.phone || !data.consent) {
      return NextResponse.json({ error: 'Brak wszystkich wymaganych pól.' }, { status: 400 });
    }

    const attachments = [];
    if (data.files && Array.isArray(data.files)) {
      for (const file of data.files) {
        const buffer = Buffer.from(file.content.split(',')[1], 'base64');
        attachments.push({
          filename: file.name,
          content: buffer,
        });
      }
    }

    await resend.emails.send({
      from: 'Verandana <formularz@verandana.pl>',
      to: ['roman@verandana.pl'],
      reply_to: data.email,
      subject: `Nowy Lead z załącznikami: ${data.name}`,
      html: `
        <h2>Nowy lead z formularza</h2>
        <p><strong>Imię:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Typ:</strong> ${data.type || 'Nie wybrano'}</p>
        <p><strong>Kod pocztowy:</strong> ${data.postalCode || 'Brak'}</p>
        <p><strong>Wiadomość:</strong> ${data.message || 'Brak'}</p>
        <p><strong>Liczba załączników:</strong> ${attachments.length}</p>
      `,
      attachments: attachments,
    });
    
    return NextResponse.json({ message: 'Wiadomość wysłana pomyślnie.' });

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: 'Wystąpił błąd podczas wysyłania.' }, { status: 500 });
  }
}
