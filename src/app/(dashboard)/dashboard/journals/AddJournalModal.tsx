"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createJournal } from "@/app/actions/journal";

export function AddJournalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createJournal(formData);

    if (result.success) {
      setIsOpen(false);
      // The page will revalidate automatically due to the server action
    } else {
      setError(result.error || "An error occurred");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Journal
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-800">Add New Journal</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Journal Title *</label>
                <Input name="title" required placeholder="e.g. International Journal of Science" className="h-11" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">ISSN (Print)</label>
                  <Input name="issnPrint" placeholder="XXXX-XXXX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">ISSN (Online)</label>
                  <Input name="issnOnline" placeholder="XXXX-XXXX" />
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
                      Creating...
                    </>
                  ) : "Create Journal"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
