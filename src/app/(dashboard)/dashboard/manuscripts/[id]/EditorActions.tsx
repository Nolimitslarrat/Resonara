"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { assignReviewer, updateManuscriptStatus } from "@/app/actions/editor";

export function EditorActions({ manuscriptId, currentStatus, reviewers, assignments }: any) {
  const [loading, setLoading] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState("");
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

  const handleAssign = async () => {
    if (!selectedReviewer) return;
    setLoading(true);
    await assignReviewer(manuscriptId, selectedReviewer);
    setSelectedReviewer("");
    setLoading(false);
  };

  const handleDecision = async (status: string) => {
    setLoading(true);
    await updateManuscriptStatus(manuscriptId, status, comment);
    setShowDecision(false);
    setLoading(false);
  };

  return (
    <div className="space-y-4 text-right">
      <div className="flex gap-2 justify-end">
        <select 
          className="border border-slate-300 rounded-md px-3 text-sm focus:outline-none focus:border-[var(--brand-500)]"
          value={selectedReviewer}
          onChange={e => setSelectedReviewer(e.target.value)}
        >
          <option value="">-- Select Reviewer to Assign --</option>
          {reviewers.map((r: any) => (
            <option key={r.id} value={r.id} disabled={assignments.some((a: any) => a.reviewerId === r.id)}>
              {r.name} {assignments.some((a: any) => a.reviewerId === r.id) ? "(Already Assigned)" : ""}
            </option>
          ))}
        </select>
        <Button onClick={handleAssign} disabled={!selectedReviewer || loading} className="gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white">
          <UserPlus className="w-4 h-4" /> Assign
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
        {currentStatus === "ACCEPTED" && (
          <Button onClick={handlePublish} disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white gap-2">
            <CheckCircle2 className="w-4 h-4" /> Publish Article
          </Button>
        )}
      </div>
    </div>
  );
}
