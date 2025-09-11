import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Logo WebP */}
        <div className="flex justify-center mb-6">
          <img 
            src="/images/verandana_logo_losos.webp" 
            alt="Verandana"
            style={{ height: '60px', width: 'auto' }}
          />
        </div>
        
        {/* Dane firmy */}
        <div className="text-center mb-6">
          <p className="font-bold text-lg">VERANDANA sp. z o.o.</p>
          <p className="text-sm text-gray-400">Miodunki 3, 44-151 Gliwice</p>
          <p className="text-sm text-gray-400">NIP: 6312707409 | REGON: 524383183</p>
        </div>
        
        {/* Dane kontaktowe */}
        <div className="text-center mb-6">
          <a href="tel:+48605834422" className="text-white hover:text-orange-400 transition-colors">
            Tel: +48 605 834 422
          </a>
          <span className="mx-2 text-gray-500">|</span>
          <a href="mailto:roman@verandana.pl" className="text-white hover:text-orange-400 transition-colors">
            roman@verandana.pl
          </a>
        </div>
        
        {/* Linki prawne */}
        <div className="border-t border-gray-700 pt-6 mt-6 flex justify-center gap-6 text-sm">
          <Link href="/polityka-prywatnosci" className="text-gray-300 hover:text-white transition-colors">
            Polityka Prywatności
          </Link>
          <Link href="/regulamin" className="text-gray-300 hover:text-white transition-colors">
            Regulamin
          </Link>
        </div>
        
        {/* Copyright */}
        <p className="text-xs text-gray-500 text-center mt-6">
          &copy; {currentYear} VERANDANA sp. z o.o. Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
