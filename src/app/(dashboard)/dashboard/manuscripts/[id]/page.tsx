import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ChevronLeft, FileText, CheckCircle2, XCircle, Users, Clock } from "lucide-react";
import { formatDate, getStatusLabel, getStatusClass } from "@/lib/utils";
import { EditorActions } from "./EditorActions";

export default async function ManuscriptDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  if (!session?.user) return notFound();

  const manuscript = await prisma.manuscript.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      journal: true,
      coAuthors: true,
      reviewerAssignments: {
        include: { reviewer: true, review: true }
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        include: { user: true }
      },
      versions: {
        orderBy: { version: "desc" },
        take: 1
      }
    }
  });

  if (!manuscript) return notFound();

  // Basic access control: Only Author or Editors/Admins can view
  const isEditor = ["SUPER_ADMIN", "MANAGING_EDITOR"].includes(session.user.role);
  const isAuthor = manuscript.authorId === session.user.id;
  
  if (!isEditor && !isAuthor) return notFound();

  const availableReviewers = isEditor 
    ? await prisma.user.findMany({ where: { role: "REVIEWER", isActive: true } })
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--brand-600)] transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white border border-[var(--border)] rounded-2xl shadow-sm p-8">
        <div className="flex flex-wrap gap-4 justify-between items-start mb-6 border-b border-[var(--border)] pb-6">
          <div>
            <div className="flex gap-2 items-center mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusClass(manuscript.status)}`}>
                {getStatusLabel(manuscript.status)}
              </span>
              <span className="text-sm font-medium text-[var(--muted)]">ID: {manuscript.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <h1 className="text-3xl font-editorial font-bold text-[var(--brand-900)] leading-tight">{manuscript.title}</h1>
          </div>
          
          {isEditor && (
            <EditorActions manuscriptId={manuscript.id} currentStatus={manuscript.status} reviewers={availableReviewers} assignments={manuscript.reviewerAssignments} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Abstract</h3>
              <p className="text-[var(--foreground)] leading-relaxed">{manuscript.abstract}</p>
            </div>
            {manuscript.keywords && manuscript.keywords.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Keywords</h3>
                <div className="flex gap-2 flex-wrap">
                  {manuscript.keywords.map((kw, i) => (
                    <span key={i} className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> Submission Info</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-500 font-medium">Journal</dt>
                  <dd className="font-semibold text-slate-900">{manuscript.journal.title}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Submitted</dt>
                  <dd className="font-semibold text-slate-900">{formatDate(manuscript.submittedAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Corresponding Author</dt>
                  <dd className="font-semibold text-slate-900">{manuscript.author.name}</dd>
                  <dd className="text-xs text-slate-500 truncate">{manuscript.author.email}</dd>
                </div>
                {manuscript.versions && manuscript.versions.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <dt className="text-slate-500 font-medium mb-1">Manuscript File</dt>
                    <dd className="font-semibold text-[var(--brand-600)]">
                      <a href={manuscript.versions[0].fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline">
                        <FileText className="w-4 h-4" />
                        <span className="truncate max-w-[180px]">{manuscript.versions[0].fileName}</span>
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {isEditor && manuscript.reviewerAssignments.length > 0 && (
              <div className="bg-white rounded-xl border border-[var(--border)] p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[var(--brand-900)] mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-[var(--brand-600)]" /> Reviewers</h3>
                <div className="space-y-3">
                  {manuscript.reviewerAssignments.map(assignment => (
                    <div key={assignment.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <p className="text-sm font-semibold text-slate-800">{assignment.reviewer.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-[0.65rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                          assignment.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                          assignment.status === "ACCEPTED" ? "bg-blue-100 text-blue-700" :
                          assignment.status === "DECLINED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {assignment.status}
                        </span>
                        {assignment.review && (
                          <span className="text-xs font-bold text-emerald-600">Score: {assignment.review.score}/100</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-2xl shadow-sm p-8">
        <h2 className="text-lg font-bold text-[var(--brand-900)] mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
          <Clock className="w-5 h-5 text-[var(--brand-500)]" /> Activity History
        </h2>
        <div className="space-y-6">
          {manuscript.activityLogs.map((log, i) => (
            <div key={log.id} className="relative pl-6 border-l-2 border-slate-200 last:border-0">
              <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[var(--brand-400)] ring-4 ring-white"></div>
              <p className="text-sm font-semibold text-slate-800 mb-1">{log.action.replace(/_/g, " ")}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatDate(log.createdAt)}</span>
                <span>•</span>
                <span>By {log.user.name}</span>
              </div>
              {log.metadata && (
                <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">{String(log.metadata)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
