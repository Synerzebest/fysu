'use client';

import React from 'react';
import Image from 'next/image';

const imageBackground = "/images/eastwind.png"

const HeroEastwind: React.FC = () => {
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
          <h1 className="text-3xl md:text-5xl font-cinzel tracking-wide">
            EASTWIND
          </h1>
          <p className="text-xs md:text-sm tracking-wider uppercase">
            Discover Fysu Scents Through Eastwind
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroEastwind;
