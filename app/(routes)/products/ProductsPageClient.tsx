"use client";

import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/layout/ProductCard";
import { ProductsPageSkeleton } from "@/components/skeletons";
import { Input } from "@/components/ui/input";

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ProductsPageClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Xəta:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categoryFiltered = useMemo(
    () =>
      category
        ? products.filter((product) => product.category_slug === category)
        : products,
    [products, category],
  );

  const displayProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categoryFiltered;
    return categoryFiltered.filter((product) => {
      const name = String(product.name ?? "").toLowerCase();
      const desc = String(product.description ?? "").toLowerCase();
      const cat = String(product.category_slug ?? "")
        .replace(/-/g, " ")
        .toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [categoryFiltered, searchQuery]);

  const title = category ? humanizeSlug(category) : "Bütün kolleksiya";
  const subtitle = category
    ? "Seçilmiş kateqoriya üzrə məhsullar."
    : "Seçilmiş dadlar, unikal anlar üçün.";

  if (loading) {
    return <ProductsPageSkeleton />;
  }

  if (categoryFiltered.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="main-container text-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-3 text-gray-500">
            {category
              ? "Bu kateqoriyada hələ məhsul yoxdur."
              : "Hazırda məhsul siyahısı boşdur."}
          </p>
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="main-container">
          <header className="mb-8 border-b border-gray-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-600/90">
              Məhsullar
            </p>
            <h1 className="mt-1 font-serif text-2xl font-bold uppercase tracking-wide text-gray-900 sm:text-3xl">
              {title}
            </h1>
            <div className="relative mt-4 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Məhsul adı, təsvir və ya kateqoriya..."
                className="h-11 border-gray-200 bg-white pl-10 pr-4 shadow-sm"
                autoComplete="off"
              />
            </div>
          </header>
          <p className="text-center text-gray-500">
            Axtarış üzrə uyğun məhsul tapılmadı. Başqa söz yazın və ya sahəni
            təmizləyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="main-container">
        <header className="mb-8 border-b border-gray-200 pb-6 sm:mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-600/90">
                Məhsullar
              </p>
              <h1 className="mt-1 font-serif text-2xl font-bold uppercase tracking-wide text-gray-900 sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm font-light italic text-gray-500">{subtitle}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:max-w-xs sm:shrink-0">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Axtarış..."
                  className="h-11 border-gray-200 bg-white pl-10 pr-4 shadow-sm"
                  autoComplete="off"
                />
              </div>
              <p className="text-right text-sm text-gray-500 sm:text-left">
                <span className="font-semibold text-gray-800">
                  {displayProducts.length}
                </span>{" "}
                məhsul
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          {displayProducts.map((product: any) => (
            <div key={product.id} className="group h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
