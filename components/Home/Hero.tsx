'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const imageBackground = "/images/home.png"

const HomeHero: React.FC = () => {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px]">
      {/* Background image */}
      <Image
        src={imageBackground}
        alt="FYSU Chapter I Background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay text */}
      <div className="absolute inset-0 bg-black/10 flex items-center justify-center px-4">
        <div className="text-center text-white space-y-4">
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide uppercase">
            Artisanal
          </h1>
          <h2 className="text-2xl md:text-4xl font-serif tracking-wider">
            前奏曲
          </h2>
          <h2 className="text-2xl md:text-4xl font-serif tracking-wider">
            第1章
          </h2>
          <Link href="/collections/prelude/chapter-one">
            <button className="uppercase bg-white text-black p-4 border border-white hover:text-white hover:bg-black hover:border-black duration-300 cursor-pointer">
                Explore the collection
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
