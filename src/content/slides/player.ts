import type { Site } from '../types';
import { esc, html, t } from '../html';

const icon = (d: string, extra = '') =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"${extra}><path d="${d}"/></svg>`;

const I = {
  prev: icon('M7 6v12M18 6l-8 6 8 6z'),
  next: icon('M17 6v12M6 6l8 6-8 6z'),
  play: icon('M8 5.5v13l11-6.5z'),
  pause: icon('M8 5v14M16 5v14'),
  vol: icon('M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11'),
  mute: icon('M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM16 9.5l5 5M21 9.5l-5 5'),
  close: icon('M6 6l12 12M18 6 6 18'),
};

export function renderPlayer(site: Site): string {
  const p = site.player;
  const l = (k: string) => esc(p[k] ?? '');
  return html`<div class="player" id="player" data-on="false" data-playing="false">
    <button
      class="player__toggle btn btn--icon glass glass--pill"
      type="button"
      aria-expanded="false"
      aria-controls="player-card"
      aria-label="${l('openLabel')}"
      data-label-open="${l('openLabel')}"
      data-label-close="${l('closeLabel')}"
    >
      <span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    </button>
    <div
      class="player__card glass glass--strong"
      id="player-card"
      role="dialog"
      aria-label="${l('toggleLabel')}"
      hidden
    >
      <button
        class="player__close btn btn--icon btn--ghost"
        type="button"
        data-p="close"
        aria-label="${l('closeLabel')}"
      >
        ${I.close}
      </button>
      <p
        class="mono mono--amber"
        data-status
        data-label-on="${l('nowPlaying')}"
        data-label-off="${l('off')}"
      >
        ${t(p.off ?? '')}
      </p>
      <p class="player__title subheading" data-title aria-live="polite"></p>
      <p class="player__artist mono mono--dim" data-artist></p>
      <div class="player__controls">
        <button class="btn btn--icon" type="button" data-p="prev" aria-label="${l('prev')}">
          ${I.prev}
        </button>
        <button
          class="btn btn--icon btn--charge player__play"
          type="button"
          data-p="play"
          aria-label="${l('play')}"
          data-label-play="${l('play')}"
          data-label-pause="${l('pause')}"
        >
          <span class="player__ic player__ic--play">${I.play}</span
          ><span class="player__ic player__ic--pause">${I.pause}</span>
        </button>
        <button class="btn btn--icon" type="button" data-p="next" aria-label="${l('next')}">
          ${I.next}
        </button>
        <button
          class="btn btn--icon"
          type="button"
          data-p="mute"
          aria-pressed="false"
          aria-label="${l('mute')}"
          data-label-mute="${l('mute')}"
          data-label-unmute="${l('unmute')}"
        >
          <span class="player__ic player__ic--vol">${I.vol}</span
          ><span class="player__ic player__ic--muted">${I.mute}</span>
        </button>
      </div>
      <label class="player__vol"
        ><span class="visually-hidden">${l('volume')}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value="0.7"
          data-p="volume"
          aria-label="${l('volume')}"
        />
      </label>
      <p class="mono mono--dim player__lib-title">${t(p.library ?? '')}</p>
      <ul class="player__list" data-list></ul>
      <p class="player__license mono mono--dim">
        <span>${t(p.license ?? '')}:</span> <span data-license></span>
        <a class="link" data-source target="_blank" rel="noopener noreferrer" hidden
          >${t(p.source ?? '')}</a
        >
      </p>
    </div>
  </div>`;
}
