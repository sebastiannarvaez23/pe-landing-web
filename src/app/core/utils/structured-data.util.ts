import { environment } from '../../../environments/environment';
import { withBase } from './public-url.util';
import { SITE_DESCRIPTION, SITE_NAME } from '../constants/site.constant';
import type { AppRoute } from '../interfaces/site.interfaces';

export interface JsonLdNode {
  readonly [key: string]: unknown;
}

function compact(node: Record<string, unknown>): JsonLdNode {
  return Object.fromEntries(Object.entries(node).filter(([, value]) => value !== undefined));
}

export function absoluteUrl(path: string): string {
  return `${environment.siteUrl.replace(/\/$/, '')}${withBase(path)}`;
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function organizationNode(): JsonLdNode {
  return compact({
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description: SITE_DESCRIPTION,
    logo: absoluteUrl('/favicon.svg'),
    email: environment.contactEmail || undefined,
    sameAs: environment.linkedinUrl ? [environment.linkedinUrl] : undefined,
  });
}

export function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: SITE_NAME,
    url: absoluteUrl('/'),
    inLanguage: 'es-CO',
    description: SITE_DESCRIPTION,
    publisher: { '@id': absoluteUrl('/#organization') },
  };
}

export function breadcrumbNode(crumbs: readonly { label: string; path: string }[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function serviceNode(route: AppRoute, serviceType: string): JsonLdNode {
  return {
    '@type': 'Service',
    name: route.crumb,
    serviceType,
    description: route.description,
    url: absoluteUrl(route.path),
    provider: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
  };
}

export function productNode(name: string, description: string, path: string): JsonLdNode {
  return {
    '@type': 'Product',
    name,
    description,
    url: absoluteUrl(path),
    brand: { '@type': 'Brand', name: SITE_NAME },
  };
}

export function itemListNode(name: string, routes: readonly { name: string; path: string }[]): JsonLdNode {
  return {
    '@type': 'ItemList',
    name,
    itemListElement: routes.map((route, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: route.name,
      url: absoluteUrl(route.path),
    })),
  };
}

export function webPageNode(route: AppRoute, type = 'WebPage'): JsonLdNode {
  return {
    '@type': type,
    name: route.title,
    description: route.description,
    url: absoluteUrl(route.path),
    inLanguage: 'es-CO',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/') },
  };
}

export function jsonLdGraph(nodes: readonly JsonLdNode[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
