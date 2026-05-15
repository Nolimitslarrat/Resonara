import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

import { FileText, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ArticlesIndexPage() {
  const articles = await prisma.manuscript.findMany({
    where: { status: { in: ["PUBLISHED", "ACCEPTED", "DRAFT"] } }, // Dummy logic for now
    include: { journal: true, author: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="bg-white border border-slate-200 p-6 sm:p-10 rounded-sm min-h-[60vh]">
      <div className="flex justify-between items-end mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-editorial font-bold text-[var(--brand-800)] mb-2">Article Database</h1>
          <p className="text-sm text-slate-600">Browse all published articles across NexScholar journals.</p>
        </div>
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Search articles by title, author, or keyword..." 
            className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-sm w-80 focus:outline-none focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="space-y-4">
        {articles.map(article => (
          <div key={article.id} className="border border-slate-200 p-5 rounded-sm hover:border-[var(--brand-300)] transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-[var(--brand-600)] uppercase">{article.journal.title}</span>
              <span className="text-xs text-slate-500">{formatDate(article.createdAt)}</span>
            </div>
            <h3 className="text-lg font-editorial font-bold text-[var(--brand-800)] mb-2 hover:underline cursor-pointer">
              <Link href={`/articles/${article.id}`}>{article.title}</Link>
            </h3>
            <p className="text-sm text-slate-600 italic mb-3">
              {article.author.name} {article.author.affiliation && <span>({article.author.affiliation})</span>}
            </p>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
              {article.abstract}
            </p>
            <div className="flex gap-2">
              <Link href={`/articles/${article.id}`} className="inline-flex items-center text-xs font-semibold text-white bg-[var(--brand-600)] px-3 py-1.5 rounded-sm hover:bg-[var(--brand-700)] transition-colors">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Full Text
              </Link>
            </div>
          </div>
        ))}
        
        {articles.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No articles available in the database yet.
          </div>
        )}
      </div>
    </div>
  );
}
