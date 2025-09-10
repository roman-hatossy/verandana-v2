'use client';
import React, { useState } from 'react';
import InquiryForm from '../components/InquiryForm';
import Footer from '../components/Footer';

const gardenTypes = [
  { 
    id: 'home-extension', 
    name: 'Home Extension', 
    desc: 'Nowoczesna bryła z płaskim dachem',
    image: '/images/home-extension-day.webp'
  },
  { 
    id: 'classic-warm', 
    name: 'Klasyczny ciepły', 
    desc: 'Szlachetny detal i elegancja',
    image: '/images/ogrod-klasyczny-day.webp'
  },
  { 
    id: 'seasonal-cold', 
    name: 'Sezonowy zimny', 
    desc: 'Idealny na wiosnę i lato',
    image: '/images/ogrod-sezonowy-day.webp'
  },
  { 
    id: 'pergola', 
    name: 'Pergola Bioclimatic', 
    desc: 'Lamele regulowane',
    image: '/images/pergola-bioclimatic-day.webp'
  },
  { 
    id: 'not-sure', 
    name: 'Nie wiem', 
    desc: 'Potrzebuję porady eksperta',
    image: '/images/help-me.webp'
  }
];

export default function HomePage() {
  const [selectedType, setSelectedType] = useState('');

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-4">
            Wprowadź do domu harmonię i nową przestrzeń do życia.
          </h1>
          <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mb-12">
            Odkryj, jak ogród zimowy otwarty na naturę staje się sercem Twojego domu przez cały rok.
          </p>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Jaki typ konstrukcji Cię interesuje?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {gardenTypes.map(type => (
                <button 
                  key={type.id} 
                  type="button" 
                  onClick={() => setSelectedType(type.id)}
                  className={`relative overflow-hidden rounded-lg transition-all transform hover:scale-105 ${
                    selectedType === type.id 
                      ? 'ring-4 ring-blue-500 shadow-xl' 
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                    <img 
                      src={type.image} 
                      alt={type.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <h3 className="font-semibold text-sm text-gray-900">{type.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
                  </div>
                </button>
              ))}
            </div>
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
