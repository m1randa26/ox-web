export const WHATSAPP_NUMBER = "5219996500077";
export const PHONE_DISPLAY = "+52 999 650 0077";

export const DEFAULT_MESSAGE =
  "Hola, me gustaría recibir información sobre OX Residencial y agendar una visita.";

export const OSTECH_MESSAGE =
  "Hola, me gustaría conocer más sobre OX Residencial y OSTECH Desarrolladora, y agendar una visita.";

interface WaOptions {
  name?: string;
  phone?: string;
  city?: string;
  intent?: string;
  context?: string;
}

export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  intent?: string;
}

/**
 * Mensaje del formulario "Agenda tu visita".
 * Usa *negritas* de WhatsApp y omite los campos opcionales vacíos.
 */
export function leadMessage({ name, phone, email, city, intent }: LeadData): string {
  const lines = [
    "Hola, me gustaría agendar una visita a OX Residencial. Estos son mis datos:",
    "",
    `*Nombre:* ${name.trim()}`,
    `*Teléfono:* ${phone.trim()}`,
  ];
  if (email?.trim()) lines.push(`*Correo:* ${email.trim()}`);
  if (city?.trim()) lines.push(`*Ciudad de origen:* ${city.trim()}`);
  if (intent?.trim()) lines.push(`*Busco para:* ${intent.trim()}`);
  return lines.join("\n");
}

export function leadLink(data: LeadData): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(leadMessage(data))}`;
}

/** Mismo generador que el sitio original. */
export function waLink({ name, phone, city, intent, context }: WaOptions = {}): string {
  let message = context?.trim() || DEFAULT_MESSAGE;
  const extra: string[] = [];
  if (name?.trim()) extra.push(`Mi nombre es ${name.trim()}.`);
  if (phone?.trim()) extra.push(`Mi teléfono es ${phone.trim()}.`);
  if (city?.trim()) extra.push(`Soy de ${city.trim()}.`);
  if (intent?.trim()) extra.push(`Busco para ${intent.trim().toLowerCase()}.`);
  if (extra.length) message = `${message} ${extra.join(" ")}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
