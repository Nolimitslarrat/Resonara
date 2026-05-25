import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, ArrowRight, Clock, CheckCircle2, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { formatDate } from "@/lib/utils";
import type { ReviewStatus } from "@prisma/client";

export const metadata = { title: "My Reviews | Resonara" };

const STATUS_CONFIG: Record<ReviewStatus, { label: string; classes: string }> = {
  PENDING: { label: "Invitation Pending", classes: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "In Progress", classes: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", classes: "bg-emerald-100 text-emerald-700" },
  DECLINED: { label: "Declined", classes: "bg-red-100 text-red-600" },
  OVERDUE: { label: "Overdue", classes: "bg-red-200 text-red-800" },
};

export default async function ReviewsListPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "REVIEWER") redirect("/dashboard");

  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';

  const assignments = await prisma.reviewerAssignment.findMany({
    where: { 
      reviewerId: session.user.id,
      ...(q ? {
        manuscript: {
          title: { contains: q, mode: "insensitive" as const }
        }
      } : {})
    },
    include: {
      manuscript: {
        select: {
          title: true,
          abstract: true,
          journal: { select: { title: true } },
          author: { select: { name: true } },
        },
      },
      review: { select: { score: true, recommendation: true } },
    },
    orderBy: { invitedAt: "desc" },
  });

  const pending = assignments.filter((a) => a.status === "PENDING");
  const active = assignments.filter((a) => a.status === "ACCEPTED");
  const completed = assignments.filter((a) => a.status === "COMPLETED");
  const declined = assignments.filter((a) => a.status === "DECLINED");

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">My Reviews</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          All your peer review invitations and completed assignments.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending", count: pending.length, color: "text-amber-600" },
          { label: "Active", count: active.length, color: "text-[var(--brand-600)]" },
          { label: "Completed", count: completed.length, color: "text-emerald-600" },
          { label: "Declined", count: declined.length, color: "text-slate-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-4 text-center"
          >
            <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-[var(--muted)] font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[var(--border)] py-20 text-center">
          <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No reviews yet</h3>
          <p className="text-sm text-slate-500 mt-1">
            You&apos;ll be notified by email when manuscripts need your expertise.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] bg-slate-50">
            <SearchInput placeholder="Search reviews by manuscript title..." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-slate-50">
                  {["Manuscript", "Journal", "Status", "Due Date", "Result", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-6 py-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {assignments.map((a) => {
                  const cfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.PENDING;
                  return (
                    <tr key={a.id} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[var(--foreground)] line-clamp-1 max-w-[240px]">
                          {a.manuscript.title}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{a.manuscript.author.name}</p>
                      </td>
                      <td className="px-6 py-4 text-[var(--muted)] text-sm">
                        {a.manuscript.journal.title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.classes}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--muted)]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {a.dueDate ? formatDate(a.dueDate) : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {a.review ? (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-emerald-700">
                              Score: {a.review.score}/100
                            </span>
                            <span className="text-[var(--muted)]">•</span>
                            <span className="text-[var(--muted)]">{a.review.recommendation}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(a.status === "PENDING" || a.status === "ACCEPTED") && (
                          <Link href={`/dashboard/reviews/${a.id}`}>
                            <Button size="sm" variant="ghost" className="gap-1 text-[var(--brand-600)]">
                              {a.status === "PENDING" ? "Respond" : "Continue"}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        )}
                        {a.status === "COMPLETED" && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                          </span>
                        )}
                        {a.status === "DECLINED" && (
                          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium justify-end">
                            <XCircle className="w-3.5 h-3.5" /> Declined
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
