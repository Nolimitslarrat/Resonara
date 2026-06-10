import Link from "next/link";
import { CalendarDays, LockKeyhole, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export type DashboardSubscription = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  notes: string | null;
  journal: {
    title: string;
    slug: string;
    manuscripts: {
      id: string;
      title: string;
      article: { pdfUrl: string | null; publishedAt: Date | null } | null;
      versions: { fileUrl: string; fileName: string }[];
    }[];
  } | null;
  article: {
    manuscriptId: string;
    pdfUrl: string | null;
    publishedAt: Date | null;
    manuscript: {
      title: string;
      journal: { title: string };
      versions: { fileUrl: string; fileName: string }[];
    };
  } | null;
};

export function MySubscriptions({ subscriptions }: { subscriptions: DashboardSubscription[] }) {
  const now = new Date();
  const active = subscriptions.filter((sub) => sub.isActive && sub.startsAt <= now && sub.endsAt >= now);
  const upcoming = subscriptions.filter((sub) => sub.isActive && sub.startsAt > now);
  const expired = subscriptions.filter((sub) => !sub.isActive || sub.endsAt < now);

  const items = [...active, ...upcoming, ...expired].slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <LockKeyhole className="w-4 h-4 text-[var(--brand-600)]" />
          My Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No subscription access assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((sub) => {
              const status =
                !sub.isActive || sub.endsAt < now
                  ? "Expired"
                  : sub.startsAt > now
                    ? "Upcoming"
                    : "Active";
              const canRead = status === "Active";
              const href = sub.article
                ? `/articles/${sub.article.manuscriptId}`
                : sub.journal
                  ? `/journals/${sub.journal.slug}`
                  : "#";
              const title = sub.article?.manuscript.title || sub.journal?.title || "Subscription access";
              const scope = sub.article ? `Article - ${sub.article.manuscript.journal.title}` : "Journal access";
              const readableArticles = sub.article
                ? [{
                    id: sub.article.manuscriptId,
                    title: sub.article.manuscript.title,
                    fileName: sub.article.manuscript.versions[0]?.fileName || "PDF",
                  }]
                : sub.journal?.manuscripts
                    .filter((manuscript) => manuscript.article?.pdfUrl || manuscript.versions[0]?.fileUrl)
                    .map((manuscript) => ({
                      id: manuscript.id,
                      title: manuscript.title,
                      fileName: manuscript.versions[0]?.fileName || "PDF",
                    })) || [];

              return (
                <div key={sub.id} className="rounded-lg border border-[var(--border)] p-4 bg-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          status === "Active" ? "bg-emerald-100 text-emerald-700" :
                          status === "Upcoming" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-500"
                        }`}>
                          {status}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{scope}</span>
                      </div>
                      <p className="font-semibold text-[var(--foreground)] line-clamp-1">{title}</p>
                      <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(sub.startsAt)} to {formatDate(sub.endsAt)}
                      </p>
                    </div>
                    <Link href={href} className="text-sm font-semibold text-[var(--brand-600)] hover:underline inline-flex items-center gap-1 whitespace-nowrap">
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="mt-4 rounded-md bg-slate-50 border border-slate-100">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-[var(--foreground)]">
                        Available PDFs
                      </p>
                      <p className="text-[11px] text-[var(--muted)]">
                        {readableArticles.length} file{readableArticles.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    {readableArticles.length === 0 ? (
                      <p className="px-3 py-3 text-xs text-[var(--muted)]">
                        No published PDF is attached yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {readableArticles.slice(0, 8).map((article) => (
                          <div key={article.id} className="px-3 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex items-start gap-2">
                              <FileText className="w-4 h-4 text-[var(--brand-600)] mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[var(--foreground)] line-clamp-1">
                                  {article.title}
                                </p>
                                <p className="text-[11px] text-[var(--muted)] line-clamp-1">
                                  {article.fileName}
                                </p>
                              </div>
                            </div>
                            {canRead ? (
                              <Link
                                href={`/api/articles/${article.id}/pdf`}
                                target="_blank"
                                className="text-xs font-semibold text-[var(--brand-600)] hover:underline whitespace-nowrap"
                              >
                                Read PDF
                              </Link>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                                {status === "Upcoming" ? "Available soon" : "Access ended"}
                              </span>
                            )}
                          </div>
                        ))}
                        {readableArticles.length > 8 ? (
                          <p className="px-3 py-2 text-xs text-[var(--muted)]">
                            {readableArticles.length - 8} more article PDFs are available in this journal.
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
