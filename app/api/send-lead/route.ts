import { NextResponse, NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const postalCode = formData.get("postalCode") as string;
    const type = formData.get("type") as string;
    const message = formData.get("message") as string;

    const attachments = await Promise.all(
      files.map(async (f) => ({
        filename: f.name,
        content: Buffer.from(await f.arrayBuffer()).toString("base64"),
      }))
    );

    const emailResult = await resend.emails.send({
      from: 'Verandana <formularz@verandana.pl>',
      to: ['roman@verandana.pl'],
      replyTo: email,
      subject: `Nowy Lead: ${name}`,
      html: `
        <h2>Nowy lead z formularza</h2>
        <p><strong>Imię:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Typ:</strong> ${type || 'Nie wybrano'}</p>
        <p><strong>Kod pocztowy:</strong> ${postalCode || 'Brak'}</p>
        <p><strong>Wiadomość:</strong> ${message || 'Brak'}</p>
      `,
      attachments,
    });

    if (emailResult.error) {
      console.error("RESEND ERROR:", emailResult.error);
      throw new Error(emailResult.error.message);
    }

    return NextResponse.json({ message: 'Wiadomość wysłana pomyślnie.' });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania.' },
      { status: 500 }
    );
  }
}
