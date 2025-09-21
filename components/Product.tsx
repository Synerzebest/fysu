import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { ProductType } from "@/types/product"


const Product = ({ product }: { product: ProductType }) => {
    return (
      <div className="relative text-center max-w-[350px]">
        <div className="absolute left-2 top-2">
          <p className="uppercase tracking-wide text-sm text-gray-500">{product.category}</p>
        </div>
  
        {/* Bouton like indépendant */}
        <div
          className="absolute top-1 right-1 duration-300 cursor-pointer rounded-full p-1 hover:bg-gray-200 z-10"
          onClick={(e) => {
            e.stopPropagation()
            console.log('Liked', product.id)
          }}
        >
          <Heart size={24} strokeWidth={0.75} />
        </div>
  
        {/* Bloc cliquable = image + infos */}
        <Link href={`/product/${product.slug}`} className="group block">
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src={product.product_images?.[0]?.url}
              alt={product.name}
              width={400}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5 mt-2">
            <p className="text-sm font-semibold uppercase tracking-wide group-hover:underline transition">
              {product.name}
            </p>
            <p className="text-sm font-light">€{product.price}</p>
            <p className="text-xs text-neutral-500">
              {product.colors} COLOR{product.colors > 1 ? 'S' : ''}
            </p>
          </div>
        </Link>
      </div>
    )
  }

export default Product;