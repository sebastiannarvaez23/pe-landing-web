import type { SolutionPageContent } from '../interfaces/solutions.interfaces';

/** Catálogo vacío hasta que el contenido de marca esté definido. */
export const SOLUTIONS: readonly SolutionPageContent[] = [];

export function getSolution(slug: string): SolutionPageContent {
  const solution = SOLUTIONS.find((item) => item.slug === slug);
  if (!solution) {
    throw new Error(`Solución desconocida: ${slug}`);
  }
  return solution;
}
