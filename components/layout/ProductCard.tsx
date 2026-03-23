"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { waMeUrl } from "@/lib/whatsapp";

type VariantShape = {
  size?: string;
  price?: string | number;
  discountPrice?: string | number;
  discount_price?: string | number;
};

function normalizeVariant(v: VariantShape) {
  const price = Number(v.price);
  const safePrice = Number.isFinite(price) ? price : 0;
  const raw = v.discountPrice ?? v.discount_price ?? "";
  const discountNum = raw === "" || raw === null ? NaN : Number(raw);
  const hasDiscount =
    Number.isFinite(discountNum) &&
    discountNum > 0 &&
    (safePrice <= 0 || discountNum < safePrice);

  return {
    size: v.size?.trim() ? v.size : "Standart",
    price: safePrice,
    discountPrice: Number.isFinite(discountNum) ? discountNum : 0,
    hasDiscount,
  };
}

const ProductCard = ({ product }: { product: any }) => {
  const { addLine } = useCart();

  const variants: VariantShape[] = useMemo(() => {
    if (
      product.variants &&
      Array.isArray(product.variants) &&
      product.variants.length > 0
    ) {
      return product.variants;
    }
    return [
      {
        size: "Standart",
        price: product.price ?? 0,
        discountPrice: product.discountPrice ?? product.discount_price,
      },
    ];
  }, [product]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = useMemo(
    () => normalizeVariant(variants[selectedIndex] ?? variants[0]),
    [variants, selectedIndex],
  );

  const waPrice = selected.hasDiscount
    ? selected.discountPrice
    : selected.price;

  const rawVariant = variants[selectedIndex];
  const variantLabel =
    rawVariant?.size?.trim() ||
    (variants.length > 1 ? String(selectedIndex + 1) : "Standart");

  const litrInMessage =
    variantLabel === "Standart"
      ? ""
      : ` — Litr: ${variantLabel}`;

  const waText = encodeURIComponent(
    `Salam, "${product.name}"${litrInMessage} sifariş vermək istəyirəm. Qiymət: ${waPrice} ₼.`,
  );

  const handleAddToCart = () => {
    addLine({
      productId: String(product.id),
      variantIndex: selectedIndex,
      name: product.name,
      image_url: product.image_url,
      category_slug: product.category_slug ?? null,
      description: product.description ?? null,
      variantLabel,
      unitPrice: waPrice,
      miqdar: 1,
    });
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square w-full bg-gradient-to-b from-gray-50 to-gray-100/80">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 18vw, (min-width: 768px) 25vw, 45vw"
          className="object-contain p-3"
        />
        <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
          {product.is_new ? (
            <span className="rounded bg-blue-600/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
              Yeni
            </span>
          ) : null}
          {product.is_popular ? (
            <span className="rounded bg-amber-500/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
              Populyar
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-3 sm:p-4">
        {product.category_slug ? (
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600/90">
            {String(product.category_slug).replace(/-/g, " ")}
          </p>
        ) : null}

        <h2 className="line-clamp-2 min-h-[2.25rem] text-[13px] font-bold leading-snug text-gray-900 sm:text-sm">
          {product.name}
        </h2>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {selected.hasDiscount ? (
            <>
              <span className="text-base font-black text-red-600 sm:text-lg">
                {selected.discountPrice} ₼
              </span>
              <span className="text-xs text-gray-400 line-through">
                {selected.price} ₼
              </span>
            </>
          ) : (
            <span className="text-base font-black text-gray-900 sm:text-lg">
              {selected.price > 0 ? `${selected.price} ₼` : "—"}
            </span>
          )}
        </div>

        {variants.length === 1 && selected.size !== "Standart" ? (
          <p className="mt-2 text-[10px] text-gray-600">
            Litr:{" "}
            <span className="font-bold text-gray-900">{selected.size}</span>
          </p>
        ) : null}

        {variants.length > 1 ? (
          <div className="mt-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Litr seçimi
            </p>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((variant, index) => {
                const label = variant.size?.trim() || String(index + 1);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    title={`Litr: ${label}`}
                    className={`rounded-md border px-2 py-1 text-[10px] font-bold transition-all ${
                      selectedIndex === index
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <span className="tabular-nums">{label}</span>
                    <span className="ml-0.5 font-semibold opacity-80">litr</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-auto grid grid-cols-5 gap-2 pt-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="col-span-2 flex items-center justify-center gap-1 rounded-lg bg-gray-100 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            aria-label="Səbətə əlavə et"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>

          <a
            href={waMeUrl(waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-3 flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-2 text-[11px] font-bold uppercase text-white transition-colors hover:bg-[#128C7E]"
          >
            Sifariş
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
