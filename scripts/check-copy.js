/* Scans user-facing source for banned prototype messaging, lorem ipsum and emoji.
   Usage: npm run lint:copy */
const fs = require('fs');
const path = require('path');

const BANNED = [
  /will be implemented/i, /backend/i, /coming soon/i, /demo/i, /prototype/i, /placeholder text/i,
  /this is a placeholder/i, /mock data/i, /for demonstration/i, /under development/i, /not connected/i,
  /lorem/i, /ipsum/i, /\bTODO\b/, /\bFIXME\b/,
];
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]/u;

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(f)) out.push(p);
  }
  return out;
}

let problems = 0;
for (const file of [...walk('src'), 'App.tsx']) {
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return; // comments are not user-facing
    for (const re of BANNED) if (re.test(line)) { console.log(`${file}:${i + 1}  banned phrase ${re}  →  ${t.slice(0, 90)}`); problems++; }
    if (EMOJI.test(line)) { console.log(`${file}:${i + 1}  emoji found  →  ${t.slice(0, 90)}`); problems++; }
  });
}
console.log(problems === 0 ? 'Copy check passed: no banned phrases, placeholders or emoji.' : `${problems} problem(s) found.`);
process.exit(problems ? 1 : 0);
