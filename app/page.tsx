"use client";
import { useState, useRef } from 'react'

export default function Home() {
  const [selectedType, setSelectedType] = useState('')
  const [consent, setConsent] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const types = [
    { id: 'home-extension', name: 'Home Extension', desc: 'Nowoczesna bryła z płaskim dachem', image: '/images/home-extension-day.webp' },
    { id: 'classic-warm', name: 'Klasyczny ciepły', desc: 'Szlachetny detal i elegancja', image: '/images/ogrod-klasyczny-day.webp' },
    { id: 'seasonal-cold', name: 'Sezonowy zimny', desc: 'Idealny na wiosnę i lato', image: '/images/ogrod-sezonowy-day.webp' },
    { id: 'pergola', name: 'Pergola Bioclimatic', desc: 'Lamele regulowane', image: '/images/pergola-bioclimatic-day.webp' },
    { id: 'unknown', name: 'Nie wiem', desc: 'Potrzebuję porady eksperta', image: '/images/help-me.webp' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-2">Otrzymaj darmową wycenę</h1>
        <p className="text-center text-gray-600 mb-8">Wypełnij formularz, a nasi specjaliści przygotują dla Ciebie indywidualną ofertę</p>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-6">Podstawowe informacje</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Imię <span className="text-red-500">*</span></label>
              <input className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Jan Kowalski" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email <span className="text-red-500">*</span></label>
              <input className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="jan@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefon <span className="text-red-500">*</span></label>
              <input className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="123 456 789" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kod pocztowy <span className="text-red-500">*</span></label>
              <input className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="00-000" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-6">Jaki typ konstrukcji Cię interesuje? <span className="text-red-500">*</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {types.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg ${
                  selectedType === type.id ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="h-32 bg-gray-100">
                  <img src={type.image} alt={type.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 text-left">
                  <h3 className="font-semibold text-sm">{type.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-6">Jaka jest planowana data montażu?</h2>
          <input type="date" className="px-4 py-3 border border-gray-300 rounded-lg" />
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-2">Dodaj zdjęcia lub plany</h2>
          <p className="text-gray-600 mb-6">Opcjonalnie. Pomogą nam lepiej zrozumieć Twoje potrzeby.</p>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <div className="text-4xl mb-4">📎</div>
            <p className="font-medium mb-2">Dodaj zdjęcia lub plany</p>
            <p className="text-sm text-gray-500 mb-4">Obsługiwane: obrazy (PNG/JPG/WebP) i PDF · Limit: 5 MB / plik</p>
            <button type="button" className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm">
              Wybierz pliki
            </button>
            <p className="text-sm text-gray-400 mt-2">lub upuść tutaj</p>
            <input 
              ref={fileInputRef} 
              type="file" 
              className="hidden" 
              multiple 
              accept="image/*,.pdf"
              onChange={handleFileSelect}
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Usuń
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-2">Dodatkowe informacje</h2>
          <p className="text-gray-600 mb-6">Opcjonalnie. Opisz swoje oczekiwania...</p>
          <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32" 
            placeholder="Np. preferowane materiały, kolory, dodatkowe wymagania..."
          />
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <label className="flex items-start cursor-pointer">
            <input 
              type="checkbox" 
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 mr-3 w-5 h-5"
            />
            <span className="text-sm text-gray-700">
              Wyrażam zgodę na przetwarzanie moich danych osobowych <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        <div className="text-center">
          <button className="px-12 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 uppercase">
            Wyślij zapytanie
          </button>
        </div>
      </div>
    </div>
  )
}
