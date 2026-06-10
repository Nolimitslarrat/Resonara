import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Hash, CheckCircle2, ExternalLink, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "DOI Manager | Resonara Publishers Pvt. Ltd." };

export default async function DOIManagerPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const articles = await prisma.article.findMany({
    include: {
      manuscript: {
        select: { title: true, author: { select: { name: true } }, journal: { select: { title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const withDoi = articles.filter((a) => a.doi).length;
  const withoutDoi = articles.filter((a) => !a.doi).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">DOI Manager</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Assign and manage Digital Object Identifiers for published articles.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <p className="text-xs text-[var(--muted)] font-medium">Total Articles</p>
          <p className="text-3xl font-bold text-[var(--foreground)] mt-1">{articles.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <p className="text-xs text-[var(--muted)] font-medium">DOIs Assigned</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{withDoi}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <p className="text-xs text-[var(--muted)] font-medium">Needs DOI</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{withoutDoi}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-slate-50 flex items-center gap-2">
          <Hash className="w-4 h-4 text-[var(--muted)]" />
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Articles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50">
                {["Title", "Journal", "Author", "DOI", "Published", ""].map((h) => (
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
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <FileText className="w-8 h-8 text-[var(--muted)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--muted)] text-sm">No articles published yet.</p>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--foreground)] line-clamp-1 max-w-[220px]">
                        {article.manuscript.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] text-sm">
                      {article.manuscript.journal.title}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] text-sm">
                      {article.manuscript.author.name}
                    </td>
                    <td className="px-6 py-4">
                      {article.doi ? (
                        <a
                          href={`https://doi.org/${article.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[var(--brand-600)] font-mono text-xs hover:underline"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          {article.doi}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--muted)]">
                      {formatDate(article.publishedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="ghost" className="text-xs text-[var(--brand-600)]">
                        {article.doi ? "Update DOI" : "Assign DOI"}
                      </Button>
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
