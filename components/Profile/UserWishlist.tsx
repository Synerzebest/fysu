"use client";

import { useEffect, useState } from "react";
import Product from "../Product";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/wishlist");
        const json = await res.json();

        if (!res.ok) {
          console.error("Erreur wishlist:", json?.error);
          setWishlist([]);
          return;
        }

        const items = Array.isArray(json?.wishlist) ? json.wishlist : [];
        setWishlist(items);
      } catch (e) {
        console.error("Erreur loadWishlist:", e);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  return (
    <div className="w-11/12 mx-auto max-w-7xl relative top-44">
      <h1 className="text-2xl font-dior mb-6">Ma liste de souhaits</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : wishlist.length === 0 ? (
        <p>Aucun produit liké.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((w, idx) => (
            <Product key={w?.product_id ?? idx} product={w.products} />
          ))}
        </div>
      )}
    </div>
  );
}