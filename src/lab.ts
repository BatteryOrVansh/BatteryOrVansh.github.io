// Hidden design lab: every component on one page, for eyeballing changes.
import './styles/index.css';
import './styles/lab.css';
import { scribbles } from './content/scribbles';

const swatches: [string, string][] = [
  ['ink', '#110C0E'],
  ['oxblood', '#3B1219'],
  ['dusk', '#2B3A67'],
  ['bone', '#F2EAD8'],
  ['amber', '#FFB238'],
  ['ember', '#FF5A3C'],
];

const section = (n: string, title: string, body: string) => `
  <section class="lab-section">
    <header><span class="mono mono--amber">${n}</span><h2 class="subheading">${title}</h2></header>
    ${body}
  </section>`;

const chargeBar = (level: number, state = '') => `
  <nav class="charge" style="--level:${level}" ${state ? `data-level="${state}"` : ''} aria-label="Charge bar sample">
    <ol class="charge__cells">
      ${[0, 1, 2, 3, 4, 5]
        .map(
          (i) => `<li class="charge__item" style="--i:${i}">
            <a class="charge__cell" href="#" style="--i:${i}" ${i === Math.ceil(level) - 1 ? 'aria-current="step"' : ''}><span class="charge__fill"></span></a>
            <span class="charge__label mono">0${i} cell</span></li>`,
        )
        .join('')}
    </ol>
  </nav>`;

const root = document.getElementById('lab')!;
root.innerHTML = `
  <div class="atmos" aria-hidden="true">
    <span class="orb orb--oxblood"></span><span class="orb orb--dusk"></span>
    <span class="orb orb--ember"></span><span class="orb orb--amber"></span>
  </div>
  <div class="grain" aria-hidden="true"></div>
  <main class="lab-wrap">
    <header>
      <p class="caption">fig. lab — every part, no context</p>
      <h1 class="display">Design <em>lab</em></h1>
    </header>

    ${section(
      '01',
      'Palette',
      `<div class="lab-row">${swatches
        .map(
          ([n, h]) =>
            `<div class="lab-swatch" style="--c:${h}"><i></i><span class="mono">${n}</span><span class="mono mono--dim">${h}</span></div>`,
        )
        .join('')}</div>`,
    )}

    ${section(
      '02',
      'Type',
      `<div class="lab-type">
      <p class="display">Vansh Dixit</p>
      <p class="heading">Low on hype, <em>high</em> on reps.</p>
      <p class="subheading">Subheading in Fraunces text optical size</p>
      <p class="lede">Lede in Hanken Grotesk. Short, specific, first person.</p>
      <p class="body-copy">Body copy at step 0. I study computer science and spend a lot of time staring at messy CSVs until they confess.</p>
      <p class="mono">Martian Mono label · cell 02 / 06</p>
      <p class="caption">fig. 02 — numbered caption</p>
      <p class="body-copy">Placeholder: <span class="todo">TODO(Vansh): fill this in</span></p>
      <p class="numeral" aria-hidden="true">02</p>
    </div>`,
    )}

    ${section(
      '03',
      'Glass',
      `<div class="lab-row">
      <article class="glass lab-card"><span class="mono mono--dim">glass</span><p class="subheading">Default pane</p><p class="body-copy">Bone 7%, blur 24, saturate 140.</p></article>
      <article class="glass glass--strong lab-card" style="--spec:1;--mx:70%;--my:20%"><span class="mono mono--dim">glass--strong + specular</span><p class="subheading">Hot spot</p></article>
      <article class="glass glass--tight lab-card"><span class="mono mono--dim">glass--tight</span><p class="subheading">Tighter radius</p></article>
    </div>`,
    )}

    ${section(
      '04',
      'Controls',
      `<div class="lab-row">
      <button class="btn btn--charge" type="button"><span class="btn__magnet">Enter with sound</span></button>
      <button class="btn" type="button"><span class="btn__magnet">Enter silent</span></button>
      <button class="btn btn--ghost" type="button"><span class="btn__magnet">Skip intro</span></button>
      <a class="link" href="#">An underlined link</a>
    </div>`,
    )}

    ${section(
      '05',
      'Charge bar',
      `<div class="lab-type">
      ${chargeBar(1, 'low')}${chargeBar(3.5)}${chargeBar(6, 'full')}
    </div>`,
    )}

    ${section(
      '06',
      'Scribbles',
      `<div class="lab-row lab-scribbles">
      ${scribbles.underline()}${scribbles.arrow()}${scribbles.ring('scribble--ember')}${scribbles.bolt()}${scribbles.squiggle('scribble--bone')}
    </div>`,
    )}
  </main>`;
