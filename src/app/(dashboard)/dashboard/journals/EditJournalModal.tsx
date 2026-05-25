"use client";

import { useState } from "react";
import { Edit, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateJournal } from "@/app/actions/journal";

type Journal = {
  id: string;
  title: string;
  issnPrint: string | null;
  issnOnline: string | null;
  description: string | null;
  scope: string | null;
  isActive: boolean;
};

export function EditJournalModal({ journal }: { journal: Journal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateJournal(journal.id, formData);

    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || "An error occurred");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)} className="h-8 w-8 text-slate-400 hover:text-[var(--brand-600)]">
        <Edit className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b shrink-0">
              <h2 className="text-xl font-bold text-slate-800">Edit Journal</h2>
              <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Journal Title *</label>
                <Input name="title" required defaultValue={journal.title} className="h-11" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">ISSN (Print)</label>
                  <Input name="issnPrint" defaultValue={journal.issnPrint || ""} placeholder="XXXX-XXXX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">ISSN (Online)</label>
                  <Input name="issnOnline" defaultValue={journal.issnOnline || ""} placeholder="XXXX-XXXX" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Short Scope / Description</label>
                <textarea 
                  name="scope"
                  rows={3}
                  defaultValue={journal.scope || ""}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Description (Optional)</label>
                <textarea 
                  name="description"
                  rows={4}
                  defaultValue={journal.description || ""}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="hidden" name="isActive" value="false" />
                <input type="checkbox" id={`active-${journal.id}`} name="isActive" value="true" defaultChecked={journal.isActive} className="w-4 h-4 text-[var(--brand-600)]" />
                <label htmlFor={`active-${journal.id}`} className="text-sm font-bold text-slate-700">Active (Visible)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsOpen(false)} 
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
                  ) : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
