"use client";

import { useState } from "react";
import { Edit2, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createIssue, deleteIssue, updateIssue } from "@/app/actions/issue";
import type { IssueStatus } from "@prisma/client";

type JournalOption = {
  id: string;
  title: string;
};

type IssueItem = {
  id: string;
  journalId: string;
  volume: number;
  issue: number;
  year: number;
  title: string | null;
  coverImage: string | null;
  status: IssueStatus;
};

type Props = {
  journals: JournalOption[];
  issue?: IssueItem;
  mode?: "create" | "edit";
};

export function IssueManager({ journals, issue, mode = "create" }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = mode === "edit" && issue
      ? await updateIssue(issue.id, formData)
      : await createIssue(formData);
    setPending(false);

    if (result.success) {
      setOpen(false);
      return;
    }

    setError(result.error || "Something went wrong.");
  }

  async function handleDelete() {
    if (!issue || !confirm("Delete this issue? This cannot be undone.")) return;
    setPending(true);
    setError(null);
    const result = await deleteIssue(issue.id);
    setPending(false);

    if (!result.success) {
      setError(result.error || "Failed to delete issue.");
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={mode === "edit" ? "outline" : "default"}
        size={mode === "edit" ? "sm" : "default"}
        className="gap-2"
      >
        {mode === "edit" ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {mode === "edit" ? "Edit" : "Create Issue"}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                {mode === "edit" ? "Edit Issue" : "Create Issue"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:bg-slate-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Journal</label>
                <select
                  name="journalId"
                  required
                  defaultValue={issue?.journalId || journals[0]?.id || ""}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                >
                  {journals.map((journal) => (
                    <option key={journal.id} value={journal.id}>{journal.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Volume</label>
                  <Input name="volume" type="number" min={1} required defaultValue={issue?.volume || 1} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Issue</label>
                  <Input name="issue" type="number" min={1} required defaultValue={issue?.issue || 1} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Year</label>
                  <Input name="year" type="number" min={1900} required defaultValue={issue?.year || new Date().getFullYear()} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <Input name="title" defaultValue={issue?.title || ""} placeholder="Optional special issue title" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cover Image URL</label>
                <Input name="coverImage" defaultValue={issue?.coverImage || ""} placeholder="/covers/issue.jpg" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={issue?.status || "DRAFT"}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                {mode === "edit" && (
                  <Button type="button" variant="destructive" onClick={handleDelete} disabled={pending} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                )}
                <div className="ml-auto flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={pending} className="gap-2">
                    {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {mode === "edit" ? "Update Issue" : "Create Issue"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
