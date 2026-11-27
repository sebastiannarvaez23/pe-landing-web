export interface NavChild {
  readonly href: string;
  readonly label: string;
}

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly match: 'exact' | 'prefix';
  readonly children?: readonly NavChild[];
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { href: '/', label: 'Inicio', match: 'exact' },
  { href: '/soluciones', label: 'Soluciones', match: 'prefix' },
  { href: '/productos', label: 'Productos', match: 'prefix' },
  { href: '/industrias', label: 'Industrias', match: 'prefix' },
  { href: '/nosotros', label: 'Nosotros', match: 'exact' },
  { href: '/contacto', label: 'Contacto', match: 'exact' },
];

export const PRIMARY_CTA = {
  href: '/contacto',
  label: 'Contacto',
} as const;
