import { breadcrumbItems, findRoute } from '../../app-routing';
import type { JsonLdNode } from './structured-data.util';
import { breadcrumbNode, jsonLdGraph, webPageNode } from './structured-data.util';

const PAGE_TYPE: Record<string, string> = {
  about: 'AboutPage',
  contact: 'ContactPage',
};

export function pageGraph(path: string, extras: readonly JsonLdNode[] = []): JsonLdNode {
  const route = findRoute(path);
  const crumbs = breadcrumbItems(path);
  const nodes: JsonLdNode[] = [webPageNode(route, PAGE_TYPE[route.kind] ?? 'WebPage')];
  if (crumbs.length > 1) {
    nodes.push(breadcrumbNode(crumbs));
  }
  nodes.push(...extras);
  return jsonLdGraph(nodes);
}
