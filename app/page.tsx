'use client'
import { useState, useRef } from 'react'
import { toast } from 'sonner'

const initialState = { name: '', email: '', phone: '', postalCode: '', deadline: '', type: '', message: '', consent: false, _honey: '' }

export default function Page() {
  const [formData, setFormData] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})
  
  const refs: { [key: string]: React.RefObject<any> } = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
    type: useRef<HTMLSelectElement>(null),
    consent: useRef<HTMLInputElement>(null),
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrors({});
    const validationErrors: Record<string,string> = {};
    if (!formData.name) validationErrors.name = 'Podaj imię i nazwisko';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) validationErrors.email = 'Podaj poprawny e-mail';
    if (!formData.phone) validationErrors.phone = 'Podaj telefon';
    if (!formData.postalCode || !/^[0-9]{2}-?[0-9]{3}$/.test(formData.postalCode)) validationErrors.postalCode = 'Kod np. 44-100';
    if (!formData.type) validationErrors.type = 'Wybierz typ';
    if (!formData.consent) validationErrors.consent = 'Zaznacz zgodę';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Formularz zawiera błędy. Proszę poprawić podświetlone pola.');
      const firstErrorKey = Object.keys(validationErrors)[0];
      if (firstErrorKey && refs[firstErrorKey]?.current) {
        refs[firstErrorKey].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => refs[firstErrorKey].current.focus(), 300);
      }
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
      if (!response.ok) {
        throw new Error(result.error || 'Wystąpił nieznany błąd serwera.');
      }

      toast.success('Dziękujemy! Twoja wiadomość została wysłana.');
      setFormData(initialState);
      
    } catch (error: any) {
      toast.error(`Błąd wysyłania: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Zapytanie</h1>
      <form onSubmit={handleSubmit} noValidate>
        <input ref={refs.name} type="text" name="name" placeholder="Imię i nazwisko" value={formData.name} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}
        <input ref={refs.email} type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
        <input ref={refs.phone} type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}
        <input ref={refs.postalCode} type="text" name="postalCode" placeholder="Kod pocztowy" value={formData.postalCode} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        {errors.postalCode && <p className="text-red-500 text-sm mb-2">{errors.postalCode}</p>}
        <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" />
        <select ref={refs.type} name="type" value={formData.type} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded">
          <option value="">Wybierz typ</option>
          <option>Home Extension</option>
          <option>Winter Garden</option>
          <option>Patio Roof</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm mb-2">{errors.type}</p>}
        <textarea name="message" placeholder="Wiadomość" value={formData.message} onChange={handleInputChange} className="block w-full mb-2 p-3 border rounded" rows={5}></textarea>
        <input type="text" name="_honey" value={formData._honey} onChange={handleInputChange} className="hidden" tabIndex={-1} autoComplete="off" />
        <label className="flex items-start gap-2 mb-4">
          <input ref={refs.consent} type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} />
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
