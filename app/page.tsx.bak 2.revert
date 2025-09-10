'use client'
import { useState, useEffect, useRef } from 'react'

const initialState = { name: '', email: '', phone: '', postalCode: '', deadline: '', type: '', message: '', consent: false, _honey: '' }

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
  };

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      console.log("DIAGNOSTYKA [1/3]: Odporny handler zdarzenia 'submit' został uruchomiony.");
      
      const validate = () => {
          const e: Record<string,string> = {}
          if (!formData.name) e.name = 'Podaj imię i nazwisko'
          if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Podaj poprawny e-mail'
          if (!formData.phone) e.phone = 'Podaj telefon'
          if (!formData.postalCode || !/^[0-9]{2}-?[0-9]{3}$/.test(formData.postalCode)) e.postalCode = 'Kod np. 44-100'
          if (!formData.type) e.type = 'Wybierz typ'
          if (!formData.consent) e.consent = 'Zaznacz zgodę'
          return e
      }

      const validationErrors = validate();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        alert("Błąd walidacji: Proszę poprawić dane w formularzu.");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch('/api/send-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message || 'Sukces! Wiadomość została wysłana.');
          setFormData(initialState);
          setErrors({});
        } else {
          alert(`Błąd API (Status ${response.status}): ${result.message || 'Wystąpił nieznany błąd.'}`);
        }
      } catch (error: any) {
        alert(`Błąd Ogólny: ${error.message}. Sprawdź Konsolę (F12).`);
      } finally {
        setIsSubmitting(false);
      }
    };

    form.addEventListener('submit', handleSubmit);
    return () => {
      form.removeEventListener('submit', handleSubmit);
    };
  }, [formData]); // Re-attach handler if formData changes to ensure it has the latest state

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Zapytanie</h1>
      <form ref={formRef} noValidate>
        <input type="text" name="name" placeholder="Imię i nazwisko" value={formData.name} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
        <input type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}
        <input type="text" name="postalCode" placeholder="Kod pocztowy" value={formData.postalCode} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        {errors.postalCode && <p className="text-red-500 text-sm mb-2">{errors.postalCode}</p>}
        <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        <select name="type" value={formData.type} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded">
          <option value="">Wybierz typ</option>
          <option>Home Extension</option>
          <option>Winter Garden</option>
          <option>Patio Roof</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm mb-2">{errors.type}</p>}
        <textarea name="message" placeholder="Wiadomość" value={formData.message} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" rows={5}></textarea>
        <input type="text" name="_honey" value={formData._honey} onChange={handleInputChange} className="hidden" tabIndex={-1} autoComplete="off" />
        <label className="flex items-start gap-2 mb-4">
          <input type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} />
          <span>Wyrażam zgodę na kontakt w celu przygotowania oferty.</span>
        </label>
        {errors.consent && <p className="text-red-500 text-sm mb-4">{errors.consent}</p>}
        <button type="submit" disabled={isSubmitting} className={`px-8 py-3 text-white font-semibold rounded ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {isSubmitting ? 'Wysyłanie…' : 'Wyślij zapytanie'}
        </button>
      </form>
    </main>
  )
}
