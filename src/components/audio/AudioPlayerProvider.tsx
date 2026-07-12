"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
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

  function playPrevious() {
    if (queueRef.current.length === 0) return;

    const prevIndex =
      queueIndexRef.current === 0 ? queueRef.current.length - 1 : queueIndexRef.current - 1;
    queueIndexRef.current = prevIndex;
    setCurrentTrack(queueRef.current[prevIndex]);
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
      <div
        className={`fixed right-4 top-4 z-50 sm:right-8 sm:top-6 ${
          showAttention ? "animate-attention-pulse" : ""
        }`}
      >
        <div className="flex items-center gap-0.5 rounded-full border border-border bg-bg-elevated/95 py-1.5 pl-1.5 pr-1.5 shadow-lg backdrop-blur transition-transform duration-300 ease-[var(--ease-google)] hover:scale-[1.02] sm:pr-3">
          <button
            type="button"
            onClick={playPrevious}
            aria-label="Previous track"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 hover:text-fg"
          >
            <SkipBack className="h-3.5 w-3.5" fill="currentColor" />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
            aria-pressed={isPlaying}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red text-bg transition-transform duration-300 ease-[var(--ease-google)] hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" fill="currentColor" />
            ) : (
              <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
            )}
          </button>
          <button
            type="button"
            onClick={playNext}
            aria-label="Next track"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 hover:text-fg"
          >
            <SkipForward className="h-3.5 w-3.5" fill="currentColor" />
          </button>
          <span className="ml-1 hidden max-w-[110px] truncate font-headline text-xs font-medium text-fg-muted sm:ml-2 sm:inline">
            {currentTrack.title}
          </span>
        </div>
      </div>
    </>
  );
}
