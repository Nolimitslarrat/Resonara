import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  Calendar,
  ArrowRight,
  Search,
  BookOpen,
  Download,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const journal = await prisma.journal.findUnique({
    where: { slug: params.slug },
    select: { title: true },
  });
  if (!journal) return { title: "Not Found" };
  return {
    title: `Articles | ${journal.title}`,
    description: `Browse all published articles in ${journal.title}`,
  };
}

const PAGE_SIZE = 20;

export default async function JournalArticlesPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const journal = await prisma.journal.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      title: true,
      slug: true,
      issnPrint: true,
      issnOnline: true,
    },
  });

  if (!journal) notFound();

  const whereClause = {
    journalId: journal.id,
    status: "PUBLISHED" as const,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { keywords: { hasSome: [q] } },
          ],
        }
      : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.manuscript.findMany({
      where: whereClause,
      include: {
        author: { select: { name: true, affiliation: true } },
        coAuthors: { select: { name: true }, orderBy: { order: "asc" } },
        article: { select: { doi: true, pdfUrl: true, publishedAt: true } },
      },
      orderBy: { submittedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.manuscript.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-[var(--brand-900)] text-white pt-16 pb-20 relative overflow-hidden">
        <div
          className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--brand-400) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href={`/journals/${journal.slug}`}
            className="inline-flex items-center text-[var(--brand-300)] hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to {journal.title}
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[var(--brand-300)] text-xs font-bold uppercase tracking-widest mb-0.5">
                {journal.title}
              </p>
              <h1 className="text-3xl font-editorial font-bold text-white">
                Published Articles
              </h1>
            </div>
          </div>

          <p className="text-[var(--brand-200)] text-sm mt-3">
            {total} article{total !== 1 ? "s" : ""} published in this journal
          </p>

          {/* Search bar */}
          <form method="GET" className="mt-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search articles by title or keyword..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Articles list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {q && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-[var(--muted)]">
              Showing results for:{" "}
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)] bg-[var(--brand-50)] border border-[var(--brand-200)] px-3 py-0.5 rounded-full">
              "{q}"
            </span>
            <Link
              href={`/journals/${journal.slug}/articles`}
              className="text-xs text-[var(--brand-600)] hover:text-[var(--brand-800)] font-semibold ml-2 transition-colors"
            >
              Clear
            </Link>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-16 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">
              {q ? "No articles match your search" : "No articles published yet"}
            </h3>
            <p className="text-sm text-[var(--muted)]">
              {q
                ? "Try different keywords or browse all articles."
                : "Check back soon for published research."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article, idx) => {
              const allAuthors = [
                article.author.name,
                ...article.coAuthors.map((ca) => ca.name),
              ];
              const publishDate =
                article.article?.publishedAt ||
                article.submittedAt ||
                article.createdAt;

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--brand-200)] transition-all p-6 sm:p-7 group"
                >
                  <div className="flex items-start gap-5">
                    {/* Article number */}
                    <div className="hidden sm:flex w-12 h-12 rounded-xl bg-[var(--brand-50)] items-center justify-center flex-shrink-0 text-[var(--brand-600)] font-bold font-editorial text-lg border border-[var(--brand-200)] group-hover:bg-[var(--brand-100)] transition-colors">
                      {String(skip + idx + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-600)] bg-[var(--brand-50)] border border-[var(--brand-200)] px-2.5 py-0.5 rounded">
                          Research Article
                        </span>
                        {article.article?.doi && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-mono font-semibold px-2 py-0.5 rounded">
                            DOI: {article.article.doi}
                          </span>
                        )}
                        <span className="text-xs text-[var(--muted)] flex items-center gap-1 ml-auto">
                          <Calendar className="w-3 h-3" />
                          {formatDate(publishDate)}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/articles/${article.id}`}>
                        <h2 className="text-lg font-editorial font-bold text-[var(--brand-900)] leading-snug mb-2 group-hover:text-[var(--brand-600)] transition-colors">
                          {article.title}
                        </h2>
                      </Link>

                      {/* Authors */}
                      <p className="text-sm text-[var(--muted)] mb-3">
                        <span className="font-medium text-slate-700">
                          {allAuthors.join(", ")}
                        </span>
                        {article.author.affiliation &&
                          ` — ${article.author.affiliation}`}
                      </p>

                      {/* Keywords */}
                      {article.keywords && article.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {article.keywords.slice(0, 5).map((kw) => (
                            <span
                              key={kw}
                              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Link href={`/articles/${article.id}`}>
                          <Button
                            size="sm"
                            className="bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-full text-xs font-semibold px-4 h-8 gap-1.5"
                          >
                            Read Abstract <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Link
                          href={`/api/articles/${article.id}/pdf`}
                          target="_blank"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[var(--brand-200)] text-[var(--brand-700)] hover:bg-[var(--brand-50)] rounded-full text-xs font-semibold px-4 h-8 gap-1.5"
                          >
                            <Download className="w-3 h-3" />
                            PDF
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/journals/${journal.slug}/articles?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page - 1) })}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--border)] rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              </Link>
            )}
            <span className="text-sm text-[var(--muted)] px-4 font-medium">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/journals/${journal.slug}/articles?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page + 1) })}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--border)] rounded-full"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Browse back */}
        <div className="mt-10 text-center">
          <Link
            href={`/journals/${journal.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Back to journal overview
          </Link>
        </div>
      </div>
    </div>
  );
}
