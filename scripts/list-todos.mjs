// Lists every TODO(Vansh) placeholder in content/site.json with its JSON path.
// `node scripts/list-todos.mjs --md` prints the Markdown used in CONTENT_TODO.md.
import { readFileSync } from 'node:fs';

const site = JSON.parse(readFileSync(new URL('../content/site.json', import.meta.url), 'utf8'));
const found = [];

(function walk(node, path) {
  if (typeof node === 'string') {
    if (node.includes('TODO(Vansh)')) found.push({ path, text: node });
  } else if (Array.isArray(node)) {
    node.forEach((child, i) => walk(child, `${path}[${i}]`));
  } else if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) walk(child, path ? `${path}.${key}` : key);
  }
})(site, '');

if (process.argv.includes('--md')) {
  for (const { path, text } of found) {
    console.log(`- [ ] \`${path}\` — ${text.replace(/^TODO\(Vansh\):\s*/, '')}`);
  }
} else {
  for (const { path, text } of found) console.warn(`${path}: ${text}`);
  console.warn(`\n${found.length} TODO(Vansh) placeholders in content/site.json`);
}
