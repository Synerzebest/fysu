"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ChevronDown, UserRound } from "lucide-react";
import Image from "next/image";
import CartDrawer from "./CartDrawer";

const logoWhite = "/images/fysu-light.png";
const logoBlack = "/images/fysu-dark.png";

function MobileMenu({
  isOpen,
  setIsOpen,
  collectionOpen,
  setCollectionOpen,
  handleMobileLinkClick,
  links,
  collections,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  collectionOpen: boolean;
  setCollectionOpen: (v: boolean) => void;
  handleMobileLinkClick: () => void;
  links: { label: string; href: string }[];
  collections: { label: string; href: string }[];
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    update();

    const observer = new MutationObserver(update);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
     <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl">
      {/* Barre mobile */}
      <div className="flex items-center gap-3">
        <div className="bg-[var(--navbar-bg)]/60 backdrop-blur-sm w-[70%] rounded-4xl flex justify-start">
        <Link href="/" className="w-full flex items-center justify-start">
          <div className="relative h-[24px] w-[160px] my-[.52rem]">
            <Image
              src={isDark ? logoBlack : logoWhite}
              alt="FYSU Logo"
              fill
              priority
              sizes="160px"
              className="object-contain"
            />
          </div>
        </Link>
        </div>

        <div className="bg-[var(--navbar-bg)]/60 backdrop-blur-sm w-[30%] rounded-4xl flex gap-3 justify-center items-center text-[var(--menu)] h-[42px]">
          {mounted && <CartDrawer />}

          <button onClick={() => setIsOpen(!isOpen)} className="text-[var(--menu)]" >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full mt-2 w-full overflow-hidden text-[var(--menu)] rounded-xl bg-[var(--navbar-bg)]/60 backdrop-blur-sm"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-5xl font-bold tracking-tighter px-4 py-4">Menu</p>

            <motion.ul
              className="flex flex-col gap-4 uppercase text-sm tracking-wider px-4 pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Pages normales */}
              {links.map((link) =>
                link.label === "COLLECTIONS" ? (
                  <React.Fragment key="collections-mobile">
                    <li>
                      <button
                        onClick={() => setCollectionOpen(!collectionOpen)}
                        className="flex items-center justify-between w-full py-2 border-b border-white/20"
                      >
                        COLLECTIONS
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${collectionOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </li>

                    <AnimatePresence>
                      {collectionOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 space-y-2 text-xs overflow-hidden"
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
                  </React.Fragment>
                ) : (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleMobileLinkClick}
                      className="block py-2 border-b border-white/20"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
              <li>
                <Link href="/profile">
                  <UserRound size={20} />
                </Link>
              </li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------
// MAIN NAVBAR
// -----------------------
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  const [links, setLinks] = useState<{ label: string; href: string }[]>([]);
  const [collections, setCollections] = useState<{ label: string; href: string }[]>([]);

  // LOAD DB NAV LINKS
  useEffect(() => {
    const loadPages = async () => {
      const res = await fetch("/api/pages");
      const data = await res.json();

      setLinks([
        ...data.map((p: any) => ({
          label: p.title.toUpperCase(),
          href: `/${p.slug}`,
        })),
        { label: "COLLECTIONS", href: "#" }, // entry point for submenu
      ]);
    };

    const loadCollections = async () => {
      const res = await fetch("/api/collectionPages");
      const data = await res.json();

      setCollections(
        data.map((c: any) => ({
          label: c.title,
          href: `/collections/${c.slug}`,
        }))
      );
    };

    loadPages();
    loadCollections();
  }, []);

  const handleMobileLinkClick = () => {
    setIsOpen(false);
    setCollectionOpen(false);
  };

  return (
    <>
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        collectionOpen={collectionOpen}
        setCollectionOpen={setCollectionOpen}
        handleMobileLinkClick={handleMobileLinkClick}
        links={links}
        collections={collections}
      />
    </>
  );
}
