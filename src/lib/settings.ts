// Site-wide settings edited from /admin: which colour themes visitors can use, and the default one.
import fs from 'node:fs';
import path from 'node:path';
import { dataDir } from './about';

export const THEMES = ['clean', 'navy', 'light', 'dark', 'emerald', 'republic', 'independence', 'gandhi'] as const;
export type ThemeId = (typeof THEMES)[number];
const ADDED_LATER: ThemeId[] = ['republic', 'independence', 'gandhi']; // themes added after settings files (v1) already existed
export interface Settings { enabled: ThemeId[]; defaultTheme: ThemeId; /** show the festival theme to new visitors on 26 Jan, 15 Aug and 2 Oct */ occasions: boolean }

export const DEFAULT_SETTINGS: Settings = { enabled: [...THEMES], defaultTheme: 'navy', occasions: true };
const file = () => path.join(dataDir(), 'settings.json');

export function sanitizeSettings(raw: any): Settings {
  let enabled = (Array.isArray(raw?.enabled) ? raw.enabled : []).filter((t: any) => THEMES.includes(t)) as ThemeId[];
  if (enabled.length && raw?.v !== 2) enabled = [...enabled, ...ADDED_LATER]; // older file: new themes start switched on
  enabled = THEMES.filter((t) => enabled.includes(t));
  if (!enabled.length) enabled = [...THEMES]; // never lock visitors out of every theme
  const d = THEMES.includes(raw?.defaultTheme) && enabled.includes(raw.defaultTheme) ? raw.defaultTheme : enabled.includes('navy') ? 'navy' : enabled[0];
  return { enabled, defaultTheme: d, occasions: raw?.occasions !== false };
}
export function loadSettings(): Settings {
  try { return sanitizeSettings(JSON.parse(fs.readFileSync(file(), 'utf8'))); } catch { return DEFAULT_SETTINGS; }
}
export function saveSettings(s: Settings) {
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.writeFileSync(file(), JSON.stringify({ v: 2, ...sanitizeSettings({ ...s, v: 2 }) }, null, 2));
}
