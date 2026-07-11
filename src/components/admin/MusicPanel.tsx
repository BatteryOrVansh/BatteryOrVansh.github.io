"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { adminFetch, adminFetchJson } from "@/lib/admin/client";
import {
  Panel,
  StatusMessage,
  dangerButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/admin/ui";
import type { MusicTrack } from "@/app/api/admin/music/route";

export function MusicPanel() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busyTrack, setBusyTrack] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [tracksRes, settingRes] = await Promise.all([
          adminFetchJson<{ tracks: MusicTrack[] }>("/api/admin/music"),
          supabase.from("site_settings").select("value").eq("key", "active_track_url").maybeSingle(),
        ]);
        if (ignore) return;
        setError(null);
        setTracks(tracksRes.tracks);
        setActiveUrl(settingRes.data?.value ?? null);
      } catch (err) {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Failed to load tracks.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("bucket", "music");
      formData.append("file", file);
      const res = await adminFetch("/api/admin/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Upload failed.");
      setRefreshIndex((n) => n + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSetActive(track: MusicTrack) {
    setBusyTrack(track.name);
    setError(null);
    try {
      await adminFetchJson("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ key: "active_track_url", value: track.publicUrl }),
      });
      setActiveUrl(track.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set active track.");
    } finally {
      setBusyTrack(null);
    }
  }

  async function handleClearActive() {
    setBusyTrack("__clear__");
    setError(null);
    try {
      await adminFetchJson("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ key: "active_track_url", value: null }),
      });
      setActiveUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear active track.");
    } finally {
      setBusyTrack(null);
    }
  }

  async function handleDelete(track: MusicTrack) {
    if (!confirm(`Delete "${track.name}"? This cannot be undone.`)) return;
    setBusyTrack(track.name);
    setError(null);
    try {
      await adminFetchJson("/api/admin/music", {
        method: "DELETE",
        body: JSON.stringify({ name: track.name }),
      });
      if (activeUrl === track.publicUrl) {
        await handleClearActive();
      }
      setTracks((prev) => prev.filter((t) => t.name !== track.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete track.");
    } finally {
      setBusyTrack(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Panel
        title="Upload track"
        description="Uploads to the music bucket. Mark a track active below to make it play on the site."
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleUpload}
          className="hidden"
          id="music-upload"
        />
        <label htmlFor="music-upload" className={`${primaryButtonClass} cursor-pointer`}>
          {uploading ? "Uploading…" : "Upload new track"}
        </label>
        {error && <StatusMessage message={error} tone="error" />}
      </Panel>

      <Panel title="Tracks" description={loading ? "Loading…" : `${tracks.length} track(s)`}>
        <div className="flex flex-col gap-3">
          {tracks.map((track) => {
            const isActive = activeUrl === track.publicUrl;
            const isBusy = busyTrack === track.name;
            return (
              <div
                key={track.name}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{track.name}</p>
                  <p className="mt-1 text-xs text-fg-muted">
                    {isActive ? "Active on site" : "Not active"}
                    {track.size ? ` · ${Math.round(track.size / 1024)} KB` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <audio controls preload="none" src={track.publicUrl} className="h-8 max-w-[220px]" />
                  <button
                    type="button"
                    disabled={isActive || isBusy}
                    onClick={() => handleSetActive(track)}
                    className={secondaryButtonClass}
                  >
                    {isActive ? "Active" : "Set active"}
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(track)}
                    className={dangerButtonClass}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {!loading && tracks.length === 0 && (
            <p className="text-sm text-fg-muted">No tracks uploaded yet.</p>
          )}
        </div>
        {activeUrl && (
          <button type="button" onClick={handleClearActive} className={`${secondaryButtonClass} mt-4`}>
            Clear active track
          </button>
        )}
      </Panel>
    </div>
  );
}
