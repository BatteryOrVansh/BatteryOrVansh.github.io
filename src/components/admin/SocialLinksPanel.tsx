"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetchJson } from "@/lib/admin/client";
import type { SocialLink } from "@/types/database";
import {
  Panel,
  StatusMessage,
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/ui";

type LinkFormState = {
  platform: string;
  label: string;
  url: string;
  sort_order: string;
  is_active: boolean;
};

const EMPTY_FORM: LinkFormState = {
  platform: "",
  label: "",
  url: "",
  sort_order: "0",
  is_active: true,
};

function linkToForm(link: SocialLink): LinkFormState {
  return {
    platform: link.platform,
    label: link.label ?? "",
    url: link.url,
    sort_order: String(link.sort_order ?? 0),
    is_active: link.is_active,
  };
}

function formToPayload(form: LinkFormState) {
  return {
    platform: form.platform.trim().toLowerCase(),
    label: form.label.trim() || null,
    url: form.url.trim(),
    sort_order: Number.isFinite(Number(form.sort_order)) ? Number(form.sort_order) : 0,
    is_active: form.is_active,
  };
}

export function SocialLinksPanel() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newLink, setNewLink] = useState<LinkFormState>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refresh = useCallback(() => setRefreshIndex((n) => n + 1), []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const { socialLinks } = await adminFetchJson<{ socialLinks: SocialLink[] }>(
          "/api/admin/social-links"
        );
        if (!ignore) {
          setError(null);
          setLinks(socialLinks);
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Failed to load social links.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await adminFetchJson("/api/admin/social-links", {
        method: "POST",
        body: JSON.stringify(formToPayload(newLink)),
      });
      setNewLink(EMPTY_FORM);
      refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to add social link.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this social link?")) return;
    try {
      await adminFetchJson(`/api/admin/social-links/${id}`, { method: "DELETE" });
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete social link.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Panel
        title="Add social link"
        description="Shown in the hero socials row and site footer. Platform controls the icon (linkedin, github, leetcode, instagram, email — anything else falls back to a generic link icon)."
      >
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="new-platform">
              Platform
            </label>
            <input
              id="new-platform"
              required
              className={inputClass}
              placeholder="leetcode"
              value={newLink.platform}
              onChange={(e) => setNewLink((f) => ({ ...f, platform: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-label">
              Label (optional)
            </label>
            <input
              id="new-label"
              className={inputClass}
              placeholder="Defaults to platform name"
              value={newLink.label}
              onChange={(e) => setNewLink((f) => ({ ...f, label: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="new-url">
              URL
            </label>
            <input
              id="new-url"
              required
              className={inputClass}
              placeholder="https://leetcode.com/u/..."
              value={newLink.url}
              onChange={(e) => setNewLink((f) => ({ ...f, url: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-sort">
              Sort order
            </label>
            <input
              id="new-sort"
              type="number"
              className={inputClass}
              value={newLink.sort_order}
              onChange={(e) => setNewLink((f) => ({ ...f, sort_order: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={creating} className={primaryButtonClass}>
              {creating ? "Adding…" : "Add social link"}
            </button>
            {createError && <StatusMessage message={createError} tone="error" />}
          </div>
        </form>
      </Panel>

      <Panel title="Existing links" description={loading ? "Loading…" : `${links.length} link(s)`}>
        {error && <StatusMessage message={error} tone="error" />}
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <SocialLinkRow key={link.id} link={link} onDelete={handleDelete} onSaved={refresh} />
          ))}
          {!loading && links.length === 0 && (
            <p className="text-sm text-fg-muted">No social links yet.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}

function SocialLinkRow({
  link,
  onDelete,
  onSaved,
}: {
  link: SocialLink;
  onDelete: (id: string) => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<LinkFormState>(linkToForm(link));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await adminFetchJson(`/api/admin/social-links/${link.id}`, {
        method: "PATCH",
        body: JSON.stringify(formToPayload(form)),
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save social link.");
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
        <label className={labelClass}>Platform</label>
        <input
          required
          className={inputClass}
          value={form.platform}
          onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
        />
      </div>
      <div>
        <label className={labelClass}>Label (optional)</label>
        <input
          className={inputClass}
          value={form.label}
          onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>URL</label>
        <input
          required
          className={inputClass}
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
        />
      </div>
      <div>
        <label className={labelClass}>Sort order</label>
        <input
          type="number"
          className={inputClass}
          value={form.sort_order}
          onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
        />
      </div>
      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
          />
          Visible on site
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={() => onDelete(link.id)} className={dangerButtonClass}>
          Delete
        </button>
        {saved && !saving && <span className="text-sm text-fg-muted">Saved.</span>}
        {saveError && <StatusMessage message={saveError} tone="error" />}
      </div>
    </form>
  );
}
