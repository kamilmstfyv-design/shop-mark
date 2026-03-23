"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AddToCartInput, CartLine } from "@/types/cart";
import { toast } from "sonner";

const STORAGE_KEY = "serabevi555-cart-v1";

function makeKey(productId: string, variantIndex: number) {
  return `${productId}::${variantIndex}`;
}

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addLine: (input: AddToCartInput) => void;
  setQty: (key: string, miqdar: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const addLine = useCallback((input: AddToCartInput) => {
    const key = makeKey(input.productId, input.variantIndex);
    const addQty = input.miqdar && input.miqdar > 0 ? input.miqdar : 1;

    setLines((prev) => {
      const idx = prev.findIndex((l) => l.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          miqdar: next[idx].miqdar + addQty,
        };
        return next;
      }
      const line: CartLine = {
        key,
        productId: input.productId,
        variantIndex: input.variantIndex,
        name: input.name,
        image_url: input.image_url,
        category_slug: input.category_slug,
        description: input.description,
        variantLabel: input.variantLabel,
        unitPrice: input.unitPrice,
        miqdar: addQty,
      };
      return [...prev, line];
    });
    toast.success("Səbətə əlavə olundu", {
      description: `${input.name} (${input.variantLabel})`,
    });
  }, []);

  const setQty = useCallback((key: string, miqdar: number) => {
    if (miqdar < 1) {
      setLines((prev) => prev.filter((l) => l.key !== key));
      toast.info("Sətir silindi");
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, miqdar } : l)),
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
    toast.info("Məhsul səbətdən çıxarıldı");
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    toast.message("Səbət təmizləndi");
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.miqdar, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.unitPrice * l.miqdar, 0),
    [lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      subtotal,
      cartOpen,
      setCartOpen,
      addLine,
      setQty,
      removeLine,
      clear,
    }),
    [
      lines,
      itemCount,
      subtotal,
      cartOpen,
      addLine,
      setQty,
      removeLine,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart yalnız CartProvider daxilində işlədilməlidir");
  }
  return ctx;
}
