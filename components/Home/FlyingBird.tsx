"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const bird = "/images/flying_bird.png"

export default function FlyingBird() {
  return (
    <Link
      href="/collections/when-the-flowers-bloom"
      aria-label="Découvrir la collection"
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.div
        className="cursor-pointer select-none"
        initial={{ y: 0, rotate: -2 }}
        animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          src={bird}
          alt="Bird"
          width={64}
          height={64}
          draggable={false}
          className="select-none"
          priority
        />
      </motion.div>
    </Link>
  );
}
