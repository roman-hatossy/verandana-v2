import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function ok(v: unknown): v is string { return typeof v === 'string' && v.trim().length > 0; }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ['name','email','phone','postalCode','type'];
    for (const k of required) if (!ok((body as any)[k])) return NextResponse.json({error:`Missing ${k}`}, {status:400});

    const subject = `Nowe zapytanie — ${body.type} — ${body.postalCode}`;
    const text = [
      `Imię i nazwisko: ${body.name}`,
      `E-mail: ${body.email}`,
      `Telefon: ${body.phone}`,
      `Kod pocztowy: ${body.postalCode}`,
      `Typ: ${body.type}`,
      `Deadline: ${body.deadline ?? '-'}`,
      `Wiadomość: ${body.message ?? '-'}`,
      `Pliki: ${(body.files?.map((f:any)=>`${f.name} (${f.size||0}B) ${f.url||''}`).join(', ')) || '-'}`,
    ].join('\n');

    const html = `
      <div style="font-family:Inter,system-ui,Arial;line-height:1.6">
        <h2 style="margin:0 0 12px">Nowe zapytanie Verandana</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>Imię i nazwisko</b></td><td>${body.name}</td></tr>
          <tr><td><b>E-mail</b></td><td>${body.email}</td></tr>
          <tr><td><b>Telefon</b></td><td>${body.phone}</td></tr>
          <tr><td><b>Kod pocztowy</b></td><td>${body.postalCode}</td></tr>
          <tr><td><b>Typ</b></td><td>${body.type}</td></tr>
          <tr><td><b>Deadline</b></td><td>${body.deadline ?? '-'}</td></tr>
          <tr><td valign="top"><b>Wiadomość</b></td><td>${(body.message ?? '-').replace(/\n/g,'<br/>')}</td></tr>
          <tr><td valign="top"><b>Pliki</b></td><td>
            ${
              Array.isArray(body.files) && body.files.length
              ? body.files.map((f:any)=>`<div>• <a href="${f.url||'#'}">${f.name}</a> ${f.size?`(${f.size}B)`:''}</div>`).join('')
              : '-'
            }
          </td></tr>
        </table>
      </div>`.trim();

    const { error } = await resend.emails.send({
      from: 'Verandana <onboarding@resend.dev>',
      to: ['roman@verandana.pl'],
      subject,
      text,
      html
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
