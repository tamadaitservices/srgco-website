// Minimal password login for /admin. Disabled unless ADMIN_PASSWORD is set.
import crypto from 'node:crypto';

const COOKIE = 'srg_admin';
const TTL = 8 * 3600; // seconds

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);
const secret = () => process.env.ADMIN_SECRET || `srg:${process.env.ADMIN_PASSWORD}`;
const sign = (v: string) => crypto.createHmac('sha256', secret()).update(v).digest('hex');

export function safeEqual(a: string, b: string) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export const checkPassword = (p: string) => adminEnabled() && safeEqual(p, process.env.ADMIN_PASSWORD!);

export function sessionCookie() {
  const exp = String(Math.floor(Date.now() / 1000) + TTL);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE}=${exp}.${sign(exp)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TTL}${secure}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;

export function isAuthed(request: Request) {
  if (!adminEnabled()) return false;
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(exp));
}

/** Reject cross-site form posts: the Origin header (when present) must match the Host. */
export function sameOrigin(request: Request) {
  const o = request.headers.get('origin');
  if (!o) return true;
  try { return new URL(o).host === request.headers.get('host'); } catch { return false; }
}
