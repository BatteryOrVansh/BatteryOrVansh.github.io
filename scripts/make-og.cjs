// Renders the 1200x630 Open Graph image to public/og.jpg from content/site.json
// and the self-hosted fonts. Needs Playwright: node scripts/make-og.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.join(__dirname, '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
const font = (f) => 'file://' + path.join(root, 'public/fonts', f);
const { firstName, lastName, handle } = site.person;
const line = site.slides.boot.oneLiner;
const cells = site.order.length;

const html = `<!doctype html><html><head><style>
@font-face{font-family:F;src:url(${font('fraunces-var.woff2')});font-weight:100 900}
@font-face{font-family:Fi;src:url(${font('fraunces-var-italic.woff2')});font-weight:100 900;font-style:italic}
@font-face{font-family:H;src:url(${font('hanken-grotesk-var.woff2')});font-weight:100 900}
@font-face{font-family:M;src:url(${font('martian-mono-400.woff2')})}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#110C0E;position:relative;overflow:hidden;color:#F2EAD8}
.o{position:absolute;border-radius:50%}
.o1{width:900px;height:900px;left:420px;top:-380px;background:radial-gradient(circle,rgba(120,30,44,.8),rgba(120,30,44,0) 68%)}
.o2{width:620px;height:620px;left:-160px;top:330px;background:radial-gradient(circle,rgba(255,90,60,.34),rgba(255,90,60,0) 68%)}
.o3{width:780px;height:780px;left:640px;top:240px;background:radial-gradient(circle,rgba(62,82,150,.55),rgba(62,82,150,0) 68%)}
.wrap{position:absolute;inset:0;padding:60px 72px 56px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;gap:20px;font:400 20px M;letter-spacing:.08em;text-transform:uppercase;color:rgba(242,234,216,.7)}
.bar{display:flex;gap:6px;padding:6px;border:1px solid rgba(242,234,216,.25);border-radius:9px}
.bar i{display:block;width:56px;height:16px;border-radius:4px;background:#FFB238}
.bar i:first-child{background:#FF5A3C}.bar i:last-child{background:rgba(242,234,216,.1)}
h1{font:300 168px/0.86 F;letter-spacing:-.045em;font-variation-settings:'SOFT' 100,'WONK' 1,'opsz' 144}
h1 em{display:block;margin-left:130px;font-family:Fi;color:#FFB238;font-variation-settings:'SOFT' 100,'WONK' 1,'opsz' 144}
p{font:400 28px/1.35 H;max-width:940px;color:#F2EAD8}
.tag{font:400 20px M;letter-spacing:.08em;text-transform:uppercase;color:#FFB238}
</style></head><body>
<div class="o o1"></div><div class="o o2"></div><div class="o o3"></div>
<div class="wrap">
  <div class="top"><div class="bar">${'<i></i>'.repeat(cells)}</div><span>${handle}</span></div>
  <div><h1>${firstName}<em>${lastName}</em></h1></div>
  <div><p>${line}</p></div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  // a real file (not setContent) so the file:// fonts are allowed to load
  const tmp = path.join(os.tmpdir(), 'bov-og.html');
  fs.writeFileSync(tmp, html);
  await p.goto('file://' + tmp, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const out = path.join(root, 'public/og.jpg');
  await p.screenshot({ path: out, type: 'jpeg', quality: 86 });
  console.log('og.jpg', fs.statSync(out).size, 'bytes');
  await b.close();
})();
