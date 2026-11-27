export const INQUIRY_LIMITS = {
  name: { min: 2, max: 80 },
  company: { min: 2, max: 120 },
  email: { min: 5, max: 120 },
  role: { min: 2, max: 80 },
  problem: { min: 20, max: 2000 },
} as const;

export const INQUIRY_INTERESTS = [
  { value: 'general', label: 'Consulta general' },
  { value: 'undecided', label: 'Aún no lo tengo claro' },
] as const;

export type InquiryInterest = (typeof INQUIRY_INTERESTS)[number]['value'];

export const INQUIRY_INTEREST_VALUES: readonly string[] = INQUIRY_INTERESTS.map((item) => item.value);

export const INQUIRY_MESSAGES = {
  name: 'Escribe tu nombre.',
  company: 'Escribe el nombre de la empresa.',
  email: 'Escribe un correo electrónico válido.',
  role: 'Si indicas el cargo, usa al menos 2 caracteres.',
  roleLength: 'El cargo es demasiado largo.',
  interest: 'Selecciona el motivo de la consulta.',
  problem: 'Describe el contexto con al menos un párrafo breve.',
  problemLength: 'La descripción supera el límite de 2000 caracteres.',
  length: 'El texto supera el límite permitido.',
  honeypot: 'No pudimos procesar la solicitud.',
  summary: 'Revisa los campos marcados.',
  unavailable:
    'El canal de recepción todavía no está conectado. La solicitud no se envió y los datos siguen en el formulario.',
  upstream: 'No pudimos entregar la solicitud. Inténtalo de nuevo en unos minutos.',
  unexpected: 'Ocurrió un problema al enviar la solicitud. Inténtalo de nuevo.',
  success: 'Recibimos tu solicitud. La usaremos para entender el contexto y responderte.',
  sending: 'Enviando…',
  submit: 'Enviar solicitud',
} as const;
