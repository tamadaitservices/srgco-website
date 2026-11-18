// Compliance health check: ten self-assessment questions. Edit freely.
export interface HealthQ {
  id: string;
  area: string;
  q: string;
  hint: string;
  service: string; // slug of the service page that helps
  fix: string; // what to do if the answer is weak
}

export const HEALTH_QUESTIONS: HealthQ[] = [
  { id: 'gst-file', area: 'GST', q: 'Are your GST returns (GSTR-1 and GSTR-3B) filed on or before the due date, every period?', hint: 'Late fees and interest add up quickly, and delays can block your customers’ input credit.', service: 'gst-customs', fix: 'Set up a filing calendar and a month-end GST checklist so returns are never filed in a hurry.' },
  { id: 'gst-rec', area: 'GST', q: 'Do you reconcile your books with your GST returns and the credit shown in GSTR-2B each month?', hint: 'Mismatches are the most common cause of GST notices and lost input credit.', service: 'gst-customs', fix: 'Reconcile sales, purchases and input credit every month, before filing, instead of once a year.' },
  { id: 'tds', area: 'TDS', q: 'Is TDS deducted on all applicable payments, deposited by the 7th of the next month, and returns filed on time?', hint: 'Late deduction, late deposit and late returns each carry interest or fees.', service: 'direct-tax-litigation', fix: 'List your TDS-liable payments, deduct at source consistently, and file quarterly returns on schedule.' },
  { id: 'books', area: 'Accounts', q: 'Are your books written up and all bank accounts reconciled at least once a month?', hint: 'Up-to-date books give you reliable numbers and make every filing and audit easier.', service: 'accounting-outsourcing', fix: 'Move to a monthly closing routine with bank reconciliation and a short management report.' },
  { id: 'audit', area: 'Audit', q: 'If an audit applies to you, are your records ready well before the due date, with schedules and confirmations on file?', hint: 'A late audit can delay your income tax return and your lenders’ requirements.', service: 'audit-assurance', fix: 'Agree an audit timeline early and prepare the supporting schedules during the year.' },
  { id: 'advance', area: 'Income tax', q: 'Do you estimate and pay advance tax in instalments through the year, rather than at the end?', hint: 'Short or late advance tax attracts interest, and a surprise tax bill hurts cash flow.', service: 'direct-tax-litigation', fix: 'Review profits each quarter and pay advance tax on the due dates.' },
  { id: 'notices', area: 'Notices', q: 'When you receive an income tax, GST or other notice, do you reply within the time allowed with proper documents?', hint: 'Missed deadlines can turn a simple query into an order or a penalty.', service: 'direct-tax-litigation', fix: 'Track every notice with a due date and involve a professional early for assessments and appeals.' },
  { id: 'payroll', area: 'Payroll', q: 'Are provident fund, ESI and professional tax paid and filed on time for all employees?', hint: 'Payroll dues are strictly time-bound and affect your employees directly.', service: 'accounting-outsourcing', fix: 'Add payroll dues to your compliance calendar and monitor them every month.' },
  { id: 'roc', area: 'Company law', q: 'Are your ROC filings (such as AOC-4, MGT-7 and DIR-3 KYC), board meetings and statutory registers up to date?', hint: 'Late filings carry per-day fees, and directors can be disqualified for continued default.', service: 'corporate-law', fix: 'Review your annual company-law calendar and regularise any pending filings and records.' },
  { id: 'controls', area: 'Controls', q: 'Do you have written procedures and approval limits for payments, expenses and purchases?', hint: 'Basic internal controls prevent errors and fraud, and auditors look for them.', service: 'audit-assurance', fix: 'Put simple written procedures and approval limits in place and review them once a year.' },
];

export const OPTIONS = [
  { label: 'Yes, always', score: 2 },
  { label: 'Sometimes', score: 1 },
  { label: 'No', score: 0 },
  { label: 'Not applicable', score: null },
] as const;

export function band(pct: number) {
  if (pct >= 80) return { name: 'Strong', tone: 'good', text: 'You are keeping up well. A periodic review will help you stay ahead of changes.' };
  if (pct >= 50) return { name: 'Needs attention', tone: 'mid', text: 'Some areas are slipping. Fixing them now is much cheaper than fixing penalties and notices later.' };
  return { name: 'At risk', tone: 'low', text: 'Several areas need prompt attention. A structured review would help you get back on track.' };
}
