import { prisma } from "@/lib/prisma";
import { BookOpen, Layers, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Special Issues | NexScholar",
  description: "Browse special thematic issues and curated collections from NexScholar journals.",
};

export default async function SpecialIssuesPage() {
  // Fetch published issues with a title (special issues typically have a descriptive title)
  const specialIssues = await prisma.publicationIssue.findMany({
    where: { status: "PUBLISHED", title: { not: null } },
    include: {
      journal: { select: { title: true, slug: true } },
      _count: { select: { articles: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 24,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-10">
        <h1 className="text-4xl font-editorial font-bold text-[var(--brand-900)] mb-3">
          Special Issues
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Thematic collections and guest-edited special issues from across NexScholar journals.
        </p>
      </div>

      {/* Grid */}
      {specialIssues.length === 0 ? (
        <div className="py-24 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-editorial font-bold text-slate-700 mb-2">
            No special issues yet
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Special issues will appear here when they are published. Browse our regular{" "}
            <Link href="/journals" className="text-[var(--brand-600)] font-semibold hover:underline">
              journal collection
            </Link>{" "}
            in the meantime.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialIssues.map((issue) => (
            <Link
              key={issue.id}
              href={`/journals/${issue.journal.slug}`}
              className="group block bg-white border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Colour bar */}
              <div className="h-2 bg-gradient-to-r from-[var(--brand-600)] to-violet-600" />

              <div className="p-6">
                {/* Issue badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    Published
                  </span>
                  <span className="text-xs text-[var(--muted)] font-mono">
                    Vol. {issue.volume} · Issue {issue.issue}
                  </span>
                </div>

                <h2 className="text-lg font-editorial font-bold text-[var(--brand-900)] leading-snug mb-2 group-hover:text-[var(--brand-600)] transition-colors">
                  {issue.title}
                </h2>

                <p className="text-sm text-[var(--muted)] flex items-center gap-1.5 mb-4">
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                  {issue.journal.title}
                </p>

                <div className="flex items-center justify-between text-xs text-[var(--muted)] border-t border-[var(--border)] pt-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(issue.publishedAt)}
                  </span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {issue._count.articles} article{issue._count.articles !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
