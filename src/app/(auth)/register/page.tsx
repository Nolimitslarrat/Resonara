"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", affiliation: "", role: "AUTHOR" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.role) return;
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("affiliation", form.affiliation);
    formData.append("role", form.role);

    const result = await registerUser(formData);
    setLoading(false);

    if (result.success) {
      toast({ title: "Account created", description: "You can now log in." });
      router.push("/login");
    } else {
      toast({ variant: "destructive", title: "Registration failed", description: result.error });
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up max-w-md w-full mx-auto p-8 bg-white border border-[var(--border)] rounded-2xl shadow-xl mt-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-600)] to-[var(--brand-400)] flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-editorial font-bold tracking-tight text-[var(--brand-900)]">Create an Account</h1>
        <p className="text-[var(--muted)] text-sm">Join the Resonara academic publishing platform.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "AUTHOR" })}
            className={`p-3 border rounded-xl text-center text-sm font-bold transition-all ${
              form.role === "AUTHOR" 
                ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)] shadow-sm" 
                : "border-[var(--border)] text-[var(--muted)] hover:bg-slate-50"
            }`}
          >
            I am an Author
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "REVIEWER" })}
            className={`p-3 border rounded-xl text-center text-sm font-bold transition-all ${
              form.role === "REVIEWER" 
                ? "border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)] shadow-sm" 
                : "border-[var(--border)] text-[var(--muted)] hover:bg-slate-50"
            }`}
          >
            I am a Reviewer
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="Dr. Jane Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Academic Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane.smith@university.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="affiliation">Institution / Affiliation</Label>
          <Input
            id="affiliation"
            placeholder="University of Science"
            value={form.affiliation}
            onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white font-bold rounded-xl shadow-md" disabled={loading}>
          {loading ? "Creating Account..." : <><UserPlus className="w-4 h-4 mr-2" /> Register</>}
        </Button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-[var(--muted)] border-t border-[var(--border)] pt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--brand-600)] hover:text-[var(--brand-700)] font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
