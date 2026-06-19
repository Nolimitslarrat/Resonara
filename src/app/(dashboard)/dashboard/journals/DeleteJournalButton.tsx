"use client";

import { useState } from "react";
import { Loader2, Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteJournal } from "@/app/actions/journal";

interface DeleteJournalButtonProps {
  journalId: string;
  journalTitle: string;
}

export function DeleteJournalButton({ journalId, journalTitle }: DeleteJournalButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);

  // Info returned when linked records exist
  const [linkedInfo, setLinkedInfo] = useState<{
    manuscriptCount: number;
    issueCount: number;
  } | null>(null);

  function openModal() {
    setForceDelete(false);
    setLinkedInfo(null);
    setOpen(true);
  }

  function closeModal() {
    if (pending) return;
    setOpen(false);
    setLinkedInfo(null);
    setForceDelete(false);
  }

  async function handleDelete() {
    setPending(true);
    const result = await deleteJournal(journalId, forceDelete);
    setPending(false);

    if (result.success) {
      setOpen(false);
      return;
    }

    // If server tells us there are linked records and we didn't forceDelete yet,
    // surface the counts so the checkbox becomes visible.
    if ("hasLinkedRecords" in result && result.hasLinkedRecords) {
      setLinkedInfo({
        manuscriptCount: (result as { manuscriptCount: number }).manuscriptCount ?? 0,
        issueCount: (result as { issueCount: number }).issueCount ?? 0,
      });
    } else {
      alert(result.error || "Failed to delete journal.");
      setOpen(false);
    }
  }

  return (
    <>
      {/* Trash icon trigger */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={openModal}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Delete journal"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Close button */}
            <button
              onClick={closeModal}
              disabled={pending}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Delete Journal</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  This action is <span className="font-semibold text-red-600">permanent</span> and cannot be undone.
                </p>
              </div>
            </div>

            {/* Journal name */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 truncate">
              {journalTitle}
            </div>

            {/* Linked records warning — appears after first failed attempt */}
            {linkedInfo && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <p className="text-sm text-amber-800 font-medium">
                  This journal has linked records that must be removed first:
                </p>
                <ul className="text-sm text-amber-700 list-disc list-inside space-y-1">
                  {linkedInfo.manuscriptCount > 0 && (
                    <li>
                      <span className="font-bold">{linkedInfo.manuscriptCount}</span> article
                      {linkedInfo.manuscriptCount !== 1 ? "s" : ""} (including reviews &amp; co-authors)
                    </li>
                  )}
                  {linkedInfo.issueCount > 0 && (
                    <li>
                      <span className="font-bold">{linkedInfo.issueCount}</span> issue
                      {linkedInfo.issueCount !== 1 ? "s" : ""}
                    </li>
                  )}
                </ul>

                {/* Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group mt-1">
                  <input
                    type="checkbox"
                    checked={forceDelete}
                    onChange={(e) => setForceDelete(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-amber-400 text-red-600 accent-red-600 cursor-pointer"
                    id="force-delete-checkbox"
                  />
                  <span className="text-sm text-amber-900 group-hover:text-amber-950 leading-snug select-none">
                    <span className="font-semibold">Also permanently delete</span> all associated articles, issues, and reviews
                  </span>
                </label>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={pending}
                className="rounded-full px-5"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={pending || (!!linkedInfo && !forceDelete)}
                className="rounded-full px-5 bg-red-600 hover:bg-red-700 text-white shadow-sm disabled:opacity-50"
              >
                {pending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {forceDelete ? "Delete Everything" : "Delete Journal"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
