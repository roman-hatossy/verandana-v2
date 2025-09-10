'use client'
import { useRef, useState } from 'react'
import { toast } from 'sonner' // GENESIS H0: toasty zamiast alert()

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
    deadline: useRef<HTMLInputElement>(null),
    type: useRef<HTMLSelectElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
    consent: useRef<HTMLInputElement>(null),
  }

  function validate(form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form).entries())
    const e: Record<string,string> = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const zipRe = /^[0-9]{2}-?[0-9]{3}$/
    if (!data.name) e.name = 'Podaj imię i nazwisko'
    if (!data.email || !emailRe.test(String(data.email))) e.email = 'Podaj poprawny e-mail'
    if (!data.phone) e.phone = 'Podaj telefon'
    if (!data.postalCode || !zipRe.test(String(data.postalCode))) e.postalCode = 'Kod np. 44-100'
    if (!data.type) e.type = 'Wybierz typ'
    if (!data.consent) e.consent = 'Zaznacz zgodę'
    return { ok: Object.keys(e).length === 0, e, data }
  }

  function focusFirstError(errs: Record<string,string>) {
    const order = ['name','email','phone','postalCode','deadline','type','message','consent'] as const
    for (const key of order) {
      if (errs[key]) {
        const el = refs[key].current
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' }) // GENESIS H0: scroll do pierwszego błędu
          setTimeout(() => el.focus({ preventScroll: true }), 220)    // GENESIS H0: focus na polu
        }
        break
      }
    }
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (isSubmitting) return
    const form = ev.currentTarget
    const { ok, e, data } = validate(form)
    setErrors(e)
    if (!ok) {
      focusFirstError(e)
      toast.error('Formularz zawiera błędy — popraw podświetlone pola.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        postalCode: data.postalCode,
        deadline: data.deadline || '',
        type: data.type,
        message: data.message || '',
        files: [],
        _honey: (data as any)._honey || ''
      }
      const res = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Błąd wysyłki')
      toast.success('Dziękujemy! Wiadomość wysłana.')
      form.reset()
      setErrors({})
    } catch (err) {
      console.error(err)
      toast.error('Nie udało się wysłać. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Zapytanie</h1>
      <form onSubmit={handleSubmit} noValidate>
        <input ref={refs.name} type="text" name="name" placeholder="Imię i nazwisko" className="block w-full mb-2 p-3 border rounded" />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

        <input ref={refs.email} type="email" name="email" placeholder="E-mail" className="block w-full mb-2 p-3 border rounded" />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

        <input ref={refs.phone} type="tel" name="phone" placeholder="Telefon" className="block w-full mb-2 p-3 border rounded" />
        {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}

        <input ref={refs.postalCode} type="text" name="postalCode" placeholder="Kod pocztowy" className="block w-full mb-2 p-3 border rounded" />
        {errors.postalCode && <p className="text-red-500 text-sm mb-2">{errors.postalCode}</p>}

        <input ref={refs.deadline} type="date" name="deadline" className="block w-full mb-2 p-3 border rounded" />

        <select ref={refs.type} name="type" className="block w-full mb-2 p-3 border rounded">
          <option value="">Wybierz typ</option>
          <option>Home Extension</option>
          <option>Winter Garden</option>
          <option>Patio Roof</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm mb-2">{errors.type}</p>}

        <textarea ref={refs.message} name="message" placeholder="Wiadomość" className="block w-full mb-2 p-3 border rounded" rows={5}></textarea>

        <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

        <label className="flex items-start gap-2 mb-4">
          <input ref={refs.consent} type="checkbox" name="consent" />
          <span>Wyrażam zgodę na kontakt w celu przygotowania oferty.</span>
        </label>
        {errors.consent && <p className="text-red-500 text-sm mb-4">{errors.consent}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 text-white font-semibold rounded ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Wysyłanie…' : 'Wyślij zapytanie'}
        </button>
      </form>
    </main>
  )
}
