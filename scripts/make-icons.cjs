// Renders public/favicon.svg to the PNG sizes the site links to.
// Needs Playwright (already in the dev sandbox): node scripts/make-icons.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const pub = path.join(__dirname, '..', 'public');
const svg = fs.readFileSync(path.join(pub, 'favicon.svg'), 'utf8');
const sizes = { 'favicon-32.png': 32, 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512 };

(async () => {
  const b = await chromium.launch();
  for (const [file, size] of Object.entries(sizes)) {
    const p = await b.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await p.setContent(
      `<body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`,
    );
    await p.screenshot({ path: path.join(pub, file), omitBackground: true });
    await p.close();
    console.log(file, fs.statSync(path.join(pub, file)).size, 'bytes');
  }
  await b.close();
})();
