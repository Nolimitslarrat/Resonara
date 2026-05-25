"use client";

import { useState } from "react";
import { User, Mail, Building2, BookOpen, Save, KeyRound, Fingerprint, Link as LinkIcon, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { changeUserPassword, updateUserProfile } from "@/app/actions/user";
import type { User as PrismaUser } from "@prisma/client";

export default function SettingsClient({ user }: { user: PrismaUser | null }) {
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [form, setForm] = useState({
    name: user?.name ?? "",
    affiliation: user?.affiliation ?? "",
    bio: user?.bio ?? "",
    orcid: user?.orcid ?? "",
    designation: user?.designation ?? "",
    institutionalProfile: user?.institutionalProfile ?? "",
    apidProfile: user?.apidProfile ?? "",
  });

  async function handleSave(formData: FormData) {
    setSaving(true);
    const res = await updateUserProfile(formData);
    setSaving(false);
    
    if (res.success) {
      toast({ title: "Settings saved", description: "Your profile has been updated." });
    } else {
      toast({ variant: "destructive", title: "Error", description: res.error });
    }
  }

  const role = user?.role ?? "";

  const ROLE_LABELS: Record<string, string> = {
    SUPER_ADMIN: "Super Administrator",
    MANAGING_EDITOR: "Managing Editor",
    REVIEWER: "Peer Reviewer",
    AUTHOR: "Author",
    PRODUCTION: "Production Staff",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in-up pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Account Settings</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Manage your profile, credentials, and preferences.
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-700)] p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold text-white shadow-lg flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-lg truncate">{user?.name}</p>
            <p className="text-[var(--brand-300)] text-sm truncate">{user?.email}</p>
            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur">
              {ROLE_LABELS[role] ?? role}
            </span>
          </div>
        </div>

        <form action={handleSave} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Jane Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email (read-only)
              </Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                disabled
                className="bg-slate-50 cursor-not-allowed text-[var(--muted)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation" className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Designation
              </Label>
              <Input
                id="designation"
                name="designation"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="Professor of Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="affiliation" className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> Institution / Affiliation
              </Label>
              <Input
                id="affiliation"
                name="affiliation"
                value={form.affiliation}
                onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                placeholder="University of Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orcid" className="flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5" /> ORCID iD
              </Label>
              <Input
                id="orcid"
                name="orcid"
                value={form.orcid}
                onChange={(e) => setForm({ ...form, orcid: e.target.value })}
                placeholder="0000-0000-0000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institutionalProfile" className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5" /> Institutional Profile URL
              </Label>
              <Input
                id="institutionalProfile"
                name="institutionalProfile"
                value={form.institutionalProfile}
                onChange={(e) => setForm({ ...form, institutionalProfile: e.target.value })}
                placeholder="https://university.edu/faculty/janesmith"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="apidProfile" className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5" /> APID Profile URL
              </Label>
              <Input
                id="apidProfile"
                name="apidProfile"
                value={form.apidProfile}
                onChange={(e) => setForm({ ...form, apidProfile: e.target.value })}
                placeholder="https://apid.org/profile/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Short Bio
            </Label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Brief biography for your public profile..."
              rows={4}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="gap-2" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {/* Password section */}
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6 sm:p-8">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-1 flex items-center gap-2">
          <KeyRound className="w-4 h-4" /> Change Password
        </h2>
        <p className="text-sm text-[var(--muted)] mb-6">
          Use a strong password with at least 6 characters.
        </p>
        <form action={async (formData) => {
          setSavingPassword(true);
          const currentPassword = formData.get("currentPassword") as string;
          const newPassword = formData.get("newPassword") as string;
          const confirmPassword = formData.get("confirmPassword") as string;
          
          if (newPassword !== confirmPassword) {
            toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
            setSavingPassword(false);
            return;
          }

          const res = await changeUserPassword(formData);
          if (res.success) {
            toast({ title: "Success", description: "Your password has been updated." });
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          } else {
            toast({ variant: "destructive", title: "Error", description: res.error });
          }
          setSavingPassword(false);
        }} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              name="currentPassword" 
              type="password" 
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              name="newPassword" 
              type="password" 
              required
              minLength={6}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              name="confirmPassword" 
              type="password" 
              required
              minLength={6}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            className="gap-2"
            disabled={savingPassword}
          >
            <KeyRound className="w-4 h-4" />
            {savingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
