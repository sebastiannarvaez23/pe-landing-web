# pe-landing-web

Sitio estático en Astro para la marca personal de Sebastian Narvaez. La voz y el posicionamiento viven en `docs/BRAND_VOICE.md`. La estructura sigue la de `ne-landing-web`: rutas delgadas en `src/pages`, páginas en `app/feature` y piezas compartidas en `app/core`.

El nombre visible es **Sebastian Narvaez** y vive en `src/app/core/constants/site.constant.ts`. Los espacios de soluciones, productos e industrias están vacíos a propósito: no hay clientes, cargos ni ofertas inventadas.

## Estructura

```
src/
├── environments/          environment.ts
├── styles/                _breakpoints.css, styles.web.css, styles.tablet.css, styles.mobile.css
├── pages/                 Rutas Astro (delgadas)
└── app/
    ├── app-routing.ts     Tabla de rutas
    ├── core/
    │   ├── components/    layout, navegación, formulario, migas
    │   ├── constants/
    │   ├── interfaces/
    │   ├── services/      inquiry.service.ts
    │   └── utils/
    └── feature/
        ├── home/
        ├── solutions/
        ├── products/
        ├── industries/
        ├── company/
        ├── contact/
        ├── legal/
        └── system/
```

Cada componente vive en su carpeta, con estilos en `styles/<nombre>.component.web.css` y, cuando hace falta, `.tablet.css` y `.mobile.css`.

Una ficha de catálogo se publica así:

1. Añadir el objeto en `feature/<área>/data/*.data.ts`.
2. Crear la ruta delgada en `src/pages` que monta el page component de detalle y le pasa el `slug`.

La tabla de rutas, la miga y el sitemap salen de esos datos.

## Formulario

`inquiry.service.ts` valida la solicitud y solo hace `POST` si existe `PUBLIC_INQUIRY_API_URL`. Sin ese canal, la interfaz dice que la solicitud no se envió. No hay un éxito simulado.

El cuerpo JSON es `{ name, company, email, role, interest, problem }`. Una respuesta correcta trae `data.id` o `data.reference` (`[A-Za-z0-9_-]{1,64}`).

## GitHub Pages

El workflow `.github/workflows/deploy.yml` publica la rama `trunk` en `https://sebastiannarvaez23.github.io/pe-landing-web/`. En el repositorio, Settings → Pages → Build and deployment, el origen tiene que ser **GitHub Actions**.

El build de Pages usa `PUBLIC_SITE_URL=https://sebastiannarvaez23.github.io` y `PUBLIC_BASE_PATH=/pe-landing-web`. En local esos valores no se definen: el sitio sigue en `http://pe.local:4010`.

## Scripts

| Script | Acción |
| --- | --- |
| `npm start` | Desarrollo en `http://pe.local:4010` |
| `npm run build` | Type-check y build estático |
| `npm test` | Type-check y pruebas de rutas, validación y envío |
| `npm run preview` | Sirve `dist/` |

Para el dominio local, agrega `127.0.0.1 pe.local` al archivo hosts. El servidor de desarrollo no se arranca desde los flujos automáticos: lo levanta quien ya tiene los frontends en marcha.
