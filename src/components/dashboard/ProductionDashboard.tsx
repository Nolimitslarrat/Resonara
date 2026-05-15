"use client";

import { Printer, Edit, CheckSquare, Rocket, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getStatusLabel, getStatusClass, timeAgo } from "@/lib/utils";
import type { ManuscriptStatus } from "@prisma/client";

interface QueueItem {
  id: string; title: string; status: ManuscriptStatus; updatedAt: Date;
  journal: { title: string }; author: { name: string };
}

interface Props {
  stats: { awaitingProduction: number; inCopyediting: number; inProofreading: number; readyToPublish: number };
  queue: QueueItem[];
}

export function ProductionDashboard({ stats, queue }: Props) {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Production Queue</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Manage copyediting, proofreading, metadata, and publishing.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Awaiting Production", value: stats.awaitingProduction, icon: Printer, color: "bg-cyan-600" },
          { label: "In Copyediting", value: stats.inCopyediting, icon: Edit, color: "bg-[var(--brand-600)]" },
          { label: "In Proofreading", value: stats.inProofreading, icon: CheckSquare, color: "bg-purple-600" },
          { label: "Ready to Publish", value: stats.readyToPublish, icon: Rocket, color: "bg-emerald-600" },
        ].map((s) => (
          <Card key={s.label} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[var(--muted)] font-medium">{s.label}</p>
                  <p className="text-3xl font-bold mt-2">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Production Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {["Title", "Author", "Journal", "Stage", "Last Updated", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {queue.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-[var(--muted)] text-sm">No items in production queue.</td></tr>
                ) : queue.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--foreground)] line-clamp-1 max-w-[220px]">{item.title}</p>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] text-xs">{item.author.name}</td>
                    <td className="px-6 py-4 text-[var(--muted)] text-xs">{item.journal.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--muted)]">{timeAgo(item.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/production/${item.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          Manage <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
