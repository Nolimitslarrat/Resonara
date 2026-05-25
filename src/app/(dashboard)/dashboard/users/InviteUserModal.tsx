"use client";

import { useState } from "react";
import { UserPlus, X, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteUser } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const ROLES = [
  {
    value: "MANAGING_EDITOR",
    label: "Managing Editor",
    description: "Can manage editorial queue and assign reviewers",
    color: "bg-purple-50 border-purple-300 text-purple-700",
    dot: "bg-purple-500",
  },
  {
    value: "PRODUCTION",
    label: "Production Editor",
    description: "Manages production stages (copyediting, typesetting)",
    color: "bg-cyan-50 border-cyan-300 text-cyan-700",
    dot: "bg-cyan-500",
  },
  {
    value: "REVIEWER",
    label: "Reviewer",
    description: "Can review manuscripts assigned to them",
    color: "bg-amber-50 border-amber-300 text-amber-700",
    dot: "bg-amber-500",
  },
  {
    value: "AUTHOR",
    label: "Author",
    description: "Can submit manuscripts to journals",
    color: "bg-emerald-50 border-emerald-300 text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full platform access and user management",
    color: "bg-red-50 border-red-300 text-red-700",
    dot: "bg-red-500",
  },
];

export function InviteUserModal({ 
  triggerClassName, 
  triggerVariant = "default" 
}: { 
  triggerClassName?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
} = {}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState("MANAGING_EDITOR");

  const filteredRoles = ROLES.filter(r => {
    if (r.value === "SUPER_ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      return false;
    }
    return true;
  });

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setSuccess(false);
    setSelectedRole("MANAGING_EDITOR");
    setShowPass(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("role", selectedRole);

    const result = await inviteUser(formData);

    if (result.success) {
      setSuccess(true);
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Button 
        onClick={handleOpen} 
        variant={triggerVariant}
        className={triggerClassName || "gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white shadow-sm"}
      >
        <UserPlus className="w-4 h-4" />
        Add User
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--brand-600)] flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">Add New User</h2>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Create an account they can immediately log in with</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {success ? (
              <div className="p-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">User Created!</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    The user has been added to the platform and can log in with their credentials immediately.
                  </p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <Button variant="outline" className="flex-1" onClick={() => { handleClose(); }}>
                    Done
                  </Button>
                  <Button
                    className="flex-1 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white"
                    onClick={() => { setSuccess(false); setSelectedRole("MANAGING_EDITOR"); }}
                  >
                    Add Another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 font-medium flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">⚠️</span>
                    {error}
                  </div>
                )}

                {/* Role selector */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Role *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredRoles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value)}
                        className={`p-3 border-2 rounded-xl text-left transition-all ${
                          selectedRole === role.value
                            ? role.color + " border-current"
                            : "border-[var(--border)] text-[var(--muted)] hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`w-2 h-2 rounded-full ${selectedRole === role.value ? role.dot : "bg-slate-300"}`} />
                          <span className="text-xs font-bold">{role.label}</span>
                        </div>
                        <p className="text-[10px] leading-tight opacity-75 pl-4">{role.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                    <Input name="name" required placeholder="Dr. Jane Smith" className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address *</label>
                    <Input type="email" name="email" required placeholder="jane@example.com" className="h-11" />
                  </div>
                </div>

                {/* Designation + Affiliation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Designation</label>
                    <Input name="designation" placeholder="e.g. Professor & HOD" className="h-11" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Institution / Affiliation</label>
                    <Input name="affiliation" placeholder="University of Science" className="h-11" />
                  </div>
                </div>

                {/* Profile Links */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 text-xs">Institutional Profile URL</label>
                    <Input type="url" name="institutionalProfile" placeholder="https://univ.edu/profile" className="h-11 text-xs" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 text-xs">APID / Scholar URL</label>
                    <Input type="url" name="apidProfile" placeholder="https://scholar.google.com/..." className="h-11 text-xs" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Set Password *</label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPass ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      className="h-11 pr-10"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] mt-1">
                    Share these credentials with the user so they can log in.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
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
                    ) : "Create User"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
