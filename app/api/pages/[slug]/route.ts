import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Charger la page
  const { data: pages, error: pageError } = await supabaseAdmin
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("visible", true)
    .limit(1)

  if (pageError || !pages || pages.length === 0) {
    return NextResponse.json(
      { error: "Page not found" },
      { status: 404 }
    )
  }

  const page = pages[0]

  // Charger les sections liées à cette page

  const { data: sectionLinks, error: sectionError } = await supabaseAdmin
    .from("section_pages")
    .select(`
      section:sections (
        id,
        title,
        display_order,
        is_active,
        section_products (
          display_order,
          product:products (
            id,
            name,
            slug,
            price,
            gender,
            createdAt,
            product_images (
              id,
              url,
              color
            )
          )
        )
      )
    `)
    .eq("page_id", page.id)

  if (sectionError) {
    console.error(sectionError)
    return NextResponse.json(
      { error: "Failed to load sections" },
      { status: 500 }
    )
  }

  // Formatter proprement 

  const sections =
    sectionLinks
      ?.map((link: any) => link.section)
      .filter((section: any) => section?.is_active)
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((section: any) => ({
        ...section,
        section_products: section.section_products
          ?.sort(
            (a: any, b: any) => a.display_order - b.display_order
          )
          .map((sp: any) => ({
            ...sp,
            product: {
              ...sp.product,
              main_image:
                sp.product?.product_images?.[0]?.url ?? null,
            },
          })),
      })) ?? []


  return NextResponse.json({
    page,
    sections,
  })
}