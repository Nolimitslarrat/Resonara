"use client";

import { useMemo, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateJournal } from "@/app/actions/journal";
import { InviteUserModal } from "../../../users/InviteUserModal";
import { useRouter } from "next/navigation";

type EditorialCandidate = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

type BoardRow = {
  id?: string; // existing db row id
  userId: string;
  role: string;
  order: number;
};

type JournalData = {
  id: string;
  title: string;
  issnPrint: string | null;
  issnOnline: string | null;
  description: string | null;
  scope: string | null;
  website: string | null;
  reviewType: string;
  editorInChiefId: string | null;
  isActive: boolean;
  indexingServices: string[];
  editorialBoard: BoardRow[];
};

export function EditJournalForm({
  journal,
  initialCandidates,
}: {
  journal: JournalData;
  initialCandidates: EditorialCandidate[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editorInChiefId, setEditorInChiefId] = useState<string>(
    journal.editorInChiefId || ""
  );
  const [reviewType, setReviewType] = useState<string>(journal.reviewType);
  const [isActive, setIsActive] = useState<boolean>(journal.isActive);
  const [board, setBoard] = useState<BoardRow[]>(
    journal.editorialBoard.filter(r => r.role.toLowerCase() !== "reviewer")
  );
  const [reviewers, setReviewers] = useState<BoardRow[]>(
    journal.editorialBoard.filter(r => r.role.toLowerCase() === "reviewer")
  );

  const candidateOptions = useMemo(() => {
    return initialCandidates.map((u) => ({
      id: u.id,
      label: u.name ? `${u.name} (${u.email})` : u.email,
    }));
  }, [initialCandidates]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("editorInChiefId", editorInChiefId);
    formData.set("reviewType", reviewType);
    formData.set("isActive", String(isActive));
    const combinedBoard = [
      ...board.filter((r) => r.userId),
      ...reviewers.filter((r) => r.userId)
    ];
    formData.set(
      "editorialBoard",
      JSON.stringify(combinedBoard)
    );

    const result = await updateJournal(journal.id, formData);

    if (result.success) {
      router.push("/dashboard/journals");
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Status toggle */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => setIsActive((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:ring-offset-2 ${
            isActive ? "bg-emerald-500" : "bg-slate-300"
          }`}
          aria-checked={isActive}
          role="switch"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <div>
          <p className="text-sm font-bold text-slate-700">
            {isActive ? "Active (Publicly Visible)" : "Inactive (Hidden)"}
          </p>
          <p className="text-xs text-slate-500">
            Toggle to control whether this journal appears on the public site.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">
          Journal Title *
        </label>
        <Input
          name="title"
          required
          defaultValue={journal.title}
          className="h-11"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">
          Website (Optional)
        </label>
        <Input
          name="website"
          defaultValue={journal.website || ""}
          placeholder="https://example.com/journal"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            ISSN (Print)
          </label>
          <Input
            name="issnPrint"
            defaultValue={journal.issnPrint || ""}
            placeholder="XXXX-XXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            ISSN (Online)
          </label>
          <Input
            name="issnOnline"
            defaultValue={journal.issnOnline || ""}
            placeholder="XXXX-XXXX"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Review Model
          </label>
          <select
            value={reviewType}
            onChange={(e) => setReviewType(e.target.value)}
            className="w-full h-11 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] bg-white"
          >
            <option value="DOUBLE_BLIND">Double-blind</option>
            <option value="SINGLE_BLIND">Single-blind</option>
            <option value="OPEN">Open review</option>
            <option value="EDITORIAL">Editorial review</option>
          </select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-slate-700">
              Editor-in-Chief
            </label>
            <InviteUserModal triggerVariant="outline" triggerClassName="h-7 px-2 text-xs gap-1 text-[var(--brand-600)] border-[var(--brand-200)] hover:bg-[var(--brand-50)] shadow-none" />
          </div>
          <select
            value={editorInChiefId}
            onChange={(e) => setEditorInChiefId(e.target.value)}
            className="w-full h-11 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] bg-white"
          >
            <option value="">Select a user</option>
            {candidateOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">
          Short Scope / Description
        </label>
        <textarea
          name="scope"
          rows={3}
          defaultValue={journal.scope || ""}
          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          placeholder="Enter a brief summary of the journal's scope"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">
          Full Description (Optional)
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={journal.description || ""}
          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          placeholder="Detailed journal description..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">
          Indexing Services (Optional)
        </label>
        <Input
          name="indexingServices"
          defaultValue={journal.indexingServices.join(", ")}
          placeholder="e.g. Google Scholar, CrossRef, DOAJ (comma-separated)"
          className="h-11"
        />
        <p className="text-xs text-slate-500 mt-1">
          Comma-separated list of services where this journal is indexed.
        </p>
      </div>

      {/* Editorial Board */}
      <div className="pt-2 border-t mt-6">
        <div className="flex items-center justify-between mt-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-slate-700">
              Editorial Board
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Add, remove, or change the role of board members.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-semibold"
            onClick={() =>
              setBoard((prev) => [
                ...prev,
                { userId: "", role: "Editorial Board Member", order: prev.length },
              ])
            }
          >
            Add Member
          </Button>
        </div>

        {board.length === 0 ? (
          <p className="text-sm text-slate-500 p-4 border border-dashed rounded-lg text-center">
            No editorial board members yet. Click &quot;Add Member&quot; to add one.
          </p>
        ) : (
          <div className="space-y-3">
            {board.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 md:col-span-6">
                  <select
                    value={row.userId}
                    onChange={(e) =>
                      setBoard((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], userId: e.target.value };
                        return next;
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] bg-white"
                  >
                    <option value="">Select user</option>
                    {candidateOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-8 md:col-span-4">
                  <Input
                    value={row.role}
                    onChange={(e) =>
                      setBoard((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], role: e.target.value };
                        return next;
                      })
                    }
                    placeholder="e.g. Associate Editor"
                    className="h-11"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Input
                    type="number"
                    value={row.order}
                    onChange={(e) =>
                      setBoard((prev) => {
                        const next = [...prev];
                        next[idx] = {
                          ...next[idx],
                          order: Number(e.target.value) || 0,
                        };
                        return next;
                      })
                    }
                    className="h-11 text-center"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setBoard((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="h-11 w-11 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center"
                    aria-label="Remove member"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t mt-6">
        <div className="flex items-center justify-between mt-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-slate-700">
              Reviewers (Optional)
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Add or remove reviewers associated with this journal.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-semibold"
            onClick={() =>
              setReviewers((prev) => [
                ...prev,
                { userId: "", role: "Reviewer", order: prev.length },
              ])
            }
          >
            Add Reviewer
          </Button>
        </div>

        {reviewers.length === 0 ? (
          <p className="text-sm text-slate-500 p-4 border border-dashed rounded-lg text-center">
            No reviewers assigned yet. Click &quot;Add Reviewer&quot; to add one.
          </p>
        ) : (
          <div className="space-y-3">
            {reviewers.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 md:col-span-10">
                  <select
                    value={row.userId}
                    onChange={(e) =>
                      setReviewers((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], userId: e.target.value };
                        return next;
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] bg-white"
                  >
                    <option value="">Select user</option>
                    {candidateOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setReviewers((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="h-11 w-11 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center"
                    aria-label="Remove reviewer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard/journals")}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
