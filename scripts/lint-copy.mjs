// Fails if content/site.json uses a banned word or placeholder filler.
import { readFileSync, existsSync } from 'node:fs';

const BANNED = [
  'passionate',
  'leverage',
  'seamless',
  'elevate',
  'cutting-edge',
  'crafting',
  'journey',
  'tapestry',
  'lorem',
  'ipsum',
];

const file = new URL('../content/site.json', import.meta.url);
if (!existsSync(file)) {
  console.warn('lint-copy: content/site.json not found, skipping');
  process.exit(0);
}
const text = readFileSync(file, 'utf8').toLowerCase();
const hits = BANNED.filter((word) => new RegExp(`\\b${word}`).test(text));
if (hits.length) {
  console.error(`lint-copy: banned words in content/site.json: ${hits.join(', ')}`);
  process.exit(1);
}
JSON.parse(text);
console.warn('lint-copy: content/site.json is clean');
