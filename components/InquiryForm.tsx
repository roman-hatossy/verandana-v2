'use client'
import React, { useState, useEffect } from 'react'
import Calendar from './Calendar'
import FileUpload, { type FileData } from './FileUpload'
import { validateEmail, validatePhone, validatePostalCode, formatPhone, formatPostalCode } from '../lib/validation'

interface ValidationErrors {
  email?: string;
  phone?: string;
  postalCode?: string;
}

export default function InquiryForm() {
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [files, setFiles] = useState<FileData[]>([])
  const [formProgress, setFormProgress] = useState(0)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (field: 'email' | 'phone' | 'postalCode', value: string) => {
    const newErrors = { ...errors }
    let validationResult;
    if (field === 'email') validationResult = validateEmail(value);
    if (field === 'phone') validationResult = validatePhone(value);
    if (field === 'postalCode') validationResult = validatePostalCode(value);
    
    if (validationResult && !validationResult.isValid && touched[field]) {
      newErrors[field] = validationResult.error;
    } else {
      delete newErrors[field];
    }
    setErrors(newErrors);
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setEmail(v); validateField('email', v) }
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = formatPhone(e.target.value); setPhone(v); validateField('phone', v) }
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = formatPostalCode(e.target.value);
    if (v.length <= 6) { setPostalCode(v); validateField('postalCode', v) }
  }
  const handleBlur = (field: 'email' | 'phone' | 'postalCode') => { 
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = field === 'email' ? email : field === 'phone' ? phone : postalCode;
    validateField(field, value);
  }

  useEffect(() => {
    let progress = 0;
    const fields = [name, email, phone, consent, selectedType];
    const total = fields.length;
    fields.forEach(field => { if (field) progress++; });
    setFormProgress(Math.round((progress / total) * 100));
  }, [name, email, phone, consent, selectedType]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-validate all required fields on submit
    const finalErrors: ValidationErrors = {};
    if (!validateEmail(email).isValid) finalErrors.email = validateEmail(email).error;
    if (!validatePhone(phone).isValid) finalErrors.phone = validatePhone(phone).error;
    if (!validatePostalCode(postalCode).isValid) finalErrors.postalCode = validatePostalCode(postalCode).error;
    setErrors(finalErrors);
    setTouched({ email: true, phone: true, postalCode: true });

    if (Object.keys(finalErrors).length === 0 && consent) {
      console.log('Form submitted:', { name, email, phone, postalCode, selectedType, selectedDate, comment, files, consent });
      alert('Dziękujemy! Skontaktujemy się wkrótce.');
    } else {
      alert('Proszę poprawić błędy w formularzu i wyrazić zgodę.');
    }
  }

  const gardenTypes = [
    { id: 'home-extension', name: 'Home Extension', desc: 'Rozszerzenie przestrzeni' },
    { id: 'classic-warm', name: 'Ogród klasyczny', desc: 'Całoroczny, ogrzewany' },
    { id: 'seasonal-cold', name: 'Ogród sezonowy', desc: 'Użytkowany w ciepłych miesiącach' },
    { id: 'pergola', name: 'Pergola', desc: 'Otwarta konstrukcja' },
    { id: 'not-sure', name: 'Nie wiem', desc: 'Pomoc w wyborze' }
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 sm:p-8 relative bg-white rounded-2xl shadow-2xl border border-slate-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Zapytanie o wycenę</h2>
        <p className="text-center text-slate-500">Wypełnij formularz, a my przygotujemy dla Ciebie ofertę.</p>
        <div className="flex justify-between items-center mt-6 mb-2">
            <span className="text-sm font-medium text-gray-700">Postęp</span>
            <span className="text-sm font-medium text-blue-600">{formProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${formProgress}%` }} />
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">1. Wybierz typ konstrukcji *</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {gardenTypes.map(type => (
              <button key={type.id} type="button" onClick={() => setSelectedType(type.id)}
                className={`w-full p-3 text-center rounded-lg border-2 transition-all ${selectedType === type.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200 hover:border-gray-400'}`}>
                <div className="font-semibold text-sm">{type.name}</div>
                <div className="text-xs text-gray-500">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Dane kontaktowe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Imię i nazwisko *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">E-mail *</label>
                  <input type="email" value={email} onChange={handleEmailChange} onBlur={() => handleBlur('email')} className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} required />
                  {errors.email && (<p className="mt-1 text-sm text-red-600">{errors.email}</p>)}
              </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon *</label>
                  <input type="tel" value={phone} onChange={handlePhoneChange} onBlur={() => handleBlur('phone')} placeholder="123 456 789" className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} required />
                  {errors.phone && (<p className="mt-1 text-sm text-red-600">{errors.phone}</p>)}
              </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Kod pocztowy (opcjonalnie)</label>
                  <input type="text" value={postalCode} onChange={handlePostalCodeChange} onBlur={() => handleBlur('postalCode')} placeholder="00-000" className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.postalCode ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} />
                  {errors.postalCode && (<p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>)}
              </div>
            </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">3. Dodatkowe informacje (opcjonalnie)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferowany termin kontaktu</label>
                  <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dodaj zdjęcia lub dokumenty</label>
                  <FileUpload files={files} onFilesChange={setFiles} onError={(m) => alert(m)} />
              </div>
              <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Wiadomość</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Opisz swoje oczekiwania..."></textarea>
              </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
         <div className="flex items-start">
            <div className="flex h-6 items-center">
                <input id="consent" name="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"/>
            </div>
            <div className="ml-3 text-sm leading-6">
                <label htmlFor="consent" className="font-medium text-gray-900">Wyrażam zgodę na kontakt w celu przygotowania oferty *</label>
            </div>
         </div>
      </div>

      <div className="mt-8 text-center">
          <button type="submit" className="px-10 py-4 rounded-lg font-semibold text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none" disabled={!consent}>
              Wyślij zapytanie
          </button>
      </div>
    </form>
  )
}
