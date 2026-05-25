"use client";

import { useMemo, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createJournal } from "@/app/actions/journal";
import { InviteUserModal } from "../../users/InviteUserModal";
import { useRouter } from "next/navigation";

type EditorialCandidate = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

type BoardRow = {
  userId: string;
  role: string;
  order: number;
};

export function AddJournalForm({ initialCandidates }: { initialCandidates: EditorialCandidate[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [editorInChiefId, setEditorInChiefId] = useState<string>("");
  const [reviewType, setReviewType] = useState<string>("DOUBLE_BLIND");
  const [board, setBoard] = useState<BoardRow[]>([]);

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
    formData.set("editorialBoard", JSON.stringify(board.filter((r) => r.userId)));
    const result = await createJournal(formData);

    if (result.success) {
      router.push("/dashboard/journals");
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

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Journal Title *</label>
        <Input name="title" required placeholder="e.g. International Journal of Science" className="h-11" />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Website (Optional)</label>
        <Input name="website" placeholder="https://example.com/journal" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">ISSN (Print)</label>
          <Input name="issnPrint" placeholder="XXXX-XXXX" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">ISSN (Online)</label>
          <Input name="issnOnline" placeholder="XXXX-XXXX" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Review Model</label>
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
            <label className="block text-sm font-bold text-slate-700">Editor-in-Chief</label>
            <div className="scale-75 origin-right -mr-2">
              <InviteUserModal />
            </div>
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
        <label className="block text-sm font-bold text-slate-700 mb-1">Short Scope / Description</label>
        <textarea 
          name="scope"
          rows={3}
          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          placeholder="Enter a brief summary of the journal's scope"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Full Description (Optional)</label>
        <textarea 
          name="description"
          rows={4}
          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          placeholder="Detailed journal description..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Indexing Services (Optional)</label>
        <Input 
          name="indexingServices"
          placeholder="e.g. Google Scholar, CrossRef, DOAJ (comma-separated)"
          className="h-11"
        />
        <p className="text-xs text-slate-500 mt-1">Comma-separated list of services where this journal is indexed.</p>
      </div>

      <div className="pt-2 border-t mt-6">
        <div className="flex items-center justify-between mt-4 mb-4">
          <label className="block text-sm font-bold text-slate-700">Editorial Board (Optional)</label>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-semibold"
            onClick={() =>
              setBoard((prev) => [
                ...prev,
                { userId: "", role: "EDITORIAL_BOARD", order: prev.length },
              ])
            }
          >
            Add Member
          </Button>
        </div>

        {board.length === 0 ? (
          <p className="text-sm text-slate-500 p-4 border border-dashed rounded-lg text-center">
            Add users to the journal&apos;s editorial board after creating the journal, or add them here now.
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
                        next[idx] = { ...next[idx], order: Number(e.target.value) || 0 };
                        return next;
                      })
                    }
                    className="h-11 text-center"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setBoard((prev) => prev.filter((_, i) => i !== idx))}
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
              Creating Journal...
            </>
          ) : "Create Journal"}
        </Button>
      </div>
    </form>
  );
}
