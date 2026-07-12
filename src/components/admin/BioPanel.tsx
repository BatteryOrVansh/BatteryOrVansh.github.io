"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { adminFetch, adminFetchJson } from "@/lib/admin/client";
import type { BioContent } from "@/types/database";
import {
  Panel,
  StatusMessage,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/admin/ui";

const TEXT_FIELDS: { key: string; label: string; multiline: boolean; placeholder?: string }[] = [
  { key: "summary", label: "Summary", multiline: true },
  { key: "education", label: "Education", multiline: true },
  { key: "experience", label: "Experience", multiline: true },
  { key: "certifications", label: "Certifications", multiline: true },
  {
    key: "technical_skills",
    label: "Technical skills (shown as pills on the Hero page)",
    multiline: true,
    placeholder: "One per line, or comma-separated — e.g. React.js, Node.js, Python, C++",
  },
  { key: "contact", label: "Contact", multiline: false, placeholder: "e.g. hello@example.com" },
  { key: "links", label: "Links", multiline: false, placeholder: "e.g. github.com/… · linkedin.com/…" },
];

export function BioPanel() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadBio() {
      const { data, error: fetchError } = await supabase.from("bio_content").select("key, value");
      if (ignore) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setError(null);
        const map: Record<string, string> = {};
        (data as BioContent[] | null)?.forEach((row) => {
          map[row.key] = row.value ?? "";
        });
        setValues(map);
      }
      setLoading(false);
    }

    loadBio();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <Panel title="Photo" description="Uploads to the photos bucket and updates bio_content.photo_url.">
        {error && <StatusMessage message={error} tone="error" />}
        {!loading && (
          <PhotoField
            value={values.photo_url ?? ""}
            onSaved={(url) => setValues((v) => ({ ...v, photo_url: url }))}
          />
        )}
      </Panel>

      {!loading &&
        TEXT_FIELDS.map((field) => (
          <Panel key={field.key} title={field.label}>
            <BioField
              fieldKey={field.key}
              multiline={field.multiline}
              placeholder={field.placeholder}
              value={values[field.key] ?? ""}
              onSaved={(value) => setValues((v) => ({ ...v, [field.key]: value }))}
            />
          </Panel>
        ))}
    </div>
  );
}

function BioField({
  fieldKey,
  multiline,
  placeholder,
  value,
  onSaved,
}: {
  fieldKey: string;
  multiline: boolean;
  placeholder?: string;
  value: string;
  onSaved: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await adminFetchJson("/api/admin/bio", {
        method: "PUT",
        body: JSON.stringify({ key: fieldKey, value: draft }),
      });
      onSaved(draft);
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {multiline ? (
        <textarea
          rows={5}
          className={inputClass}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      )}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || draft === value}
          className={primaryButtonClass}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && draft === value && <span className="text-sm text-fg-muted">Saved.</span>}
      </div>
      {saveError && <StatusMessage message={saveError} tone="error" />}
    </div>
  );
}

function PhotoField({ value, onSaved }: { value: string; onSaved: (url: string) => void }) {
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function saveUrl(nextUrl: string) {
    setSaving(true);
    setError(null);
    try {
      await adminFetchJson("/api/admin/bio", {
        method: "PUT",
        body: JSON.stringify({ key: "photo_url", value: nextUrl }),
      });
      onSaved(nextUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save photo URL.");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("bucket", "photos");
      formData.append("file", file);
      const res = await adminFetch("/api/admin/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Upload failed.");
      setUrl(body.publicUrl);
      await saveUrl(body.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-bg">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Bio photo preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-fg-muted">
            No photo
          </div>
        )}
      </div>
      <div className="flex-1">
        <label className={labelClass} htmlFor="photo-url">
          Photo URL
        </label>
        <div className="flex flex-wrap gap-3">
          <input
            id="photo-url"
            className={inputClass}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={() => saveUrl(url)}
            disabled={saving || url === value}
            className={primaryButtonClass}
          >
            {saving ? "Saving…" : "Save URL"}
          </button>
        </div>
        <div className="mt-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className={`${secondaryButtonClass} cursor-pointer`}>
            {uploading ? "Uploading…" : "Upload new photo"}
          </label>
        </div>
        {error && <StatusMessage message={error} tone="error" />}
      </div>
    </div>
  );
}
