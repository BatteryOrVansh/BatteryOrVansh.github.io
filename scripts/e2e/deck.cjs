const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:4173/#about', { waitUntil: 'networkidle' });
  const st = () =>
    p.evaluate(() => ({
      cell: document.documentElement.dataset.cell,
      hash: location.hash,
      level: document.querySelector('.charge').style.getPropertyValue('--level'),
      inert: [...document.querySelectorAll('.cell')].filter((c) => !c.inert).map((c) => c.id),
      focus: document.activeElement.className || document.activeElement.tagName,
      live: document.getElementById('announcer').textContent,
    }));
  console.log('deeplink', JSON.stringify(await st()));
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(1100);
  console.log('right', JSON.stringify(await st()));
  await p.mouse.move(600, 400);
  await p.mouse.wheel(0, 120);
  await p.waitForTimeout(1100);
  console.log('wheel', JSON.stringify(await st()));
  await p.click('.charge__cell[href="#contact"]', { force: true });
  await p.waitForTimeout(1500);
  console.log('click contact', JSON.stringify(await st()));
  await p.goBack();
  await p.waitForTimeout(1500);
  console.log('back', JSON.stringify(await st()));
  await p.keyboard.press('Home');
  await p.waitForTimeout(1200);
  console.log('home', JSON.stringify(await st()));
  await p.screenshot({ path: process.argv[2] || 'deck.png' });
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
