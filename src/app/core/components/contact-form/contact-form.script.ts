import { INQUIRY_MESSAGES } from '../../constants/inquiry.constant';
import type { InquiryDraft, InquiryResult } from '../../interfaces/inquiry.interfaces';
import { submitInquiry } from '../../services/inquiry.service';
import { normalizeInquiry } from '../../utils/inquiry-validation.util';

const FIELDS = ['name', 'company', 'email', 'role', 'interest', 'problem', 'form'] as const;

function readDraft(form: HTMLFormElement): InquiryDraft {
  const data = new FormData(form);
  return normalizeInquiry({
    name: data.get('name'),
    company: data.get('company'),
    email: data.get('email'),
    role: data.get('role'),
    interest: data.get('interest'),
    problem: data.get('problem'),
    website: data.get('website'),
  });
}

function setText(node: Element | null, text: string, hidden: boolean): void {
  if (!(node instanceof HTMLElement)) {
    return;
  }
  node.textContent = text;
  node.hidden = hidden || text.length === 0;
}

function clearFieldErrors(form: HTMLFormElement): void {
  form.querySelectorAll('[data-inquiry-error-for]').forEach((node) => {
    setText(node, '', true);
  });
  form.querySelectorAll('[data-inquiry-input]').forEach((node) => {
    if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement) {
      node.removeAttribute('aria-invalid');
      node.removeAttribute('aria-describedby');
    }
  });
}

function showFieldErrors(form: HTMLFormElement, result: Extract<InquiryResult, { ok: false }>): void {
  if (result.code !== 'VALIDATION') {
    return;
  }
  for (const error of result.errors) {
    const slot = form.querySelector(`[data-inquiry-error-for="${error.field}"]`);
    if (slot instanceof HTMLElement) {
      setText(slot, error.detail, false);
      const input = form.querySelector(`[data-inquiry-input="${error.field}"]`);
      if (input instanceof HTMLElement) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', slot.id || `${error.field}-error`);
      }
    }
  }
}

function resultMessage(result: InquiryResult): string {
  if (result.ok) {
    return INQUIRY_MESSAGES.success;
  }
  if (result.code === 'VALIDATION') {
    return INQUIRY_MESSAGES.summary;
  }
  if (result.code === 'CHANNEL_UNAVAILABLE') {
    return INQUIRY_MESSAGES.unavailable;
  }
  if (result.code === 'UPSTREAM') {
    return INQUIRY_MESSAGES.upstream;
  }
  return INQUIRY_MESSAGES.unexpected;
}

async function handleSubmit(form: HTMLFormElement): Promise<void> {
  if (form.dataset.submitting === 'true') {
    return;
  }
  form.dataset.submitting = 'true';
  const button = form.querySelector('[data-inquiry-submit]');
  const status = form.querySelector('[data-inquiry-status]');
  const alert = form.querySelector('[data-inquiry-alert]');
  clearFieldErrors(form);
  setText(status, '', true);
  setText(alert, '', true);
  if (button instanceof HTMLButtonElement) {
    button.disabled = true;
    button.textContent = INQUIRY_MESSAGES.sending;
  }
  form.setAttribute('aria-busy', 'true');

  try {
    const result = await submitInquiry(readDraft(form));
    if (!result.ok && result.code === 'VALIDATION') {
      showFieldErrors(form, result);
      const formError = result.errors.find((error) => error.field === 'form');
      setText(alert, formError?.detail ?? resultMessage(result), false);
      return;
    }
    if (!result.ok) {
      setText(alert, resultMessage(result), false);
      return;
    }
    setText(status, resultMessage(result), false);
    form.reset();
  } finally {
    form.dataset.submitting = 'false';
    form.removeAttribute('aria-busy');
    if (button instanceof HTMLButtonElement) {
      button.disabled = false;
      button.textContent = INQUIRY_MESSAGES.submit;
    }
  }
}

export function bindContactForms(root: ParentNode = document): void {
  root.querySelectorAll('[data-contact-form]').forEach((node) => {
    if (!(node instanceof HTMLFormElement) || node.dataset.bound === 'true') {
      return;
    }
    node.dataset.bound = 'true';
    for (const field of FIELDS) {
      const slot = node.querySelector(`[data-inquiry-error-for="${field}"]`);
      if (slot instanceof HTMLElement && !slot.id) {
        slot.id = `${node.id || 'inquiry'}-${field}-error`;
      }
    }
    node.addEventListener('submit', (event) => {
      event.preventDefault();
      void handleSubmit(node);
    });
  });
}
