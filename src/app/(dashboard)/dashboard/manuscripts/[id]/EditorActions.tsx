"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { assignEditor, assignReviewer, updateManuscriptStatus } from "@/app/actions/editor";
import type { ManuscriptStatus, ReviewStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

type Person = {
  id: string;
  name: string;
  email: string;
};

type ReviewerAssignment = {
  reviewerId: string;
  status: ReviewStatus;
};

type EditorAssignment = {
  editorId: string;
};

type Props = {
  manuscriptId: string;
  currentStatus: ManuscriptStatus;
  reviewers: Person[];
  reviewerAssignments: ReviewerAssignment[];
  editors: Person[];
  editorAssignments: EditorAssignment[];
  canAssignEditors: boolean;
  canPublish: boolean;
};

export function EditorActions({
  manuscriptId,
  currentStatus,
  reviewers,
  reviewerAssignments,
  editors,
  editorAssignments,
  canAssignEditors,
  canPublish,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [selectedEditors, setSelectedEditors] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [showDecision, setShowDecision] = useState(false);

  const handlePublish = async () => {
    if (!confirm("Are you sure you want to publish this article officially? This will make it public and indexable.")) return;
    setLoading(true);
    const { publishArticle } = await import("@/app/actions/publish");
    const result = await publishArticle(manuscriptId);
    if (!result.success) alert(result.error);
    setLoading(false);
  };

  const handleBulkAssign = async () => {
    if (selectedReviewers.length === 0) return;
    setLoading(true);
    for (const rid of selectedReviewers) {
      const res = await assignReviewer(manuscriptId, rid);
      if (!res.success) {
        alert(res.error || "Failed to assign reviewer");
      }
    }
    setSelectedReviewers([]);
    setLoading(false);
    router.refresh();
  };

  const handleEditorAssign = async () => {
    if (selectedEditors.length === 0) return;
    setLoading(true);
    for (const editorId of selectedEditors) {
      const res = await assignEditor(manuscriptId, editorId);
      if (!res.success) {
        alert(res.error || "Failed to assign editor");
      }
    }
    setSelectedEditors([]);
    setLoading(false);
    router.refresh();
  };

  const toggleReviewer = (rid: string) => {
    setSelectedReviewers(prev => 
      prev.includes(rid) ? prev.filter(id => id !== rid) : [...prev, rid]
    );
  };

  const toggleEditor = (editorId: string) => {
    setSelectedEditors(prev =>
      prev.includes(editorId) ? prev.filter(id => id !== editorId) : [...prev, editorId]
    );
  };

  const handleDecision = async (status: ManuscriptStatus) => {
    setLoading(true);
    const res = await updateManuscriptStatus(manuscriptId, status, comment);
    if (!res.success) {
      alert(res.error || "Failed to record decision");
    }
    setShowDecision(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="space-y-4 text-right">
      {canAssignEditors && (
        <div className="flex flex-col gap-3 items-end">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Assign Editor</p>
          <div className="flex flex-wrap gap-2 justify-end max-w-md">
            {editors.map((editor) => {
              const isAssigned = editorAssignments.some((a) => a.editorId === editor.id);
              const isSelected = selectedEditors.includes(editor.id);
              return (
                <button
                  key={editor.id}
                  disabled={isAssigned || loading}
                  onClick={() => toggleEditor(editor.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isAssigned ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" :
                    isSelected ? "bg-purple-600 text-white border-purple-600" :
                    "bg-white text-slate-600 border-slate-300 hover:border-purple-500"
                  }`}
                >
                  {editor.name} {isAssigned && "(assigned)"}
                </button>
              );
            })}
          </div>
          <Button
            onClick={handleEditorAssign}
            disabled={selectedEditors.length === 0 || loading}
            className="gap-2 bg-purple-700 hover:bg-purple-800 text-white shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            {selectedEditors.length > 1 ? `Assign ${selectedEditors.length} Editors` : "Assign Editor"}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 items-end">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Assign Reviewer</p>
        <div className="flex flex-wrap gap-2 justify-end max-w-md">
          {reviewers.map((r) => {
            const isAssigned = reviewerAssignments.some((a) => a.reviewerId === r.id);
            const isSelected = selectedReviewers.includes(r.id);
            return (
              <button
                key={r.id}
                disabled={isAssigned || loading}
                onClick={() => toggleReviewer(r.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isAssigned ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" :
                  isSelected ? "bg-[var(--brand-600)] text-white border-[var(--brand-600)]" :
                  "bg-white text-slate-600 border-slate-300 hover:border-[var(--brand-500)]"
                }`}
              >
                {r.name} {isAssigned && "✓"}
              </button>
            );
          })}
        </div>
        <Button 
          onClick={handleBulkAssign} 
          disabled={selectedReviewers.length === 0 || loading} 
          className="gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> 
          {selectedReviewers.length > 1 ? `Assign ${selectedReviewers.length} Reviewers` : "Assign Reviewer"}
        </Button>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        {showDecision ? (
          <div className="flex flex-col items-end gap-2 bg-slate-50 p-4 border border-slate-200 rounded-xl w-80 text-left shadow-lg absolute z-10 right-8">
            <h4 className="text-sm font-bold w-full">Record Editorial Decision</h4>
            <textarea 
              className="w-full text-sm p-2 border border-slate-300 rounded-md focus:outline-none focus:border-[var(--brand-500)]" 
              rows={3} 
              placeholder="Comments for the author (optional)..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              <Button size="sm" onClick={() => handleDecision("ACCEPTED")} className="bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="w-3 h-3 mr-1" /> Accept</Button>
              <Button size="sm" onClick={() => handleDecision("REJECTED")} className="bg-red-600 hover:bg-red-700 text-white"><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
              <Button size="sm" onClick={() => handleDecision("MINOR_REVISION")} className="bg-amber-500 hover:bg-amber-600 text-white"><AlertTriangle className="w-3 h-3 mr-1" /> Min. Rev</Button>
              <Button size="sm" onClick={() => handleDecision("MAJOR_REVISION")} className="bg-orange-600 hover:bg-orange-700 text-white"><AlertTriangle className="w-3 h-3 mr-1" /> Maj. Rev</Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowDecision(false)} className="w-full mt-1 text-slate-500">Cancel</Button>
          </div>
        ) : (
          <Button onClick={() => setShowDecision(true)} disabled={loading} variant="outline" className="border-[var(--brand-300)] text-[var(--brand-700)]">
            Record Decision
          </Button>
        )}
        {canPublish && currentStatus === "ACCEPTED" && (
          <Button onClick={handlePublish} disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white gap-2">
            <CheckCircle2 className="w-4 h-4" /> Publish Article
          </Button>
        )}
      </div>
    </div>
  );
}
