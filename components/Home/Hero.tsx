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
    <section className="relative w-full h-[100vh] min-h-[600px] overflow-hidden">
      <Carousel autoplay dots={false} effect="fade" className="h-full">
        {images.map((item, index) => (
          <div key={index} className="relative w-full h-[100vh] min-h-[600px]">
            <Image
              src={`https://mugpnlsqeqbojnzrfnjf.supabase.co/storage/v1/object/public/hero-images/${item.image_path}`}
              alt={`Hero image ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
            />
            <div className="absolute inset-0 flex items-end justify-start px-4">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

              <div className="relative text-white space-y-2 pb-6">

                <div>
                  <p className="font-dior text-[1.1rem]">When the flowers bloom</p>
                  <p className="font-dior text-sm">the newest spring collection</p>
                </div>

                <Link href="/collections/when-the-flowers-bloom" >
                  <button className="mb-4 bg-white px-4 py-4 rounded-lg uppercase text-sm text-black cursor-pointer">
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
