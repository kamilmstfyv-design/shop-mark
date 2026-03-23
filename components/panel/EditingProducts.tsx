"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Edit2, Trash2, Package, Info, Search } from "lucide-react";
import { AdminProductsListSkeleton } from "@/components/skeletons";
import { useProductsAdmin } from "@/hooks/useProductsAdmin";
import { useCategories } from "@/hooks/useCategories";
import EditProductSheet from "@/components/panel/EditProductSheet";
import { Input } from "@/components/ui/input";
import type { ProductRow } from "@/types/product";

export type ProductsAdminApi = ReturnType<typeof useProductsAdmin>;

export default function EditingProducts({ admin }: { admin: ProductsAdminApi }) {
  const { products, loading, saving, error, deleteProduct, updateProduct } = admin;
  const { categories } = useCategories();
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const name = String(p.name ?? "").toLowerCase();
      const desc = String(p.description ?? "").toLowerCase();
      const cat = String(p.category_slug ?? "")
        .replace(/-/g, " ")
        .toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [products, searchQuery]);

  const openEdit = (p: ProductRow) => {
    setEditing(p);
    setSheetOpen(true);
  };

  const handleSheetOpen = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setEditing(null);
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl py-2 font-sans">
        <AdminProductsListSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl rounded-lg border border-red-200 bg-red-50 p-10 text-center text-red-600">
        <Info className="mx-auto mb-2" />
        <p className="font-bold">Məlumatlar yüklənərkən xəta baş verdi:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl py-2 font-sans">
      <EditProductSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpen}
        product={editing}
        categories={categories.map((c) => ({
          id: String(c.id),
          slug: c.slug ?? null,
          category: String(c.category),
        }))}
        saving={saving}
        onSave={(id, prevUrl, payload, file) => updateProduct(id, prevUrl, payload, file)}
      />

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Məhsul idarəetmə paneli
              </h1>
              <p className="mt-1 text-slate-500">
                Siyahı, qiymət və şəkil redaktəsi (Supabase).
              </p>
            </div>
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-slate-700">
                {searchQuery.trim()
                  ? `${filteredProducts.length} / ${products.length} məhsul`
                  : `Cəmi: ${products.length} məhsul`}
              </span>
            </div>
          </div>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Məhsul adı, təsvir və ya kateqoriya..."
              className="h-11 border-slate-200 bg-white pl-10 pr-4 shadow-sm"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {products.length > 0 && filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Search className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-700">Axtarış üzrə nəticə yoxdur</h3>
              <p className="mt-2 text-sm text-slate-500">
                Başqa söz yazın və ya sahəni təmizləyin.
              </p>
            </div>
          ) : null}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:shadow-lg lg:flex-row"
              >
                <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100 lg:w-40">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="160px"
                  />
                </div>

                <div className="min-w-0 flex-grow">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-red-600">
                        {product.category_slug || "Kateqoriyasız"}
                      </span>
                      <h2 className="mb-2 text-xl font-bold text-slate-800">{product.name}</h2>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {product.is_new ? (
                        <span className="rounded bg-blue-100 px-2 py-1 text-[9px] font-bold uppercase text-blue-700">
                          Yeni
                        </span>
                      ) : null}
                      {product.is_popular ? (
                        <span className="rounded bg-amber-100 px-2 py-1 text-[9px] font-bold uppercase text-amber-700">
                          Populyar
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm italic text-slate-500">
                    {product.description || "Açıqlama daxil edilməyib."}
                  </p>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400">
                          <th className="pb-2">Həcm</th>
                          <th className="pb-2">Qiymət</th>
                          <th className="pb-2 text-right">Endirimli</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {product.variants && product.variants.length > 0 ? (
                          product.variants.map((v, idx) => (
                            <tr key={idx} className="text-sm">
                              <td className="py-2 font-medium text-slate-700">{v.size}</td>
                              <td className="py-2 text-slate-600">{v.price} ₼</td>
                              <td className="py-2 text-right">
                                {v.discountPrice ? (
                                  <span className="rounded bg-green-100 px-2 py-0.5 font-bold text-green-600">
                                    {v.discountPrice} ₼
                                  </span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-2 text-xs italic text-slate-400">
                              Variant yoxdur.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-center gap-3 border-slate-100 lg:flex-col lg:border-l lg:pl-6">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => openEdit(product)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white disabled:opacity-50"
                    aria-label="Redaktə et"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void deleteProduct(product)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-all hover:bg-red-600 hover:text-white disabled:opacity-50"
                    aria-label="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-20 text-center">
              <Package className="mx-auto mb-4 text-slate-200" size={60} />
              <h3 className="text-xl font-bold text-slate-400">Məhsul tapılmadı</h3>
              <p className="mt-2 text-sm text-slate-400">
                Sistemə hələ məhsul əlavə edilməyib.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
