"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/app/actions/reviewer";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ReviewForm({ assignmentId }: { assignmentId: string }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    score: "85",
    recommendation: "ACCEPT",
    commentsToAuthor: "",
    commentsToEditor: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("score", form.score);
    formData.append("recommendation", form.recommendation);
    formData.append("commentsToAuthor", form.commentsToAuthor);
    formData.append("commentsToEditor", form.commentsToEditor);

    const res = await submitReview(formData);
    setLoading(false);

    if (res.success) {
      toast({ title: "Review Submitted", description: "Thank you for your review." });
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="score">Overall Score (0-100) *</Label>
          <Input 
            id="score" 
            type="number" 
            min="0" max="100" 
            value={form.score}
            onChange={e => setForm({...form, score: e.target.value})}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recommendation">Recommendation *</Label>
          <select 
            id="recommendation"
            className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] text-sm"
            value={form.recommendation}
            onChange={e => setForm({...form, recommendation: e.target.value})}
            required
          >
            <option value="ACCEPT">Accept Submission</option>
            <option value="MINOR_REVISION">Minor Revision</option>
            <option value="MAJOR_REVISION">Major Revision</option>
            <option value="REJECT">Reject</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="commentsToAuthor">Comments to Author *</Label>
        <textarea 
          id="commentsToAuthor"
          className="w-full p-3 min-h-[150px] rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] text-sm"
          placeholder="Please provide constructive feedback..."
          value={form.commentsToAuthor}
          onChange={e => setForm({...form, commentsToAuthor: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="commentsToEditor">Confidential Comments to Editor</Label>
        <textarea 
          id="commentsToEditor"
          className="w-full p-3 min-h-[100px] rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] text-sm bg-slate-50"
          placeholder="These comments will not be shared with the author..."
          value={form.commentsToEditor}
          onChange={e => setForm({...form, commentsToEditor: e.target.value})}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white">
        {loading ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Review</>}
      </Button>
    </form>
  );
}
