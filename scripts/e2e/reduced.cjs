// Reduced-motion audit: nothing should move; everything should still work.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('bov:v1', JSON.stringify({ seen: true }));
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__audio = this;
      return play.call(this);
    };
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const running = () =>
    p.evaluate(() =>
      document
        .getAnimations()
        .filter(
          (a) =>
            a.playState === 'running' &&
            !(
              a.effect &&
              a.effect.target &&
              a.effect.target.closest &&
              a.effect.target.closest('.cursor')
            ),
        )
        .map(
          (a) =>
            (a.animationName || a.transitionProperty || 'anim') +
            '@' +
            (a.effect && a.effect.target
              ? a.effect.target.className || a.effect.target.tagName
              : '?'),
        )
        .slice(0, 8),
    );
  console.log('running CSS animations on load:', JSON.stringify(await running()));
  console.log('cursor element:', await p.evaluate(() => !!document.querySelector('.cursor')));
  console.log(
    'ready + visible at once:',
    await p.evaluate(
      () =>
        document.documentElement.classList.contains('is-ready') &&
        getComputedStyle(document.querySelector('.cell.is-active .cell__inner')).opacity,
    ),
  );
  // move the pointer over a panel: no tilt transform
  await p.goto('http://localhost:4173/#work', { waitUntil: 'networkidle' });
  await p.mouse.move(400, 360);
  await p.mouse.move(440, 380);
  await p.waitForTimeout(400);
  console.log(
    'panel transform after hover:',
    await p.evaluate(() => document.querySelector('.panel').style.transform || '(none)'),
  );
  // cell change: crossfade, no sliding track tween left running
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(80);
  console.log(
    'track transform right after nav (should already be at rest position):',
    await p.evaluate(() => document.querySelector('.deck__track').style.transform),
  );
  await p.waitForTimeout(500);
  // player card: opens by crossfade, no scale transform; eq bars static while playing
  await p.click('.player__toggle');
  await p.waitForTimeout(60);
  const mid = await p.evaluate(() => {
    const c = document.querySelector('.player__card');
    return { transform: c.style.transform || '(none)', hidden: c.hidden };
  });
  await p.waitForTimeout(400);
  console.log(
    'player card 60ms in:',
    JSON.stringify(mid),
    '| opacity at rest:',
    await p.evaluate(() => getComputedStyle(document.querySelector('.player__card')).opacity),
  );
  await p.click('[data-p="play"]');
  await p.waitForTimeout(1500);
  const eq = await p.evaluate(() => ({
    playing: document.getElementById('player').dataset.playing,
    anim: [...document.querySelectorAll('.eq i')].map((i) => getComputedStyle(i).animationName),
  }));
  console.log('equalizer while playing:', JSON.stringify(eq));
  await p.keyboard.press('Escape');
  await p.waitForTimeout(500);
  console.log(
    'card closed:',
    await p.evaluate(() => document.querySelector('.player__card').hidden),
  );
  // project detail by crossfade
  await p.goto('http://localhost:4173/#work', { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  await p.click('[data-open="this-site"]');
  await p.waitForTimeout(60);
  console.log(
    'detail transform 60ms in:',
    await p.evaluate(() => document.querySelector('#detail-this-site').style.transform || '(none)'),
  );
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
