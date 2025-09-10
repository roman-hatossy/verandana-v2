export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Regulamin świadczenia usług</h1>
        <div className="prose lg:prose-xl space-y-4">
          <h2 className="text-xl font-semibold mt-6">§1. Postanowienia ogólne</h2>
          <p>
            1. Niniejszy regulamin określa zasady korzystania ze strony internetowej verandana.pl 
            oraz zasady świadczenia usług przez VERANDANA sp. z o.o.<br />
            2. Właścicielem strony jest VERANDANA sp. z o.o. z siedzibą w Gliwicach.
          </p>
          <h2 className="text-xl font-semibold mt-6">§2. Zakres usług</h2>
          <p>
            Usługodawca świadczy usługi w zakresie:<br />
            • Projektowania ogrodów zimowych<br />
            • Montażu konstrukcji ogrodowych<br />
            • Doradztwa technicznego<br />
            • Serwisu gwarancyjnego i pogwarancyjnego
          </p>
          <h2 className="text-xl font-semibold mt-6">§3. Gwarancja</h2>
          <p>
            • Konstrukcja aluminiowa: 10 lat<br />
            • Szyby i uszczelki: 5 lat<br />
            • Elementy ruchome: 2 lata<br />
            • Montaż: 3 lata
          </p>
          <h2 className="text-xl font-semibold mt-6">§4. Reklamacje</h2>
          <p>
            1. Reklamacje należy zgłaszać pisemnie lub mailowo<br />
            2. Czas rozpatrzenia: do 14 dni<br />
            3. W przypadku uznania reklamacji - naprawa w ciągu 30 dni
          </p>
        </div>
      </div>
    </div>
  );
}
