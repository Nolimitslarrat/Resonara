import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SubscriptionEngine } from "./SubscriptionEngine";

export const metadata = { title: "Subscription Engine | Resonara Publishers Pvt. Ltd." };

export default async function SubscriptionEnginePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const [users, journals, articles, subscriptions] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    }),
    prisma.journal.findMany({
      where: { isActive: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.article.findMany({
      where: { publishedAt: { not: null } },
      select: {
        id: true,
        manuscriptId: true,
        manuscript: { select: { title: true, journal: { select: { title: true } } } },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.subscriptionAccess.findMany({
      include: {
        user: { select: { name: true, email: true } },
        journal: { select: { title: true } },
        article: { select: { manuscript: { select: { title: true, journal: { select: { title: true } } } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Subscription Engine</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Grant paid article or journal access to users for a controlled subscription window.
        </p>
      </div>

      <SubscriptionEngine users={users} journals={journals} articles={articles} subscriptions={subscriptions} />
    </div>
  );
}
