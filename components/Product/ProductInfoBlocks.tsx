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

  const formattedText = text.replace(/\\n/g, "\n")

  return (
    <div>
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : "5.5rem" }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden"
      >
        <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
          {formattedText}
        </p>
      </motion.div>

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="text-sm mt-2 text-foreground/50 hover:text-foreground transition"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
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
            <div className="relative w-full aspect-[16/7] overflow-hidden">
              <Image
                src={block.image_url}
                alt={block.title ?? "Product detail"}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            <div className="max-w-6xl mx-auto mt-14 grid md:grid-cols-2 gap-16 w-11/12">
              <div className="space-y-2">
                {block.title && (
                  <h3 className="text-xl font-medium font-dior">
                    {block.title}
                  </h3>
                )}

                {block.subtitle && (
                  <p className="text-sm text-foreground/40 italic">
                    {block.subtitle}
                  </p>
                )}
              </div>

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