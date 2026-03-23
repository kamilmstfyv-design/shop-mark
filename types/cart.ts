export type CartLine = {
  /** Unikal: productId + variant indeksi */
  key: string;
  productId: string;
  variantIndex: number;
  name: string;
  image_url: string;
  category_slug?: string | null;
  description?: string | null;
  variantLabel: string;
  /** Vahid qiymət (₼) */
  unitPrice: number;
  miqdar: number;
};

export type AddToCartInput = {
  productId: string;
  variantIndex: number;
  name: string;
  image_url: string;
  category_slug?: string | null;
  description?: string | null;
  variantLabel: string;
  unitPrice: number;
  miqdar?: number;
};
