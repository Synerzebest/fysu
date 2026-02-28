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

      <div
        className="
          flex
          gap-6
          overflow-x-auto
          scroll-smooth
          snap-x snap-mandatory
          no-scrollbar
          pb-2
        "
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="
              snap-start
              flex-shrink-0
              w-[220px]
              sm:w-[260px]
              md:w-[300px]
              lg:w-[320px]
            "
          >
            <Product product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}