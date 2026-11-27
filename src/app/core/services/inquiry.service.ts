import { environment } from '../../../environments/environment';
import { INQUIRY_MESSAGES } from '../constants/inquiry.constant';
import type {
  InquiryDraft,
  InquiryFieldError,
  InquiryResult,
  InquirySubmitOptions,
} from '../interfaces/inquiry.interfaces';
import { validateInquiry } from '../utils/inquiry-validation.util';

const DEFAULT_TIMEOUT_MS = 12_000;
const REFERENCE_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const KNOWN_FIELDS = new Set(['name', 'company', 'email', 'role', 'interest', 'problem', 'form']);

export interface InquiryPayload {
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly role: string | null;
  readonly interest: string;
  readonly problem: string;
}

export function toInquiryPayload(draft: InquiryDraft): InquiryPayload {
  return {
    name: draft.name,
    company: draft.company,
    email: draft.email,
    role: draft.role || null,
    interest: draft.interest,
    problem: draft.problem,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function readReference(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }
  const data = isRecord(payload.data) ? payload.data : payload;
  const raw = data.reference ?? data.id;
  if (typeof raw !== 'string' || !REFERENCE_PATTERN.test(raw)) {
    return null;
  }
  return raw;
}

function mapApiErrors(payload: unknown): readonly InquiryFieldError[] {
  if (!isRecord(payload) || !Array.isArray(payload.errors)) {
    return [{ field: 'form', detail: INQUIRY_MESSAGES.summary }];
  }
  const errors: InquiryFieldError[] = [];
  for (const item of payload.errors) {
    if (!isRecord(item)) {
      continue;
    }
    const field = typeof item.field === 'string' && KNOWN_FIELDS.has(item.field) ? item.field : 'form';
    errors.push({
      field: field as InquiryFieldError['field'],
      detail: INQUIRY_MESSAGES.summary,
    });
  }
  return errors.length > 0 ? errors : [{ field: 'form', detail: INQUIRY_MESSAGES.summary }];
}

/**
 * Valida y, solo si hay un canal configurado, entrega la solicitud.
 * Sin endpoint no hay éxito simulado.
 */
export async function submitInquiry(
  draft: InquiryDraft,
  options: InquirySubmitOptions = {},
): Promise<InquiryResult> {
  const errors = validateInquiry(draft);
  if (errors.length > 0) {
    return { ok: false, code: 'VALIDATION', errors };
  }

  const endpoint = (options.endpoint ?? environment.inquiryApiUrl).trim();
  if (!endpoint) {
    return { ok: false, code: 'CHANNEL_UNAVAILABLE', errors: [] };
  }

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return { ok: false, code: 'UNEXPECTED', errors: [] };
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { ok: false, code: 'UNEXPECTED', errors: [] };
  }

  const fetchFn = options.fetchFn ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetchFn(url.href, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(toInquiryPayload(draft)),
      signal: controller.signal,
    });
    const payload = await readJson(response);

    if (response.status === 503) {
      return { ok: false, code: 'CHANNEL_UNAVAILABLE', errors: [] };
    }
    if (response.status === 400 || response.status === 422) {
      return { ok: false, code: 'VALIDATION', errors: mapApiErrors(payload) };
    }
    if (response.ok) {
      const reference = readReference(payload);
      if (!reference) {
        return { ok: false, code: 'UNEXPECTED', errors: [] };
      }
      return { ok: true, reference };
    }
    return { ok: false, code: 'UPSTREAM', errors: [] };
  } catch {
    return { ok: false, code: 'UNEXPECTED', errors: [] };
  } finally {
    clearTimeout(timeout);
  }
}
