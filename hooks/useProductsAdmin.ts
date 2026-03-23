import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  productsImagePathFromPublicUrl,
  PRODUCTS_IMAGE_BUCKET,
} from "@/lib/productsStorage";
import type { ProductRow, ProductVariant, ProductVariantForm } from "@/types/product";

function normalizeVariants(raw: unknown): ProductVariant[] {
  if (raw == null) return [];
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw) as unknown;
      return Array.isArray(p) ? (p as ProductVariant[]) : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return raw as ProductVariant[];
  return [];
}

function mapRow(row: Record<string, unknown>): ProductRow {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    image_url: String(row.image_url ?? ""),
    category_slug:
      row.category_slug === null || row.category_slug === undefined
        ? null
        : String(row.category_slug),
    description:
      row.description === null || row.description === undefined
        ? null
        : String(row.description),
    is_new: row.is_new === null || row.is_new === undefined ? null : Boolean(row.is_new),
    is_popular:
      row.is_popular === null || row.is_popular === undefined
        ? null
        : Boolean(row.is_popular),
    variants: normalizeVariants(row.variants),
    created_at:
      row.created_at === null || row.created_at === undefined
        ? undefined
        : String(row.created_at),
  };
}

function variantsForDb(variants: ProductVariantForm[]) {
  return variants.map((v) => ({
    size: v.size.trim(),
    price: v.price,
    discountPrice: v.discountPrice?.trim() ? v.discountPrice : "",
  }));
}

export function useProductsAdmin() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setError(null);
    try {
      const { data, error: qError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (qError) {
        setError(qError.message);
        return;
      }

      setProducts((data ?? []).map((row) => mapRow(row as Record<string, unknown>)));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(
    async (product: ProductRow) => {
      if (!confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) return;

      setSaving(true);
      setError(null);
      try {
        const path = productsImagePathFromPublicUrl(product.image_url);
        if (path) {
          const { error: stErr } = await supabase.storage
            .from(PRODUCTS_IMAGE_BUCKET)
            .remove([path]);
          if (stErr) console.warn("Storage silinmədi:", stErr.message);
        }

        const { error: delErr } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

        if (delErr) {
          setError(delErr.message);
          toast.error("Məhsul silinmədi", { description: delErr.message });
          return;
        }

        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        toast.success("Məhsul silindi");
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        toast.error("Xəta", { description: msg });
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const updateProduct = useCallback(
    async (
      id: string,
      previousImageUrl: string,
      payload: {
        name: string;
        category_slug: string;
        description: string;
        is_new: boolean;
        is_popular: boolean;
        variants: ProductVariantForm[];
      },
      newImageFile: File | null,
    ): Promise<boolean> => {
      if (!payload.name.trim() || !payload.category_slug.trim()) {
        toast.warning("Ad və kateqoriya mütləqdir");
        return false;
      }

      setSaving(true);
      setError(null);

      let image_url = previousImageUrl;

      try {
        if (newImageFile) {
          const ext = newImageFile.name.split(".").pop() || "jpg";
          const fileName = `${Math.random()}.${ext}`;
          const filePath = `products/${fileName}`;

          const { error: upErr } = await supabase.storage
            .from(PRODUCTS_IMAGE_BUCKET)
            .upload(filePath, newImageFile);

          if (upErr) {
            toast.error("Şəkil yüklənmədi", { description: upErr.message });
            return false;
          }

          const oldPath = productsImagePathFromPublicUrl(previousImageUrl);
          if (oldPath) {
            const { error: rmErr } = await supabase.storage
              .from(PRODUCTS_IMAGE_BUCKET)
              .remove([oldPath]);
            if (rmErr) console.warn("Köhnə şəkil silinmədi:", rmErr.message);
          }

          const { data: urlData } = supabase.storage
            .from(PRODUCTS_IMAGE_BUCKET)
            .getPublicUrl(filePath);
          image_url = urlData.publicUrl;
        }

        const { error: upDb } = await supabase
          .from("products")
          .update({
            name: payload.name.trim(),
            category_slug: payload.category_slug.trim(),
            description: payload.description.trim() || null,
            is_new: payload.is_new,
            is_popular: payload.is_popular,
            variants: variantsForDb(payload.variants),
            image_url,
          })
          .eq("id", id);

        if (upDb) {
          toast.error("Yenilənmə alınmadı", { description: upDb.message });
          setError(upDb.message);
          return false;
        }

        await fetchProducts();
        toast.success("Məhsul yeniləndi");
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        toast.error("Xəta", { description: msg });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchProducts],
  );

  return {
    products,
    loading,
    saving,
    error,
    refetch: fetchProducts,
    deleteProduct,
    updateProduct,
  };
}
