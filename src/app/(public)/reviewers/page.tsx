import { Star, Shield, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Reviewer Guidelines | Resonara",
  description: "Guidance for peer reviewers on how to evaluate manuscripts submitted to Resonara journals.",
};

const principles = [
  {
    icon: Shield,
    title: "Confidentiality",
    body: "Manuscripts submitted for review are confidential documents. Do not share or discuss the content with anyone not involved in the review process.",
  },
  {
    icon: CheckCircle2,
    title: "Impartiality",
    body: "Reviews must be objective and based on scientific merit. Personal criticism is not acceptable. Decline to review if you have a conflict of interest.",
  },
  {
    icon: Clock,
    title: "Timeliness",
    body: "Accept invitations only when you can meet the deadline — typically 14 days. Contact the editor promptly if you cannot complete the review on time.",
  },
  {
    icon: Star,
    title: "Constructiveness",
    body: "Provide specific, actionable feedback that helps authors improve their work, regardless of your recommendation decision.",
  },
];

const criteria = [
  { label: "Originality", description: "Does the work present novel findings or perspectives?" },
  { label: "Methodology", description: "Are the study design and methods appropriate and rigorous?" },
  { label: "Clarity", description: "Is the paper clearly written and well-structured?" },
  { label: "References", description: "Is the literature review complete and citations accurate?" },
  { label: "Significance", description: "Does the work make a meaningful contribution to the field?" },
  { label: "Ethics", description: "Does the study adhere to ethical standards and guidelines?" },
];

export default function ReviewersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center space-y-5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-200">
          <Star className="w-3.5 h-3.5" /> For Reviewers
        </span>
        <h1 className="text-4xl sm:text-5xl font-editorial font-bold text-[var(--brand-900)] leading-tight">
          Reviewer Guidelines
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Peer review is at the heart of academic publishing. Thank you for supporting scientific integrity.
        </p>
        <Link href="/register">
          <Button className="rounded-full h-11 px-8 gap-2 bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white shadow-md">
            Join as Reviewer <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Core principles */}
      <section>
        <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-10 text-center">
          Core Principles
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white border border-[var(--border)] rounded-2xl p-7 shadow-sm flex gap-5"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--brand-900)] mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Review criteria */}
      <section>
        <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-3 text-center">
          Evaluation Criteria
        </h2>
        <p className="text-center text-slate-600 text-sm mb-10">
          Score each manuscript on the following dimensions in your review form.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {criteria.map((c, i) => (
            <div key={c.label} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[var(--brand-600)] bg-[var(--brand-50)] border border-[var(--brand-200)] w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-bold text-[var(--brand-800)] text-sm">{c.label}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process timeline */}
      <section className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-6">
          Review Process Timeline
        </h2>
        <div className="space-y-5">
          {[
            { step: "Invitation received", note: "You receive an email with manuscript title and abstract." },
            { step: "Accept or decline", note: "Respond within 3 days. If you have a conflict of interest, please decline." },
            { step: "Access manuscript", note: "After accepting, download the blinded manuscript via your dashboard." },
            { step: "Submit review", note: "Complete your structured review form within 14 days of accepting." },
            { step: "Decision communicated", note: "The editor considers all reviews and notifies the author." },
          ].map((item, i) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-[var(--brand-600)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.step}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--brand-900)] rounded-2xl p-10 text-center text-white">
        <h2 className="text-2xl font-editorial font-bold mb-3">Become a Reviewer</h2>
        <p className="text-[var(--brand-300)] mb-6 max-w-md mx-auto">
          Register as a reviewer to be invited for manuscripts matching your expertise.
        </p>
        <Link href="/register">
          <Button className="rounded-full h-11 px-8 bg-white text-[var(--brand-900)] hover:bg-[var(--brand-50)] font-bold shadow">
            Register Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
