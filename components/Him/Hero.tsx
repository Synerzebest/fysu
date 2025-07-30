'use client';

import React from 'react';
import Image from 'next/image';

const imageBackground = "/images/him.png"

const HeroForHer: React.FC = () => {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px]">
      {/* Background image */}
      <Image
        src={imageBackground}
        alt="FYSU For Him"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay text */}
      <div className="absolute inset-0 bg-black/10 flex items-center justify-center px-4">
        <div className="text-center text-white space-y-4">
          <h1 className="text-3xl md:text-5xl tracking-wide font-cinzel m-[0]">
            FYSU
          </h1>
          <h2 className="text-2xl md:text-4xl tracking-wider font-cinzel m-[0]">
            FOR HIM
          </h2>
          <p className="text-xs md:text-sm tracking-wider uppercase">
            Men&apos;s ready-to-wear collections from clothes, shoes and accessories
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroForHer;
