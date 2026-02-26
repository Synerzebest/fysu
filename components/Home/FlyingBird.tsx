"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const bird = "/images/flying_bird.png";

export default function FlyingBird() {
  return (
    <Link
      href="/collections/when-the-flowers-bloom"
      aria-label="Découvrir la collection"
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.div
        className="relative cursor-pointer select-none"
        initial={{ y: 0, rotate: -2 }}
        animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Bubble */}
        <motion.div
          className="absolute -top-12 right-2 whitespace-nowrap rounded-full bg-white text-black text-xs px-3 py-1 shadow-xl"
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
        >
          Help me find the flowers
          {/* Tail */}
          <span className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-white" />
        </motion.div>

        <Image
          src={bird}
          alt="Bird"
          width={140}
          height={140}
          draggable={false}
          className="select-none scale-x-[-1]"
          priority
        />
      </motion.div>
    </Link>
  );
}