#!/usr/bin/env python3
"""Generate three short, original ambient demo tracks into public/music.

Pure numpy synthesis (no samples, no downloads), so the music player works on
day one and the tracks are original, license-free work.

Each track: soft detuned pads on a slow chord loop, a gentle sine "bell" line,
and a little filtered noise. About 64 s long (so the 10 s start point matters),
44.1 kHz stereo, normalised, with a short fade at both ends.

Output: MP3 (128 kbps) if ffmpeg is installed, otherwise 16-bit WAV (kept under
4 MB by dropping to 22.05 kHz mono if needed). Also writes library.json.

    python3 scripts/make_demo_tracks.py
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = 64.0
OUT = Path(__file__).resolve().parent.parent / "public" / "music"

NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def midi(name: str, octave: int) -> float:
    base = NOTE[name[0]] + (1 if name.endswith("#") else 0) - (1 if name.endswith("b") else 0)
    return 12 * (octave + 1) + base


def hz(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def env(n: int, attack: float, release: float) -> np.ndarray:
    a, r = int(attack * SR), int(release * SR)
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** 2
    e[n - r :] *= np.linspace(1, 0, r) ** 2
    return e


def pad(freq: float, n: int, rng: np.random.Generator) -> np.ndarray:
    t = np.arange(n) / SR
    out = np.zeros(n)
    for detune in (-7, -2, 3, 8):  # cents
        f = freq * 2 ** (detune / 1200)
        out += np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28))
        out += 0.3 * np.sin(2 * np.pi * 2 * f * t + rng.uniform(0, 6.28))
    # slow tremolo so it breathes
    out *= 0.85 + 0.15 * np.sin(2 * np.pi * rng.uniform(0.05, 0.14) * t + rng.uniform(0, 6.28))
    return out / 5


def bell(freq: float, n: int) -> np.ndarray:
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.01 * t)
    return tone * np.exp(-t * 1.6) * (1 - np.exp(-t * 200))


def lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):  # simple one-pole; fine for noise bed length
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def render(chords: list[list[str]], melody: list[tuple[str, int]], tempo_bars: float, seed: int,
           bell_gain: float, noise_gain: float) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n_total = int(DUR * SR)
    left = np.zeros(n_total)
    right = np.zeros(n_total)
    bar = tempo_bars  # seconds per chord
    pos = 0.0
    ci = 0
    while pos < DUR:
        n = int(min(bar * 1.35, DUR - pos + 1) * SR)  # overlap into the next chord
        start = int(pos * SR)
        for note in chords[ci % len(chords)]:
            name, octave = note[:-1], int(note[-1])
            sig = pad(hz(midi(name, octave)), n, rng) * env(n, 2.2, 2.8)
            pan = rng.uniform(0.3, 0.7)
            end = min(start + n, n_total)
            left[start:end] += sig[: end - start] * (1 - pan)
            right[start:end] += sig[: end - start] * pan
        pos += bar
        ci += 1

    # sparse bell line
    step = bar / 2
    t = 3.0
    mi = 0
    while t < DUR - 4:
        name, octave = melody[mi % len(melody)][0][:-1], int(melody[mi % len(melody)][0][-1])
        n = int(4.5 * SR)
        s = bell(hz(midi(name, octave)), n) * bell_gain
        start = int(t * SR)
        end = min(start + n, n_total)
        pan = 0.25 + 0.5 * ((mi * 0.37) % 1)
        left[start:end] += s[: end - start] * (1 - pan)
        right[start:end] += s[: end - start] * pan
        t += step * melody[mi % len(melody)][1]
        mi += 1

    # filtered noise bed
    for ch in (left, right):
        ch += lowpass(rng.normal(0, 1, n_total), 700) * noise_gain

    stereo = np.stack([left, right], axis=1)
    stereo *= env(n_total, 1.5, 3.0)[:, None]
    peak = np.max(np.abs(stereo))
    return (stereo / peak * 0.85).astype(np.float32)


TRACKS = [
    {
        "slug": "low-power-hum",
        "title": "Low Power Hum",
        "chords": [["A2", "E3", "C4", "E4"], ["F2", "C3", "A3", "C4"], ["C3", "G3", "E4", "G4"], ["G2", "D3", "B3", "D4"]],
        "melody": [("E5", 2), ("C5", 3), ("A4", 2), ("D5", 3), ("B4", 2)],
        "bar": 8.0, "seed": 11, "bell": 0.16, "noise": 0.012,
    },
    {
        "slug": "trickle-charge",
        "title": "Trickle Charge",
        "chords": [["D3", "A3", "F4", "A4"], ["Bb2", "F3", "D4", "F4"], ["F3", "C4", "A4", "C5"], ["C3", "G3", "E4", "G4"]],
        "melody": [("A5", 3), ("F5", 2), ("D5", 3), ("C5", 2), ("E5", 3)],
        "bar": 8.0, "seed": 23, "bell": 0.13, "noise": 0.008,
    },
    {
        "slug": "full-charge",
        "title": "Full Charge",
        "chords": [["C3", "G3", "E4", "B4"], ["E3", "B3", "G4", "D5"], ["A2", "E3", "C4", "G4"], ["F2", "C3", "A3", "E4"]],
        "melody": [("G5", 2), ("E5", 2), ("B4", 3), ("D5", 2), ("C5", 3)],
        "bar": 8.0, "seed": 37, "bell": 0.18, "noise": 0.01,
    },
]


def write_wav(path: Path, audio: np.ndarray, sr: int = SR) -> None:
    pcm = (np.clip(audio, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(pcm.shape[1] if pcm.ndim == 2 else 1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    ffmpeg = shutil.which("ffmpeg")
    library = []
    for spec in TRACKS:
        audio = render(spec["chords"], spec["melody"], spec["bar"], spec["seed"], spec["bell"], spec["noise"])
        wav = OUT / f"{spec['slug']}.wav"
        write_wav(wav, audio)
        if ffmpeg:
            mp3 = OUT / f"{spec['slug']}.mp3"
            subprocess.run(
                [ffmpeg, "-y", "-loglevel", "error", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "128k", str(mp3)],
                check=True,
            )
            wav.unlink()
            file = mp3.name
        else:
            if wav.stat().st_size > 4 * 1024 * 1024:  # too big: mono 22.05 kHz
                mono = audio.mean(axis=1)[::2]
                write_wav(wav, mono[:, None], SR // 2)
            file = wav.name
        size_kb = (OUT / file).stat().st_size / 1024
        print(f"{file}: {size_kb:.0f} KB")
        library.append(
            {
                "title": spec["title"],
                "artist": "BatteryOrVansh (generated demo)",
                "file": file,
                "startAt": 10,
                "license": "Original, generated by scripts/make_demo_tracks.py. Free to reuse.",
                "sourceUrl": "https://github.com/BatteryOrVansh/BatteryOrVansh.github.io/blob/main/scripts/make_demo_tracks.py",
            }
        )
    (OUT / "library.json").write_text(json.dumps(library, indent=2) + "\n")
    print(f"wrote {OUT / 'library.json'} ({len(library)} tracks)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
