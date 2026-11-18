// Single source of truth for all site content. Source: "SRGCO Firm Profile" PDF.

export const firm = {
  name: 'S.R. Garimella & Co.',
  short: 'SRG & Co.',
  legalType: 'Chartered Accountants',
  tagline: 'Building Trust through Professional Excellence',
  pillars: ['Tax', 'Assurance', 'Advisory'],
  established: 1989,
  founder: 'Late Sri Garimella Someswara Rao, FCA',
  partnershipYear: 2009,
  description:
    'S.R. Garimella & Co. is a Chartered Accountant firm providing professional services in audit, taxation, corporate advisory, and financial consulting. Established in 1989, the firm brings decades of experience in the Indian financial and regulatory environment.',
  approach:
    'Our team combines technical expertise, regulatory knowledge, and practical business insight to help clients navigate complex financial and compliance challenges.',
  closing: 'Your trusted partner for financial advisory, compliance, and business growth.',
};

export const timeline = [
  { year: '1989', text: 'Firm established by Late Sri Garimella Someswara Rao, FCA.' },
  { year: '2009', text: 'Firm reconstituted as a partnership firm.' },
  { year: 'Today', text: 'Serving businesses across multiple industries with offices in Hyderabad and Vijayawada.' },
];

export const values = [
  { name: 'Integrity', icon: 'shield' },
  { name: 'Professionalism', icon: 'briefcase' },
  { name: 'Accountability', icon: 'scales' },
  { name: 'Adaptability', icon: 'arrows' },
  { name: 'Competence', icon: 'cap' },
  { name: 'Simplicity', icon: 'bulb' },
];

export const promises = [
  'Deliver high quality professional services',
  'Maintain strict confidentiality',
  'Provide innovative and practical solutions',
  'Solve complex client challenges with dedication',
];

export interface Service {
  slug: string;
  title: string;
  short: string;
  icon: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  groups: { heading: string; items: string[] }[];
}

export const services: Service[] = [
  {
    slug: 'audit-assurance',
    title: 'Audit & Assurance',
    short: 'Statutory, internal, tax, investigation and management audits.',
    icon: 'glasses',
    seoTitle: 'Audit & Assurance Services in Hyderabad & Vijayawada',
    seoDescription:
      'Statutory, internal, tax, investigation and management audits, risk-based reviews and internal control evaluation by S.R. Garimella & Co., Chartered Accountants.',
    intro:
      'Our audit services focus on strengthening financial governance, regulatory compliance, and operational transparency.',
    groups: [
      {
        heading: 'Core audit services',
        items: ['Statutory audits', 'Internal audits', 'Tax audits', 'Investigation audits', 'Management audits'],
      },
      {
        heading: 'Advisory & review',
        items: ['Risk-based audit reviews', 'Internal control system evaluation', 'Standard operating procedure design'],
      },
    ],
  },
  {
    slug: 'direct-tax-litigation',
    title: 'Tax Advisory & Litigation Support',
    short: 'Tax planning, compliance, representation and litigation support.',
    icon: 'gavel',
    seoTitle: 'Direct Tax Advisory, Compliance & Litigation — Income Tax Representation',
    seoDescription:
      'Tax planning, filings, compliance and representation before assessing authorities, appellate authorities and the ITAT. Chartered Accountants in Hyderabad and Vijayawada.',
    intro:
      'Our tax advisory services help businesses optimise tax structures while ensuring full compliance with evolving tax laws.',
    groups: [
      {
        heading: 'Key services',
        items: [
          'Tax planning and strategy',
          'Tax compliance and filings',
          'Tax representation',
          'Litigation support',
          'Regulatory compliance advisory',
        ],
      },
      {
        heading: 'Representation before',
        items: ['Assessing authorities', 'Appellate authorities', 'Income Tax Appellate Tribunal (ITAT)'],
      },
    ],
  },
  {
    slug: 'international-tax-transfer-pricing',
    title: 'International Taxation & Transfer Pricing',
    short: 'Cross-border tax planning, treaty advisory and transfer pricing.',
    icon: 'globe',
    seoTitle: 'International Taxation & Transfer Pricing Consultants in Hyderabad',
    seoDescription:
      'International tax planning, transfer pricing documentation and studies, cross-border structuring and tax treaty advisory for multinationals and foreign investors.',
    intro: 'We assist multinational companies and foreign investors in navigating cross-border tax regulations.',
    groups: [
      {
        heading: 'What we do',
        items: [
          'International tax planning',
          'Transfer pricing documentation & studies',
          'Cross-border transaction structuring',
          'Tax treaty advisory',
          'Representation before transfer pricing authorities',
        ],
      },
    ],
  },
  {
    slug: 'gst-customs',
    title: 'Indirect Tax (GST & Customs)',
    short: 'GST advisory, filings, appeals, customs and EOU/FTP compliance.',
    icon: 'receipt',
    seoTitle: 'GST Consultants & Customs Advisory in Hyderabad and Vijayawada',
    seoDescription:
      'GST advisory, compliance and filings, appeals and litigation, customs advisory and 100% EOU / FTP compliance by S.R. Garimella & Co.',
    intro:
      'Our indirect tax team provides advisory and compliance services related to GST and customs regulations.',
    groups: [
      {
        heading: 'What we do',
        items: [
          'GST advisory',
          'GST compliance & filings',
          'Appeals / litigations',
          'Customs advisory',
          '100% EOU / FTP compliances',
        ],
      },
    ],
  },
  {
    slug: 'eou-compliance',
    title: '100% EOU Services',
    short: 'EOU (VSEZ) compliance, customs, GST, refunds and duty drawback.',
    icon: 'stamp',
    seoTitle: '100% EOU Compliance, TED Refund & Duty Drawback Services',
    seoDescription:
      '100% EOU (VSEZ) regulatory compliance and reporting, customs (EPD) documentation, GST compliance for EOUs, TED refund on diesel and duty drawback.',
    intro: 'End-to-end compliance support for 100% Export Oriented Units.',
    groups: [
      {
        heading: 'EOU (VSEZ) regulatory compliance & reporting',
        items: ['Product lifecycle management', 'Job work & Form A', 'Progress reporting'],
      },
      {
        heading: 'Customs (EPD) & import documentation',
        items: ['Intimations & returns', 'Various permissions & disposals'],
      },
      {
        heading: 'GST compliance for EOU',
        items: ['Return filings', 'Submission of Form A and assisting Form B'],
      },
      {
        heading: 'Refund facilitation & maximisation',
        items: [
          'TED refund (diesel): end-to-end processing of claims, from application to sanction follow-up',
          'Duty drawback (DBK): annual preparation, filing and diligent follow-up',
        ],
      },
    ],
  },
  {
    slug: 'corporate-law',
    title: 'Corporate Law & Regulatory Services',
    short: 'Incorporation, secretarial services, MCA compliance and governance.',
    icon: 'building',
    seoTitle: 'Company Incorporation, MCA Compliance & Corporate Secretarial Services',
    seoDescription:
      'Incorporation and structuring of companies and LLPs, corporate secretarial services, MCA compliance, board meeting and statutory record management.',
    intro: 'We assist businesses in complying with corporate laws and regulatory requirements.',
    groups: [
      {
        heading: 'Entity formation',
        items: [
          'Incorporation & structuring of companies and LLPs',
          'Corporate secretarial services',
          'MCA compliance',
        ],
      },
      {
        heading: 'Ongoing governance',
        items: ['Board meeting and statutory record management', 'Corporate litigation support'],
      },
    ],
  },
  {
    slug: 'corporate-finance-advisory',
    title: 'Corporate Finance Advisory',
    short: 'Fund raising, business plans, valuation, project finance and M&A.',
    icon: 'chart',
    seoTitle: 'Corporate Finance Advisory — Fund Raising, Valuation & M&A Support',
    seoDescription:
      'Fund raising advisory, business plans, financial projections, project finance, business and intangible asset valuation, and M&A support.',
    intro: 'We help businesses raise capital and structure financial strategies for growth.',
    groups: [
      {
        heading: 'What we do',
        items: [
          'Fund raising advisory',
          'Business plan preparation',
          'Financial projections',
          'Project finance',
          'Business valuation',
          'Intangible asset valuation',
          'Support for mergers and acquisitions',
        ],
      },
    ],
  },
  {
    slug: 'accounting-outsourcing',
    title: 'Accounting & Finance Outsourcing',
    short: 'Accounting, financial and MIS reporting, compliance monitoring, virtual CFO.',
    icon: 'calculator',
    seoTitle: 'Accounting & Finance Outsourcing, MIS Reporting and Virtual CFO Services',
    seoDescription:
      'Outsourced accounting process management, financial and MIS reporting, compliance monitoring and virtual CFO services.',
    intro:
      'We provide outsourced accounting and financial process services for businesses seeking efficient and professional accounting solutions.',
    groups: [
      {
        heading: 'What we do',
        items: [
          'Accounting process management',
          'Financial reporting',
          'MIS reporting',
          'Compliance monitoring',
          'Virtual CFO services',
        ],
      },
    ],
  },
];

export const sectors = [
  'Pharma / Agri Chem / Herbal / Aqua',
  'IT / ITES',
  'R&D / Healthcare / Hospitals',
  'Educational institutions',
  'Construction',
];

export const team = [
  {
    name: 'D.P. Sai Sandeep Garimella',
    quals: 'B.Com, FCA, CISA, Dip. Int Tax (ICAI)',
    since: 2011,
    focus: 'Direct Tax, Assurance, International Tax',
    note: 'Certified in International Taxation, Forensic Accounting, and Concurrent Bank Audit.',
  },
  {
    name: 'Thadi Krishna Pavan',
    quals: 'B.Com, M.Com, pursuing LLB',
    since: 2019,
    focus: 'Direct Tax, Assurance, Accounting and GST',
  },
  {
    name: 'Kavali Raghavendar',
    quals: 'B.Com, CA',
    since: 2023,
    focus: 'Direct & Indirect Taxation, Accounting and Statutory Audit',
  },
  {
    name: 'Nitish Kumar Dwara',
    quals: 'B.Com, ACA',
    since: 2021,
    focus: 'Direct & Indirect Taxation, Accounting and GST',
  },
];

export interface Office {
  slug: string;
  city: string;
  region: string;
  primary: boolean;
  address?: string[];
  postal?: string;
  tel?: string;
  telHref?: string;
  email?: string;
  geo?: { lat: number; lng: number };
}

export const offices: Office[] = [
  {
    slug: 'hyderabad',
    city: 'Hyderabad',
    region: 'Telangana',
    primary: true,
    address: ['Flat 304, Queens Court Apartments', 'St No. 19, Himayat Nagar'],
    postal: '500028',
    tel: '040-66462292',
    telHref: '+914066462292',
    email: 'sandeepgdps@srgco.in',
    geo: { lat: 17.3994, lng: 78.4861 },
  },
  {
    slug: 'vijayawada',
    city: 'Vijayawada',
    region: 'Andhra Pradesh',
    primary: true,
    address: ['4th Floor, # 52-1/1-3', 'Veterinary Colony'],
    postal: '520008',
    tel: '0866-2975292',
    telHref: '+918662975292',
    email: 'gsrao@srgco.in',
    geo: { lat: 16.5062, lng: 80.648 },
  },
  { slug: 'rajahmundry', city: 'Rajahmundry', region: 'Andhra Pradesh', primary: false },
  { slug: 'kakinada', city: 'Kakinada', region: 'Andhra Pradesh', primary: false },
];

export const nav = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/tools', label: 'Tools' },
  { href: '/insights', label: 'Notes' },
  { href: '/contact', label: 'Contact' },
];

// ---- Contact page: each enquiry type has its own document, questions and checklist ----
export interface EnquiryField {
  id: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: string[];
}
export interface EnquiryType {
  slug: string;
  chip: string;
  title: string; // used in the subject line
  docTitle: string; // heading of the document
  fields: EnquiryField[];
  enclosures: string[]; // "documents to keep ready"
}

const entityOptions = ['Company', 'LLP', 'Partnership firm', 'Proprietorship', 'Trust / Society', 'Individual', 'Other'];

export const enquiryTypes: EnquiryType[] = [
  {
    slug: 'audit-assurance',
    chip: 'Audit',
    title: 'Audit & Assurance',
    docTitle: 'Audit Engagement Request',
    fields: [
      { id: 'entity', label: 'Type of entity', type: 'select', options: entityOptions },
      { id: 'audit', label: 'Audit required', type: 'select', options: ['Statutory audit', 'Internal audit', 'Tax audit', 'Investigation audit', 'Management audit', 'Not sure yet'] },
      { id: 'fy', label: 'Financial year', type: 'text', placeholder: 'e.g. 2025-26' },
      { id: 'turnover', label: 'Approx. annual turnover', type: 'text', placeholder: 'e.g. ₹5 crore' },
    ],
    enclosures: ["Previous year's audited financial statements", 'Trial balance / books of accounts', 'Bank statements and ledgers'],
  },
  {
    slug: 'direct-tax-litigation',
    chip: 'Direct tax',
    title: 'Direct Tax Advisory & Litigation',
    docTitle: 'Income Tax Advisory & Representation Request',
    fields: [
      { id: 'matter', label: 'Nature of matter', type: 'select', options: ['Tax planning', 'Return filing / compliance', 'Notice or assessment', 'Appeal (CIT(A) / ITAT)', 'Other'] },
      { id: 'ay', label: 'Assessment year', type: 'text', placeholder: 'e.g. 2025-26' },
      { id: 'notice', label: 'Notice or order date (if any)', type: 'text', placeholder: 'e.g. 12 October 2026' },
    ],
    enclosures: ['PAN and previous income tax returns', 'Copy of the notice / order, if received', 'Form 26AS / AIS statement'],
  },
  {
    slug: 'international-tax-transfer-pricing',
    chip: 'International tax',
    title: 'International Taxation & Transfer Pricing',
    docTitle: 'International Tax & Transfer Pricing Request',
    fields: [
      { id: 'need', label: 'Requirement', type: 'select', options: ['Transfer pricing documentation', 'International tax planning', 'Cross-border structuring', 'Tax treaty advice', 'Representation before authorities'] },
      { id: 'countries', label: 'Countries involved', type: 'text', placeholder: 'e.g. USA, Singapore' },
      { id: 'fy', label: 'Financial year', type: 'text', placeholder: 'e.g. 2025-26' },
    ],
    enclosures: ['Agreements with overseas parties', 'Details of related-party transactions', 'Previous transfer pricing documentation, if any'],
  },
  {
    slug: 'gst-customs',
    chip: 'GST & Customs',
    title: 'Indirect Tax (GST & Customs)',
    docTitle: 'GST & Customs Service Request',
    fields: [
      { id: 'need', label: 'Requirement', type: 'select', options: ['GST registration', 'Return filing & compliance', 'GST advisory', 'Appeal / litigation', 'Customs advisory', 'EOU / FTP compliance'] },
      { id: 'gstin', label: 'GSTIN (if registered)', type: 'text', placeholder: '15-character GSTIN' },
      { id: 'activity', label: 'Nature of business', type: 'text', placeholder: 'e.g. pharma exports' },
    ],
    enclosures: ['GST registration certificate', 'Recent returns (GSTR-1 and GSTR-3B)', 'Sales and purchase registers'],
  },
  {
    slug: 'eou-compliance',
    chip: '100% EOU',
    title: '100% EOU Services',
    docTitle: '100% EOU Compliance Request',
    fields: [
      { id: 'need', label: 'Requirement', type: 'select', options: ['EOU (VSEZ) compliance & reporting', 'Customs (EPD) documentation', 'GST compliance for EOU', 'TED refund (diesel)', 'Duty drawback (DBK)'] },
      { id: 'location', label: 'Unit location', type: 'text', placeholder: 'e.g. Visakhapatnam' },
      { id: 'lop', label: 'Letter of Permission / approval details', type: 'text', placeholder: 'optional' },
    ],
    enclosures: ['Letter of Permission / approval', 'Latest EOU returns and reports', 'Customs and import documents'],
  },
  {
    slug: 'corporate-law',
    chip: 'Company law',
    title: 'Corporate Law & Regulatory Services',
    docTitle: 'Company Law & MCA Compliance Request',
    fields: [
      { id: 'need', label: 'Requirement', type: 'select', options: ['Company incorporation', 'LLP formation', 'Corporate secretarial services', 'MCA compliance', 'Board meetings & statutory records', 'Corporate litigation support'] },
      { id: 'entity', label: 'Proposed / existing entity name', type: 'text', placeholder: 'e.g. Acme Pharma Pvt Ltd' },
      { id: 'people', label: 'Number of directors / partners', type: 'text', placeholder: 'e.g. 2' },
    ],
    enclosures: ['ID and address proof of directors / partners', '2–3 proposed company names', 'Proof of registered office address'],
  },
  {
    slug: 'corporate-finance-advisory',
    chip: 'Corporate finance',
    title: 'Corporate Finance Advisory',
    docTitle: 'Corporate Finance Advisory Request',
    fields: [
      { id: 'need', label: 'Requirement', type: 'select', options: ['Fund raising', 'Business plan preparation', 'Financial projections', 'Project finance', 'Business valuation', 'Intangible asset valuation', 'Mergers & acquisitions support'] },
      { id: 'sector', label: 'Industry / sector', type: 'text', placeholder: 'e.g. healthcare' },
      { id: 'size', label: 'Funding or deal size (optional)', type: 'text', placeholder: 'e.g. ₹10 crore' },
    ],
    enclosures: ['Business plan or pitch, if any', "Last 2–3 years' financial statements", 'Summary of the funding requirement'],
  },
  {
    slug: 'accounting-outsourcing',
    chip: 'Accounting',
    title: 'Accounting & Finance Outsourcing',
    docTitle: 'Accounting Outsourcing Brief',
    fields: [
      { id: 'need', label: 'Requirement', type: 'select', options: ['Accounting process management', 'Financial reporting', 'MIS reporting', 'Compliance monitoring', 'Virtual CFO services'] },
      { id: 'software', label: 'Accounting software in use', type: 'text', placeholder: 'e.g. Tally' },
      { id: 'volume', label: 'Approx. monthly transactions', type: 'text', placeholder: 'e.g. 500' },
    ],
    enclosures: ['Chart of accounts', 'Recent books / accounting software export', 'List of recurring compliances'],
  },
  {
    slug: 'other',
    chip: 'Something else',
    title: 'General enquiry',
    docTitle: 'Letter of Enquiry',
    fields: [],
    enclosures: [],
  },
];
