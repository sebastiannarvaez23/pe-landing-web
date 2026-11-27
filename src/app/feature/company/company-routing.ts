import type { AppRoute } from '../../core/interfaces/site.interfaces';

export const COMPANY_ROUTES: readonly AppRoute[] = [
  {
    id: 'about',
    path: '/nosotros',
    title: 'Perfil de Sebastian Narvaez',
    description:
      'De la ingeniería de software hacia una lectura estratégica del negocio y la aplicación de inteligencia artificial.',
    crumb: 'Nosotros',
    changefreq: 'monthly',
    priority: '0.6',
    kind: 'about',
    parentPath: '/',
  },
];
