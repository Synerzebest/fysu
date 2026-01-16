'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabaseClient' 
import { Carousel } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

type HeroImage = {
  image_path: string
}

const HomeHero = () => {
  const [images, setImages] = useState<HeroImage[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabaseClient
        .from('hero_slider')
        .select('image_path')
        .order('order')

      if (error) {
        console.error('Erreur Supabase:', error)
        return
      }

      setImages(data || [])
    }

    fetchImages()
  }, [])

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden">
      <Carousel autoplay dots={false} effect="fade" className="h-full">
        {images.map((item, index) => (
          <div key={index} className="relative w-full h-[90vh] min-h-[600px]">
            <Image
              src={`https://mugpnlsqeqbojnzrfnjf.supabase.co/storage/v1/object/public/hero-images/${item.image_path}`}
              alt={`Hero image ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/10 flex items-end justify-center px-4">
              <div className="text-center text-white space-y-4">
                {/* <h1 className="text-3xl md:text-5xl font-sans tracking-widest uppercase">
                  Artisanal
                </h1>
                <h2 className="text-2xl md:text-4xl font-serif tracking-wider">前奏曲</h2>
                <h2 className="text-2xl md:text-4xl font-serif tracking-wider">第1章</h2> */}
                <Link href="/collections/prelude/chapter-one">
                  <button className="mb-12 rounded-lg uppercase bg-white text-black p-4 border border-white hover:text-white hover:bg-black hover:border-black duration-300 cursor-pointer">
                    Explore the collection
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  )
}

export default HomeHero
