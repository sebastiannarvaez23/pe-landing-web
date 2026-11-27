import type { AppRoute } from '../../core/interfaces/site.interfaces';

export const CONTACT_ROUTES: readonly AppRoute[] = [
  {
    id: 'contact',
    path: '/contacto',
    title: 'Contacto del sitio',
    description:
      'Conversación sobre una oportunidad, un desafío o una idea. El mensaje solo se envía cuando el canal de contacto está configurado.',
    crumb: 'Contacto',
    changefreq: 'monthly',
    priority: '0.7',
    kind: 'contact',
    parentPath: '/',
  },
];
