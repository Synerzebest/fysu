import Image from "next/image"

type Props = {
  decorationText: string
  decorationImageUrl: string
}

export default function ProductDecorationSection({
  decorationText,
  decorationImageUrl,
}: Props) {
  if (!decorationText || !decorationImageUrl) return null

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Image full width + hauteur max */}
        <div className="w-full">
          <div className="relative w-full overflow-hidden max-h-[520px] sm:max-h-[640px]">
            {/* ratio stable + max height */}
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={decorationImageUrl}
                alt="Decoration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          </div>
        </div>

        {/* Texte avec border-top */}
        <div className="w-11/12 mx-auto mt-10 pt-8 border-t border-neutral-200">
          <p className="text-lg text-foreground leading-relaxed">
            {decorationText}
          </p>
        </div>
      </div>
    </section>
  )
}