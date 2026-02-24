"use client";

import { ProductType } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

type Props = {
  product: ProductType;
  className?: string;
};

export default function AddToCartButton({ product, className }: Props) {
  const { addToCartWithFeedback, justAdded } = useCart();
  const isAdded = !!justAdded[product.id];

  return (
    <motion.button
      type="button"
      disabled={isAdded}
      onClick={() => addToCartWithFeedback(product, 1500)}
      className={`
        w-full
        bg-black
        text-white
        py-3
        text-sm
        font-medium
        tracking-wide
        transition-colors duration-300
        hover:bg-neutral-800
        disabled:cursor-not-allowed
        cursor-pointer
        disabled:bg-black
        relative
        overflow-hidden
        ${className || ""}
      `}
    >
      <div className="relative flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div
              key="added"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <Check size={16} />
              <span>Added to basket</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              Add to basket
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}