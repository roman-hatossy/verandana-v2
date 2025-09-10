'use client'
import { useState } from 'react'

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

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

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (isSubmitting) return
    const form = ev.currentTarget
    const { ok, e, data } = validate(form)
    setErrors(e)
    if (!ok) return

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
      alert('Dziękujemy! Wiadomość wysłana.')
      form.reset()
      setErrors({})
    } catch (err) {
      alert('Nie udało się wysłać. Spróbuj ponownie.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Zapytanie</h1>

      <form onSubmit={handleSubmit} noValidate>
        <input type="text" name="name" placeholder="Imię i nazwisko" className="block w-full mb-2 p-3 border rounded" />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

        <input type="email" name="email" placeholder="E-mail" className="block w-full mb-2 p-3 border rounded" />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

        <input type="tel" name="phone" placeholder="Telefon" className="block w-full mb-2 p-3 border rounded" />
        {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}

        <input type="text" name="postalCode" placeholder="Kod pocztowy" className="block w-full mb-2 p-3 border rounded" />
        {errors.postalCode && <p className="text-red-500 text-sm mb-2">{errors.postalCode}</p>}

        <input type="date" name="deadline" className="block w-full mb-2 p-3 border rounded" />

        <select name="type" className="block w-full mb-2 p-3 border rounded">
          <option value="">Wybierz typ</option>
          <option>Home Extension</option>
          <option>Winter Garden</option>
          <option>Patio Roof</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm mb-2">{errors.type}</p>}

        <textarea name="message" placeholder="Wiadomość" className="block w-full mb-2 p-3 border rounded" rows={5}></textarea>

        <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

        <label className="flex items-start gap-2 mb-4">
          <input type="checkbox" name="consent" />
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[GENESIS KROK 1] Funkcja handleSubmit została uruchomiona.');

    const newErrors: any = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Imię jest wymagane (min. 2 znaki)';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email jest wymagany';
    }
    if (!formData.phone || !/^[0-9]{9,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Telefon jest wymagany';
    }
    if (!formData.postalCode || !/^[0-9]{2}-[0-9]{3}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Kod pocztowy jest wymagany';
    }
    if (!selectedType) {
      newErrors.type = 'Wybierz typ konstrukcji';
    }
    if (!consent) {
      newErrors.consent = 'Zgoda jest wymagana';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.error('[GENESIS BŁĄD] Walidacja nie powiodła się. Błędy:', newErrors);
      alert('Formularz zawiera błędy. Sprawdź poprawność wszystkich wymaganych pól.');
      return;
    }

    console.log('[GENESIS KROK 2] Walidacja pól zakończona pomyślnie.');
    setIsSubmitting(true);

    try {
      console.log('[GENESIS KROK 3] Próba wysłania danych na serwer...');
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: selectedType,
          date: selectedDate,
          comment: comment
        })
      });

      if (response.ok) {
        console.log('[GENESIS SUKCES] Dane wysłane pomyślnie.');
        alert('Dziękujemy! Wkrótce się odezwiemy.');
      } else {
        console.error('[GENESIS BŁĄD] Serwer zwrócił błąd.', await response.json());
        alert('Błąd wysyłania. Spróbuj ponownie.');
      }
    } catch (error) {
      console.error('[GENESIS KRYTYCZNY BŁĄD] Wystąpił błąd podczas wysyłania:', error);
      alert('Błąd wysyłania. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };
