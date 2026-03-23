"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ADMIN_NAV, isNavActive } from "./admin-nav";
import { cn } from "@/lib/utils";

export default function AdminMobileNav() {
  const pathname = usePathname() ?? "";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 p-2 text-white transition hover:bg-white/10"
          aria-label="Panel menyusunu aç"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(100%,320px)] border-slate-200 bg-slate-50 p-0"
      >
        <SheetHeader className="border-b border-slate-200 bg-white px-4 py-4 text-left">
          <SheetTitle className="font-serif text-lg text-slate-900">
            Panel menyusu
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            Bölmələr və URL yolları
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3">
          {ADMIN_NAV.map((item) => {
            const active = isNavActive(pathname, item.href);
            const Icon = item.Icon;
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-xl border px-3 py-3 text-left transition",
                    active
                      ? "border-red-200 bg-red-50 text-red-900"
                      : "border-transparent bg-white text-slate-800 shadow-sm hover:border-slate-200",
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    {item.label}
                  </span>
                  <code className="text-[11px] text-slate-500">{item.pathLabel}</code>
                  <span className="text-xs text-slate-500">{item.description}</span>
                </Link>
              </SheetClose>
            );
          })}
          <SheetClose asChild>
            <Link
              href="/"
              className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-medium text-slate-700 shadow-sm"
            >
              Mağazaya qayıt
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
