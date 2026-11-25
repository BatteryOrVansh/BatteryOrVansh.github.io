// Player UI: wires the server-rendered markup to the engine. The toggle button
// (equalizer) expands into the card with a FLIP animation.
import { collapseTo, expandFrom } from '../motion/flip';
import { load } from '../state';
import type { Engine, PlayerState } from './engine';

export function initPlayerUi(engine: Engine): void {
  const root = document.getElementById('player');
  if (!root) return;
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const toggle = $<HTMLButtonElement>('.player__toggle');
  const card = $<HTMLElement>('.player__card');
  const title = $('[data-title]');
  const artist = $('[data-artist]');
  const status = $('[data-status]');
  const list = $<HTMLUListElement>('[data-list]');
  const license = $('[data-license]');
  const sourceSlot = $('[data-source-slot]');
  const play = $<HTMLButtonElement>('[data-p="play"]');
  const mute = $<HTMLButtonElement>('[data-p="mute"]');
  const vol = $<HTMLInputElement>('[data-p="volume"]');
  let open = false;
  let builtFor = -1;

  const setOpen = (next: boolean, restoreFocus = true) => {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    toggle.setAttribute('aria-label', toggle.dataset[next ? 'labelClose' : 'labelOpen'] ?? '');
    if (next) {
      void engine.loadLibrary();
      card.hidden = false;
      expandFrom(toggle, card);
      card.querySelector<HTMLElement>('[data-p="play"]')?.focus({ preventScroll: true });
    } else {
      collapseTo(toggle, card, () => (card.hidden = true));
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));
  $('[data-p="close"]').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  });
  // click or focus outside collapses it
  document.addEventListener('pointerdown', (e) => {
    if (open && !root.contains(e.target as Node)) setOpen(false, false);
  });
  document.addEventListener('focusin', (e) => {
    if (open && !root.contains(e.target as Node)) setOpen(false, false);
  });

  play.addEventListener('click', () => {
    const s = engine.state;
    if (s.on) void engine.stop();
    else void engine.start();
  });
  $('[data-p="prev"]').addEventListener('click', () => void engine.prev());
  $('[data-p="next"]').addEventListener('click', () => void engine.next());
  mute.addEventListener('click', () => engine.setMuted(!engine.state.muted));
  vol.addEventListener('input', () => {
    engine.setVolume(Number(vol.value));
    if (engine.state.muted && Number(vol.value) > 0) engine.setMuted(false);
  });

  const buildList = (s: PlayerState) => {
    if (builtFor === s.tracks.length) return;
    builtFor = s.tracks.length;
    list.replaceChildren(
      ...s.tracks.map((t, i) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'player__song';
        b.dataset.i = String(i);
        b.innerHTML = '<span class="mono mono--amber"></span><span></span>';
        b.children[0]!.textContent = String(i + 1).padStart(2, '0');
        b.children[1]!.textContent = t.title;
        b.addEventListener('click', () => {
          const cur = engine.state;
          if (cur.index === i && cur.on && cur.playing) return;
          void engine.start(i);
        });
        li.append(b);
        return li;
      }),
    );
  };

  const saved = load();
  vol.value = String(saved.volume);

  engine.subscribe((s) => {
    root.dataset.on = String(s.on);
    root.dataset.playing = String(s.playing);
    buildList(s);
    const t = s.tracks[s.index];
    title.textContent = t?.title ?? '';
    artist.textContent = t?.artist ?? '';
    status.textContent = (s.on ? status.dataset.labelOn : status.dataset.labelOff) ?? '';
    license.textContent = t?.license ?? '';
    sourceSlot.replaceChildren();
    if (t?.sourceUrl) {
      const a = document.createElement('a');
      a.className = 'link';
      a.href = t.sourceUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = sourceSlot.dataset.label ?? '';
      sourceSlot.append(a);
    }
    play.setAttribute('aria-label', play.dataset[s.on ? 'labelPause' : 'labelPlay'] ?? '');
    mute.setAttribute('aria-pressed', String(s.muted));
    mute.setAttribute('aria-label', mute.dataset[s.muted ? 'labelUnmute' : 'labelMute'] ?? '');
    mute.dataset.muted = String(s.muted);
    vol.value = String(s.volume);
    vol.style.setProperty('--fill', `${Math.round(s.volume * 100)}%`);
    list.querySelectorAll<HTMLElement>('.player__song').forEach((b, i) => {
      if (i === s.index) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  });
}
