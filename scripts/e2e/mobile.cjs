const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const reduced of [false, true]) {
    const ctx = await b.newContext({
      ...devices['iPhone 13'],
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    const p = await ctx.newPage();
    await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
    const cdp = await ctx.newCDPSession(p);
    const swipe = async (x1, x2) => {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: x1, y: 400 }],
      });
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: (x1 + x2) / 2, y: 402 }],
      });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    await swipe(330, 60);
    await p.waitForTimeout(1200);
    const c1 = await p.evaluate(() => document.documentElement.dataset.cell);
    await swipe(60, 330);
    await p.waitForTimeout(1200);
    const c2 = await p.evaluate(() => document.documentElement.dataset.cell);
    console.log(
      reduced ? 'reduced' : 'normal',
      'after left swipe:',
      c1,
      '| after right swipe:',
      c2,
    );
    if (!reduced) await p.screenshot({ path: process.argv[2] || 'mobile.png' });
    await ctx.close();
  }
  await b.close();
})();
