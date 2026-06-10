import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, Users, FileText, BookOpen, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Analytics | Resonara Publishers Pvt. Ltd." };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const [
    totalManuscripts,
    totalUsers,
    totalJournals,
    totalPublished,
    submittedCount,
    underReviewCount,
    acceptedCount,
    rejectedCount,
    recentMonthManuscripts,
  ] = await Promise.all([
    prisma.manuscript.count(),
    prisma.user.count(),
    prisma.journal.count({ where: { isActive: true } }),
    prisma.article.count({ where: { publishedAt: { not: null } } }),
    prisma.manuscript.count({ where: { status: "SUBMITTED" } }),
    prisma.manuscript.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.manuscript.count({ where: { status: "ACCEPTED" } }),
    prisma.manuscript.count({ where: { status: { in: ["REJECTED", "DESK_REJECTED"] } } }),
    prisma.manuscript.count({
      where: { submittedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const acceptanceRate =
    totalManuscripts > 0 ? Math.round((acceptedCount / totalManuscripts) * 100) : 0;

  const stats = [
    { label: "Total Manuscripts", value: totalManuscripts, icon: FileText, color: "bg-[var(--brand-600)]" },
    { label: "Published Articles", value: totalPublished, icon: CheckCircle2, color: "bg-emerald-600" },
    { label: "Active Journals", value: totalJournals, icon: BookOpen, color: "bg-violet-600" },
    { label: "Total Users", value: totalUsers, icon: Users, color: "bg-amber-500" },
    { label: "Submitted (Pending)", value: submittedCount, icon: TrendingUp, color: "bg-sky-600" },
    { label: "Under Review", value: underReviewCount, icon: BarChart3, color: "bg-indigo-600" },
  ];

  const pipeline = [
    { label: "Submitted", count: submittedCount, color: "bg-amber-400" },
    { label: "Under Review", count: underReviewCount, color: "bg-blue-500" },
    { label: "Accepted", count: acceptedCount, color: "bg-emerald-500" },
    { label: "Rejected", count: rejectedCount, color: "bg-red-400" },
    { label: "Published", count: totalPublished, color: "bg-[var(--brand-600)]" },
  ];
  const maxPipeline = Math.max(...pipeline.map((p) => p.count), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Analytics</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Platform-wide statistics and submission pipeline overview.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5 flex items-start gap-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-[var(--foreground)] mt-1">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline chart */}
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-6">Submission Pipeline</h2>
        <div className="space-y-4">
          {pipeline.map((p) => (
            <div key={p.label} className="flex items-center gap-4">
              <p className="text-sm font-medium text-[var(--muted)] w-28 flex-shrink-0">{p.label}</p>
              <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full rounded-lg transition-all duration-700 flex items-center px-3 ${p.color}`}
                  style={{ width: `${Math.max((p.count / maxPipeline) * 100, 2)}%` }}
                >
                  {p.count > 0 && (
                    <span className="text-white text-xs font-bold">{p.count}</span>
                  )}
                </div>
              </div>
              <p className="text-sm font-bold text-[var(--foreground)] w-8 text-right">{p.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-4">
            Acceptance Rate
          </h3>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-[var(--foreground)]">{acceptanceRate}%</span>
            <span className="text-sm text-[var(--muted)] mb-2">of all submissions</span>
          </div>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${acceptanceRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-4">
            Submissions This Month
          </h3>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-[var(--foreground)]">{recentMonthManuscripts}</span>
            <span className="text-sm text-[var(--muted)] mb-2">manuscripts submitted</span>
          </div>
          <p className="text-xs text-[var(--muted)] mt-4">Last 30 days rolling window</p>
        </div>
      </div>
    </div>
  );
}
