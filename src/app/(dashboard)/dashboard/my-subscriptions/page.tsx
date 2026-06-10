import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CalendarDays, FileText, Library, Timer } from "lucide-react";
import { MySubscriptions } from "@/components/dashboard/MySubscriptions";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "My Subscriptions" };

const subscriptionInclude = {
  journal: {
    select: {
      title: true,
      slug: true,
      manuscripts: {
        where: {
          article: { publishedAt: { not: null } },
        },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          article: { select: { pdfUrl: true, publishedAt: true } },
          versions: {
            orderBy: { version: "desc" },
            take: 1,
            select: { fileUrl: true, fileName: true },
          },
        },
      },
    },
  },
  article: {
    select: {
      manuscriptId: true,
      pdfUrl: true,
      publishedAt: true,
      manuscript: {
        select: {
          title: true,
          journal: { select: { title: true } },
          versions: {
            orderBy: { version: "desc" },
            take: 1,
            select: { fileUrl: true, fileName: true },
          },
        },
      },
    },
  },
} as const;

export default async function MySubscriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const subscriptions = await prisma.subscriptionAccess.findMany({
    where: { userId: session.user.id },
    include: subscriptionInclude,
    orderBy: [{ isActive: "desc" }, { endsAt: "asc" }],
  });

  const now = new Date();
  const active = subscriptions.filter((sub) => sub.isActive && sub.startsAt <= now && sub.endsAt >= now);
  const expiringSoon = active.filter((sub) => {
    const daysLeft = Math.ceil((sub.endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30;
  });
  const journalAccess = active.filter((sub) => sub.journal).length;
  const activePdfCount = active.reduce((total, sub) => {
    if (sub.article) return total + 1;
    return total + (sub.journal?.manuscripts.filter((m) => m.article?.pdfUrl || m.versions[0]?.fileUrl).length || 0);
  }, 0);
  const latestEndDate = active.length
    ? active.reduce((latest, sub) => (sub.endsAt > latest ? sub.endsAt : latest), active[0].endsAt)
    : null;

  const stats = [
    { label: "Readable PDFs", value: activePdfCount, icon: FileText, tone: "bg-[var(--brand-600)]" },
    { label: "Journal Access", value: journalAccess, icon: Library, tone: "bg-emerald-600" },
    { label: "Expiring Soon", value: expiringSoon.length, icon: Timer, tone: "bg-amber-500" },
    { label: "Latest Valid Until", value: latestEndDate ? formatDate(latestEndDate) : "No active access", icon: CalendarDays, tone: "bg-slate-700" },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--foreground)]">My Subscriptions</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Read subscribed article PDFs and track your access period.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-[var(--muted)] font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2 text-[var(--foreground)] truncate">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.tone}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MySubscriptions subscriptions={subscriptions} />
    </div>
  );
}
