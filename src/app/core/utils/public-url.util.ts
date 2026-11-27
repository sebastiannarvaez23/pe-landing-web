/** Prefijo público. En local es `/`. En GitHub Pages es `/pe-landing-web/`. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;

  if (path.startsWith('#')) return path;

  const hashAt = path.indexOf('#');
  const hash = hashAt >= 0 ? path.slice(hashAt) : '';
  let route = hashAt >= 0 ? path.slice(0, hashAt) : path;
  if (!route) route = '/';
  if (!route.startsWith('/')) route = `/${route}`;

  const isFile = /\.[a-z0-9]+$/i.test(route);
  if (!isFile && route !== '/' && !route.endsWith('/')) route = `${route}/`;

  if (route === '/') {
    const home = base === '/' || base.endsWith('/') ? base : `${base}/`;
    return `${home}${hash}`;
  }
  return `${prefix}${route}${hash}`;
}
