// File: components/TileGrid.tsx
import React from 'react';
import Image from 'next/image';

// Zaktualizowana definicja danych z precyzyjnymi ścieżkami do obrazów .webp (wersja 'day')
const tileData = [
  {
    title: 'Home Extension',
    description: 'Nowoczesna bryła z płaskim dachem',
    imageUrl: '/images/home-extension-day.webp',
  },
  {
    title: 'Klasyczny ciepły',
    description: 'Szlachetny detal i elegancja',
    imageUrl: '/images/ogrod-klasyczny-day.webp',
  },
  {
    title: 'Sezonowy zimny',
    description: 'Idealny na wiosnę i lato',
    imageUrl: '/images/ogrod-sezonowy-day.webp',
  },
  {
    title: 'Pergola Bioclimatic',
    description: 'Lamele regulowane',
    imageUrl: '/images/pergola-bioclimatic-day.webp',
  },
  {
    title: 'Nie wiem',
    description: 'Potrzebuję porady eksperta',
    imageUrl: '/images/help-me.webp', 
  },
];

const TileGrid = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Jaki typ konstrukcji Cię interesuje?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {tileData.map((tile) => (
          <div
            key={tile.title}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-white group"
          >
            <div className="relative w-full h-40">
              <Image
                src={tile.imageUrl}
                alt={tile.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-1">{tile.title}</h3>
              <p className="text-sm text-gray-500">{tile.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TileGrid;