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
