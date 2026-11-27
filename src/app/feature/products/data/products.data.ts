import type { ProductPageContent } from '../interfaces/products.interfaces';

/** Catálogo vacío hasta que el contenido de marca esté definido. */
export const PRODUCTS: readonly ProductPageContent[] = [];

export function getProduct(slug: string): ProductPageContent {
  const product = PRODUCTS.find((item) => item.slug === slug);
  if (!product) {
    throw new Error(`Producto desconocido: ${slug}`);
  }
  return product;
}
