"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, BookOpen, User, GraduationCap, FlaskConical,
  Lock, ArrowRight, ArrowLeft, Check, Loader2, Pen, Building2,
  Globe, Tag, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { registerUser } from "@/app/actions/auth";

// ─── Step definitions ────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    title: "Who are you?",
    subtitle: "Choose your primary role in the academic community",
    icon: User,
  },
  {
    id: 2,
    title: "Your Identity",
    subtitle: "Basic account credentials — quick and secure",
    icon: Lock,
  },
  {
    id: 3,
    title: "Your Affiliation",
    subtitle: "Tell us about your institution and position",
    icon: Building2,
  },
  {
    id: 4,
    title: "Your Expertise",
    subtitle: "Help editors and reviewers find you by research area",
    icon: FlaskConical,
  },
];

const ROLE_OPTIONS = [
  {
    value: "AUTHOR",
    label: "Author",
    desc: "I submit research manuscripts for publication",
    icon: Pen,
    color: "from-violet-500 to-indigo-600",
  },
  {
    value: "REVIEWER",
    label: "Reviewer",
    desc: "I peer-review manuscripts for journals",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-600",
  },
];

type FormState = {
  role: string;
  name: string;
  email: string;
  password: string;
  affiliation: string;
  designation: string;
  orcid: string;
  bio: string;
  expertise: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState<FormState>({
    role: "AUTHOR",
    name: "",
    email: "",
    password: "",
    affiliation: "",
    designation: "",
    orcid: "",
    bio: "",
    expertise: "",
  });

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const canAdvance = () => {
    if (step === 1) return !!form.role;
    if (step === 2) return form.name.length > 1 && form.email.includes("@") && form.password.length >= 6;
    if (step === 3) return true; // affiliation optional
    return true;
  };

  const next = () => { if (canAdvance()) setStep((s) => s + 1); };
  const prev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    const result = await registerUser(fd);
    setLoading(false);
    if (result.success) {
      setStep(5); // success screen
    } else {
      toast({ variant: "destructive", title: "Registration failed", description: result.error });
    }
  };

  const progress = Math.round(((step - 1) / STEPS.length) * 100);

  // ─── Success screen ──────────────────────────────────────
  if (step === 5) {
    return (
      <div className="max-w-md w-full mx-auto p-8 text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-editorial font-bold text-[var(--brand-900)] mb-3">
          Welcome aboard!
        </h1>
        <p className="text-[var(--muted)] mb-8 leading-relaxed">
          Your account has been created successfully. You can now sign in and start your academic journey with Resonara Publishers Pvt. Ltd..
        </p>
        <Link href="/login">
          <Button className="w-full h-12 bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white font-bold rounded-xl shadow-md">
            Sign In to Your Account
          </Button>
        </Link>
      </div>
    );
  }

  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="max-w-lg w-full mx-auto animate-fade-in-up">
      {/* Top card */}
      <div className="bg-white border border-[var(--border)] rounded-3xl shadow-xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-400)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step header */}
        <div className="px-8 pt-8 pb-6 border-b border-[var(--border)] bg-gradient-to-br from-[var(--brand-900)] to-[var(--brand-700)] text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <StepIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-300)]">
                  Step {step} of {STEPS.length}
                </p>
                <h2 className="text-xl font-editorial font-bold leading-tight">
                  {currentStep.title}
                </h2>
              </div>
            </div>
            {/* Step dots */}
            <div className="flex gap-1.5">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-full transition-all duration-300 ${
                    s.id === step
                      ? "w-6 h-2 bg-white"
                      : s.id < step
                        ? "w-2 h-2 bg-white/60"
                        : "w-2 h-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-[var(--brand-200)]">{currentStep.subtitle}</p>
        </div>

        {/* Step content */}
        <div className="p-8">
          {/* ── Step 1: Role ── */}
          {step === 1 && (
            <div className="space-y-4">
              {ROLE_OPTIONS.map((opt) => {
                const Ic = opt.icon;
                const selected = form.role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: opt.value }))}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selected
                        ? "border-[var(--brand-500)] bg-[var(--brand-50)] shadow-md shadow-[var(--brand-500)]/10"
                        : "border-[var(--border)] hover:border-[var(--brand-200)] hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${opt.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Ic className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-base ${selected ? "text-[var(--brand-800)]" : "text-[var(--foreground)]"}`}>
                        {opt.label}
                      </p>
                      <p className="text-sm text-[var(--muted)] mt-0.5">{opt.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selected
                        ? "border-[var(--brand-500)] bg-[var(--brand-500)]"
                        : "border-slate-300"
                    }`}>
                      {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
              <p className="text-xs text-[var(--muted)] text-center pt-2">
                You can always switch roles later from your profile settings.
              </p>
            </div>
          )}

          {/* ── Step 2: Credentials ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-[var(--foreground)]">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    placeholder="Dr. Jane Smith"
                    value={form.name}
                    onChange={set("name")}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[var(--foreground)]">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">@</span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane.smith@university.edu"
                    value={form.email}
                    onChange={set("email")}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-[var(--foreground)]">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={set("password")}
                    className="pl-10 pr-10 h-11 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength hint */}
                {form.password.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                          form.password.length >= i * 3
                            ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-yellow-400" : "bg-emerald-400"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Affiliation ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="affiliation" className="text-sm font-semibold text-[var(--foreground)]">
                  Institution / University
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="affiliation"
                    placeholder="e.g. Harvard University"
                    value={form.affiliation}
                    onChange={set("affiliation")}
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-semibold text-[var(--foreground)]">
                  Designation / Title
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="designation"
                    placeholder="e.g. Associate Professor, PhD Scholar"
                    value={form.designation}
                    onChange={set("designation")}
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orcid" className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  ORCID iD
                  <span className="text-[10px] text-[var(--muted)] font-normal bg-slate-100 px-2 py-0.5 rounded">Optional</span>
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="orcid"
                    placeholder="0000-0000-0000-0000"
                    value={form.orcid}
                    onChange={set("orcid")}
                    className="pl-10 h-11 rounded-xl font-mono"
                  />
                </div>
                <p className="text-xs text-[var(--muted)]">
                  ORCID is a persistent digital identifier for researchers.{" "}
                  <a href="https://orcid.org" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-600)] hover:underline">
                    Get yours free →
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* ── Step 4: Expertise + Bio ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="expertise" className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  Research Areas / Keywords
                  <span className="text-[10px] text-[var(--muted)] font-normal bg-slate-100 px-2 py-0.5 rounded">Comma separated</span>
                </Label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <Input
                    id="expertise"
                    placeholder="Machine Learning, Genomics, Climate Science..."
                    value={form.expertise}
                    onChange={set("expertise")}
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
                {form.expertise && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.expertise.split(",").filter(s => s.trim()).map((tag, i) => (
                      <span key={i} className="text-xs bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-200)] px-2.5 py-0.5 rounded-full font-medium">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  Short Bio
                  <span className="text-[10px] text-[var(--muted)] font-normal bg-slate-100 px-2 py-0.5 rounded">Optional</span>
                </Label>
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="Brief description of your research background and interests..."
                  value={form.bio}
                  onChange={set("bio")}
                  className="w-full resize-none rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-400)] focus:border-transparent transition-all"
                />
                <p className="text-xs text-[var(--muted)]">
                  Visible to journal editors. Helps with matching for peer review assignments.
                </p>
              </div>

              {/* Summary preview */}
              <div className="rounded-2xl border border-[var(--border)] bg-slate-50/60 p-4 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                  Profile Preview
                </p>
                {[
                  { label: "Role", value: form.role },
                  { label: "Name", value: form.name },
                  { label: "Email", value: form.email },
                  { label: "Institution", value: form.affiliation || "—" },
                  { label: "Title", value: form.designation || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-[var(--muted)] font-medium">{label}</span>
                    <span className="font-semibold text-[var(--foreground)] text-right max-w-[200px] truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation footer */}
        <div className="px-8 pb-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prev}
              className="gap-2 border-[var(--border)] rounded-xl h-11"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={next}
              disabled={!canAdvance()}
              className="gap-2 bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-xl h-11 px-6 font-bold shadow-md disabled:opacity-50"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canAdvance()}
              className="gap-2 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-500)] hover:from-[var(--brand-700)] hover:to-[var(--brand-600)] text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-[var(--brand-500)]/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Create Account
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-[var(--muted)] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--brand-600)] hover:text-[var(--brand-700)] font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
