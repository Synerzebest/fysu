import { prisma } from '@/lib/prisma';
import { Navbar, Product, Footer } from "@/components";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  imageUrl: string;
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany()

  return (
    <>
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Produits</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product:Product) => (
          <Product key={product.id} name={product.name} price={product.price} imageUrl={product.imageUrl} />
        ))}
      </div>

      <Footer />
    </>
  )
}
