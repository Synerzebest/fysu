import React from 'react'

const backgroundImage = "/images/home-about.png"

const Origin = () => {
  return (
    <section
      className="sm:w-[90%] sm:rounded-xl mx-auto w-full bg-cover bg-center text-white px-6 py-20 md:py-32 font-sans relative top-24"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h2 className="text-3xl md:text-5xl font-cinzel text-center">FYSU</h2>
      <p className="mt-2 italic text-sm md:text-base text-gray-300 text-center">/ˈfai.su/</p>

      <div className="max-w-4xl mx-auto mt-10 text-sm md:text-base leading-relaxed tracking-wide space-y-4 text-gray-200">
        <p className="font-semibold text-white">
          FYSU ARTISANAL FALL–WINTER 26.
        </p>

        <p>
          <strong>FYSU</strong> s’inscrit dans un moment de bascule. Une époque où les images circulent plus vite que les récits, où les identités se tissent en ligne, à partir de références croisées, souvent floues.
        </p>
        <p>
          Le projet <strong>FYSU</strong> naît de cette matière hybride : un triangle fait d’Afrique, d’Europe et d’Asie extrême-orientale. Une origine multiple, ou aucune.
          Un contexte flottant, hérité de la mondialisation culturelle. Et avec lui, une première collection.
        </p>

        <p className="mt-8 font-semibold text-white">Lack of Love, c’est le point de départ.</p>
        <p>
          Une manière de chercher ce qu’est <strong>FYSU</strong>, en acceptant que cette recherche soit encore incertaine.
          Le nom vient d’un morceau de Ryuichi Sakamoto. Une musique douce et mélancolique, où tout semble suspendu.
        </p>
        <p>
          Le manque d’amour, ici, ne crie pas. Il observe. Il cherche une forme à donner à ce qui reste en creux : l’identité, l’émotion, le goût du vrai.
        </p>
      </div>
    </section>
  )
}

export default Origin
