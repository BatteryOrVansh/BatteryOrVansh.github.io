// Music engine. HTMLAudioElement (streamed, so files stay small) routed through
// Web Audio: element -> fadeGain -> volumeGain -> speakers. GainNodes do the
// volume and fades because iOS Safari ignores audio.volume.
//
// Rules: every song starts at its startAt (default 10 s; 0 if the track is
// shorter), fades in over ~2 s, loops back to startAt, and fades out over ~1 s
// when the song changes, music is switched off, or the page is hidden/unloaded.
import { load, save } from '../state';

export interface Track {
  title: string;
  artist: string;
  file: string;
  startAt?: number;
  license: string;
  sourceUrl?: string;
}

export interface PlayerState {
  tracks: Track[];
  index: number;
  /** the listener wants music on (may be briefly false-playing: loading, tab hidden) */
  on: boolean;
  playing: boolean;
  volume: number;
  muted: boolean;
}

const FADE_IN = 2;
const FADE_OUT = 1;
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

type Listener = (s: PlayerState) => void;

export class Engine {
  private ctx: AudioContext | null = null;
  private el: HTMLAudioElement | null = null;
  private fade: GainNode | null = null;
  private master: GainNode | null = null;
  private listeners = new Set<Listener>();
  private token = 0; // bumps on every track change so stale loads are ignored
  private startAt = 0;
  private hiddenPause = false;
  state: PlayerState = {
    tracks: [],
    index: 0,
    on: false,
    playing: false,
    volume: 0.7,
    muted: false,
  };

  constructor() {
    const saved = load();
    this.state.volume = saved.volume;
    this.state.muted = saved.muted;
    document.addEventListener('visibilitychange', () => this.onVisibility());
    window.addEventListener('pagehide', () => this.quickSilence());
    window.addEventListener('beforeunload', () => this.quickSilence());
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  private emit(patch: Partial<PlayerState> = {}): void {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn(this.state));
  }

  /** fetch library.json once; picks the last-played song if it still exists */
  async loadLibrary(): Promise<void> {
    if (this.state.tracks.length) return;
    try {
      const res = await fetch(`${BASE}/music/library.json`);
      const tracks = (await res.json()) as Track[];
      const last = load().song;
      const found = tracks.findIndex((t) => t.file === last);
      this.emit({ tracks, index: found >= 0 ? found : 0 });
    } catch {
      this.emit({ tracks: [] });
    }
  }

  private graph(): { ctx: AudioContext; el: HTMLAudioElement; fade: GainNode; master: GainNode } {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.el = new Audio();
      this.el.preload = 'auto';
      this.el.setAttribute('playsinline', '');
      const src = this.ctx.createMediaElementSource(this.el);
      this.fade = this.ctx.createGain();
      this.fade.gain.value = 0;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.level();
      src.connect(this.fade).connect(this.master).connect(this.ctx.destination);
      this.el.addEventListener('ended', () => this.onEnded());
    }
    return { ctx: this.ctx, el: this.el!, fade: this.fade!, master: this.master! };
  }

  /** perceptual volume curve; muted is exactly silent */
  private level(): number {
    return this.state.muted ? 0 : this.state.volume ** 2;
  }

  private ramp(node: GainNode, target: number, seconds: number): void {
    const { currentTime: t } = node.context;
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(node.gain.value, t);
    node.gain.linearRampToValueAtTime(target, t + Math.max(seconds, 0.01));
  }

  /** must be called from a user gesture the first time */
  async start(index?: number): Promise<void> {
    await this.loadLibrary();
    if (!this.state.tracks.length) return;
    const { ctx } = this.graph();
    await ctx.resume().catch(() => undefined);
    this.emit({ on: true });
    save({ sound: 'on' });
    await this.playTrack(index ?? this.state.index, false);
  }

  /** switch the music off with a ~1 s fade out */
  async stop(): Promise<void> {
    this.emit({ on: false });
    save({ sound: 'off' });
    await this.fadeOutAndPause();
  }

  async next(): Promise<void> {
    await this.step(1);
  }

  async prev(): Promise<void> {
    await this.step(-1);
  }

  private async step(dir: number): Promise<void> {
    const n = this.state.tracks.length;
    if (!n) return;
    await this.start((this.state.index + dir + n) % n);
  }

  private async playTrack(index: number, keepPosition: boolean): Promise<void> {
    const { el, fade } = this.graph();
    const my = ++this.token;
    const track = this.state.tracks[index];
    if (!track) return;

    // fade the old song out first (if one is audible), then swap
    if (this.state.playing && !keepPosition) await this.fadeOutAndPause(my);
    if (my !== this.token) return;

    this.emit({ index });
    save({ song: track.file });

    if (!keepPosition) {
      el.src = `${BASE}/music/${track.file}`;
      el.load();
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        el.addEventListener('loadedmetadata', done, { once: true });
        el.addEventListener('error', done, { once: true });
        window.setTimeout(done, 8000);
      });
      if (my !== this.token) return;
      const wanted = track.startAt ?? 10;
      this.startAt = el.duration > 10 && wanted < el.duration ? wanted : 0;
      el.currentTime = this.startAt;
    }

    fade.gain.cancelScheduledValues(fade.context.currentTime);
    fade.gain.setValueAtTime(0, fade.context.currentTime);
    try {
      await el.play();
    } catch {
      // autoplay blocked: stay "on" and wait for the next gesture (see armGesture)
      this.emit({ playing: false });
      return;
    }
    if (my !== this.token) return;
    this.ramp(fade, 1, FADE_IN);
    this.emit({ playing: true });
  }

  private async fadeOutAndPause(myToken = ++this.token): Promise<void> {
    const el = this.el;
    const fade = this.fade;
    if (!el || !fade || el.paused) {
      this.emit({ playing: false });
      return;
    }
    this.ramp(fade, 0, FADE_OUT);
    await new Promise((r) => window.setTimeout(r, FADE_OUT * 1000 + 40));
    if (myToken !== this.token) return;
    el.pause();
    this.emit({ playing: false });
  }

  private onEnded(): void {
    // loop back to the start point with a short fade so there is no click
    const { el, fade } = this.graph();
    if (!this.state.on) return;
    el.currentTime = this.startAt;
    fade.gain.setValueAtTime(0, fade.context.currentTime);
    void el.play().then(() => this.ramp(fade, 1, 0.8));
  }

  setVolume(v: number): void {
    const volume = Math.min(1, Math.max(0, v));
    this.emit({ volume });
    save({ volume });
    this.applyLevel();
  }

  setMuted(muted: boolean): void {
    this.emit({ muted });
    save({ muted });
    this.applyLevel();
  }

  private applyLevel(): void {
    if (this.master) this.ramp(this.master, this.level(), 0.08);
  }

  /** tab hidden: fade out and pause; visible again: fade back in from the same spot */
  private onVisibility(): void {
    if (document.hidden) {
      if (this.state.on && this.state.playing) {
        this.hiddenPause = true;
        void this.fadeOutAndPause();
      }
    } else if (this.hiddenPause) {
      this.hiddenPause = false;
      if (this.state.on) void this.ctx?.resume().then(() => this.playTrack(this.state.index, true));
    }
  }

  /** best effort during refresh/close: the browser may stop the page before it finishes */
  private quickSilence(): void {
    if (this.fade && this.state.playing) {
      const { currentTime: t } = this.fade.context;
      this.fade.gain.cancelScheduledValues(t);
      this.fade.gain.setTargetAtTime(0, t, 0.12);
    }
  }

  /** start on the first user interaction (returning visitors who chose sound) */
  armGesture(): void {
    const go = () => {
      off();
      if (!this.state.on || !this.state.playing) void this.start();
    };
    const events = ['pointerdown', 'click', 'keydown', 'touchend'] as const;
    const off = () => events.forEach((e) => window.removeEventListener(e, go, true));
    events.forEach((e) => window.addEventListener(e, go, { capture: true, once: false }));
  }
}
