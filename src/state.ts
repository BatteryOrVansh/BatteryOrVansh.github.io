// Tiny persisted state. localStorage can throw or be empty (private windows,
// blocked storage), so every access is wrapped and the site works without it.

export interface Saved {
  seen: boolean; // intro already shown
  sound: 'on' | 'off' | null; // the Boot gate choice
  song: string | null; // last song file
  volume: number; // 0..1
  muted: boolean;
}

const KEY = 'bov:v1';
const DEFAULTS: Saved = { seen: false, sound: null, song: null, volume: 0.7, muted: false };

export function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Saved>) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function save(patch: Partial<Saved>): Saved {
  const next = { ...load(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: fine */
  }
  return next;
}
