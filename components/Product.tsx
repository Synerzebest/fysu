import React from "react";
import Image from "next/image";

interface ProductProps {
  name: string;
  price: number;
  imageUrl: string;
  colors?: number;
}

const Product: React.FC<ProductProps> = ({ name, price, imageUrl, colors = 1 }) => {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
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
