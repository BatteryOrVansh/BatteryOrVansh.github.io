"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminFetch, adminFetchJson } from "@/lib/admin/client";
import type { MusicTrack } from "@/types/database";
import {
  Panel,
  StatusMessage,
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/ui";

export function MusicPanel() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const [newTitle, setNewTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => setRefreshIndex((n) => n + 1), []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const { tracks: fetched } = await adminFetchJson<{ tracks: MusicTrack[] }>(
          "/api/admin/music-tracks"
        );
        if (!ignore) {
          setError(null);
          setTracks(fetched);
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Failed to load tracks.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError("Choose an audio file first.");
      return;
    }
    if (!newTitle.trim()) {
      setUploadError("Title is required.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("bucket", "music");
      formData.append("file", file);
      const uploadRes = await adminFetch("/api/admin/upload", { method: "POST", body: formData });
      const uploadBody = await uploadRes.json().catch(() => null);
      if (!uploadRes.ok) {
        throw new Error(uploadBody?.error ?? "Upload failed.");
      }

      await adminFetchJson("/api/admin/music-tracks", {
        method: "POST",
        body: JSON.stringify({
          title: newTitle.trim(),
          file_url: uploadBody.publicUrl,
          sort_order: tracks.length,
        }),
      });

      setNewTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this track? This cannot be undone.")) return;
    try {
      await adminFetchJson(`/api/admin/music-tracks/${id}`, { method: "DELETE" });
      setTracks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete track.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Panel
        title="Upload track"
        description="Uploads to the music bucket and adds it to the shuffled play queue. Toggle 'Active' below to control whether it plays on the site."
      >
        <form onSubmit={handleUpload} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="new-title">
              Title
            </label>
            <input
              id="new-title"
              required
              className={inputClass}
              placeholder="Track title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-file">
              Audio file
            </label>
            <input
              id="new-file"
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={uploading} className={primaryButtonClass}>
              {uploading ? "Uploading…" : "Upload track"}
            </button>
            {uploadError && <StatusMessage message={uploadError} tone="error" />}
          </div>
        </form>
      </Panel>

      <Panel title="Tracks" description={loading ? "Loading…" : `${tracks.length} track(s)`}>
        {error && <StatusMessage message={error} tone="error" />}
        <div className="flex flex-col gap-4">
          {tracks.map((track) => (
            <MusicTrackRow key={track.id} track={track} onDelete={handleDelete} onSaved={refresh} />
          ))}
          {!loading && tracks.length === 0 && (
            <p className="text-sm text-fg-muted">No tracks uploaded yet.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}

function MusicTrackRow({
  track,
  onDelete,
  onSaved,
}: {
  track: MusicTrack;
  onDelete: (id: string) => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(track.title);
  const [sortOrder, setSortOrder] = useState(String(track.sort_order ?? 0));
  const [isActive, setIsActive] = useState(track.is_active);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await adminFetchJson(`/api/admin/music-tracks/${track.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          sort_order: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
          is_active: isActive,
        }),
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save track.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="grid grid-cols-1 gap-4 rounded-xl border border-border p-4 sm:grid-cols-2"
    >
      <div>
        <label className={labelClass}>Title</label>
        <input
          required
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Sort order</label>
        <input
          type="number"
          className={inputClass}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <audio controls preload="none" src={track.file_url} className="h-8 w-full max-w-sm" />
      </div>
      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active on site
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={() => onDelete(track.id)} className={dangerButtonClass}>
          Delete
        </button>
        {saved && !saving && <span className="text-sm text-fg-muted">Saved.</span>}
        {saveError && <StatusMessage message={saveError} tone="error" />}
      </div>
    </form>
  );
}
