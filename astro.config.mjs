// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Sitio estático. El formulario no finge un envío: el canal vive en
 * PUBLIC_INQUIRY_API_URL y, si no está configurado, la UI lo dice.
 *
 * GitHub Pages (sitio de proyecto):
 * PUBLIC_SITE_URL=https://sebastiannarvaez23.github.io
 * PUBLIC_BASE_PATH=/pe-landing-web
 */
/**
 * @param {string} value
 * @returns {string}
 */
function normalizeBase(value) {
  if (!value || value === '/') return '/';
  const withLead = value.startsWith('/') ? value : `/${value}`;
  return withLead.endsWith('/') ? withLead.slice(0, -1) : withLead;
}

const holder = /** @type {{ process?: { env?: Record<string, string | undefined> } }} */ (
  globalThis
);
const runtimeEnv = holder.process?.env ?? {};
const site = String(
  runtimeEnv.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL || 'http://pe.local:4010',
).replace(/\/$/, '');
const base = normalizeBase(
  String(runtimeEnv.PUBLIC_BASE_PATH || import.meta.env.PUBLIC_BASE_PATH || '/'),
);

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
  server: {
    host: true,
    port: 4010,
  },
  vite: {
    server: {
      allowedHosts: ['pe.local', '.pe.local'],
    },
  },
});
