"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const error = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) return;
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        toast({ variant: "destructive", title: "Sign in failed", description: "Invalid email or password." });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Welcome back</h1>
        <p className="text-[var(--muted)] text-sm">Sign in to your Resonara account to continue.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">
          {error === "CredentialsSignin" ? "Invalid email or password." : "Something went wrong. Please try again."}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@university.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--brand-600)] hover:text-[var(--brand-700)] font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
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

        <Button type="submit" className="w-full h-11" loading={loading}>
          {!loading && <LogIn className="w-4 h-4" />}
          Sign in
        </Button>
      </form>

      {/* Demo credentials */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 space-y-3">
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Demo Accounts</p>
        <div className="grid grid-cols-1 gap-2">
          {[
            { role: "Super Admin", email: "admin@nexschoolar.com", color: "text-[var(--brand-600)]" },
            { role: "Editor", email: "editor@nexschoolar.com", color: "text-purple-600" },
            { role: "Reviewer", email: "reviewer@nexschoolar.com", color: "text-amber-600" },
            { role: "Author", email: "author@nexschoolar.com", color: "text-emerald-600" },
          ].map((demo) => (
            <button
              key={demo.role}
              type="button"
              onClick={() => setForm({ email: demo.email, password: "password123" })}
              className="flex items-center justify-between text-xs px-3 py-2 rounded-lg hover:bg-[var(--border-subtle)] transition-colors text-left"
            >
              <span className={`font-semibold ${demo.color}`}>{demo.role}</span>
              <span className="text-[var(--muted)] font-mono">{demo.email}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-[var(--muted)]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[var(--brand-600)] hover:text-[var(--brand-700)] font-semibold transition-colors">
          Create account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
