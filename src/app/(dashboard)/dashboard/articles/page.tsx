import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { LucideProps } from "lucide-react";
import {
  FileText,
  ExternalLink,
  Globe,
  TrendingUp,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ManageArticleModal } from "./ManageArticleModal";

export const metadata = {
  title: "Article Management | Resonara",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; class: string; icon: React.FC<LucideProps> }
> = {
  PUBLISHED: {
    label: "Published",
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Globe,
  },
  READY_TO_PUBLISH: {
    label: "Ready",
    class: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  COPYEDITING: {
    label: "Copyediting",
    class: "bg-cyan-50 text-cyan-700 border-cyan-200",
    icon: FileText,
  },
  PROOFREADING: {
    label: "Proofreading",
    class: "bg-blue-50 text-blue-700 border-blue-200",
    icon: FileText,
  },
  TYPESETTING: {
    label: "Typesetting",
    class: "bg-violet-50 text-violet-700 border-violet-200",
    icon: FileText,
  },
  ACCEPTED: {
    label: "Accepted",
    class: "bg-green-50 text-green-700 border-green-200",
    icon: TrendingUp,
  },
};

type FilterTab = "all" | "published" | "unpublished";

export default async function ArticlesManagerPage(props: {
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const tab = (searchParams.tab as FilterTab) || "all";

  const session = await auth();
  if (
    !session?.user ||
    !["SUPER_ADMIN", "MANAGING_EDITOR"].includes(session.user.role)
  ) {
    redirect("/dashboard");
  }

  const allStatuses = ["PUBLISHED", "ACCEPTED", "READY_TO_PUBLISH", "COPYEDITING", "PROOFREADING", "TYPESETTING"] as const;
  type ManagedStatus = (typeof allStatuses)[number];
  const statusFilter: ManagedStatus[] =
    tab === "published"
      ? ["PUBLISHED"]
      : tab === "unpublished"
        ? ["ACCEPTED", "READY_TO_PUBLISH", "COPYEDITING", "PROOFREADING", "TYPESETTING"]
        : [...allStatuses];

  const articles = await prisma.manuscript.findMany({
    where: {
      status: { in: statusFilter },
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    include: {
      journal: { select: { title: true, slug: true, issnOnline: true, issnPrint: true } },
      author: { select: { name: true, email: true, affiliation: true } },
      article: { select: { doi: true, publishedAt: true, views: true, downloads: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Counts for tab badges
  const [publishedCount, pendingCount] = await Promise.all([
    prisma.manuscript.count({
      where: { status: "PUBLISHED", ...(q ? { title: { contains: q, mode: "insensitive" } } : {}) },
    }),
    prisma.manuscript.count({
      where: {
        status: { in: ["ACCEPTED", "READY_TO_PUBLISH", "COPYEDITING", "PROOFREADING", "TYPESETTING"] },
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      },
    }),
  ]);

  const totalCount = publishedCount + pendingCount;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All Articles", count: totalCount },
    { key: "published", label: "Published (Live)", count: publishedCount },
    { key: "unpublished", label: "In Production", count: pendingCount },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Article Management
          </h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            Control publication status, verify Google Scholar indexability, and
            manage article visibility across all journals.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Live Articles",
            value: publishedCount,
            icon: Globe,
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-200",
          },
          {
            label: "In Production",
            value: pendingCount,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-200",
          },
          {
            label: "Total Managed",
            value: totalCount,
            icon: FileText,
            color: "text-[var(--brand-600)]",
            bg: "bg-[var(--brand-50)] border-[var(--brand-200)]",
          },
          {
            label: "Indexed Articles",
            value: publishedCount,
            icon: TrendingUp,
            color: "text-violet-600",
            bg: "bg-violet-50 border-violet-200",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className={`bg-white border rounded-xl p-4 shadow-sm flex items-center gap-3 ${bg.split(" ")[1]}`}
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--foreground)]">{value}</p>
              <p className="text-xs text-[var(--muted)] font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        {/* Tab bar + search */}
        <div className="border-b border-[var(--border)]">
          {/* Tabs */}
          <div className="flex overflow-x-auto">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={`/dashboard/articles?tab=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-[var(--brand-600)] text-[var(--brand-700)] bg-[var(--brand-50)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-50"
                }`}
              >
                {tab === t.key && t.key === "published" && (
                  <Eye className="w-3.5 h-3.5" />
                )}
                {tab === t.key && t.key === "unpublished" && (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                {t.label}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tab === t.key
                      ? "bg-[var(--brand-100)] text-[var(--brand-700)]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {t.count}
                </span>
              </Link>
            ))}
          </div>
          {/* Search */}
          <div className="p-4 bg-slate-50/60 border-t border-[var(--border)]">
            <SearchInput
              placeholder="Search articles by title..."
              extraParams={tab !== "all" ? { tab } : undefined}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50">
                {[
                  "Article",
                  "Journal",
                  "Author",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <FileText className="w-10 h-10 text-[var(--muted)] mx-auto mb-3 opacity-30" />
                    <p className="text-[var(--muted)] text-sm font-semibold">
                      No articles found
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      {tab === "published"
                        ? "No articles have been published yet."
                        : tab === "unpublished"
                          ? "No articles are currently in production."
                          : "Try a different search term."}
                    </p>
                  </td>
                </tr>
              ) : (
                articles.map((article) => {
                  const statusConf =
                    STATUS_CONFIG[article.status] ||
                    STATUS_CONFIG["COPYEDITING"];
                  const StatusIcon = statusConf.icon;
                  const isLive = article.status === "PUBLISHED";

                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-[var(--surface)] transition-colors group"
                    >
                      {/* Article title + DOI */}
                      <td className="px-5 py-4 max-w-[280px]">
                        <p className="font-semibold text-[var(--foreground)] text-sm leading-snug truncate group-hover:text-[var(--brand-700)] transition-colors">
                          {article.title}
                        </p>
                        {article.article?.doi && (
                          <p className="text-[10px] text-emerald-600 font-mono mt-0.5 truncate">
                            DOI: {article.article.doi}
                          </p>
                        )}
                        {isLive && (
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--muted)]">
                            <span className="flex items-center gap-1">
                              <Eye className="w-2.5 h-2.5" />
                              {article.article?.views ?? 0} views
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-2.5 h-2.5" />
                              {article.article?.downloads ?? 0} downloads
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Journal */}
                      <td className="px-5 py-4">
                        <Link href={`/journals/${article.journal.slug}`} target="_blank">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--brand-50)] text-[var(--brand-700)] text-xs font-semibold border border-[var(--brand-200)] hover:bg-[var(--brand-100)] transition-colors">
                            {article.journal.title}
                          </span>
                        </Link>
                      </td>

                      {/* Author */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {article.author.name}
                        </p>
                        {article.author.affiliation && (
                          <p className="text-[10px] text-[var(--muted)] truncate max-w-[180px]">
                            {article.author.affiliation}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusConf.class}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConf.label}
                        </span>
                        {isLive && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              Scholar-indexed
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-[var(--muted)] whitespace-nowrap">
                        {isLive && article.article?.publishedAt
                          ? formatDate(article.article.publishedAt)
                          : formatDate(article.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {isLive && (
                            <Link
                              href={`/articles/${article.id}`}
                              target="_blank"
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1 text-[var(--brand-600)] hover:text-[var(--brand-700)] hover:bg-[var(--brand-50)] h-8 px-3"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View
                              </Button>
                            </Link>
                          )}
                          <ManageArticleModal
                            article={{
                              id: article.id,
                              title: article.title,
                              status: article.status,
                              journal: {
                                title: article.journal.title,
                                issnOnline: article.journal.issnOnline,
                                issnPrint: article.journal.issnPrint,
                              },
                              author: {
                                name: article.author.name,
                                email: article.author.email,
                                affiliation: article.author.affiliation,
                              },
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {articles.length > 0 && (
          <div className="px-5 py-3 border-t border-[var(--border)] bg-slate-50/60 text-xs text-[var(--muted)]">
            Showing {articles.length} of {totalCount} articles
          </div>
        )}
      </div>
    </div>
  );
}
