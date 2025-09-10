'use client'
import React, { useState } from 'react'
import { toast } from 'sonner'
import Calendar from './Calendar' // POPRAWKA: Zmiana ścieżki z '@/components/Calendar'
import FileUpload, { type FileData } from './FileUpload' // POPRAWKA: Zmiana ścieżki z '@/components/FileUpload'
import { validateEmail, validatePhone, validatePostalCode, formatPhone, formatPostalCode } from '../lib/validation' // POPRAWKA: Zmiana ścieżki z '@/lib/validation'

// ... reszta kodu komponentu pozostaje bez zmian ...
const gardenTypes = [
  { id: 'home-extension', name: 'Home Extension', icon: '🏠', desc: 'Rozszerzenie przestrzeni mieszkalnej' },
  { id: 'classic-warm', name: 'Klasyczny ciepły', icon: '☀️', desc: 'Całoroczny, ogrzewany ogród' },
  { id: 'seasonal-cold', name: 'Sezonowy zimny', icon: '❄️', desc: 'Użytkowany w ciepłych miesiącach' },
  { id: 'pergola', name: 'Pergola', icon: '🌿', desc: 'Otwarta konstrukcja ogrodowa' },
  { id: 'not-sure', name: 'Nie wiem', icon: '❓', desc: 'Pomożemy wybrać najlepsze rozwiązanie' }
];

const initialState = { name: '', email: '', phone: '', postalCode: '', comment: '', consent: false };

export default function InquiryForm() {
  const [selectedType, setSelectedType] = useState('home-extension');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors: Record<string, string> = {};
    if (!formData.name) validationErrors.name = 'Imię jest wymagane';
    if (!validateEmail(formData.email).isValid) validationErrors.email = validateEmail(formData.email).error;
    if (!validatePhone(formData.phone).isValid) validationErrors.phone = validatePhone(formData.phone).error;
    if (!formData.consent) validationErrors.consent = 'Zgoda jest wymagana';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Formularz zawiera błędy. Proszę je poprawić.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        type: selectedType,
        deadline: selectedDate?.toISOString(),
        files: files.map(f => ({ name: f.name, size: f.size })),
      };
      
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Wystąpił nieznany błąd serwera.');
      
      toast.success('Dziękujemy! Twoja wiadomość została wysłana.');
      setFormData(initialState);
      setSelectedType('home-extension');
      setSelectedDate(null);
      setFiles([]);
      setErrors({});
      
    } catch (error: any) {
      toast.error(`Błąd wysyłania: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">1. Wybierz typ ogrodu</h3>
          <div className="space-y-3">
            {gardenTypes.map(type => (
              <button key={type.id} type="button" onClick={() => setSelectedType(type.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedType === type.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <div>
                    <div className="font-semibold">{type.name}</div>
                    <div className="text-sm text-gray-600">{type.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">2. Dane kontaktowe</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Imię i nazwisko *" className="w-full px-3 py-2 border rounded-md" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email *" className="w-full px-3 py-2 border rounded-md" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <input type="tel" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: formatPhone(e.target.value)})} placeholder="Telefon *" className="w-full px-3 py-2 border rounded-md" />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} placeholder="Kod pocztowy" className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">3. Termin i materiały</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferowany termin spotkania</label>
              <Calendar value={selectedDate} onChange={setSelectedDate} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dodaj zdjęcia lub dokumenty</label>
              <FileUpload onFilesChange={setFiles} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dodatkowe informacje</label>
              <textarea name="comment" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-md" placeholder="Opisz swoje oczekiwania..."/>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input type="checkbox" name="consent" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="w-4 h-4 mt-1 accent-orange-500" />
            <span className="text-sm">Wyrażam zgodę na przetwarzanie danych osobowych. *</span>
          </label>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-md font-semibold text-white bg-gray-800 hover:bg-orange-600 transition-all disabled:opacity-50">
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij zapytanie'}
          </button>
        </div>
      </div>
    </form>
  );
}
