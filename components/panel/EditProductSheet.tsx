"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ProductRow, ProductVariantForm } from "@/types/product";

type CategoryOption = {
  id: string;
  slug: string | null;
  category: string;
};

type EditProductSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductRow | null;
  categories: CategoryOption[];
  saving: boolean;
  onSave: (
    productId: string,
    previousImageUrl: string,
    payload: {
      name: string;
      category_slug: string;
      description: string;
      is_new: boolean;
      is_popular: boolean;
      variants: ProductVariantForm[];
    },
    newImage: File | null,
  ) => Promise<boolean>;
};

function variantsFromProduct(product: ProductRow): ProductVariantForm[] {
  const list = product.variants;
  if (!list || list.length === 0) {
    return [{ size: "", price: "", discountPrice: "" }];
  }
  return list.map((v) => ({
    size: String(v.size ?? ""),
    price: v.price === null || v.price === undefined ? "" : String(v.price),
    discountPrice:
      v.discountPrice === null || v.discountPrice === undefined
        ? ""
        : String(v.discountPrice),
  }));
}

export default function EditProductSheet({
  open,
  onOpenChange,
  product,
  categories,
  saving,
  onSave,
}: EditProductSheetProps) {
  const [name, setName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [description, setDescription] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [variants, setVariants] = useState<ProductVariantForm[]>([
    { size: "", price: "", discountPrice: "" },
  ]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!newImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(newImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newImage]);

  useEffect(() => {
    if (!product || !open) return;
    setName(product.name);
    setCategorySlug(product.category_slug ?? "");
    setDescription(product.description ?? "");
    setIsNew(Boolean(product.is_new));
    setIsPopular(Boolean(product.is_popular));
    setVariants(variantsFromProduct(product));
    setNewImage(null);
  }, [product, open]);

  const updateVariant = (index: number, field: keyof ProductVariantForm, value: string) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { size: "", price: "", discountPrice: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const ok = await onSave(
      product.id,
      product.image_url,
      {
        name,
        category_slug: categorySlug,
        description,
        is_new: isNew,
        is_popular: isPopular,
        variants,
      },
      newImage,
    );
    if (ok) onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        {product ? (
          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
            <SheetHeader>
              <SheetTitle>Məhsulu redaktə et</SheetTitle>
              <SheetDescription>
                Dəyişiklikləri saxladıqdan sonra siyahı avtomatik yenilənəcək.
              </SheetDescription>
            </SheetHeader>

            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-xl border bg-slate-100">
              <Image
                src={previewUrl ?? product.image_url}
                alt={product.name}
                fill
                unoptimized={Boolean(previewUrl)}
                className="object-cover"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Yeni şəkil (istəyə bağlı)</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm"
                onChange={(e) =>
                  setNewImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Ad</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Kateqoriya</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                required
              >
                <option value="">Seçin...</option>
                {categories.map((c) => {
                  const val = c.slug || c.category;
                  return (
                    <option key={c.id} value={val}>
                      {c.category}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Açıqlama</label>
              <textarea
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm min-h-[88px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch id="edit-is-new" checked={isNew} onCheckedChange={setIsNew} />
              <label htmlFor="edit-is-new" className="text-sm">
                Yeni məhsul
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="edit-is-pop" checked={isPopular} onCheckedChange={setIsPopular} />
              <label htmlFor="edit-is-pop" className="text-sm">
                Populyar / ən çox satılan
              </label>
            </div>

            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Variantlar</span>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  + Variant
                </Button>
              </div>
              {variants.map((v, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 rounded-lg border bg-slate-50 p-2"
                >
                  <input
                    className="col-span-4 rounded border px-2 py-1 text-xs"
                    placeholder="Həcm"
                    value={v.size}
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                  />
                  <input
                    className="col-span-3 rounded border px-2 py-1 text-xs"
                    placeholder="Qiymət"
                    type="number"
                    value={v.price}
                    onChange={(e) => updateVariant(index, "price", e.target.value)}
                  />
                  <input
                    className="col-span-4 rounded border px-2 py-1 text-xs"
                    placeholder="Endirimli"
                    type="number"
                    value={v.discountPrice}
                    onChange={(e) => updateVariant(index, "discountPrice", e.target.value)}
                  />
                  <button
                    type="button"
                    className="col-span-1 text-red-500 text-xs"
                    onClick={() => removeVariant(index)}
                    aria-label="Variantı sil"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <SheetFooter className="gap-2 sm:flex-col sm:space-x-0">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Saxlanılır..." : "Saxla"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Ləğv et
              </Button>
            </SheetFooter>
          </form>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
