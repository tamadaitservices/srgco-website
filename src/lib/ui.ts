// Small helpers shared by the interactive tools.
export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const pct = (n: number, d = 1) => (n * 100).toFixed(d) + '%';

/** Parse a number from an input that may contain Indian-style commas. */
export const num = (el: HTMLInputElement | null) => (el ? Number(String(el.value).replace(/[^0-9.]/g, '')) || 0 : 0);

/** Live "1,23,456" formatting while typing, keeping the caret in place. */
export function bindInr(el: HTMLInputElement, onChange: () => void) {
  el.addEventListener('input', () => {
    const pos = el.selectionStart ?? el.value.length;
    const digitsBefore = el.value.slice(0, pos).replace(/\D/g, '').length;
    const digits = el.value.replace(/\D/g, '').slice(0, 12);
    el.value = digits ? Number(digits).toLocaleString('en-IN') : '';
    let seen = 0, idx = 0;
    while (idx < el.value.length && seen < digitsBefore) { if (/\d/.test(el.value[idx])) seen++; idx++; }
    try { el.setSelectionRange(idx, idx); } catch {}
    onChange();
  });
}

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
