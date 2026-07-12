"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { adminFetchJson } from "@/lib/admin/client";
import { Panel, StatusMessage, inputClass, primaryButtonClass } from "@/components/admin/ui";

export function HeroInterestsPanel() {
  const [value, setValue] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const { data, error: fetchError } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_interests")
        .maybeSingle();

      if (ignore) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setError(null);
        setValue(data?.value ?? "");
        setDraft(data?.value ?? "");
      }
      setLoading(false);
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await adminFetchJson("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ key: "hero_interests", value: draft }),
      });
      setValue(draft);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel
      title="Hero interests"
      description="The paragraph under 'What I'm interested in' on the homepage."
    >
      {loading ? (
        <p className="text-sm text-fg-muted">Loading…</p>
      ) : (
        <>
          <textarea
            rows={6}
            className={inputClass}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
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
          {error && <StatusMessage message={error} tone="error" />}
        </>
      )}
    </Panel>
  );
}
