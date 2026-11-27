import type { AppRoute } from '../../core/interfaces/site.interfaces';
import { PRODUCTS } from './data/products.data';

const HUB: AppRoute = {
  id: 'products',
  path: '/productos',
  title: 'Productos del sitio',
  description:
    'Espacio para productos y plataformas con un resultado que merezca contarse. Aún no hay entradas publicadas.',
  crumb: 'Productos',
  changefreq: 'monthly',
  priority: '0.8',
  kind: 'hub',
  parentPath: '/',
};

export const PRODUCT_ROUTES: readonly AppRoute[] = [
  HUB,
  ...PRODUCTS.map(
    (product): AppRoute => ({
      id: product.slug,
      path: product.path,
      title: product.metaTitle,
      description: product.metaDescription,
      crumb: product.crumb,
      changefreq: 'monthly',
      priority: '0.8',
      kind: 'product',
      parentPath: '/productos',
    }),
  ),
];
