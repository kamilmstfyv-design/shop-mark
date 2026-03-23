/** Supabase `products` cədvəli + JSON `variants` */
export type ProductVariant = {
  size: string;
  price: string | number;
  discountPrice?: string | number | null;
};

export type ProductRow = {
  id: string;
  name: string;
  image_url: string;
  category_slug: string | null;
  description: string | null;
  is_new: boolean | null;
  is_popular: boolean | null;
  variants: ProductVariant[] | null;
  created_at?: string;
};

export type ProductVariantForm = {
  size: string;
  price: string;
  discountPrice: string;
};
