"use client";

import AddingProductForm from "@/components/panel/AddingProductForm";
import EditingProducts from "@/components/panel/EditingProducts";
import { useProductsAdmin } from "@/hooks/useProductsAdmin";

export default function ProductsPanelClient() {
  const admin = useProductsAdmin();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <AddingProductForm onSuccess={() => void admin.refetch()} />
      <EditingProducts admin={admin} />
    </div>
  );
}
