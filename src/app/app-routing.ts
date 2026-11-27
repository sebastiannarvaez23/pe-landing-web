import type { AppRoute, Crumb } from './core/interfaces/site.interfaces';
import { COMPANY_ROUTES } from './feature/company/company-routing';
import { CONTACT_ROUTES } from './feature/contact/contact-routing';
import { HOME_ROUTES } from './feature/home/home-routing';
import { INDUSTRY_ROUTES } from './feature/industries/industries-routing';
import { PRODUCT_ROUTES } from './feature/products/products-routing';
import { SOLUTION_ROUTES } from './feature/solutions/solutions-routing';

/**
 * Tabla de rutas del sitio. Equivale al `app-routing.module.ts` de wa-client-web:
 * las páginas viven en `feature/.../pages` y esta tabla las publica.
 */
export const APP_ROUTES: readonly AppRoute[] = [
  ...HOME_ROUTES,
  ...SOLUTION_ROUTES,
  ...PRODUCT_ROUTES,
  ...INDUSTRY_ROUTES,
  ...COMPANY_ROUTES,
  ...CONTACT_ROUTES,
];

export function findRoute(path: string): AppRoute {
  const route = APP_ROUTES.find((item) => item.path === path);
  if (!route) {
    throw new Error(`Ruta desconocida: ${path}`);
  }
  return route;
}

function trail(path: string): AppRoute[] {
  const chain: AppRoute[] = [];
  let current: AppRoute | undefined = findRoute(path);
  const guard = new Set<string>();
  while (current && !guard.has(current.path)) {
    guard.add(current.path);
    chain.unshift(current);
    current = current.parentPath ? findRoute(current.parentPath) : undefined;
  }
  return chain;
}

export function visibleCrumbs(path: string): readonly Crumb[] {
  return trail(path).map((route, index, all) => ({
    label: route.crumb,
    href: index === all.length - 1 ? undefined : route.path,
  }));
}

export function breadcrumbItems(path: string): readonly { label: string; path: string }[] {
  return trail(path).map((route) => ({ label: route.crumb, path: route.path }));
}
