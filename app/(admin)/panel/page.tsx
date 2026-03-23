import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ADMIN_NAV } from "../_components/admin-nav";

export const metadata = {
  title: "İdarə paneli",
  description: "Məhsul, kateqoriya və slayder idarəetməsi",
};

export default function PanelPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-600">
          Panel
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
          İdarə paneli
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Bölmələri seçin. Hər kartda mağaza URL yolu göstərilir.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {ADMIN_NAV.filter((item) => item.href !== "/panel").map((item) => {
          const Icon = item.Icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-md"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-red-600" />
                </span>
                <span className="mt-4 block text-lg font-bold text-slate-900">
                  {item.label}
                </span>
                <code className="mt-1 block text-xs text-slate-500">{item.pathLabel}</code>
                <span className="mt-2 text-sm text-slate-600">{item.description}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Ünvan xatırlatması</p>
        <p className="mt-1">
          Panel səhifələri brauzerdə{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs text-slate-800 shadow-sm">
            /panel/...
          </code>{" "}
          altında açılır (məsələn{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">/panel/products</code>
          ).
        </p>
      </div>
    </div>
  );
}
