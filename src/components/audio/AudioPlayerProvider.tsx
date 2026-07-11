"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

/**
 * Lives in the root layout so the <audio> element survives client-side
 * navigation instead of remounting (and restarting) per page. Browsers block
 * autoplay, so playback only starts from the explicit toggle click below.
 */
export function AudioPlayerProvider() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackUrl, setTrackUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadActiveTrack() {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "active_track_url")
        .maybeSingle();

      if (!cancelled && data?.value) {
        setTrackUrl(data.value);
      }
    }

    loadActiveTrack();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio || !trackUrl) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => undefined);
      setIsPlaying(true);
      setHasStarted(true);
    }
  }

  if (!trackUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={trackUrl} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        aria-pressed={isPlaying}
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-elevated text-fg shadow-lg transition-transform duration-300 ease-[var(--ease-google)] hover:scale-105"
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
      {!hasStarted && (
        <span className="fixed bottom-8 left-20 z-40 hidden text-xs text-fg-muted sm:inline">
          Music
        </span>
      )}
    </>
  );
}
