// Admin sign-in: one administrator, identified by email + password.
//  * First run: ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
//  * After the password is changed or reset in the panel, only a salted scrypt hash is kept
//    in DATA_DIR/admin.json, and it takes over from the environment variable.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { dataDir } from './about';

const COOKIE = 'srg_admin';
const TTL = 8 * 3600; // seconds

interface Stored { email: string; salt: string; hash: string }
const file = () => path.join(dataDir(), 'admin.json');
function stored(): Stored | null {
  try { const j = JSON.parse(fs.readFileSync(file(), 'utf8')); return j?.hash && j?.salt ? j : null; } catch { return null; }
}

export const adminEmail = () => (stored()?.email || process.env.ADMIN_EMAIL || process.env.CONTACT_TO || '').trim().toLowerCase();
export const adminEnabled = () => Boolean(stored() || process.env.ADMIN_PASSWORD);

const scrypt = (pw: string, salt: string) => crypto.scryptSync(pw, salt, 64).toString('hex');
const sha = (s: string) => crypto.createHash('sha256').update(s).digest();
export const safeEqual = (a: string, b: string) => crypto.timingSafeEqual(sha(a), sha(b));

// everything signed (sessions, reset links) depends on the current credentials, so changing the password signs everyone out
const credFingerprint = () => { const s = stored(); return s ? s.hash : `env:${process.env.ADMIN_PASSWORD || ''}`; };
const secret = () => `${process.env.ADMIN_SECRET || 'srg'}|${credFingerprint()}`;
const sign = (v: string) => crypto.createHmac('sha256', secret()).update(v).digest('hex');

export function checkLogin(email: string, password: string) {
  if (!adminEnabled()) return false;
  const okEmail = safeEqual(email.trim().toLowerCase(), adminEmail());
  const s = stored();
  const okPw = s ? safeEqual(scrypt(password, s.salt), s.hash) : safeEqual(password, process.env.ADMIN_PASSWORD || '');
  return okEmail && okPw; // evaluate both to keep timing even
}
export const checkPassword = (password: string) => {
  const s = stored();
  return s ? safeEqual(scrypt(password, s.salt), s.hash) : adminEnabled() && safeEqual(password, process.env.ADMIN_PASSWORD || '');
};

export function setPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.writeFileSync(file(), JSON.stringify({ email: adminEmail(), salt, hash: scrypt(password, salt) }), { mode: 0o600 });
}
export const passwordProblem = (p: string) => (p.length < 8 ? 'Use at least 8 characters.' : p.length > 128 ? 'That password is too long.' : null);

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

/** One-time password-reset link token: valid 30 minutes, dies as soon as the password changes. */
export const resetToken = () => { const exp = String(Math.floor(Date.now() / 1000) + 1800); return `${exp}.${sign('reset:' + exp)}`; };
export function validResetToken(t: string) {
  const [exp, sig] = String(t || '').split('.');
  return Boolean(exp && sig && Number(exp) > Date.now() / 1000 && safeEqual(sig, sign('reset:' + exp)));
}

/** Reject cross-site posts: the Origin header (when present) must match the Host. */
export function sameOrigin(request: Request) {
  const o = request.headers.get('origin');
  if (!o) return true;
  try { return new URL(o).host === request.headers.get('host'); } catch { return false; }
}
