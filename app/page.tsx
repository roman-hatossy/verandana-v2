import TileGrid from "@/components/TileGrid";
import InquiryForm from "@/components/InquiryForm";

export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-slate-800 tracking-tight">
          Nowoczesne ogrody zimowe
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-slate-600">
          Odkryj nasze realizacje i poproś o bezpłatną wycenę.
        </p>

        {/* Siatka z 5 kafelkami */}
        <TileGrid />

        {/* Sekcja z formularzem */}
        <section id="inquiry-form" className="mt-16 sm:mt-24">
          <InquiryForm />
        </section>
      </div>
    </main>
  );
}
