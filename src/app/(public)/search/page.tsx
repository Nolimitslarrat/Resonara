import { prisma } from "@/lib/prisma";
import { Search as SearchIcon, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Search Results | Resonara",
};

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";

  let articles: any[] = [];
  let journals: any[] = [];

  if (q) {
    articles = await prisma.manuscript.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { abstract: { contains: q, mode: "insensitive" } },
          { author: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        journal: true,
        author: true,
      },
      orderBy: { createdAt: "desc" },
    });

    journals = await prisma.journal.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { scope: { contains: q, mode: "insensitive" } },
        ],
      },
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Search Results for "{q}"
          </h1>
          <form action="/search" method="GET" className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] bg-white text-lg"
              placeholder="Search articles, journals, and authors..."
            />
          </form>
        </div>

        {!q ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Enter a search term to find articles and journals.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Journals Section */}
            {journals.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[var(--brand-600)]" />
                  Journals
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {journals.map((journal) => (
                    <Link key={journal.id} href={`/journals/${journal.id}`}>
                      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group h-full flex flex-col">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[var(--brand-600)] transition-colors mb-2">
                          {journal.title}
                        </h3>
                        <p className="text-slate-600 text-sm flex-1 line-clamp-3">
                          {journal.scope || journal.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Articles Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[var(--brand-600)]" />
                Articles
              </h2>
              {articles.length > 0 ? (
                <div className="space-y-6">
                  {articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.id}`}>
                      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[var(--brand-600)] transition-colors mb-3">
                          {article.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                          <span className="font-medium text-slate-700">{article.author.name}</span>
                          <span>•</span>
                          <span className="text-[var(--brand-600)] font-medium bg-[var(--brand-50)] px-2.5 py-0.5 rounded">
                            {article.journal.title}
                          </span>
                          <span>•</span>
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                        {article.abstract && (
                          <p className="text-slate-600 text-sm line-clamp-3">
                            {article.abstract}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <p className="text-slate-500">No articles found matching "{q}".</p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
