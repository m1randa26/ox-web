import type { APIRoute } from "astro";

// Esta ruta se ejecuta en el servidor (función de Vercel); el resto del sitio es estático.
export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Solicitud inválida." }, 400);
  }

  // Honeypot: si un bot llenó "website", respondemos OK sin hacer nada.
  if (str(data.website)) return json({ ok: true });

  const lead = {
    name: str(data.name),
    phone: str(data.phone, 40),
    email: str(data.email),
    city: str(data.city),
    intent: ["Vivir", "Invertir"].includes(str(data.intent)) ? str(data.intent) : "",
    createdAt: new Date().toISOString(),
    source: "oxresidencial.com",
  };

  if (!lead.name) return json({ error: "Ingresa tu nombre." }, 422);
  if (!lead.phone || !/^[\d\s()+-]{7,}$/.test(lead.phone)) return json({ error: "Teléfono no válido." }, 422);
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return json({ error: "Correo no válido." }, 422);

  const webhook = import.meta.env.CONTACT_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    // Sin destino configurado: se registra en los logs del servidor.
    console.info("[contacto] Nuevo lead (sin CONTACT_WEBHOOK_URL configurado):", lead);
    return json({ ok: true });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
  } catch (err) {
    console.error("[contacto] Error al reenviar el lead:", err);
    return json({ error: "No pudimos enviar tu solicitud." }, 502);
  }

  return json({ ok: true });
};
