// =====================================================================
// RECURRING COMPLIANCE DUE DATES — REVIEW REGULARLY
// These are the standard statutory dates. The government often extends or
// changes dates by notification, and dates falling on holidays move. The
// calendar page tells visitors to confirm with the firm. Update this file
// when dates change.
// =====================================================================

export type Cat = 'GST' | 'TDS / TCS' | 'Income tax' | 'Payroll' | 'Companies & LLP';
export const CATEGORIES: Cat[] = ['GST', 'TDS / TCS', 'Income tax', 'Payroll', 'Companies & LLP'];

export interface Rule {
  id: string;
  cat: Cat;
  title: string;
  detail: string;
  /** 1–12. Omit for "every month". */
  months?: number[];
  day: number;
  /** Month-specific day overrides, e.g. { 4: 30 } */
  overrides?: Record<number, number>;
  note?: string;
}

export const RULES: Rule[] = [
  { id: 'gstr1-m', cat: 'GST', title: 'GSTR-1 (monthly filers)', detail: 'Details of outward supplies for the previous month.', day: 11 },
  { id: 'gstr3b-m', cat: 'GST', title: 'GSTR-3B (monthly filers)', detail: 'Summary return and payment of GST for the previous month.', day: 20 },
  { id: 'gstr1-q', cat: 'GST', title: 'GSTR-1 (quarterly – QRMP scheme)', detail: 'Outward supplies for the quarter just ended.', months: [1, 4, 7, 10], day: 13 },
  { id: 'gstr3b-q', cat: 'GST', title: 'GSTR-3B (quarterly – QRMP scheme)', detail: 'Summary return for the quarter just ended.', months: [1, 4, 7, 10], day: 22, note: 'The 22nd or 24th depending on your state.' },
  { id: 'gstr9', cat: 'GST', title: 'GSTR-9 / GSTR-9C annual return', detail: 'Annual return and reconciliation statement for the previous financial year.', months: [12], day: 31 },

  { id: 'tds-pay', cat: 'TDS / TCS', title: 'TDS / TCS payment', detail: 'Deposit tax deducted or collected in the previous month.', day: 7, overrides: { 4: 30 }, note: 'For March, the date is 30 April.' },
  { id: 'tds-ret', cat: 'TDS / TCS', title: 'TDS returns (Forms 24Q, 26Q, 27Q)', detail: 'Quarterly statements of tax deducted at source.', months: [1, 5, 7, 10], day: 31 },
  { id: 'form16', cat: 'TDS / TCS', title: 'Form 16 to employees', detail: 'Salary TDS certificate for the previous financial year.', months: [6], day: 15 },

  { id: 'adv-tax', cat: 'Income tax', title: 'Advance tax instalment', detail: 'Cumulative 15% by 15 June, 45% by 15 Sept, 75% by 15 Dec and 100% by 15 March.', months: [3, 6, 9, 12], day: 15 },
  { id: 'itr-1', cat: 'Income tax', title: 'Income tax return – non-audit cases', detail: 'Individuals and others not requiring an audit.', months: [7], day: 31 },
  { id: 'tax-audit', cat: 'Income tax', title: 'Tax audit report', detail: 'Audit report under section 44AB for the previous financial year.', months: [9], day: 30 },
  { id: 'itr-2', cat: 'Income tax', title: 'Income tax return – audit cases', detail: 'Businesses and professionals whose accounts require an audit.', months: [10], day: 31 },
  { id: 'tp-report', cat: 'Income tax', title: 'Transfer pricing report (Form 3CEB)', detail: 'For taxpayers with international or specified domestic transactions.', months: [10], day: 31 },
  { id: 'itr-tp', cat: 'Income tax', title: 'Income tax return – transfer pricing cases', detail: 'Return due date for taxpayers covered by transfer pricing.', months: [11], day: 30 },
  { id: 'itr-late', cat: 'Income tax', title: 'Belated / revised return – last date', detail: 'Last date to file a belated return or revise a filed return.', months: [12], day: 31 },

  { id: 'pf', cat: 'Payroll', title: 'Provident fund (PF) contribution & ECR', detail: 'Employer and employee contribution for the previous month.', day: 15 },
  { id: 'esi', cat: 'Payroll', title: 'ESI contribution', detail: 'Contribution for the previous month.', day: 15 },

  { id: 'dpt3', cat: 'Companies & LLP', title: 'DPT-3 return of deposits', detail: 'Annual return of deposits / outstanding receipts of money.', months: [6], day: 30 },
  { id: 'llp11', cat: 'Companies & LLP', title: 'LLP Form 11 – annual return', detail: 'Annual return of an LLP.', months: [5], day: 30 },
  { id: 'msme1', cat: 'Companies & LLP', title: 'MSME Form 1', detail: 'Half-yearly return of outstanding payments to micro and small enterprises.', months: [4, 10], day: 30, overrides: { 10: 31 } },
  { id: 'agm', cat: 'Companies & LLP', title: 'AGM – last date (March year-end companies)', detail: 'Annual general meeting for the previous financial year.', months: [9], day: 30 },
  { id: 'dir3', cat: 'Companies & LLP', title: 'DIR-3 KYC for directors', detail: 'Annual KYC of directors holding a DIN.', months: [9], day: 30 },
  { id: 'llp8', cat: 'Companies & LLP', title: 'LLP Form 8 – statement of account & solvency', detail: 'Annual filing for an LLP.', months: [10], day: 30 },
  { id: 'aoc4', cat: 'Companies & LLP', title: 'AOC-4 – financial statements', detail: 'Within 30 days of the AGM (shown for an AGM on 30 September).', months: [10], day: 30, note: 'Depends on your actual AGM date.' },
  { id: 'mgt7', cat: 'Companies & LLP', title: 'MGT-7 – annual return', detail: 'Within 60 days of the AGM (shown for an AGM on 30 September).', months: [11], day: 29, note: 'Depends on your actual AGM date.' },
];

export interface Due { rule: Rule; date: Date }

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** All due dates from `from` for the next `days` days, sorted. */
export function upcoming(from: Date, days: number): Due[] {
  const start = startOfDay(from);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + days);
  const out: Due[] = [];
  for (const rule of RULES) {
    for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
      const months = rule.months ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      for (const m of months) {
        const day = rule.overrides?.[m] ?? rule.day;
        const date = new Date(y, m - 1, day);
        if (date >= start && date <= end) out.push({ rule, date });
      }
    }
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime() || a.rule.title.localeCompare(b.rule.title));
}

const ord = (n: number) => n + (['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) || n % 10 > 3 ? 0 : n % 10]);
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Plain-English "when" for the static, always-visible table. */
export function whenText(r: Rule): string {
  if (!r.months) return `${ord(r.day)} of every month`;
  return r.months.map((m) => `${r.overrides?.[m] ?? r.day} ${MON[m - 1]}`).join(', ');
}
