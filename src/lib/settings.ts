// Site-wide settings edited from /admin: which colour themes visitors can use, and the default one.
import fs from 'node:fs';
import path from 'node:path';
import { dataDir } from './about';

export const THEMES = ['clean', 'navy', 'light', 'dark', 'emerald'] as const;
export type ThemeId = (typeof THEMES)[number];
export interface Settings { enabled: ThemeId[]; defaultTheme: ThemeId }

export const DEFAULT_SETTINGS: Settings = { enabled: [...THEMES], defaultTheme: 'navy' };
const file = () => path.join(dataDir(), 'settings.json');

export function sanitizeSettings(raw: any): Settings {
  let enabled = (Array.isArray(raw?.enabled) ? raw.enabled : []).filter((t: any) => THEMES.includes(t)) as ThemeId[];
  enabled = THEMES.filter((t) => enabled.includes(t));
  if (!enabled.length) enabled = [...THEMES]; // never lock visitors out of every theme
  const d = THEMES.includes(raw?.defaultTheme) && enabled.includes(raw.defaultTheme) ? raw.defaultTheme : enabled.includes('navy') ? 'navy' : enabled[0];
  return { enabled, defaultTheme: d };
}
export function loadSettings(): Settings {
  try { return sanitizeSettings(JSON.parse(fs.readFileSync(file(), 'utf8'))); } catch { return DEFAULT_SETTINGS; }
}
export function saveSettings(s: Settings) {
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.writeFileSync(file(), JSON.stringify(sanitizeSettings(s), null, 2));
}
