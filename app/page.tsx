import Footer from "../components/Footer";
// ŚCIEŻKA: app/page.tsx

import TileGrid from "@/components/TileGrid";
import InquiryForm from "@/components/InquiryForm";

export default function Home() {
  
  // === BLOK DIAGNOSTYCZNY OMNIBUS FLASH ===
  // Poniższy kod sprawdzi, czy komponenty nie są 'undefined'.
  // Jeśli błąd nadal występuje, problem leży w pliku jednego z tych komponentów.
  if (!TileGrid || !InquiryForm) {
    return (
      <div style={{ padding: '40px', fontFamily: 'monospace', color: 'red', fontSize: '18px' }}>
        <h1>Błąd Krytyczny Ładowania Komponentu</h1>
        <p>Jeden z głównych komponentów strony (TileGrid lub InquiryForm) nie został poprawnie załadowany.</p>
        <p>Sprawdź, czy pliki `components/TileGrid.tsx` oraz `components/InquiryForm.tsx` zawierają na końcu linii `export default NazwaKomponentu;`</p>
        <p>Status TileGrid: {String(!!TileGrid)}</p>
        <p>Status InquiryForm: {String(!!InquiryForm)}</p>
      </div>
    );
  }
  // === KONIEC BLOKU DIAGNOSTYCZNEGO ===

  return (
    <main className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-slate-800 tracking-tight">
          Nowoczesne ogrody zimowe
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-slate-600">
          Odkryj nasze realizacje i poproś o bezpłatną wycenę.
        </p>

        {/* Siatka z typami konstrukcji */}
        <TileGrid />

        {/* Sekcja z formularzem */}
        <section id="inquiry-form" className="mt-16 sm:mt-24">
          <InquiryForm />
        </section>
      </div>
      <Footer />
    </main>
  );
}