"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { MusicTrack } from "@/types/database";

/**
 * Lives in the root layout so the <audio> element survives client-side
 * navigation instead of remounting (and restarting) per page. Browsers block
 * autoplay, so playback only starts from the explicit toggle click below.
 *
 * Builds a shuffled queue from every active track in `music_tracks` and
 * advances through it on `ended`, reshuffling once the queue is exhausted
 * instead of looping a single track.
 */

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function AudioPlayerProvider() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const tracksRef = useRef<MusicTrack[]>([]);
  const queueRef = useRef<MusicTrack[]>([]);
  const queueIndexRef = useRef(0);

  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAttention, setShowAttention] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTracks() {
      const { data } = await supabase
        .from("music_tracks")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!cancelled && data && data.length > 0) {
        tracksRef.current = data;
        const shuffled = shuffle(data);
        queueRef.current = shuffled;
        queueIndexRef.current = 0;
        setCurrentTrack(shuffled[0]);
      }
    }

    loadTracks();
    return () => {
      cancelled = true;
    };
  }, []);

  // One-time subtle attention animation on initial page load only. The
  // layout only mounts this component once per full page load (App Router
  // doesn't remount layouts on client-side navigation), so a plain timeout
  // gated by state that starts true is enough — no persistence needed.
  // Matches the 4×1s duration of `.animate-attention-pulse` in globals.css
  // so the class is removed right as the animation settles.
  useEffect(() => {
    const timeout = setTimeout(() => setShowAttention(false), 4000);
    return () => clearTimeout(timeout);
  }, []);

  function playNext() {
    if (queueRef.current.length === 0) return;

    let nextIndex = queueIndexRef.current + 1;
    if (nextIndex >= queueRef.current.length) {
      queueRef.current = shuffle(tracksRef.current);
      nextIndex = 0;
    }
    queueIndexRef.current = nextIndex;
    setCurrentTrack(queueRef.current[nextIndex]);
  }

  // Whenever the current track changes (initial load or advancing to the
  // next queued track) resume playback automatically if we were mid-session.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.play().catch(() => undefined);
    }
  }, [currentTrack, isPlaying]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => undefined);
      setIsPlaying(true);
    }
  }

  if (!currentTrack) return null;

  return (
    <>
      <audio ref={audioRef} src={currentTrack.file_url} preload="none" onEnded={playNext} />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        aria-pressed={isPlaying}
        className={`fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-elevated text-fg shadow-lg transition-transform duration-300 ease-[var(--ease-google)] hover:scale-105 sm:right-8 sm:top-6 ${
          showAttention ? "animate-attention-pulse" : ""
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-transform duration-300 ${isPlaying ? "" : "translate-x-0.5"}`}
        >
          {isPlaying ? (
            <g stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round">
              <line x1="8" y1="6" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="18" />
            </g>
          ) : (
            <path
              d="M5 3.5L20 12L5 20.5V3.5Z"
              fill="var(--red)"
              stroke="var(--red)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>
    </>
  );
}
