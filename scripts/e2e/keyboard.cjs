// Keyboard-only walkthrough: prints the focus order and checks key behaviours.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => localStorage.setItem('bov:v1', JSON.stringify({ seen: true })));
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  const who = () =>
    p.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return 'BODY';
      const cs = getComputedStyle(a);
      const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const name =
        a.getAttribute('aria-label') || (a.textContent || '').trim().slice(0, 28) || a.tagName;
      return `${a.tagName.toLowerCase()}:${name}${ring ? '' : '  [NO FOCUS RING]'}`;
    });
  const order = [];
  for (let i = 0; i < 22; i++) {
    await p.keyboard.press('Tab');
    order.push(await who());
  }
  console.log('Tab order from top:\n  ' + order.join('\n  '));
  const hidden = await p.evaluate(
    () =>
      [
        ...document.querySelectorAll('.cell:not(.is-active) a, .cell:not(.is-active) button'),
      ].filter((e) => e.tabIndex >= 0 && !e.closest('[inert]')).length,
  );
  console.log('focusable controls in off-screen cells:', hidden);
  // skip link
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.keyboard.press('Tab');
  console.log('first Tab:', await who());
  await p.keyboard.press('Enter');
  console.log('after skip link, focus:', await who());
  // arrow navigation and heading focus
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(1200);
  console.log(
    'ArrowRight ->',
    await p.evaluate(() => document.documentElement.dataset.cell),
    '| focus:',
    await who(),
    '| live:',
    await p.evaluate(() => document.getElementById('announcer').textContent),
  );
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(1200);
  // open a project with Enter, Esc closes, focus returns
  await p.keyboard.press('Tab');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(1200);
  const d = await p.evaluate(() => ({
    open: !!document.querySelector('.detail.is-open'),
    focus: document.activeElement.getAttribute('aria-label'),
  }));
  console.log('Enter on panel:', JSON.stringify(d));
  await p.keyboard.press('ArrowRight');
  console.log(
    'ArrowRight while detail open stays on:',
    await p.evaluate(() => document.documentElement.dataset.cell),
  );
  await p.keyboard.press('Escape');
  await p.waitForTimeout(1000);
  console.log('Esc -> focus back on:', await who());
  // player by keyboard
  await p.keyboard.press('Home');
  await p.waitForTimeout(1000);
  await p.focus('.player__toggle');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(900);
  console.log('player open, focus:', await who());
  for (let i = 0; i < 8; i++) {
    await p.keyboard.press('Tab');
  }
  console.log('after 8 Tabs inside card:', await who());
  await p.keyboard.press('Escape');
  await p.waitForTimeout(800);
  console.log(
    'Esc closes player -> focus:',
    await who(),
    '| expanded:',
    await p.getAttribute('.player__toggle', 'aria-expanded'),
  );
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
