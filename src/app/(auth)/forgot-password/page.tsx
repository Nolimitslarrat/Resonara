"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="space-y-6 animate-fade-in-up text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Request received</h1>
          <p className="text-[var(--muted)] text-sm max-w-sm mx-auto">
            If password reset email delivery is configured for this site, instructions will be sent to{" "}
            <span className="font-semibold text-[var(--foreground)]">{email}</span>.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Forgot password?</h1>
        <p className="text-[var(--muted)] text-sm">
          Enter your email to request password reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full h-11" loading={loading}>
          {!loading && <Mail className="w-4 h-4" />}
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--muted)]">
        Remembered it?{" "}
        <Link href="/login" className="text-[var(--brand-600)] hover:text-[var(--brand-700)] font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
