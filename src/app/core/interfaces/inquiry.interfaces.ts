export interface InquiryDraft {
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly role: string;
  readonly interest: string;
  readonly problem: string;
  /** Honeypot. Debe llegar vacío. */
  readonly website: string;
}

export interface InquiryFieldError {
  readonly field: keyof InquiryDraft | 'form';
  readonly detail: string;
}

export type InquiryFailureCode = 'VALIDATION' | 'CHANNEL_UNAVAILABLE' | 'UPSTREAM' | 'UNEXPECTED';

export type InquiryResult =
  | { readonly ok: true; readonly reference: string }
  | { readonly ok: false; readonly code: InquiryFailureCode; readonly errors: readonly InquiryFieldError[] };

export interface InquirySubmitOptions {
  readonly endpoint?: string;
  readonly fetchFn?: typeof fetch;
  readonly timeoutMs?: number;
}
