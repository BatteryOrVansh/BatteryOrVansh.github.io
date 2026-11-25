/* global rec */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const shot = process.argv[2] || 'intro.png';
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  const q = (sel) => p.evaluate((s) => !!document.querySelector(s), sel);
  console.log(
    'first visit intro shown:',
    await q('#intro'),
    '| deck inert:',
    await p.evaluate(() => document.querySelector('.deck').inert),
  );
  await p.waitForTimeout(1200);
  await p.screenshot({ path: shot.replace('.png', '-charging.png') });
  await p.click('[data-skip]');
  await p.waitForTimeout(900);
  await p.screenshot({ path: shot });
  console.log(
    'ready, focus on:',
    await p.evaluate(() => document.activeElement.textContent.trim()),
  );
  const events = [];
  await p.exposeFunction('rec', (d) => events.push(d));
  await p.evaluate(() => document.addEventListener('intro:done', (e) => rec(e.detail)));
  await p.click('[data-enter="on"]');
  await p.waitForTimeout(1000);
  console.log(
    'event:',
    JSON.stringify(events),
    '| intro removed:',
    !(await q('#intro')),
    '| deck inert:',
    await p.evaluate(() => document.querySelector('.deck').inert),
    '| saved:',
    await p.evaluate(() => localStorage.getItem('bov:v1')),
  );
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(1000);
  console.log('nav after intro ->', await p.evaluate(() => document.documentElement.dataset.cell));
  await p.reload({ waitUntil: 'networkidle' });
  console.log('return visit intro shown:', await q('#intro'));
  const p2 = await ctx.newPage();
  await ctx.clearCookies();
  await p2.addInitScript(() => localStorage.clear());
  await p2.goto('http://localhost:4173/#work', { waitUntil: 'networkidle' });
  console.log(
    'deep link (fresh) intro shown:',
    await p2.evaluate(
      () =>
        !!document.getElementById('intro') &&
        document.documentElement.classList.contains('has-intro'),
    ),
  );
  const rctx = await b.newContext({ reducedMotion: 'reduce' });
  const p3 = await rctx.newPage();
  await p3.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  console.log(
    'reduced motion ready immediately:',
    await p3.evaluate(() => document.getElementById('intro').classList.contains('is-ready')),
  );
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
