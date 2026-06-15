import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, FileText, Rocket, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusLabel, getStatusClass, getNumericId } from "@/lib/utils";
import { updateManuscriptStatus } from "@/app/actions/editor";

export const metadata = {
  title: "Production Management | NexScholar",
};

export default async function ProductionManagerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  let manuscript = await prisma.manuscript.findUnique({
    where: { id: params.id },
    include: {
      journal: true,
      author: true,
      coAuthors: true
    }
  });

  if (!manuscript) {
    const allManuscripts = await prisma.manuscript.findMany({
      include: {
        journal: true,
        author: true,
        coAuthors: true
      }
    });
    manuscript = allManuscripts.find((m) => getNumericId(m.id) === params.id) || null;
  }

  if (!manuscript) return notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      <Link href="/dashboard" className="inline-flex items-center text-[var(--muted)] hover:text-[var(--foreground)] text-sm font-medium mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="border-b border-[var(--border)] p-6 sm:p-8 bg-slate-50">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusClass(manuscript.status)}`}>
              {getStatusLabel(manuscript.status)}
            </span>
            <span className="text-xs font-mono text-[var(--muted)]">ID: {getNumericId(manuscript.id)}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-[var(--foreground)] mb-3 leading-tight">
            {manuscript.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">{manuscript.author.name}</span>
            <span>•</span>
            <span>{manuscript.journal.title}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Production Checklist
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded text-[var(--brand-600)] focus:ring-[var(--brand-600)]" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Copyediting Complete</p>
                  <p className="text-xs text-slate-500">All text has been formatted and proofread.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded text-[var(--brand-600)] focus:ring-[var(--brand-600)]" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Typesetting & PDF Generation</p>
                  <p className="text-xs text-slate-500">Final galley proof has been generated and approved.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded text-[var(--brand-600)] focus:ring-[var(--brand-600)]" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Metadata Verification</p>
                  <p className="text-xs text-slate-500">DOIs, ORCID IDs, and funding data verified.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
              <Rocket className="w-4 h-4" /> Final Actions
            </h3>
            <div className="flex flex-wrap gap-4">
              <form action={async () => {
                "use server";
                await updateManuscriptStatus(manuscript.id, "PUBLISHED", "Completed production and published.");
              }}>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 h-11 px-8 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Publish Manuscript
                </Button>
              </form>
              <Button variant="outline" className="gap-2 h-11 px-6 text-slate-600">
                <Save className="w-4 h-4" />
                Save Progress
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
