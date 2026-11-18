// =====================================================================
// TAX RULES USED BY THE CALCULATORS — REVIEW & UPDATE EVERY FINANCIAL YEAR
// Figures below follow the slabs notified for FY 2025-26 (AY 2026-27)
// as understood when this was built. They are INDICATIVE. The firm's
// partners must confirm them against the current law before publishing,
// and update them after each Union Budget.
// =====================================================================

export const TAX_META = {
  fy: '2025-26',
  ay: '2026-27',
  cessRate: 0.04,
};

export interface Slab { upto: number; rate: number }
export type AgeBand = 'general' | 'senior' | 'super';

export const NEW_REGIME = {
  standardDeduction: 75000,
  rebateIncomeLimit: 1200000, // 87A: no tax up to this taxable income
  rebateMax: 60000,
  slabs: [
    { upto: 400000, rate: 0 },
    { upto: 800000, rate: 0.05 },
    { upto: 1200000, rate: 0.1 },
    { upto: 1600000, rate: 0.15 },
    { upto: 2000000, rate: 0.2 },
    { upto: 2400000, rate: 0.25 },
    { upto: Infinity, rate: 0.3 },
  ] as Slab[],
  surcharge: [
    { above: 20000000, rate: 0.25 }, // new regime surcharge is capped at 25%
    { above: 10000000, rate: 0.15 },
    { above: 5000000, rate: 0.1 },
  ],
};

export const OLD_REGIME = {
  standardDeduction: 50000,
  rebateIncomeLimit: 500000,
  rebateMax: 12500,
  slabs: {
    general: [{ upto: 250000, rate: 0 }, { upto: 500000, rate: 0.05 }, { upto: 1000000, rate: 0.2 }, { upto: Infinity, rate: 0.3 }],
    senior: [{ upto: 300000, rate: 0 }, { upto: 500000, rate: 0.05 }, { upto: 1000000, rate: 0.2 }, { upto: Infinity, rate: 0.3 }],
    super: [{ upto: 500000, rate: 0 }, { upto: 1000000, rate: 0.2 }, { upto: Infinity, rate: 0.3 }],
  } as Record<AgeBand, Slab[]>,
  surcharge: [
    { above: 50000000, rate: 0.37 },
    { above: 20000000, rate: 0.25 },
    { above: 10000000, rate: 0.15 },
    { above: 5000000, rate: 0.1 },
  ],
  caps: { d80c: 150000, d80d: 100000, nps: 50000, homeLoan: 200000 },
};

export interface SlabRow { from: number; to: number; amount: number; rate: number; tax: number }

export function slabTax(income: number, slabs: Slab[]) {
  let prev = 0;
  let tax = 0;
  const rows: SlabRow[] = [];
  for (const s of slabs) {
    if (income <= prev) break;
    const upper = Math.min(income, s.upto);
    const amount = upper - prev;
    const t = amount * s.rate;
    tax += t;
    rows.push({ from: prev, to: s.upto, amount, rate: s.rate, tax: t });
    prev = s.upto;
  }
  return { tax, rows };
}

export interface RegimeResult {
  taxable: number;
  slabTax: number;
  rebate: number;
  surcharge: number;
  cess: number;
  total: number;
  rows: SlabRow[];
  effectiveRate: number;
  note?: string;
}

function finish(taxable: number, gross: number, base: number, rebateLimit: number, rebateMax: number, surchargeTable: { above: number; rate: number }[], rows: SlabRow[], marginalRelief: boolean): RegimeResult {
  let tax = base;
  let rebate = 0;
  if (taxable <= rebateLimit) {
    rebate = Math.min(tax, rebateMax);
    tax -= rebate;
  } else if (marginalRelief && tax > taxable - rebateLimit) {
    // marginal relief: tax cannot exceed the income above the rebate limit
    rebate = tax - (taxable - rebateLimit);
    tax = taxable - rebateLimit;
  }
  const sc = surchargeTable.find((x) => taxable > x.above)?.rate ?? 0;
  const surcharge = tax * sc;
  const cess = (tax + surcharge) * TAX_META.cessRate;
  const total = tax + surcharge + cess;
  return {
    taxable, slabTax: base, rebate, surcharge, cess, total, rows,
    effectiveRate: gross > 0 ? total / gross : 0,
    note: sc > 0 ? 'Surcharge is applied without marginal relief, so treat this as approximate.' : undefined,
  };
}

export interface TaxInput {
  income: number;
  age: AgeBand;
  salaried: boolean;
  d80c: number;
  d80d: number;
  nps: number;
  homeLoan: number;
  hra: number;
  other: number;
}

export function computeNew(i: TaxInput): RegimeResult {
  const std = i.salaried ? NEW_REGIME.standardDeduction : 0;
  const taxable = Math.max(0, Math.round(i.income - std));
  const { tax, rows } = slabTax(taxable, NEW_REGIME.slabs);
  return finish(taxable, i.income, tax, NEW_REGIME.rebateIncomeLimit, NEW_REGIME.rebateMax, NEW_REGIME.surcharge, rows, true);
}

export function computeOld(i: TaxInput): RegimeResult {
  const c = OLD_REGIME.caps;
  const std = i.salaried ? OLD_REGIME.standardDeduction : 0;
  const ded = Math.min(i.d80c, c.d80c) + Math.min(i.d80d, c.d80d) + Math.min(i.nps, c.nps) + Math.min(i.homeLoan, c.homeLoan) + i.hra + i.other;
  const taxable = Math.max(0, Math.round(i.income - std - ded));
  const { tax, rows } = slabTax(taxable, OLD_REGIME.slabs[i.age]);
  return finish(taxable, i.income, tax, OLD_REGIME.rebateIncomeLimit, OLD_REGIME.rebateMax, OLD_REGIME.surcharge, rows, false);
}

// ---------------- GST ----------------
export interface GstResult { base: number; gst: number; total: number; cgst: number; sgst: number; igst: number }
export function computeGst(amount: number, ratePct: number, mode: 'exclusive' | 'inclusive', supply: 'intra' | 'inter'): GstResult {
  const r = ratePct / 100;
  const base = mode === 'exclusive' ? amount : amount / (1 + r);
  const gst = base * r;
  const total = base + gst;
  return supply === 'intra'
    ? { base, gst, total, cgst: gst / 2, sgst: gst / 2, igst: 0 }
    : { base, gst, total, cgst: 0, sgst: 0, igst: gst };
}

// ---------------- HRA ----------------
export interface HraResult { received: number; rentMinus10: number; percentOfSalary: number; exemption: number; taxable: number; limiting: string }
export function computeHra(basicDaAnnual: number, hraAnnual: number, rentAnnual: number, metro: boolean): HraResult {
  const rentMinus10 = Math.max(0, rentAnnual - 0.1 * basicDaAnnual);
  const percentOfSalary = (metro ? 0.5 : 0.4) * basicDaAnnual;
  const exemption = Math.max(0, Math.min(hraAnnual, rentMinus10, percentOfSalary));
  const limiting = exemption === hraAnnual ? 'HRA actually received' : exemption === rentMinus10 ? 'Rent paid minus 10% of salary' : `${metro ? '50' : '40'}% of salary`;
  return { received: hraAnnual, rentMinus10, percentOfSalary, exemption, taxable: Math.max(0, hraAnnual - exemption), limiting };
}

// ---------------- TDS ----------------
export const TDS_PRESETS: { id: string; label: string; rate: number }[] = [
  { id: '194C1', label: '194C – Contractors (individual / HUF)', rate: 1 },
  { id: '194C2', label: '194C – Contractors (others)', rate: 2 },
  { id: '194J1', label: '194J – Professional / director fees', rate: 10 },
  { id: '194J2', label: '194J – Technical services / royalty (specified)', rate: 2 },
  { id: '194I1', label: '194I – Rent: land, building, furniture', rate: 10 },
  { id: '194I2', label: '194I – Rent: plant and machinery', rate: 2 },
  { id: '194H', label: '194H – Commission / brokerage', rate: 2 },
  { id: '194A', label: '194A – Interest (other than securities)', rate: 10 },
  { id: '194Q', label: '194Q – Purchase of goods', rate: 0.1 },
  { id: 'custom', label: 'Other – enter the rate yourself', rate: 10 },
];
export function computeTds(amount: number, ratePct: number, hasPan: boolean) {
  const rate = hasPan ? ratePct : Math.max(ratePct, 20);
  const tds = (amount * rate) / 100;
  return { rate, tds, net: amount - tds };
}
