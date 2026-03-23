"use client";

import Link from "next/link";
import { ExternalLink, Shield } from "lucide-react";
import AdminMobileNav from "./AdminMobileNav";

export default function AdminTopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/90 bg-slate-800 text-white shadow-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="shrink-0 font-serif text-lg font-bold tracking-tight text-white transition hover:text-red-200 sm:text-xl"
          >
            SerabEvi555
          </Link>
          <span className="hidden h-6 w-px bg-white/20 sm:block" aria-hidden />
          <span className="hidden items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-300 sm:inline-flex">
            <Shield className="h-3.5 w-3.5 text-red-400" aria-hidden />
            İdarə paneli
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10 sm:inline-flex"
          >
            <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
            Mağazaya keç
          </Link>
          <div className="md:hidden">
            <AdminMobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
