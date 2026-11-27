import type { APIRoute } from 'astro';

import { absoluteUrl } from '../app/core/utils/structured-data.util';

export const GET: APIRoute = () => {
  const sitemap = absoluteUrl('/sitemap.xml');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
