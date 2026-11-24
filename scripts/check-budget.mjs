// Fails the build if the JavaScript shipped in dist/ exceeds the budget.
// Budget: 120 KB gzipped, fonts excluded (fonts are not JS anyway).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 120;
const dist = new URL('../dist/', import.meta.url).pathname;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

let files;
try {
  files = walk(dist).filter((f) => f.endsWith('.js'));
} catch {
  console.error('check-budget: dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

let total = 0;
for (const file of files) {
  const gz = gzipSync(readFileSync(file), { level: 9 }).length;
  total += gz;
  console.warn(`${(gz / 1024).toFixed(1).padStart(7)} KB  ${file.replace(dist, '')}`);
}
const kb = total / 1024;
console.warn(`${kb.toFixed(1).padStart(7)} KB  total JS (gzip) — budget ${BUDGET_KB} KB`);
if (kb > BUDGET_KB) {
  console.error('check-budget: over budget');
  process.exit(1);
}
