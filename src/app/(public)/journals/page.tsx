import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import { BookOpen, Users, FileText, ArrowRight, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journals | Resonara",
  description:
    "Browse all active peer-reviewed journals published by Resonara. Find the right journal for your research.",
};

export default async function JournalsIndexPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";

  const journals = await prisma.journal.findMany({
    where: {
      isActive: true,
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    include: {
      categories: true,
      editorInChief: { select: { name: true, designation: true } },
      _count: {
        select: {
          manuscripts: { where: { status: "PUBLISHED" } },
          editorialBoard: true,
        },
      },
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-[var(--brand-900)] text-white pt-20 pb-28 relative overflow-hidden">
        <div
          className="absolute -right-32 top-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--brand-400) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-[var(--brand-300)] text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Resonara Journals
          </div>
          <h1 className="text-5xl font-editorial font-bold mb-4 leading-tight">
            Journals A–Z
          </h1>
          <p className="text-[var(--brand-200)] max-w-xl mx-auto text-base mb-10">
            Browse our collection of peer-reviewed academic journals spanning
            multiple disciplines.
          </p>

          {/* Search */}
          <form method="GET" className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search journals by name..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-2xl pl-11 pr-28 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[var(--brand-900)] text-xs font-bold px-4 py-2 rounded-xl transition-all hover:bg-[var(--brand-50)]"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {/* Stats bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--border)] p-5 mb-8 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-50)] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[var(--brand-600)]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">{journals.length}</p>
              <p className="text-xs text-[var(--muted)] font-medium">Active Journals</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {journals.reduce((acc, j) => acc + j._count.manuscripts, 0)}
              </p>
              <p className="text-xs text-[var(--muted)] font-medium">Published Articles</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {journals.reduce((acc, j) => acc + j._count.editorialBoard, 0)}
              </p>
              <p className="text-xs text-[var(--muted)] font-medium">Board Members</p>
            </div>
          </div>

          {q && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-[var(--muted)]">
                Results for:{" "}
                <strong className="text-[var(--foreground)]">"{q}"</strong>
              </span>
              <Link
                href="/journals"
                className="text-xs text-[var(--brand-600)] hover:text-[var(--brand-800)] font-semibold"
              >
                Clear
              </Link>
            </div>
          )}
        </div>

        {/* Journal grid */}
        {journals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-16 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-700">
              {q ? "No journals match your search" : "No journals yet"}
            </p>
            {q && (
              <Link
                href="/journals"
                className="mt-4 inline-block text-sm text-[var(--brand-600)] hover:underline font-semibold"
              >
                Browse all journals →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-lg hover:border-[var(--brand-300)] transition-all duration-300 group flex flex-col overflow-hidden"
              >
                {/* Card top accent */}
                <div className="h-1.5 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-400)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + categories */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-16 bg-gradient-to-br from-[var(--brand-50)] to-[var(--brand-100)] rounded-xl border border-[var(--brand-200)] flex items-center justify-center flex-shrink-0 group-hover:from-[var(--brand-100)] group-hover:to-[var(--brand-200)] transition-all">
                      <BookOpen className="w-6 h-6 text-[var(--brand-600)]" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      {journal.categories.slice(0, 1).map((cat) => (
                        <span
                          key={cat.id}
                          className="text-[9px] font-bold uppercase tracking-widest text-[var(--brand-600)] bg-[var(--brand-50)] border border-[var(--brand-200)] px-2 py-0.5 rounded-full mb-2 inline-block"
                        >
                          {cat.name}
                        </span>
                      ))}
                      <h2 className="text-lg font-editorial font-bold text-[var(--brand-900)] leading-tight line-clamp-2 group-hover:text-[var(--brand-700)] transition-colors">
                        <Link href={`/journals/${journal.slug}`}>
                          {journal.title}
                        </Link>
                      </h2>
                    </div>
                  </div>

                  {/* ISSN */}
                  {(journal.issnPrint || journal.issnOnline) && (
                    <p className="text-xs text-[var(--muted)] mb-3 font-mono">
                      {journal.issnPrint && `ISSN (P): ${journal.issnPrint}`}
                      {journal.issnPrint && journal.issnOnline && "  •  "}
                      {journal.issnOnline && `ISSN (E): ${journal.issnOnline}`}
                    </p>
                  )}

                  {/* Editor */}
                  {journal.editorInChief && (
                    <p className="text-xs text-[var(--muted)] mb-4">
                      <span className="font-semibold text-slate-700">
                        {journal.editorInChief.name}
                      </span>
                      {journal.editorInChief.designation && (
                        <span className="text-slate-400">
                          {" "}— {journal.editorInChief.designation}
                        </span>
                      )}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-[var(--muted)] mb-5 mt-auto">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[var(--brand-400)]" />
                      {journal._count.manuscripts} articles
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[var(--brand-400)]" />
                      {journal._count.editorialBoard} board members
                    </span>
                  </div>

                  {/* CTA links */}
                  <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
                    <Link
                      href={`/journals/${journal.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors"
                    >
                      View Journal <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href={`/journals/${journal.slug}/editorial-board`}
                      className="inline-flex items-center justify-center gap-1.5 border border-[var(--border)] hover:border-[var(--brand-300)] hover:bg-[var(--brand-50)] text-[var(--muted)] hover:text-[var(--brand-700)] text-xs font-semibold px-3 py-2.5 rounded-xl transition-all"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Board
                    </Link>
                    <Link
                      href={`/journals/${journal.slug}/articles`}
                      className="inline-flex items-center justify-center gap-1.5 border border-[var(--border)] hover:border-[var(--brand-300)] hover:bg-[var(--brand-50)] text-[var(--muted)] hover:text-[var(--brand-700)] text-xs font-semibold px-3 py-2.5 rounded-xl transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Articles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
