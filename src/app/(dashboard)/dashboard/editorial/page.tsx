import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ClipboardList, ArrowRight, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { getStatusLabel, getStatusClass, formatDate } from "@/lib/utils";

export const metadata = { title: "Editorial Queue | Resonara Publishers Pvt. Ltd." };

export default async function EditorialPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["SUPER_ADMIN", "MANAGING_EDITOR"].includes(session.user.role)) redirect("/dashboard");

  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';

  const [submitted, underScreening, underReview, awaitingDecision, manuscripts] = await Promise.all([
    prisma.manuscript.count({ where: { status: "SUBMITTED" } }),
    prisma.manuscript.count({ where: { status: "UNDER_SCREENING" } }),
    prisma.manuscript.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.manuscript.count({ where: { status: { in: ["MINOR_REVISION", "MAJOR_REVISION"] } } }),
    prisma.manuscript.findMany({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_SCREENING", "UNDER_REVIEW", "MINOR_REVISION", "MAJOR_REVISION"],
        },
        ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
      },
      include: {
        author: { select: { name: true } },
        journal: { select: { title: true } },
        reviewerAssignments: { select: { id: true, status: true } },
      },
      orderBy: { submittedAt: "asc" },
      take: 50,
    }),
  ]);

  const summaryItems = [
    { label: "Awaiting Screening", value: submitted, color: "bg-amber-500" },
    { label: "In Screening", value: underScreening, color: "bg-sky-500" },
    { label: "Under Review", value: underReview, color: "bg-[var(--brand-600)]" },
    { label: "Revision Pending", value: awaitingDecision, color: "bg-violet-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Editorial Queue</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Manage manuscripts in the editorial pipeline.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5"
          >
            <div className={`w-2 h-2 rounded-full ${item.color} mb-3`} />
            <p className="text-3xl font-bold text-[var(--foreground)]">{item.value}</p>
            <p className="text-xs text-[var(--muted)] mt-1 font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Manuscript table */}
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[var(--muted)]" />
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Active Manuscripts ({manuscripts.length})
            </h2>
          </div>
          <SearchInput placeholder="Search queue by title..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50">
                {["Title", "Author", "Journal", "Status", "Reviewers", "Submitted", ""].map((h) => (
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
              {manuscripts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <FileText className="w-8 h-8 text-[var(--muted)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--muted)] text-sm">No manuscripts in the editorial queue.</p>
                  </td>
                </tr>
              ) : (
                manuscripts.map((m) => (
                  <tr key={m.id} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--foreground)] line-clamp-1 max-w-[250px]">
                        {m.title}
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-0.5 font-mono">
                        {m.id.slice(0, 8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] text-sm">{m.author.name}</td>
                    <td className="px-6 py-4 text-[var(--muted)] text-sm">{m.journal.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(m.status)}`}
                      >
                        {getStatusLabel(m.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                      {m.reviewerAssignments.length > 0 ? (
                        <span className="font-semibold text-[var(--foreground)]">
                          {m.reviewerAssignments.filter((r) => r.status === "COMPLETED").length}/
                          {m.reviewerAssignments.length}
                        </span>
                      ) : (
                        <span className="text-amber-500 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(m.submittedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/manuscripts/${m.id}`}>
                        <Button size="sm" variant="ghost" className="gap-1 text-[var(--brand-600)]">
                          Manage <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
