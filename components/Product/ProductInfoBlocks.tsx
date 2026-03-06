"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

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

function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <p
        className={`text-lg leading-relaxed text-foreground/80 whitespace-pre-line ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>

      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-sm mt-2 text-foreground/50 hover:text-foreground transition"
        >
          Read more
        </button>
      )}
    </div>
  )
}

export default function ProductInfoBlocks({ blocks }: Props) {
  if (!blocks?.length) return null

  return (
    <section className="py-28 space-y-28">
      {blocks.map((block) => {
        if (!block.image_url) return null

        return (
          <motion.div
            key={block.id}
            className="w-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* IMAGE */}
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
                  <p className="text-sm text-foreground/40 italic">
                    {block.subtitle}
                  </p>
                )}
              </div>

              {/* CONTENT SIDE */}
              <div className="pt-6 border-t border-neutral-300">
                {block.content && <ExpandableText text={block.content} />}
              </div>

            </div>
          </motion.div>
        )
      })}
    </section>
  )
}