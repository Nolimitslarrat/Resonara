import { BookOpen, Upload, CheckCircle2, Clock, FileText, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Author Guidelines | NexScholar",
  description: "Submission guidelines, formatting requirements, and editorial policies for authors submitting to NexScholar journals.",
};

const steps = [
  {
    number: "01",
    title: "Prepare Your Manuscript",
    icon: FileText,
    description:
      "Format your manuscript according to the target journal's specific template. Include a structured abstract (Background, Methods, Results, Conclusion) of 200–300 words, and provide 4–8 keywords.",
  },
  {
    number: "02",
    title: "Register & Log In",
    icon: CheckCircle2,
    description:
      "Create a free NexScholar account or sign in. Select 'Author' as your role during registration. Your ORCID iD can be linked in your profile settings.",
  },
  {
    number: "03",
    title: "Submit Online",
    icon: Upload,
    description:
      "Use the online submission wizard to upload your manuscript, add co-authors, select a journal and subject category, and attach your cover letter.",
  },
  {
    number: "04",
    title: "Track Your Submission",
    icon: Clock,
    description:
      "Monitor the status of your manuscript in real time from your Author Dashboard. You will receive email notifications at every stage of the peer review process.",
  },
];

const policies = [
  { title: "Originality", body: "Submissions must be original, unpublished work not under review elsewhere." },
  { title: "Authorship", body: "All listed authors must have made a substantial contribution and approved the final manuscript." },
  { title: "Conflict of Interest", body: "Authors must disclose any financial or personal relationships that could influence the work." },
  { title: "Ethics", body: "Research involving human subjects or animals must have appropriate ethics committee approval." },
  { title: "Open Access", body: "All articles published on NexScholar are made freely available under a Creative Commons licence." },
  { title: "Peer Review", body: "All submissions undergo double-blind peer review. Typically 2–3 reviewers are assigned per manuscript." },
];

export default function AuthorsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center space-y-5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] text-sm font-semibold border border-[var(--brand-200)]">
          <BookOpen className="w-3.5 h-3.5" /> For Authors
        </span>
        <h1 className="text-4xl sm:text-5xl font-editorial font-bold text-[var(--brand-900)] leading-tight">
          Author Guidelines
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about submitting and publishing your research on NexScholar.
        </p>
        <Link href="/dashboard/manuscripts/submit">
          <Button className="rounded-full h-11 px-8 gap-2 bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white shadow-md">
            Submit a Manuscript <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Submission steps */}
      <section>
        <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-10 text-center">
          How to Submit
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white border border-[var(--border)] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold font-editorial text-[var(--brand-100)] leading-none">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-50)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--brand-600)]" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--brand-900)] mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Policies */}
      <section>
        <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-8 text-center">
          Editorial Policies
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {policies.map((p) => (
            <div
              key={p.title}
              className="bg-slate-50 border border-slate-200 rounded-xl p-5"
            >
              <h3 className="font-bold text-[var(--brand-800)] mb-2 text-sm">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--brand-900)] rounded-2xl p-10 text-center text-white">
        <h2 className="text-2xl font-editorial font-bold mb-3">Ready to publish?</h2>
        <p className="text-[var(--brand-300)] mb-6">
          Create a free account and submit your manuscript today.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register">
            <Button className="rounded-full h-11 px-8 bg-white text-[var(--brand-900)] hover:bg-[var(--brand-50)] font-bold shadow">
              Create Account
            </Button>
          </Link>
          <Link href="/journals">
            <Button variant="outline" className="rounded-full h-11 px-8 border-white/30 text-white hover:bg-white/10">
              Browse Journals
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
