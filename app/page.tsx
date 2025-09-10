'use client';
import React, { useState, useEffect } from 'react';
import InquiryForm from '../components/InquiryForm';
import Footer from '../components/Footer';

const gardenTypes = [
  { id: 'home-extension', name: 'Home Extension', desc: 'Rozszerzenie przestrzeni' },
  { id: 'classic-warm', name: 'Ogród klasyczny', desc: 'Całoroczny, ogrzewany' },
  { id: 'seasonal-cold', name: 'Ogród sezonowy', desc: 'Użytkowany w ciepłych miesiącach' },
  { id: 'pergola', name: 'Pergola', desc: 'Otwarta konstrukcja' },
  { id: 'not-sure', name: 'Nie wiem', desc: 'Pomoc w wyborze' }
];

export default function HomePage() {
  const [selectedType, setSelectedType] = useState('');

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="py-12 px-6 text-center bg-white shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
          Wprowadź do domu harmonię i nową przestrzeń do życia.
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
          Odkryj, jak ogród zimowy otwarty na naturę staje się sercem Twojego domu przez cały rok.
        </p>
        
        {/* Kafelki wyboru typu - przeniesione do nagłówka */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {gardenTypes.map(type => (
              <button 
                key={type.id} 
                type="button" 
                onClick={() => setSelectedType(type.id)}
                className={`p-4 text-center rounded-lg border-2 transition-all ${
                  selectedType === type.id 
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' 
                    : 'border-gray-200 hover:border-gray-400 bg-white'
                }`}
              >
                <div className="font-semibold text-sm">{type.name}</div>
                <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-6">
        <InquiryForm preselectedType={selectedType} />
      </main>
      
      <Footer />
    </div>
  );
}
