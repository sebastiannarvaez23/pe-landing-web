/**
 * Configuración de entorno del sitio.
 * Equivale a `src/environments/environment.ts` de ne-landing-web.
 * Los datos de contacto solo se muestran cuando están definidos.
 */

function envString(key: keyof ImportMetaEnv, fallback = ''): string {
  const raw = import.meta.env?.[key];
  return typeof raw === 'string' ? raw.trim() : fallback;
}

export const environment = {
  production: import.meta.env?.PROD === true,
  siteUrl: envString('PUBLIC_SITE_URL', 'http://pe.local:4010').replace(/\/$/, ''),
  inquiryApiUrl: envString('PUBLIC_INQUIRY_API_URL'),
  contactEmail: envString('PUBLIC_CONTACT_EMAIL'),
  linkedinUrl: envString('PUBLIC_LINKEDIN_URL'),
} as const;
