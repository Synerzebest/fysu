import { supabaseServer } from "@/lib/supabaseServer"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"

export default async function CollectionPage({ params }:any) {
  const { slug } = params

  // Récupérer la page
  const { data: page, error: pageError } = await supabaseServer
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("visible", true)
    .single()

  if (pageError || !page) {
    return <div className="p-10 text-center">Collection introuvable.</div>
  }

  // Récupérer les produits liés à cette page
  const { data: products, error: productError } = await supabaseServer
    .from("page_products")
    .select("products(*)") // jointure sur la table products
    .eq("page_id", page.id)

  if (productError) {
    console.error(productError)
  }

  return (
    <>
      <Navbar />
      <div className="p-6 relative top-24 pb-44">
        <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

        {(!products || products.length === 0) && (
          <p className="text-neutral-500">Aucun produit dans cette collection.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((p: any) => {
            const product = p.products
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group block rounded-xl overflow-hidden border"
              >
                <div className="aspect-[3/4] bg-neutral-100">
                  <Image
                    src={product.product_images?.[0]?.url ?? "/placeholder.png"}
                    alt={product.name}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold uppercase tracking-wide group-hover:underline">
                    {product.name}
                  </p>
                  <p className="text-sm font-light">€{product.price}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <Footer />
    </>
  )
}
