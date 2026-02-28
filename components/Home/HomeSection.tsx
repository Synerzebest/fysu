"use client";

import { useEffect, useState } from "react";
import Product from "../Product";
import { ProductType } from "../../types/product"

export default function HomeSection({ slug }: { slug: string }) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch(`/api/sections/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setTitle(data.title);
      });
  }, [slug]);

  if (!products.length) return null;

  return (
    <section className="relative top-56 w-11/12 mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-8 font-dior">{title}</h2>

      <div className="flex gap-6 w-full overflow-x-scroll">
        {products.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}