'use client';

import React from 'react';
import Image from 'next/image';

const imageBackground = "/images/her.png"

const HeroForHim: React.FC = () => {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px]">
      {/* Background image */}
      <Image
        src={imageBackground}
        alt="FYSU For Her"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay text */}
      <div className="absolute inset-0 bg-black/10 flex items-center justify-center px-4">
        <div className="text-center text-white space-y-4">
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide">
            FYSU
          </h1>
          <h2 className="text-2xl md:text-4xl font-serif tracking-wider">
            FOR HER
          </h2>
          <p className="text-xs md:text-sm tracking-wider uppercase">
            Women&apos;s ready-to-wear collections from clothes, shoes and accessories
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroForHim;
