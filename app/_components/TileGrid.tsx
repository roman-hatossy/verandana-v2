const tiles = [
  { title: "Home Extension", desc: "Rozszerzenie przestrzeni", icon: "🏠" },
  { title: "Ogród klasyczny", desc: "Całoroczny ogród", icon: "☀️" },
  { title: "Ogród sezonowy", desc: "Na ciepłe miesiące", icon: "❄️" },
  { title: "Pergola", desc: "Konstrukcja ogrodowa", icon: "🌿" },
  { title: "Pomoc w wyborze", desc: "Doradzimy najlepsze", icon: "❓" }
];

export default function TileGrid() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">{tile.icon}</div>
            <h3 className="text-xl font-bold mb-2">{tile.title}</h3>
            <p className="text-gray-600">{tile.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
