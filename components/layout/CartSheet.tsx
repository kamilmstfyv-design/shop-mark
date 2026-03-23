"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { buildCartWhatsAppBody } from "@/lib/cartWhatsApp";
import { waMeUrl } from "@/lib/whatsapp";

export function CartOpenButton() {
  const { itemCount, setCartOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className="relative flex items-center gap-1 rounded-lg p-2 text-white transition hover:bg-white/10"
      aria-label="Səbəti aç"
    >
      <ShoppingBag className="h-6 w-6" />
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}

export default function CartSheet() {
  const {
    lines,
    subtotal,
    cartOpen,
    setCartOpen,
    setQty,
    removeLine,
    clear,
  } = useCart();

  const waHref =
    lines.length > 0
      ? waMeUrl(encodeURIComponent(buildCartWhatsAppBody(lines)))
      : "#";

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="left"
        className="flex w-full flex-col border-l border-slate-200 bg-slate-50 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-slate-200 bg-white px-4 py-4 text-left">
          <SheetTitle className="font-serif text-xl text-slate-900">Səbət</SheetTitle>
          <SheetDescription className="text-slate-500">
            Məhsulları təsdiqləyib WhatsApp ilə sifariş göndərin.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <ShoppingBag className="h-14 w-14 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">Səbət boşdur</p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/products" onClick={() => setCartOpen(false)}>
                  Məhsullara keç
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
              {lines.map((line) => (
                <li
                  key={line.key}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={line.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {line.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Litr: <span className="font-medium">{line.variantLabel}</span>
                    </p>
                    <p className="mt-1 text-sm font-bold text-red-700">
                      {line.unitPrice.toFixed(2)} ₼ × {line.miqdar} ={" "}
                      {(line.unitPrice * line.miqdar).toFixed(2)} ₼
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100"
                        onClick={() => setQty(line.key, line.miqdar - 1)}
                        aria-label="Azalt"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">
                        {line.miqdar}
                      </span>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100"
                        onClick={() => setQty(line.key, line.miqdar + 1)}
                        aria-label="Artır"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                        onClick={() => removeLine(line.key)}
                        aria-label="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {lines.length > 0 ? (
            <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">Ümumi</span>
                <span className="text-lg font-bold text-slate-900">
                  {subtotal.toFixed(2)} ₼
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-[#25D366] font-bold text-white hover:bg-[#128C7E]"
                  asChild
                >
                  <a href={waHref} target="_blank" rel="noopener noreferrer">
                    WhatsApp ilə göndər
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => clear()}
                >
                  Səbəti təmizlə
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
