import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Layers, Plus, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Publication Issues | NexScholar" };

export default async function IssuesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["SUPER_ADMIN", "PRODUCTION"].includes(session.user.role)) redirect("/dashboard");

  const issues = await prisma.publicationIssue.findMany({
    include: {
      journal: { select: { title: true, slug: true } },
      _count: { select: { articles: true } },
    },
    orderBy: [{ year: "desc" }, { volume: "desc" }, { issue: "desc" }],
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Publication Issues</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            Manage journal volumes and issues for publishing.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Issue
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {issues.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-[var(--border)] py-20 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">No issues created yet</h3>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Create your first publication issue to start assigning articles.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Create Issue
            </Button>
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              {/* Status badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    issue.status === "PUBLISHED"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {issue.status}
                </span>
                <span className="text-xs text-[var(--muted)] font-mono">Vol. {issue.volume}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[var(--foreground)] leading-tight mb-1">
                {issue.title ?? `Vol. ${issue.volume}, Issue ${issue.issue}`}
              </h3>
              <p className="text-sm text-[var(--muted)] mb-4 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {issue.journal.title}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-[var(--muted)] border-t border-[var(--border)] pt-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {issue.year}
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {issue._count.articles} article{issue._count.articles !== 1 ? "s" : ""}
                </span>
                {issue.publishedAt && (
                  <span>Published {formatDate(issue.publishedAt)}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
