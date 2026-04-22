import { Collapse } from "antd"
import type { CollapseProps } from "antd"
import AddToCartButton from "@/components/ui/AddToCartButton"
import { ColorSelector } from "./ColorSelector"
import { SizeSelector } from "./SizeSelector"
import { ProductType } from "@/types/product"
import { useTranslations } from "next-intl"

type ProductInfoProps = {
  product: ProductType
  colors: string[]
  sizes: ProductType["product_sizes"]

  selectedColor: string | null
  selectedSizeId: string | null
  selectedSizeLabel: string | null

  onColorSelect: (color: string) => void
  onSizeSelect: (id: string, label: string) => void
}

export default function ProductInfo({
  product,
  colors,
  sizes,
  selectedColor,
  selectedSizeId,
  selectedSizeLabel,
  onColorSelect,
  onSizeSelect,
}: ProductInfoProps) {
  const t = useTranslations("Product")

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <span className="font-medium">{t("details")}</span>,
      children: <p>{product.details ?? t("noDetails")}</p>,
    },
    {
      key: "2",
      label: <span className="font-medium">{t("sizeFit")}</span>,
      children: <p>{product.size_fit ?? t("noInfo")}</p>,
    },
  ]

  return (
    <div className="space-y-6 sticky top-24 p-4 sm:p-0">
      <h1 className="text-4xl font-medium">{product.name}</h1>

      <p className="text-lg font-bold">
        {product.price} EUR
      </p>

      {colors.length > 0 && (
        <ColorSelector
          colors={colors}
          selectedColor={selectedColor}
          onSelect={onColorSelect}
        />
      )}

      {sizes.length > 0 && (
        <SizeSelector
          sizes={sizes}
          selectedSizeId={selectedSizeId}
          onSelect={onSizeSelect}
        />
      )}

      <AddToCartButton
        product={product}
        selectedSizeId={selectedSizeId}
        selectedSizeLabel={selectedSizeLabel}
      />

      <Collapse
        items={items}
        bordered={false}
        ghost
        expandIconPlacement="end"
      />
    </div>
  )
}
