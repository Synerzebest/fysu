"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ChevronDown, UserRound } from "lucide-react";
import Image from "next/image";
import CartDrawer from "./CartDrawer"

const logoImage = "/images/logo.png";

const collections = [
  { label: "The Prelude Chapter 1", href: "/collections/prelude/chapter-one" },
  { label: "The Prelude Chapter 2", href: "/collections/prelude/chapter-two" },
  { label: "The Prelude Chapter 3", href: "/collections/prelude/chapter-two" },
];

const navLinks = [
  { label: "FOR HIM", href: "/men" },
  { label: "FOR HER", href: "/women" },
  { label: "COLLECTIONS", href: "#" },
  { label: "EASTWIND", href: "/eastwind" },
  { label: "ABOUT FYSU", href: "/about" },
];


function MobileMenu({
  isOpen,
  setIsOpen,
  collectionOpen,
  setCollectionOpen,
  handleMobileLinkClick
}: {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  collectionOpen: boolean
  setCollectionOpen: (val: boolean) => void
  handleMobileLinkClick: () => void
}) {
  return (
    <div className="md:hidden fixed top-2 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl">
      {/* Barre mobile */}
      <div className="flex items-center gap-3">
        <div className="bg-neutral-800/60 backdrop-blur-sm w-[60%] rounded-4xl flex justify-center">
          <Link href="/">
            <div className="w-12 sm:w-14 h-auto">
              <Image
                src={logoImage}
                alt="FYSU Logo"
                width={30}
                height={30}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </Link>
        </div>
        <div className="bg-neutral-800/60 backdrop-blur-sm w-[40%] rounded-4xl flex gap-3 justify-center items-center text-white h-[50px]">
          <CartDrawer />
          <Link href="/profile">
            <UserRound size={20} />
          </Link>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu déroulant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full mt-2 w-full overflow-hidden text-white rounded-xl bg-neutral-800/60 backdrop-blur-sm"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p className="text-5xl font-bold tracking-tighter text-white px-4 py-4">
              Menu
            </p>
            <motion.ul
              className="flex flex-col gap-4 uppercase text-sm tracking-wider px-4 pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {navLinks.map((link) => (
                <React.Fragment key={link.label}>
                  {link.label === "COLLECTIONS" ? (
                    <>
                      <li>
                        <button
                          onClick={() => setCollectionOpen(!collectionOpen)}
                          className="flex items-center justify-between w-full py-2 border-b border-white/20"
                        >
                          {link.label}
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              collectionOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </li>
                      <AnimatePresence>
                        {collectionOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-4 space-y-2 text-xs"
                          >
                            {collections.map((col) => (
                              <li key={col.label}>
                                <Link
                                  href={col.href}
                                  onClick={handleMobileLinkClick}
                                  className="block py-1 border-b border-white/10"
                                >
                                  {col.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <li>
                      <Link
                        href={link.href}
                        onClick={handleMobileLinkClick}
                        className="block py-2 border-b border-white/20"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  const handleMobileLinkClick = () => {
    setIsOpen(false);
    setCollectionOpen(false);
  };

  return (
    <>
      <nav className="hidden md:block z-50 bg-neutral-800/60 backdrop-blur-sm w-11/12 max-w-3xl left-1/2 -translate-x-1/2 fixed top-2 text-white px-6 rounded-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="w-12 sm:w-14 h-auto">
              <Image
                src={logoImage}
                alt="FYSU Logo"
                width={60}
                height={60}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 uppercase text-sm tracking-wider">
            <ul className="flex gap-8">
              {navLinks.map((link) => (
                <React.Fragment key={link.label}>
                  {link.label === "COLLECTIONS" ? (
                    <li className="relative">
                      <button
                        onClick={() => setCollectionOpen((prev) => !prev)}
                        className="flex items-center gap-1 hover:underline"
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${collectionOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {collectionOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-8 left-0 bg-neutral-800/60 backdrop-blur-md text-white text-sm mt-2 rounded shadow-lg z-50 min-w-[220px] overflow-hidden"
                          >
                            {collections.map((col) => (
                              <Link
                                key={col.label}
                                href={col.href}
                                className="block px-4 py-2 hover:bg-neutral-900/60 duration-300 whitespace-nowrap"
                                onClick={() => setCollectionOpen(false)}
                              >
                                {col.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li>
                      <Link href={link.href} className="hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>

            {/* Panier Desktop */}
            <CartDrawer />

            <Link href="/profile">
              <UserRound size={20} />
            </Link>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        collectionOpen={collectionOpen}
        setCollectionOpen={setCollectionOpen}
        handleMobileLinkClick={handleMobileLinkClick}
      />
    </>
  );
};

export default Navbar;
