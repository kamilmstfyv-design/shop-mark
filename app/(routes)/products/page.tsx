import { Suspense } from "react";
import { ProductsPageSkeleton } from "@/components/skeletons";
import ProductsPageClient from "./ProductsPageClient";

function ProductsFallback() {
  return <ProductsPageSkeleton cardCount={8} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsPageClient />
    </Suspense>
  );
}
