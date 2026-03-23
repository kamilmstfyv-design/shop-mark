"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, isNavActive } from "./admin-nav";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const pathname = usePathname() ?? "";

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-700/50 bg-slate-800 text-white md:flex">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Naviqasiya
        </p>
        <p className="mt-1 text-xs text-slate-300">Panel bölmələri</p>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {ADMIN_NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group rounded-xl border px-3 py-2.5 transition",
                active
                  ? "border-red-400/40 bg-red-600/20 text-white shadow-inner"
                  : "border-transparent text-slate-200 hover:border-white/10 hover:bg-white/5",
              )}
            >
              <span className="flex items-start gap-3">
                <Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    active ? "text-red-300" : "text-slate-400 group-hover:text-slate-200",
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-tight">
                    {item.label}
                  </span>
                  <code className="mt-0.5 block truncate text-[10px] font-normal text-slate-400 group-hover:text-slate-300">
                    {item.pathLabel}
                  </code>
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 p-4">
        <Link
          href="/"
          className="block rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-center text-xs font-medium text-slate-200 transition hover:bg-white/10"
        >
          Mağazaya keç
        </Link>
      </div>
    </aside>
  );
};

export default SideBar;
