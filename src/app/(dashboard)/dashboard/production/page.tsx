import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Printer, ArrowRight, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusLabel, getStatusClass, formatDate } from "@/lib/utils";

export const metadata = { title: "Production Queue | Resonara Publishers Pvt. Ltd." };

export default async function ProductionQueuePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const [awaitingProduction, inCopyediting, inProofreading, readyToPublish, queue] =
    await Promise.all([
      prisma.manuscript.count({ where: { status: "ACCEPTED" } }),
      prisma.manuscript.count({ where: { status: "COPYEDITING" } }),
      prisma.manuscript.count({ where: { status: "PROOFREADING" } }),
      prisma.manuscript.count({ where: { status: "READY_TO_PUBLISH" } }),
      prisma.manuscript.findMany({
        where: {
          status: {
            in: ["ACCEPTED", "COPYEDITING", "PROOFREADING", "TYPESETTING", "READY_TO_PUBLISH"],
          },
        },
        include: {
          journal: { select: { title: true } },
          author: { select: { name: true } },
        },
        orderBy: { updatedAt: "asc" },
        take: 50,
      }),
    ]);

  const summaryItems = [
    { label: "Awaiting Production", value: awaitingProduction, color: "bg-amber-500" },
    { label: "Copyediting", value: inCopyediting, color: "bg-sky-500" },
    { label: "Proofreading", value: inProofreading, color: "bg-violet-500" },
    { label: "Ready to Publish", value: readyToPublish, color: "bg-emerald-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Production Queue</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Manuscripts accepted for publication and currently in production.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5"
          >
            <div className={`w-2 h-2 rounded-full ${item.color} mb-3`} />
            <p className="text-3xl font-bold text-[var(--foreground)]">{item.value}</p>
            <p className="text-xs text-[var(--muted)] mt-1 font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Queue table */}
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-slate-50 flex items-center gap-2">
          <Printer className="w-4 h-4 text-[var(--muted)]" />
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Production Queue ({queue.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50">
                {["Title", "Author", "Journal", "Stage", "Last Updated", ""].map((h) => (
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
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <FileText className="w-8 h-8 text-[var(--muted)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--muted)] text-sm">No manuscripts in production.</p>
                  </td>
                </tr>
              ) : (
                queue.map((m) => (
                  <tr key={m.id} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--foreground)] line-clamp-1 max-w-[250px]">
                        {m.title}
                      </p>
                      <p className="text-xs font-mono text-[var(--muted)] mt-0.5">
                        {m.id.slice(0, 8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] text-sm">{m.author.name}</td>
                    <td className="px-6 py-4 text-[var(--muted)] text-sm">{m.journal.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(m.status)}`}
                      >
                        {getStatusLabel(m.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(m.updatedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/production/${m.id}`}>
                        <Button size="sm" variant="ghost" className="gap-1 text-[var(--brand-600)]">
                          Manage <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
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
