import Image from "next/image";

type Tile = { src: string; alt: string; ratio?: string };
const tiles: Tile[] = [
  { src: "/images/home-extension-day.webp", alt: "Home Extension Premium", ratio: "16/9" },
  { src: "/images/ogrod-klasyczny-day.webp", alt: "Ogród zimowy klasyczny", ratio: "4/3" },
  { src: "/images/ogrod-sezonowy-day.webp", alt: "Ogród zimowy sezonowy", ratio: "4/3" },
  { src: "/images/pergola-bioclimatic-day.webp", alt: "Pergola bioclimatic", ratio: "1/1" },
  { src: "/images/help-me.webp", alt: "Pomóż mi wybrać", ratio: "3/2" }
];

export default function TileGrid() {
  return (
    <section className="my-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((t, i) => (
          <article key={i} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-full" style={{ aspectRatio: t.ratio || "4/3" }}>
              <Image 
                src={t.src} 
                alt={t.alt} 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" 
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-center text-sm text-gray-800 font-medium">{t.alt}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
