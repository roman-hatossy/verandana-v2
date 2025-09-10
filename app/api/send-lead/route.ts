import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';
import { kv } from '@vercel/kv';

const resend = new Resend(process.env.RESEND_API_KEY);

async function allowRequest(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || '0.0.0.0';
    const key = `rate:send-lead:${ip}`;
    const count = await kv.incr(key);
    if (count === 1) await kv.expire(key, 600); // 10 minut
    const MAX_REQ = 10;
    return count <= MAX_REQ;
  } catch (error) {
    console.error("Błąd Vercel KV (Rate Limiter):", error);
    return true; // Miękki fallback w razie awarii KV
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production" && !(await allowRequest(req))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const data = await req.json();

    if (data._honey) {
      return NextResponse.json({ message: 'Wiadomość wysłana pomyślnie.' });
    }

    if (!data.name || !data.email || !data.phone || !data.consent) {
      return NextResponse.json({ error: 'Brak wszystkich wymaganych pól.' }, { status: 400 });
    }

    const emailResult = await resend.emails.send({
      from: 'Verandana <formularz@verandana.pl>',
      to: 'roman@verandana.pl',
      replyTo: data.email,
      subject: `Nowy Lead z Verandana - ${data.name}`,
      html: `
        <strong>Imię:</strong> ${data.name}<br>
        <strong>Email:</strong> ${data.email}<br>
        <strong>Telefon:</strong> ${data.phone}<br>
        <strong>Typ:</strong> ${data.type || 'Nie wybrano'}<br>
        <strong>Kod pocztowy:</strong> ${data.postalCode || 'Nie podano'}<br>
        <strong>Wiadomość:</strong> ${data.message || 'Brak'}
      `,
    });

    if (emailResult.error) {
      console.error("RESEND API ERROR:", emailResult.error);
      throw new Error(emailResult.error.message);
    }

    return NextResponse.json({ message: 'Wiadomość wysłana pomyślnie.' });
  } catch (error: any) {
    console.error("KRYTYCZNY BŁĄD API:", error);
    return NextResponse.json({ error: 'Wystąpił wewnętrzny błąd serwera.' }, { status: 500 });
  }
}
