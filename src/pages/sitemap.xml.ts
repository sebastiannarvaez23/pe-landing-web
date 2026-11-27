import type { APIRoute } from 'astro';

import { APP_ROUTES } from '../app/app-routing';
import { absoluteUrl } from '../app/core/utils/structured-data.util';

export const GET: APIRoute = () => {
  const urls = APP_ROUTES.map((route) => {
    const loc = absoluteUrl(route.path);
    return `  <url><loc>${loc}</loc><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
