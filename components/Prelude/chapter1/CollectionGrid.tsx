'use client';

import Product from '@/components/Product';
import React from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  colors: number;
  imageUrl: string;
};

const products: Product[] = [
  {
    id: '1',
    name: 'CARDIGAN COAT',
    price: 1273,
    colors: 1,
    imageUrl: '/images/products/cardigan-coat.png',
  },
  {
    id: '2',
    name: 'BLAZER',
    price: 845,
    colors: 1,
    imageUrl: '/images/products/blazer.png',
  },
  {
    id: '3',
    name: 'TANK TOP',
    price: 69,
    colors: 2,
    imageUrl: '/images/products/tank-top.png',
  },
  {
    id: '4',
    name: 'SWEATER',
    price: 235,
    colors: 1,
    imageUrl: '/images/products/sweater.png',
  },
];

const CollectionGrid: React.FC = () => {

  return (
    <section className="px-6 py-12">
      {/* Header: Filters */}
      <div className="flex flex-wrap gap-6 justify-between items-center text-sm font-semibold uppercase tracking-wide mb-10">
        <div className="flex gap-6">
          <button className="hover:underline">Category ▾</button>
          <button className="hover:underline">Line ▾</button>
          <button className="hover:underline">Filters ▾</button>
        </div>
        <div>
          <button className="hover:underline">Sort by ▾</button>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Product key={product.id} name={product.name} price={product.price} imageUrl={product.imageUrl} />
        ))}
      </div>
    </section>
  );
};

export default CollectionGrid;
