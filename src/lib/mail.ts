import nodemailer from 'nodemailer';

// In-memory per-IP rate limit (fine for a single-process brochure site).
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, max = 5, windowMs = 600_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return true;
  hits.set(ip, [...recent, now]);
  return false;
}

export const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
export const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export function mailConfigured() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_TO);
}

export async function sendMail(opts: { subject: string; text: string; replyTo?: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  const port = Number(SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transport.sendMail({
    from: `"SRG Website" <${SMTP_USER}>`,
    to: CONTACT_TO,
    cc: process.env.CONTACT_CC || undefined,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
  });
}
