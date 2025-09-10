'use client'
import { useState } from 'react'

const initialState = {
  name: '',
  email: '',
  phone: '',
  postalCode: '',
  deadline: '',
  type: '',
  message: '',
  consent: false,
  _honey: '',
}

export default function Page() {
  const [formData, setFormData] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

  // Ta funkcja walidacji musi być zgodna z Twoim formularzem.
  // Upewnij się, że klucze (np. 'name', 'email') pasują do atrybutów 'name' w polach <input>.
  function validate() {
    const e: Record<string,string> = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const zipRe = /^[0-9]{2}-?[0-9]{3}$/

    if (!formData.name) e.name = 'Podaj imię i nazwisko'
    if (!formData.email || !emailRe.test(formData.email)) e.email = 'Podaj poprawny e-mail'
    if (!formData.phone) e.phone = 'Podaj telefon'
    if (!formData.postalCode || !zipRe.test(formData.postalCode)) e.postalCode = 'Kod np. 44-100'
    if (!formData.type) e.type = 'Wybierz typ'
    if (!formData.consent) e.consent = 'Zaznacz zgodę'
    return e
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Weryfikacja Walidacji Frontendu
    const validationErrors = validate(); 
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
        alert("Błąd walidacji: Proszę poprawić dane w formularzu."); 
        return;
    }

    setIsSubmitting(true);
    console.log("DIAGNOSTYKA [1/3]: Próba wysłania danych...", formData);

    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log("DIAGNOSTYKA [2/3]: Odpowiedź HTTP otrzymana. Status:", response.status, "OK:", response.ok);

      // 2. Weryfikacja Typu Odpowiedzi
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text();
          console.error("KRYTYCZNE [3/3]: Odpowiedź nie jest w formacie JSON:", textResponse.substring(0, 500));
          alert(`Błąd Infrastruktury (Nieoczekiwany format). Status: ${response.status}. Sprawdź konsolę (F12).`);
          setIsSubmitting(false);
          return;
      }

      const result = await response.json();
      console.log("DIAGNOSTYKA [3/3]: Parsowanie JSON zakończone.", result);

      // 3. Obsługa Logiki Biznesowej
      if (response.ok) {
        alert(result.message || 'Sukces! Wiadomość została wysłana.');
        setFormData(initialState); 
        setErrors({});
      } else {
        alert(`Błąd API (Status ${response.status}): ${result.message || 'Wystąpił nieznany błąd.'}`);
      }

    } catch (error: any) {
      // 4. Zaawansowana Obsługa Błędów Sieciowych
      console.error("Błąd Krytyczny [3/3]: Błąd Sieci/Fetch/Wykonania:", error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
          alert('BŁĄD KRYTYCZNY SIECI (Failed to fetch). Możliwe przyczyny: Błąd CORS, problem z DNS, blokowanie reklam lub API jest niedostępne. Sprawdź Konsolę (F12).');
      } else if (error instanceof SyntaxError) {
          alert('BŁĄD KRYTYCZNY PARSOWANIA (JSON). Serwer zwrócił niepoprawną odpowiedź. Sprawdź Konsolę (F12).');
      } else {
          alert(`Błąd Ogólny: ${error.message}. Sprawdź Konsolę (F12).`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Zapytanie</h1>
      <form onSubmit={handleSubmit} noValidate>
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
