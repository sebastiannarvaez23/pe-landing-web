import type { AppRoute } from '../../core/interfaces/site.interfaces';
import { SOLUTIONS } from './data/solutions.data';

const HUB: AppRoute = {
  id: 'solutions',
  path: '/soluciones',
  title: 'Soluciones del sitio',
  description:
    'Espacio para iniciativas en las que la tecnología abre una oportunidad de negocio. Aún no hay entradas publicadas.',
  crumb: 'Soluciones',
  changefreq: 'monthly',
  priority: '0.9',
  kind: 'hub',
  parentPath: '/',
};

export const SOLUTION_ROUTES: readonly AppRoute[] = [
  HUB,
  ...SOLUTIONS.map(
    (solution): AppRoute => ({
      id: solution.slug,
      path: solution.path,
      title: solution.metaTitle,
      description: solution.metaDescription,
      crumb: solution.crumb,
      changefreq: 'monthly',
      priority: '0.8',
      kind: 'service',
      parentPath: '/soluciones',
    }),
  ),
];
