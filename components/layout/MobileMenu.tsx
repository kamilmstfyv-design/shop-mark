"use client";

import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const MobileMenu = () => {
  const { setCartOpen } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
          aria-label="Menyunu aç"
        >
          <MenuIcon className="h-7 w-7" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,320px)] border-slate-200 bg-white p-0">
        <SheetHeader className="border-b border-slate-100 px-4 py-4 text-left">
          <SheetTitle className="font-serif text-lg text-slate-900">Menyu</SheetTitle>
          <SheetDescription className="text-slate-500">
            Səhifələr və səbət
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3">
          <SheetClose asChild>
            <Link
              href="/"
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Ana səhifə
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/products"
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Məhsullar
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              className="mt-2 w-full justify-start gap-2 border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="h-4 w-4" />
              Səbəti aç
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
