const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] || '.';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__audio = this;
      return play.call(this);
    };
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  const st = () =>
    p.evaluate(() => ({
      on: document.getElementById('player').dataset.on,
      playing: document.getElementById('player').dataset.playing,
      title: document.querySelector('[data-title]').textContent,
      t: window.__audio ? Math.round(window.__audio.currentTime * 10) / 10 : null,
      paused: window.__audio ? window.__audio.paused : null,
      saved: JSON.parse(localStorage.getItem('bov:v1') || '{}'),
    }));
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await p.click('[data-skip]');
  await p.waitForTimeout(800);
  await p.click('[data-enter="on"]');
  await p.waitForTimeout(1500);
  console.log('after Enter with sound:', JSON.stringify(await st()));
  await p.waitForTimeout(1200);
  const gain = await p.evaluate(() => window.__audio && !window.__audio.paused);
  console.log('audio running:', gain);
  await p.click('.player__toggle');
  await p.waitForTimeout(900);
  await p.screenshot({ path: out + '/p-open.png' });
  console.log('aria-expanded:', await p.getAttribute('.player__toggle', 'aria-expanded'));
  await p.click('[data-p="mute"]');
  console.log(
    'muted:',
    await p.getAttribute('[data-p="mute"]', 'aria-pressed'),
    '| label:',
    await p.getAttribute('[data-p="mute"]', 'aria-label'),
  );
  await p.click('[data-p="mute"]');
  await p.fill('[data-p="volume"]', '0.3');
  console.log('volume saved:', (await st()).saved.volume);
  await p.click('[data-p="next"]');
  await p.waitForTimeout(3500);
  console.log('after next:', JSON.stringify(await st()));
  await p.keyboard.press('ArrowRight');
  console.log(
    'arrow in card keeps cell:',
    await p.evaluate(() => document.documentElement.dataset.cell),
  );
  await p.mouse.click(300, 500);
  await p.waitForTimeout(900);
  console.log(
    'outside click closed:',
    await p.evaluate(() => document.querySelector('.player__card').hidden),
  );
  await p.click('.player__toggle');
  await p.waitForTimeout(700);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(900);
  console.log(
    'Esc closed + focus on toggle:',
    await p.evaluate(() => document.querySelector('.player__card').hidden),
    await p.evaluate(() => document.activeElement.className.includes('player__toggle')),
  );
  await p.click('.player__toggle');
  await p.waitForTimeout(600);
  await p.click('[data-p="play"]');
  await p.waitForTimeout(1600);
  console.log('after switched off:', JSON.stringify(await st()));
  await p.click('[data-p="play"]');
  await p.waitForTimeout(1500);
  console.log('back on:', JSON.stringify(await st()));
  // returning visit
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  console.log('returning, before interaction:', JSON.stringify(await st()));
  await p.keyboard.press('Tab');
  await p.waitForTimeout(2500);
  console.log('returning, after first key:', JSON.stringify(await st()));
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
