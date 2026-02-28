"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { ProductType } from "@/types/product";

type CartItem = ProductType & {
  quantity: number;
  selectedSizeId: string;
  selectedSizeLabel: string;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (product: ProductType, sizeId: string, sizeLabel: string) => void;

  justAdded: Record<string, boolean>;
  addToCartWithFeedback: (
    product: ProductType,
    sizeId: string,
    sizeLabel: string,
    resetMs?: number
  ) => void;

  removeFromCart: (productId: number, sizeId: string) => void;
  increaseQuantity: (productId: number, sizeId: string) => void;
  decreaseQuantity: (productId: number, sizeId: string) => void;

  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "fysu_cart_v1";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const [justAdded, setJustAdded] = useState<Record<string, boolean>>({});
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /* -------------------- LOAD (client only) -------------------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (e) {
      console.warn("Cart load failed:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  /* -------------------- SAVE (after hydration) -------------------- */
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Cart save failed:", e);
    }
  }, [cart, isHydrated]);

  /* -------------------- CART OPS -------------------- */

  const addToCart = (product: ProductType, sizeId: string, sizeLabel: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSizeId === sizeId
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSizeId === sizeId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          selectedSizeId: sizeId,
          selectedSizeLabel: sizeLabel,
          quantity: 1,
        },
      ];
    });
  };

  const addToCartWithFeedback = (
    product: ProductType,
    sizeId: string,
    sizeLabel: string,
    resetMs = 1500
  ) => {
    const key = `${product.id}-${sizeId}`;

    addToCart(product, sizeId, sizeLabel);

    setJustAdded((prev) => ({ ...prev, [key]: true }));

    const existingTimer = timersRef.current[key];
    if (existingTimer) clearTimeout(existingTimer);

    timersRef.current[key] = setTimeout(() => {
      setJustAdded((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      delete timersRef.current[key];
    }, resetMs);
  };

  const removeFromCart = (productId: number, sizeId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedSizeId === sizeId))
    );
  };

  const increaseQuantity = (productId: number, sizeId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSizeId === sizeId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number, sizeId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId && item.selectedSizeId === sizeId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      justAdded,
      addToCartWithFeedback,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [cart, justAdded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};