import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Activity, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Activity Logs | Resonara",
};

export default async function ActivityLogsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';

  const searchWhere = q ? {
    OR: [
      { action: { contains: q, mode: 'insensitive' as const } },
      { entity: { contains: q, mode: 'insensitive' as const } },
      { user: { name: { contains: q, mode: 'insensitive' as const } } }
    ]
  } : {};

  const logs = await prisma.activityLog.findMany({
    where: searchWhere,
    include: {
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 100 // Limit to recent 100 for now
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">System Activity Logs</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Audit trail of all actions performed across the platform.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Activity className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-slate-50">
          <SearchInput placeholder="Search logs..." />
          <Button variant="outline" size="sm" className="gap-2 bg-white">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50">
                {["Timestamp", "User", "Action", "Entity", "Metadata"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Activity className="w-8 h-8 text-[var(--muted)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--muted)] text-sm">No activity logs found.</p>
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--surface)] transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-[var(--muted)] whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[var(--foreground)]">{log.user.name}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{log.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)] text-sm font-medium">
                    {log.entity}
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--muted)] max-w-[300px] truncate">
                    {log.metadata ? String(log.metadata) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
