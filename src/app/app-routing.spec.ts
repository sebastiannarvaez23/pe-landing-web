import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { APP_ROUTES, breadcrumbItems, visibleCrumbs } from './app-routing';

describe('APP_ROUTES', () => {
  it('publica rutas únicas, con título y descripción propios', () => {
    const paths = APP_ROUTES.map((route) => route.path);
    const titles = APP_ROUTES.map((route) => route.title);
    const descriptions = APP_ROUTES.map((route) => route.description);
    assert.equal(new Set(paths).size, paths.length);
    assert.equal(new Set(titles).size, titles.length);
    assert.equal(new Set(descriptions).size, descriptions.length);
    for (const route of APP_ROUTES) {
      assert.equal(route.path.startsWith('/'), true);
      assert.equal(route.title.length > 8, true);
      assert.equal(route.description.length > 40, true);
      if (route.parentPath) {
        assert.equal(paths.includes(route.parentPath), true);
      }
    }
  });

  it('arma la miga de contacto desde el inicio', () => {
    assert.deepEqual(
      visibleCrumbs('/contacto').map((crumb) => crumb.label),
      ['Inicio', 'Contacto'],
    );
    const visible = visibleCrumbs('/contacto');
    assert.equal(visible.at(-1)?.href, undefined);
    assert.deepEqual(
      breadcrumbItems('/contacto').map((crumb) => crumb.path),
      ['/', '/contacto'],
    );
  });
});
