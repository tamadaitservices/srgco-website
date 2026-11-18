import { computeNew, computeOld, computeGst, computeHra, computeTds } from './tax.ts';
const base = { age: 'general' as const, salaried: true, d80c: 0, d80d: 0, nps: 0, homeLoan: 0, hra: 0, other: 0 };
const t = (label: string, v: unknown, expect: unknown) => console.log((JSON.stringify(v) === JSON.stringify(expect) ? 'OK  ' : 'FAIL'), label, JSON.stringify(v), '(expect', JSON.stringify(expect) + ')');
const r = (n: number) => Math.round(n);
// New regime: 12.75L gross salaried -> taxable 12L -> nil tax
t('new 12.75L', r(computeNew({ ...base, income: 1275000 }).total), 0);
// New regime: 15L salaried -> taxable 14.25L: 0-4L 0; 4-8L 20000; 8-12L 40000; 12-14.25L 33750 => 93750 + 4% cess = 97500
t('new 15L', r(computeNew({ ...base, income: 1500000 }).total), 97500);
// Old regime: 10L salaried, no deductions -> taxable 9.5L: 12500 + 90000 = 102500 +4% = 106600
t('old 10L', r(computeOld({ ...base, income: 1000000 }).total), 106600);
// Old with 1.5L 80C: taxable 8L: 12500+60000=72500 *1.04 = 75400
t('old 10L 80C', r(computeOld({ ...base, income: 1000000, d80c: 150000 }).total), 75400);
// Old: income 5.5L salaried -> taxable 5L -> rebate -> nil
t('old 5.5L', r(computeOld({ ...base, income: 550000 }).total), 0);
// Marginal relief new: taxable 12.1L -> tax would be 60000+... cap to 10000 (+cess)
t('new marginal', r(computeNew({ ...base, salaried: false, income: 1210000 }).total), r(10000 * 1.04));
t('gst excl', computeGst(1000, 18, 'exclusive', 'intra').total, 1180);
t('gst incl', r(computeGst(1180, 18, 'inclusive', 'inter').base), 1000);
t('hra', computeHra(600000, 240000, 300000, true).exemption, 240000);
t('hra nonmetro', computeHra(600000, 240000, 300000, false).exemption, 240000);
t('tds nopan', computeTds(100000, 10, false).tds, 20000);
