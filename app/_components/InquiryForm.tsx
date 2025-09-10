"use client";
import { useState } from "react";

export default function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [formProgress, setFormProgress] = useState(0);

  const gardenTypes = [
    { id: 'home-extension', name: 'Home Extension', icon: '🏠', desc: 'Rozszerzenie przestrzeni mieszkalnej' },
    { id: 'classic-warm', name: 'Klasyczny ciepły', icon: '☀️', desc: 'Całoroczny, ogrzewany ogród' },
    { id: 'seasonal-cold', name: 'Sezonowy zimny', icon: '❄️', desc: 'Użytkowany w ciepłych miesiącach' },
    { id: 'pergola', name: 'Pergola', icon: '🌿', desc: 'Otwarta konstrukcja ogrodowa' },
    { id: 'not-sure', name: 'Nie wiem', icon: '❓', desc: 'Pomożemy wybrać najlepsze rozwiązanie' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('gardenType', selectedType);
    
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        body: formData
      });
      
      const result = await response.json();
      setMessage("Dziękujemy! Wkrótce się odezwiemy.");
      
      if (result.success) {
        (e.target as HTMLFormElement).reset();
        setSelectedType("");
      }
    } catch {
      setMessage("Błąd. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Sekcja 1: Wybór typu ogrodu */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">1. Wybierz typ ogrodu</h3>
          <div className="space-y-3">
            {gardenTypes.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedType === type.id 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
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

        {/* Sekcja 2: Dane kontaktowe */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">2. Dane kontaktowe</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imię i nazwisko *</label>
              <input
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="123 456 789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <input
                name="address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kod pocztowy</label>
                <input
                  name="postalCode"
                  placeholder="00-950"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Miasto</label>
                <input
                  name="city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja 3: Dodatkowe informacje */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">3. Szczegóły</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferowany termin spotkania</label>
              <input
                name="meetingDate"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dodatkowe informacje</label>
              <textarea
                name="comment"
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Opisz swoje oczekiwania..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Podsumowanie */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">Podsumowanie zapytania:</h3>
        <div className="text-sm">
          <span className="font-medium">Wybrany typ:</span> {
            selectedType ? gardenTypes.find(t => t.id === selectedType)?.name : 'Nie wybrano'
          }
        </div>
      </div>

      {/* Przycisk wysyłania */}
      <div className="mt-6 text-center">
        <button
          type="submit"
          disabled={isSubmitting || !selectedType}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            isSubmitting || !selectedType
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg'
          }`}
        >
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij zapytanie'}
        </button>
      </div>

      {message && (
        <div className="mt-4 text-center p-3 rounded bg-green-100 text-green-700">
          {message}
        </div>
      )}
    </form>
  );
}
