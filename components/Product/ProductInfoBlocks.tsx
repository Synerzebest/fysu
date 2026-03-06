import Image from "next/image"

type InfoBlock = {
  id: string
  image_url: string | null
  title: string | null
  subtitle: string | null
  content: string | null
}

type Props = {
  blocks: InfoBlock[]
}

export default function ProductInfoBlocks({ blocks }: Props) {
  if (!blocks?.length) return null

  return (
    <section className="py-28 space-y-28">

      {blocks.map((block) => {
        if (!block.image_url) return null

        return (
          <div key={block.id} className="w-full">

            {/* IMAGE FULL WIDTH */}
            <div className="relative w-full aspect-[16/7] overflow-hidden">
              <Image
                src={block.image_url}
                alt={block.title ?? "Product detail"}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* TEXT SECTION */}
            <div className="max-w-6xl mx-auto mt-14 grid md:grid-cols-2 gap-16 w-11/12">

              {/* TITLE SIDE */}
              <div className="space-y-2">
                {block.title && (
                  <h3 className="text-3xl md:text-4xl font-medium font-dior">
                    {block.title}
                  </h3>
                )}

                {block.subtitle && (
                  <p className="text-sm text-neutral-500 italic">
                    {block.subtitle}
                  </p>
                )}
              </div>

              {/* CONTENT SIDE */}
              <div className="pt-6 border-t border-neutral-300">
                {block.content && (
                  <p className="text-lg leading-relaxed text-neutral-700">
                    {block.content}
                  </p>
                )}
              </div>

            </div>

          </div>
        )
      })}

    </section>
  )
}