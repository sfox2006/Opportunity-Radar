#!/usr/bin/env node
// Prints Opening-tab cards whose opensOn date is today or earlier.
// Exit 1 when fresh verification is due; this never promotes a record automatically.
const fs = require('node:fs');
const path = require('node:path');

function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function loadOpeningSoon(appPath = path.join(__dirname, '..', 'dist', 'app.js')) {
  const source = fs.readFileSync(appPath, 'utf8');
  const start = source.indexOf('const openingSoon = ');
  const end = source.indexOf('const openStatuses');
  if (start < 0 || end < 0) throw new Error('Could not find openingSoon in dist/app.js');
  const json = source.slice(start + 'const openingSoon = '.length, end).trim().replace(/;$/, '');
  return JSON.parse(json);
}

function openingDue(records, today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return records.filter((item) => {
    const opens = parseIsoDate(item && item.opensOn);
    return opens && opens.getTime() <= start.getTime();
  });
}

function report(due) {
  if (!due.length) return 'Opening tab: no opensOn date is today or in the past.';
  const lines = ['Reverify these openingSoon cards before publishing as Open. Their opensOn date is today or in the past:'];
  for (const item of due) lines.push(`- ${item.id} opensOn ${item.opensOn}`);
  return lines.join('\n');
}

if (require.main === module) {
  const due = openingDue(loadOpeningSoon(), new Date());
  console.log(report(due));
  process.exit(due.length ? 1 : 0);
}

module.exports = { parseIsoDate, loadOpeningSoon, openingDue, report };
