import { INQUIRY_INTEREST_VALUES, INQUIRY_LIMITS, INQUIRY_MESSAGES } from '../constants/inquiry.constant';
import type { InquiryDraft, InquiryFieldError } from '../interfaces/inquiry.interfaces';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function singleLine(value: unknown): string {
  return asText(value)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function multiLine(value: unknown): string {
  return asText(value)
    .replace(/\r\n/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

export function normalizeInquiry(input: Partial<Record<keyof InquiryDraft, unknown>>): InquiryDraft {
  return {
    name: singleLine(input.name),
    company: singleLine(input.company),
    email: singleLine(input.email),
    role: singleLine(input.role),
    interest: singleLine(input.interest),
    problem: multiLine(input.problem),
    website: asText(input.website).trim(),
  };
}

function checkLength(
  field: InquiryFieldError['field'],
  value: string,
  min: number,
  max: number,
  emptyDetail: string,
  errors: InquiryFieldError[],
): void {
  if (value.length < min) {
    errors.push({ field, detail: emptyDetail });
    return;
  }
  if (value.length > max) {
    errors.push({ field, detail: INQUIRY_MESSAGES.length });
  }
}

export function validateInquiry(draft: InquiryDraft): InquiryFieldError[] {
  const errors: InquiryFieldError[] = [];
  const limits = INQUIRY_LIMITS;

  checkLength('name', draft.name, limits.name.min, limits.name.max, INQUIRY_MESSAGES.name, errors);
  checkLength('company', draft.company, limits.company.min, limits.company.max, INQUIRY_MESSAGES.company, errors);

  if (!EMAIL_PATTERN.test(draft.email) || draft.email.length > limits.email.max || draft.email.length < limits.email.min) {
    errors.push({ field: 'email', detail: INQUIRY_MESSAGES.email });
  }

  if (draft.role.length > 0 && draft.role.length < limits.role.min) {
    errors.push({ field: 'role', detail: INQUIRY_MESSAGES.role });
  } else if (draft.role.length > limits.role.max) {
    errors.push({ field: 'role', detail: INQUIRY_MESSAGES.roleLength });
  }

  if (!INQUIRY_INTEREST_VALUES.includes(draft.interest)) {
    errors.push({ field: 'interest', detail: INQUIRY_MESSAGES.interest });
  }

  if (draft.problem.length < limits.problem.min) {
    errors.push({ field: 'problem', detail: INQUIRY_MESSAGES.problem });
  } else if (draft.problem.length > limits.problem.max) {
    errors.push({ field: 'problem', detail: INQUIRY_MESSAGES.problemLength });
  }

  if (draft.website.trim().length > 0) {
    errors.push({ field: 'form', detail: INQUIRY_MESSAGES.honeypot });
  }

  return errors;
}
