"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { adminFetchJson } from "@/lib/admin/client";
import type { Project } from "@/types/database";
import {
  Panel,
  StatusMessage,
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/ui";

type ProjectFormState = {
  title: string;
  status: string;
  tech: string;
  description: string;
  link: string;
  sort_order: string;
};

const EMPTY_FORM: ProjectFormState = {
  title: "",
  status: "",
  tech: "",
  description: "",
  link: "",
  sort_order: "0",
};

function projectToForm(project: Project): ProjectFormState {
  return {
    title: project.title,
    status: project.status ?? "",
    tech: (project.tech ?? []).join(", "),
    description: project.description ?? "",
    link: project.link ?? "",
    sort_order: String(project.sort_order ?? 0),
  };
}

function formToPayload(form: ProjectFormState) {
  return {
    title: form.title.trim(),
    status: form.status.trim() || null,
    tech: form.tech
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    description: form.description.trim() || null,
    link: form.link.trim() || null,
    sort_order: Number.isFinite(Number(form.sort_order)) ? Number(form.sort_order) : 0,
  };
}

export function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<ProjectFormState>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refresh = useCallback(() => setRefreshIndex((n) => n + 1), []);

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (ignore) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setError(null);
        setProjects(data ?? []);
      }
      setLoading(false);
    }

    loadProjects();
    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await adminFetchJson("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify(formToPayload(newProject)),
      });
      setNewProject(EMPTY_FORM);
      refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await adminFetchJson(`/api/admin/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Panel title="Add project" description="Appears on the public /projects page once saved.">
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="new-title">
              Title
            </label>
            <input
              id="new-title"
              required
              className={inputClass}
              value={newProject.title}
              onChange={(e) => setNewProject((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-status">
              Status
            </label>
            <input
              id="new-status"
              className={inputClass}
              placeholder="e.g. Live, In progress"
              value={newProject.status}
              onChange={(e) => setNewProject((f) => ({ ...f, status: e.target.value }))}
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
              value={newProject.sort_order}
              onChange={(e) => setNewProject((f) => ({ ...f, sort_order: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="new-tech">
              Tech (comma separated)
            </label>
            <input
              id="new-tech"
              className={inputClass}
              placeholder="Next.js, TypeScript, Supabase"
              value={newProject.tech}
              onChange={(e) => setNewProject((f) => ({ ...f, tech: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="new-description">
              Description
            </label>
            <textarea
              id="new-description"
              rows={3}
              className={inputClass}
              value={newProject.description}
              onChange={(e) => setNewProject((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="new-link">
              Link
            </label>
            <input
              id="new-link"
              type="url"
              className={inputClass}
              placeholder="https://..."
              value={newProject.link}
              onChange={(e) => setNewProject((f) => ({ ...f, link: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={creating} className={primaryButtonClass}>
              {creating ? "Adding…" : "Add project"}
            </button>
            {createError && <StatusMessage message={createError} tone="error" />}
          </div>
        </form>
      </Panel>

      <Panel title="Existing projects" description={loading ? "Loading…" : `${projects.length} project(s)`}>
        {error && <StatusMessage message={error} tone="error" />}
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} onDelete={handleDelete} onSaved={refresh} />
          ))}
          {!loading && projects.length === 0 && (
            <p className="text-sm text-fg-muted">No projects yet.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}

function ProjectRow({
  project,
  onDelete,
  onSaved,
}: {
  project: Project;
  onDelete: (id: string) => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProjectFormState>(projectToForm(project));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await adminFetchJson(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify(formToPayload(form)),
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="grid grid-cols-1 gap-4 rounded-xl border border-border p-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <label className={labelClass}>Title</label>
        <input
          required
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <input
          className={inputClass}
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
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
      <div className="sm:col-span-2">
        <label className={labelClass}>Tech (comma separated)</label>
        <input
          className={inputClass}
          value={form.tech}
          onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          className={inputClass}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>Link</label>
        <input
          type="url"
          className={inputClass}
          value={form.link}
          onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={() => onDelete(project.id)} className={dangerButtonClass}>
          Delete
        </button>
        {saved && !saving && <span className="text-sm text-fg-muted">Saved.</span>}
        {saveError && <StatusMessage message={saveError} tone="error" />}
      </div>
    </form>
  );
}
