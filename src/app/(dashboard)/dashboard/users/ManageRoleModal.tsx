"use client";

import { useState } from "react";
import { ShieldAlert, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/app/actions/user";

export function ManageRoleModal({ userId, currentRole, userName }: { userId: string, currentRole: string, userName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateUserRole(userId, formData);

    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || "An error occurred");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setIsOpen(true)} className="gap-1 text-[var(--muted)] hover:text-red-600">
        <ShieldAlert className="w-4 h-4" />
        Manage Role
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Manage Role</h2>
              <button onClick={() => setIsOpen(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 font-medium">
                  {error}
                </div>
              )}

              <p className="text-sm text-[var(--muted)] mb-2">
                Update role for <span className="font-bold text-slate-800">{userName}</span>
              </p>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Select Role</label>
                <select
                  name="role"
                  required
                  defaultValue={currentRole}
                  className="w-full h-11 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] bg-white"
                >
                  <option value="AUTHOR">Author</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="EDITOR">Editor</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : "Update Role"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
