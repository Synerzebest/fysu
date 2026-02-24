"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { ProductType } from "@/types/product";

type CartItem = ProductType & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: ProductType) => void;

  justAdded: Record<number, boolean>;
  addToCartWithFeedback: (product: ProductType, resetMs?: number) => void;

  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [justAdded, setJustAdded] = useState<Record<number, boolean>>({});
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const addToCart = (product: ProductType) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addToCartWithFeedback = (product: ProductType, resetMs = 1500) => {
    addToCart(product);

    // passe à "Added"
    setJustAdded((prev) => ({ ...prev, [product.id]: true }));

    // reset timer (si l'utilisateur clique plusieurs fois vite)
    const existingTimer = timersRef.current[product.id];
    if (existingTimer) clearTimeout(existingTimer);

    timersRef.current[product.id] = setTimeout(() => {
      setJustAdded((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
      delete timersRef.current[product.id];
    }, resetMs);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
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
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};