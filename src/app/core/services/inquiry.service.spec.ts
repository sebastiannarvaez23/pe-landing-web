import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { InquiryDraft } from '../interfaces/inquiry.interfaces';
import { submitInquiry } from './inquiry.service';

const valid: InquiryDraft = {
  name: 'Ana Ruiz',
  company: 'Andina SAS',
  email: 'ana@andina.com',
  role: '',
  interest: 'general',
  problem: 'La bodega confirma cada pedido por teléfono porque el inventario no coincide.',
  website: '',
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('submitInquiry', () => {
  it('no simula éxito cuando el canal no está configurado', async () => {
    const result = await submitInquiry(valid, { endpoint: '' });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, 'CHANNEL_UNAVAILABLE');
    }
  });

  it('valida antes de llamar a la red', async () => {
    let called = false;
    const result = await submitInquiry(
      { ...valid, email: 'no-es-correo' },
      {
        endpoint: 'https://api.pe.local/inquiries',
        fetchFn: async () => {
          called = true;
          return jsonResponse(201, { data: { id: 'abc' } });
        },
      },
    );
    assert.equal(called, false);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, 'VALIDATION');
    }
  });

  it('acepta una referencia opaca del API', async () => {
    const result = await submitInquiry(valid, {
      endpoint: 'https://api.pe.local/inquiries',
      fetchFn: async () => jsonResponse(201, { status_code: 201, data: { id: 'inq_123' } }),
    });
    assert.deepEqual(result, { ok: true, reference: 'inq_123' });
  });

  it('no trata como éxito una respuesta 200 sin referencia', async () => {
    const result = await submitInquiry(valid, {
      endpoint: 'https://api.pe.local/inquiries',
      fetchFn: async () => jsonResponse(200, { ok: true }),
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, 'UNEXPECTED');
    }
  });

  it('traduce un 400 a validación y no muestra el detalle crudo', async () => {
    const result = await submitInquiry(valid, {
      endpoint: 'https://api.pe.local/inquiries',
      fetchFn: async () => jsonResponse(400, { errors: [{ field: 'email', detail: 'Invalid email address' }] }),
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, 'VALIDATION');
      assert.equal(result.errors[0]?.field, 'email');
      assert.equal(result.errors.some((error) => error.detail.includes('Invalid')), false);
    }
  });

  it('informa canal no disponible ante un 503 y fallo de red', async () => {
    const unavailable = await submitInquiry(valid, {
      endpoint: 'https://api.pe.local/inquiries',
      fetchFn: async () => jsonResponse(503, {}),
    });
    assert.equal(unavailable.ok, false);
    if (!unavailable.ok) {
      assert.equal(unavailable.code, 'CHANNEL_UNAVAILABLE');
    }

    const failed = await submitInquiry(valid, {
      endpoint: 'https://api.pe.local/inquiries',
      fetchFn: async () => {
        throw new Error('offline');
      },
    });
    assert.equal(failed.ok, false);
    if (!failed.ok) {
      assert.equal(failed.code, 'UNEXPECTED');
    }
  });
});
