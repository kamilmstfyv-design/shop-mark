const BUCKET = "products_image";
const PUBLIC_MARKER = `/object/public/${BUCKET}/`;

/** Public URL-dən storage-da saxlanan path (məs: `products/0.12.jpg`) */
export function productsImagePathFromPublicUrl(publicUrl: string): string | null {
  if (!publicUrl || typeof publicUrl !== "string") return null;
  const i = publicUrl.indexOf(PUBLIC_MARKER);
  if (i === -1) return null;
  try {
    return decodeURIComponent(publicUrl.slice(i + PUBLIC_MARKER.length));
  } catch {
    return publicUrl.slice(i + PUBLIC_MARKER.length);
  }
}

export { BUCKET as PRODUCTS_IMAGE_BUCKET };
