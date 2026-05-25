"use client";

import { useState } from "react";
import { User, Mail, Shield, Building2, Fingerprint, ExternalLink, X, Loader2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserAdmin, softDeleteUser, adminResetPassword } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  orcid: string | null;
  affiliation: string | null;
  designation: string | null;
  institutionalProfile: string | null;
  apidProfile: string | null;
  bio: string | null;
};

export function EditUserModal({ user }: { user: UserData }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateUserAdmin(user.id, formData);

    if (result.success) {
      toast({
        title: "User updated",
        description: "The user profile has been successfully updated.",
      });
      router.refresh();
      setIsOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: result.error || "An error occurred",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={() => setIsOpen(true)} 
        className="gap-1 text-[var(--brand-600)] hover:text-[var(--brand-700)]"
      >
        <Edit className="w-4 h-4" />
        Edit Profile
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--brand-900)] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">Edit User Profile</h2>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Manage detailed personal and professional credentials.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-bold">Full Name *</Label>
                  <Input id="name" name="name" required defaultValue={user.name} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-bold">Email Address *</Label>
                  <Input id="email" type="email" name="email" required defaultValue={user.email} className="h-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="designation" className="text-xs font-bold">Designation (e.g. Professor & HOD)</Label>
                  <Input id="designation" name="designation" defaultValue={user.designation || ""} placeholder="Professor & HOD" className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="affiliation" className="text-xs font-bold">Institution / Affiliation</Label>
                  <Input id="affiliation" name="affiliation" defaultValue={user.affiliation || ""} placeholder="University of Science" className="h-10" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="orcid" className="text-xs font-bold">ORCID Identifier</Label>
                <Input id="orcid" name="orcid" defaultValue={user.orcid || ""} placeholder="0000-0000-0000-0000" className="h-10" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="institutionalProfile" className="text-xs font-bold flex items-center gap-1">
                    Institutional Profile URL
                  </Label>
                  <Input 
                    id="institutionalProfile" 
                    name="institutionalProfile" 
                    type="url" 
                    defaultValue={user.institutionalProfile || ""} 
                    placeholder="https://univ.edu/faculty/profile" 
                    className="h-10 text-xs" 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apidProfile" className="text-xs font-bold flex items-center gap-1">
                    APID / Scholar Profile URL
                  </Label>
                  <Input 
                    id="apidProfile" 
                    name="apidProfile" 
                    type="url" 
                    defaultValue={user.apidProfile || ""} 
                    placeholder="https://scholar.google.com/citations?user=..." 
                    className="h-10 text-xs" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="bio" className="text-xs font-bold">Biography (Optional)</Label>
                <textarea
                  id="bio"
                  name="bio"
                  defaultValue={user.bio || ""}
                  placeholder="Short professional biography..."
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3 border-t flex-wrap">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to deactivate this user account?")) {
                      const res = await softDeleteUser(user.id);
                      if (res.success) {
                        toast({ title: "User deactivated" });
                        router.refresh();
                        setIsOpen(false);
                      } else {
                        toast({ variant: "destructive", title: "Error", description: res.error });
                      }
                    }
                  }} 
                >
                  Deactivate User
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="mr-auto border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                  onClick={async () => {
                    const newPassword = window.prompt("Enter the new password for this user (minimum 6 characters):");
                    if (newPassword === null) return; // User cancelled
                    if (newPassword.trim().length < 6) {
                      toast({ variant: "destructive", title: "Error", description: "Password must be at least 6 characters." });
                      return;
                    }
                    if (window.confirm(`Are you sure you want to reset this user's password to: ${newPassword} ?`)) {
                      const res = await adminResetPassword(user.id, newPassword);
                      if (res.success) {
                        toast({ title: "Password Reset", description: `The password has been updated successfully.` });
                        setIsOpen(false);
                      } else {
                        toast({ variant: "destructive", title: "Error", description: res.error });
                      }
                    }
                  }} 
                >
                  Reset Password
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white font-bold"
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
