import { supabaseServer } from "@/lib/supabaseServer"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Product from "@/components/Product";

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
  .select(`
    products (
      id,
      name,
      slug,
      price,
      product_images ( url )
    )
  `)
  .eq("page_id", page.id)


  if (productError) {
    console.error(productError)
  }

  return (
    <>
      <Navbar />
  
      {/* HERO IMAGE */}
      {page.hero_image && (
        <div className="relative top-24 w-full h-[300px] md:h-[500px]">
          <Image
            src={page.hero_image}
            alt={page.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      <div className="relative top-36 z-50 pl-6 tracking-tighter">
        <p className="text-3xl font-bold">In this collection</p>
      </div>
  
      <div className="p-6 relative top-36 pb-44">
        {!page.hero_image && (
          <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
        )}
  
        {(!products || products.length === 0) && (
          <p className="text-neutral-500">
            Aucun produit dans cette collection.
          </p>
        )}
  
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((p: any, index) => {
            const product = p.products
            return (
              <Product key={index} product={product} />
            )
          })}
        </div>
      </div>
  
      <Footer />
    </>
  )  
}
