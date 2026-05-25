import { ClipboardList, Users, BarChart3, BookOpen, ChevronRight, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Editor Guidelines | Resonara",
  description: "Responsibilities, workflows, and best practices for Managing Editors on the Resonara platform.",
};

const responsibilities = [
  {
    icon: ClipboardList,
    title: "Initial Screening",
    body: "Review new submissions for scope, formatting, and basic quality. Decide whether to desk-reject or send to peer review with clear editorial reasoning.",
  },
  {
    icon: Users,
    title: "Reviewer Assignment",
    body: "Identify and invite qualified reviewers for each manuscript. Monitor invitation responses and send reminders as needed.",
  },
  {
    icon: BarChart3,
    title: "Editorial Decision",
    body: "Evaluate reviewer reports holistically. Make Accept, Minor Revision, Major Revision, or Reject decisions with a detailed editorial letter.",
  },
  {
    icon: Shield,
    title: "Conflict of Interest",
    body: "Recuse yourself from manuscripts where you have a financial, personal, or professional conflict. Transfer the manuscript to another editor.",
  },
  {
    icon: BookOpen,
    title: "Production Oversight",
    body: "Coordinate with the production team so accepted manuscripts move through copyediting, typesetting, and publication preparation.",
  },
  {
    icon: ChevronRight,
    title: "Author Communication",
    body: "Give authors clear, constructive feedback and keep editorial communication organized in the platform.",
  },
];

const standards = [
  { label: "Desk decision", target: "Clear scope and quality screening" },
  { label: "Reviewer selection", target: "Relevant expertise and conflict checks" },
  { label: "First decision", target: "Balanced editorial judgement" },
  { label: "Revision decision", target: "Transparent author guidance" },
  { label: "Production handoff", target: "Complete files and metadata" },
];

export default function EditorsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center space-y-5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-700 text-sm font-semibold border border-violet-200">
          <ClipboardList className="w-3.5 h-3.5" /> For Editors
        </span>
        <h1 className="text-4xl sm:text-5xl font-editorial font-bold text-[var(--brand-900)] leading-tight">
          Editor Guidelines
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Your role as a Managing Editor is central to maintaining the quality and integrity of Resonara journals.
        </p>
        <Link href="/login">
          <Button className="rounded-full h-11 px-8 gap-2 bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white shadow-md">
            Access Editorial Dashboard <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Responsibilities */}
      <section>
        <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-10 text-center">
          Editor Responsibilities
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {responsibilities.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-base font-bold text-[var(--brand-900)] mb-2">{r.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{r.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Performance standards */}
      <section className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-6">
          Editorial Working Principles
        </h2>
        <div className="divide-y divide-[var(--border)]">
          {standards.map((s) => (
            <div key={s.label} className="flex items-center justify-between py-4">
              <span className="text-sm text-[var(--foreground)] font-medium">{s.label}</span>
              <span className="text-sm font-bold text-[var(--brand-600)] bg-[var(--brand-50)] px-3 py-1 rounded-full border border-[var(--brand-200)]">
                {s.target}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--brand-900)] rounded-2xl p-10 text-center text-white">
        <h2 className="text-2xl font-editorial font-bold mb-3">Ready to manage your journal?</h2>
        <p className="text-[var(--brand-300)] mb-6">
          Log in to access your editorial dashboard and manuscript queue.
        </p>
        <Link href="/login">
          <Button className="rounded-full h-11 px-8 bg-white text-[var(--brand-900)] hover:bg-[var(--brand-50)] font-bold shadow">
            Sign In
          </Button>
        </Link>
      </section>
    </div>
  );
}

