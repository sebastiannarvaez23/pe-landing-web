import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizeInquiry, validateInquiry } from './inquiry-validation.util';

const valid = {
  name: 'Ana Ruiz',
  company: 'Andina SAS',
  email: 'ana@andina.com',
  role: 'Gerencia',
  interest: 'general',
  problem: 'El pedido se digita tres veces antes de salir de bodega.',
  website: '',
};

describe('validateInquiry', () => {
  it('acepta una solicitud completa', () => {
    assert.deepEqual(validateInquiry(normalizeInquiry(valid)), []);
  });

  it('exige los campos de negocio y un correo válido', () => {
    const errors = validateInquiry(
      normalizeInquiry({ ...valid, name: ' ', email: 'ana', problem: 'corto', interest: 'otro' }),
    );
    assert.deepEqual(
      errors.map((error) => error.field),
      ['name', 'email', 'interest', 'problem'],
    );
  });

  it('rechaza el campo oculto sin tratarlo como un envío válido', () => {
    const errors = validateInquiry(normalizeInquiry({ ...valid, website: 'https://spam.example' }));
    assert.equal(errors.some((error) => error.field === 'form'), true);
  });

  it('permite cargo vacío y rechaza un cargo de un carácter', () => {
    assert.deepEqual(validateInquiry(normalizeInquiry({ ...valid, role: '' })), []);
    const errors = validateInquiry(normalizeInquiry({ ...valid, role: 'A' }));
    assert.equal(errors[0]?.field, 'role');
  });
});
