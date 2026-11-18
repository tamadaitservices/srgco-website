// Minimal iCalendar (.ics) builder for appointment invites.
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const fold = (line: string) => (line.length <= 74 ? line : line.match(/.{1,73}/g)!.join('\r\n '));

export function buildIcs(o: {
  uid: string; start: Date; end: Date; summary: string; description: string; location: string;
  organizer: string; attendees: { email: string; name?: string }[]; method: 'REQUEST' | 'PUBLISH';
}) {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//S.R. Garimella & Co.//Appointments//EN', 'CALSCALE:GREGORIAN', `METHOD:${o.method}`,
    'BEGIN:VEVENT', `UID:${o.uid}`, `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(o.start)}`, `DTEND:${utc(o.end)}`,
    `SUMMARY:${esc(o.summary)}`, `DESCRIPTION:${esc(o.description)}`, `LOCATION:${esc(o.location)}`, 'STATUS:TENTATIVE', 'SEQUENCE:0',
    `ORGANIZER;CN=S.R. Garimella & Co.:mailto:${o.organizer}`,
    ...o.attendees.map((a) => `ATTENDEE;CN=${esc(a.name || a.email)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${a.email}`),
    'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', 'DESCRIPTION:Appointment reminder', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n');
}
