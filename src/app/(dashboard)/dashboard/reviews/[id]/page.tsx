import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ChevronLeft, FileText, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ReviewForm } from "./ReviewForm";

export default async function ReviewerAssignmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  if (!session?.user || !["EDITOR", "REVIEWER"].includes(session.user.role)) return notFound();

  const assignment = await prisma.reviewerAssignment.findUnique({
    where: { id: params.id },
    include: {
      manuscript: {
        include: { 
          journal: true, 
          author: true,
          versions: {
            orderBy: { version: "desc" },
            take: 1
          }
        }
      },
      review: true
    }
  });

  if (!assignment || assignment.reviewerId !== session.user.id) return notFound();

  const manuscript = assignment.manuscript;
  const existingReview = assignment.review;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--brand-600)] transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white border border-[var(--border)] rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-editorial font-bold text-[var(--brand-900)] leading-tight mb-4">{manuscript.title}</h1>
        
        <div className="flex gap-4 items-center flex-wrap text-sm text-slate-600 mb-8 pb-6 border-b border-slate-200">
          <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {manuscript.journal.title}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Due: {assignment.dueDate ? formatDate(assignment.dueDate) : 'N/A'}</span>
          {manuscript.versions && manuscript.versions.length > 0 && (
            <>
              <span>•</span>
              <a href={manuscript.versions[0].fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-[var(--brand-600)] hover:underline">
                <FileText className="w-4 h-4" /> Download Manuscript
              </a>
            </>
          )}
        </div>

        <div className="space-y-6 mb-10">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Abstract</h3>
            <p className="text-slate-800 leading-relaxed">{manuscript.abstract}</p>
          </div>
          {manuscript.keywords && manuscript.keywords.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Keywords</h3>
              <div className="flex gap-2 flex-wrap">
                {manuscript.keywords.map((kw, i) => (
                  <span key={i} className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {existingReview ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-emerald-800 mb-4">Review Submitted Successfully</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-emerald-900">
              <div><strong>Score:</strong> {existingReview.score}/100</div>
              <div><strong>Recommendation:</strong> {existingReview.recommendation}</div>
            </div>
            <div className="mt-4">
              <strong>Comments to Author:</strong>
              <p className="mt-1 bg-white/50 p-3 rounded border border-emerald-100">{existingReview.authorComments}</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Submit Your Review</h2>
            <ReviewForm assignmentId={assignment.id} />
          </div>
        )}
      </div>
    </div>
  );
}
