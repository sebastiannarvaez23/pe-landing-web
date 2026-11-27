import type { AppRoute } from '../../core/interfaces/site.interfaces';
import { INDUSTRIES } from './data/industries.data';

export const INDUSTRY_ROUTES: readonly AppRoute[] = [
  {
    id: 'industries',
    path: '/industrias',
    title: 'Industrias del sitio',
    description:
      'Espacio para contextos de negocio donde la tecnología cambia la operación. Aún no hay entradas publicadas.',
    crumb: 'Industrias',
    changefreq: 'monthly',
    priority: '0.7',
    kind: 'hub',
    parentPath: '/',
  },
  ...INDUSTRIES.map(
    (industry): AppRoute => ({
      id: industry.slug,
      path: industry.path,
      title: industry.metaTitle,
      description: industry.metaDescription,
      crumb: industry.crumb,
      changefreq: 'monthly',
      priority: '0.6',
      kind: 'industry',
      parentPath: '/industrias',
    }),
  ),
];
