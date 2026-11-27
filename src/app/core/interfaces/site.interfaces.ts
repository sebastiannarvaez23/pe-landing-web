export type RouteKind =
  | 'home'
  | 'hub'
  | 'service'
  | 'product'
  | 'industry'
  | 'about'
  | 'contact';

export interface AppRoute {
  readonly id: string;
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly crumb: string;
  readonly changefreq: 'weekly' | 'monthly' | 'yearly';
  readonly priority: string;
  readonly kind: RouteKind;
  readonly parentPath?: string;
}

export interface Crumb {
  readonly label: string;
  readonly href?: string;
}

export interface RelatedLink {
  readonly href: string;
  readonly label: string;
  readonly text: string;
}

export interface TextBlock {
  readonly title: string;
  readonly text: string;
}

export interface PageSection {
  readonly title: string;
  readonly paragraphs?: readonly string[];
  readonly blocks?: readonly TextBlock[];
}
