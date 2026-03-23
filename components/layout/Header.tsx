"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import CartSheet, { CartOpenButton } from "./CartSheet";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/80 bg-slate-800 text-white shadow-md">
      <div className="main-container flex items-center justify-between gap-4 py-3 md:py-4">
        <Link href="/" className="shrink-0">
          <h1 className="font-serif text-xl font-bold tracking-tight md:text-2xl">
            SerabEvi555
          </h1>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/" className="text-slate-200 transition hover:text-white">
            Ana səhifə
          </Link>
          <Link href="/products" className="text-slate-200 transition hover:text-white">
            Məhsullar
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <CartOpenButton />
          <div className="flex md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
