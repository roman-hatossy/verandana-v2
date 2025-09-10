import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv' // GENESIS H0: trwały rate-limit (KV)

type Body = {
  name: string
  email: string
  phone: string
  postalCode: string
  type: string
  deadline?: string
  message?: string
  files?: { name: string; url?: string; size?: number }[]
  _honey?: string
}

function ok(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

async function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!ok(key)) throw new Error('RESEND_API_KEY missing')
  const { Resend } = await import('resend')
  return new Resend(key)
}

// GENESIS H0: KV rate limit z TTL; miękki fallback gdy KV nie jest skonfigurowane
async function allowRequest(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || '0.0.0.0'
    const key = `rate:send-lead:${ip}`
    const count = await kv.incr(key)
    if (count === 1) await kv.expire(key, 600)
    const MAX = 5
    return count <= MAX
  } catch {
    return true
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await allowRequest(req))) {
      return NextResponse.json({ error: 'Rate limit' }, { status: 429 })
    }

    const body = (await req.json()) as Partial<Body>
    if (ok(body._honey)) return NextResponse.json({ success: true })

    const required: (keyof Body)[] = ['name', 'email', 'phone', 'postalCode', 'type']
    for (const k of required) {
      if (!ok((body as any)[k])) {
        return NextResponse.json({ error: `Missing ${k}` }, { status: 400 })
      }
    }

    const subject = `Nowe zapytanie — ${body.type} — ${body.postalCode}`
    const text = [
      `Imię i nazwisko: ${body.name}`,
      `E-mail: ${body.email}`,
      `Telefon: ${body.phone}`,
      `Kod pocztowy: ${body.postalCode}`,
      `Typ: ${body.type}`,
      `Deadline: ${body.deadline ?? '-'}`,
      `Wiadomość: ${body.message ?? '-'}`,
      `Pliki: ${body.files?.map(f => `${f.name} (${f.size || 0}B) ${f.url || ''}`).join(', ') || '-'}`,
    ].join('\n')

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
          <tr><td valign="top"><b>Wiadomość</b></td><td>${(body.message ?? '-').toString().replace(/\n/g,'<br/>')}</td></tr>
          <tr><td valign="top"><b>Pliki</b></td><td>${
            Array.isArray(body.files) && body.files.length
              ? body.files.map(f => `• <a href="${f.url || '#'}">${f.name}</a> ${f.size ? `(${f.size}B)` : ''}`).join('<br/>')
              : '-'
          }</td></tr>
        </table>
      </div>
    `.trim()

    const resend = await getResend()
    const { error } = await resend.emails.send({
      from: 'Verandana <onboarding@resend.dev>',
      to: ['roman@verandana.pl'],
      subject,
      text,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('API error:', e?.message || e)
    const msg = e?.message?.includes('RESEND_API_KEY') ? 'Server misconfig' : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
