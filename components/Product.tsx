import React from "react";
import Image from "next/image";
import { CiHeart } from "react-icons/ci";

interface ProductProps {
  name: string;
  price: number;
  imageUrl: string;
  colors?: number;
}

const Product: React.FC<ProductProps> = ({ name, price, imageUrl, colors = 1 }) => {
  return (
    <div className="relative text-center">
      <div className="absolute left-2 top-2">
        <p className="uppercase tracking-wider text-sm">collection name</p>
      </div>
      <div className="absolute top-1 right-1 duration-300 cursor-pointer rounded-full p-1 hover:bg-gray-200">
        <CiHeart size={24} />
      </div>
      <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={name}
          width={400}
          height={600}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-semibold uppercase tracking-wide">{name}</p>
        <p className="text-sm font-light">€{price}</p>
        <p className="text-xs text-neutral-500">{colors} COLOR{colors > 1 ? "S" : ""}</p>
      </div>
    </div>
  );
};

export default Product;
