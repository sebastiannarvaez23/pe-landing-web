import type { IndustryPageContent } from '../interfaces/industries.interfaces';

/** Catálogo vacío hasta que el contenido de marca esté definido. */
export const INDUSTRIES: readonly IndustryPageContent[] = [];

export function getIndustry(slug: string): IndustryPageContent {
  const industry = INDUSTRIES.find((item) => item.slug === slug);
  if (!industry) {
    throw new Error(`Industria desconocida: ${slug}`);
  }
  return industry;
}
