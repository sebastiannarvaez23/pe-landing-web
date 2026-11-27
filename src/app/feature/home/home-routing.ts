import { SITE_DESCRIPTION } from '../../core/constants/site.constant';
import type { AppRoute } from '../../core/interfaces/site.interfaces';

export const HOME_ROUTES: readonly AppRoute[] = [
  {
    id: 'home',
    path: '/',
    title: 'Sebastian Narvaez | Tecnología e inteligencia artificial para el negocio',
    description: SITE_DESCRIPTION,
    crumb: 'Inicio',
    changefreq: 'weekly',
    priority: '1.0',
    kind: 'home',
  },
];
