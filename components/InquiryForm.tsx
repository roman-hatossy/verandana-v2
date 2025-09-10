'use client'
import React, { useState, useEffect } from 'react'
import Calendar from './Calendar'
import FileUpload, { type FileData } from './FileUpload'
import { validateEmail, validatePhone, validatePostalCode, formatPhone, formatPostalCode } from '../lib/validation'
import { toast } from 'sonner'

interface ValidationErrors {
  email?: string;
  phone?: string;
  postalCode?: string;
}
interface InquiryFormProps { preselectedType?: string; }

export default function InquiryForm({ preselectedType = '' }: InquiryFormProps) {
  const [selectedType, setSelectedType] = useState<string>(preselectedType)
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { if (preselectedType) setSelectedType(preselectedType) }, [preselectedType])

  useEffect(() => {
    let progress = 0;
    const fields = [name, email, phone, consent, selectedType];
    fields.forEach(field => { if (field) progress++; });
    setFormProgress(Math.round((progress / fields.length) * 100));
  }, [name, email, phone, consent, selectedType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Walidacja
    const finalErrors: ValidationErrors = {}
    if (!validateEmail(email).isValid) finalErrors.email = validateEmail(email).error
    if (!validatePhone(phone).isValid) finalErrors.phone = validatePhone(phone).error
    if (postalCode && !validatePostalCode(postalCode).isValid) finalErrors.postalCode = validatePostalCode(postalCode).error
    setErrors(finalErrors)
    setTouched({ email: true, phone: true, postalCode: true })
    if (Object.keys(finalErrors).length > 0 || !consent) {
      toast.error('Proszę poprawić błędy w formularzu i wyrazić zgodę.')
      setIsSubmitting(false)
      return
    }

    // Użycie FormData
    const fd = new FormData()
    fd.append("name", name)
    fd.append("email", email)
    fd.append("phone", phone)
    fd.append("postalCode", postalCode)
    fd.append("type", selectedType)
    fd.append("date", selectedDate ? selectedDate.toISOString() : "")
    fd.append("message", comment)
    fd.append("consent", consent.toString())
    files.forEach(f => fd.append("files", f.file, f.name))

    try {
      const response = await fetch('/api/send-lead', { method: 'POST', body: fd })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Wystąpił błąd serwera.')
      toast.success('Dziękujemy! Twoje zapytanie zostało wysłane.')
    } catch (error) {
      console.error("Błąd wysyłania formularza:", error)
      toast.error((error as Error).message || 'Nie udało się wysłać formularza. Spróbuj ponownie.')
    } finally { setIsSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-slate-200">
      <h2 className="text-3xl font-bold text-center mb-4">Zapytanie o wycenę</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Imię i nazwisko *</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full border px-3 py-2 rounded"/>
        </div>
        <div>
          <label className="block text-sm font-medium">E-mail *</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Telefon *</label>
          <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required className="w-full border px-3 py-2 rounded"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Kod pocztowy</label>
          <input type="text" value={postalCode} onChange={e=>setPostalCode(e.target.value)} className="w-full border px-3 py-2 rounded"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Preferowany termin kontaktu</label>
          <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate}/>
        </div>
        <div>
          <label className="block text-sm font-medium">Załączniki</label>
          <FileUpload files={files} onFilesChange={setFiles} onError={(m)=>toast.error(m)}/>
        </div>
        <div>
          <label className="block text-sm font-medium">Wiadomość</label>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={4} className="w-full border px-3 py-2 rounded"/>
        </div>
        <div className="flex items-center">
          <input id="consent" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mr-2"/>
          <label htmlFor="consent">Wyrażam zgodę na kontakt w celu przygotowania oferty *</label>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button type="submit" disabled={!consent||isSubmitting} className="px-6 py-3 bg-blue-600 text-white rounded shadow">
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij zapytanie'}
        </button>
      </div>
    </form>
  )
}
