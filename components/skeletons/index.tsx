"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Məhsul kartının təxmini görüntüsü (grid üçün) */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm",
        className,
      )}
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-grow flex-col space-y-2.5 p-3 sm:p-4">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-4 w-full max-w-[95%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="mt-1 h-6 w-20" />
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Skeleton className="h-7 w-14 rounded-md" />
          <Skeleton className="h-7 w-14 rounded-md" />
          <Skeleton className="h-7 w-14 rounded-md" />
        </div>
        <div className="mt-auto grid grid-cols-5 gap-2 pt-3">
          <Skeleton className="col-span-2 h-9 rounded-lg" />
          <Skeleton className="col-span-3 h-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** /products səhifəsi — başlıq + axtarış + şəbəkə */
export function ProductsPageSkeleton({ cardCount = 10 }: { cardCount?: number }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="main-container">
        <header className="mb-8 border-b border-gray-200 pb-6 sm:mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-64 max-w-full sm:h-11" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <div className="flex w-full flex-col gap-3 sm:max-w-xs sm:shrink-0">
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="ml-auto h-4 w-20 sm:ml-0" />
            </div>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          {Array.from({ length: cardCount }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Admin məhsul siyahısı — üfüqi kartlar */
export function AdminProductsListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-1">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 lg:flex-row"
        >
          <Skeleton className="h-40 w-full shrink-0 rounded-xl lg:w-40" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-3/4 max-w-md" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <div className="flex justify-center gap-3 lg:flex-col lg:border-l lg:border-slate-100 lg:pl-6">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Əsas səhifə slider (Swiper) */
export function MainSliderSkeleton() {
  return (
    <section className="main-container py-10 sm:py-12">
      <div className="flex w-full justify-center gap-2 overflow-hidden px-1 sm:gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-[260px] w-[min(88vw,280px)] shrink-0 rounded-2xl shadow-lg sm:h-[300px] sm:w-[min(40vw,350px)] md:h-[320px] md:w-[400px]"
          />
        ))}
      </div>
    </section>
  );
}

/** Admin slider şəkilləri şəbəkəsi */
export function SliderGallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[150px] w-[150px] rounded-lg shadow-sm" />
      ))}
    </div>
  );
}

/** Kateqoriya kartları (ana səhifə / panel) */
export function CategoryGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
        >
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-4 pb-5">
            <Skeleton className="mx-auto h-8 w-[75%]" />
          </div>
        </div>
      ))}
    </div>
  );
}
