"use client";

import { FileText, Clock, AlertTriangle, CheckCircle2, ArrowRight, PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getStatusLabel, getStatusClass, timeAgo, getNumericId } from "@/lib/utils";
import type { ManuscriptStatus } from "@prisma/client";

interface Manuscript {
  id: string; title: string; status: ManuscriptStatus; updatedAt: Date;
  author: { name: string }; journal: { title: string };
}

interface Props {
  stats: { awaiting: number; pendingAssignment: number; overdue: number; decisionPending: number };
  manuscripts: Manuscript[];
}

const PIPELINE = [
  { status: "SUBMITTED",       label: "Submitted",     color: "bg-blue-500" },
  { status: "UNDER_SCREENING", label: "Screening",     color: "bg-purple-500" },
  { status: "UNDER_REVIEW",    label: "Under Review",  color: "bg-amber-500" },
  { status: "MINOR_REVISION",  label: "Minor Rev.",    color: "bg-orange-500" },
  { status: "MAJOR_REVISION",  label: "Major Rev.",    color: "bg-red-500" },
  { status: "ACCEPTED",        label: "Accepted",      color: "bg-emerald-500" },
];

export function EditorDashboard({ stats, manuscripts }: Props) {
  const pipelineCounts = PIPELINE.map(p => ({
    ...p,
    count: manuscripts.filter(m => m.status === p.status).length,
  }));

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Editorial Dashboard</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage manuscripts, reviewers, and editorial decisions.</p>
        </div>
        <Link href="/dashboard/manuscripts/submit">
          <Button className="gap-2">
            <PenLine className="w-4 h-4" />
            Submit Manuscript
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Awaiting Screening", value: stats.awaiting, icon: FileText, color: "bg-blue-600" },
          { label: "Pending Assignment", value: stats.pendingAssignment, icon: Clock, color: "bg-purple-600" },
          { label: "Overdue Reviews", value: stats.overdue, icon: AlertTriangle, color: "bg-red-600" },
          { label: "Decision Pending", value: stats.decisionPending, icon: CheckCircle2, color: "bg-amber-500" },
        ].map((s) => (
          <Card key={s.label} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[var(--muted)] font-medium">{s.label}</p>
                  <p className="text-3xl font-bold mt-2 text-[var(--foreground)]">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manuscript Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {pipelineCounts.map((stage, i) => (
              <div key={stage.status} className="flex items-center gap-2 flex-shrink-0">
                <div className="text-center min-w-[90px]">
                  <div className={`w-12 h-12 rounded-2xl ${stage.color} flex items-center justify-center text-white font-bold text-lg mx-auto`}>
                    {stage.count}
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-2 font-medium">{stage.label}</p>
                </div>
                {i < pipelineCounts.length - 1 && <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manuscripts Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Manuscripts</CardTitle>
          <Link href="/dashboard/manuscripts">
            <Button variant="ghost" size="sm" className="gap-1 text-[var(--brand-600)]">View all <ArrowRight className="w-3.5 h-3.5" /></Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {["Title", "Author", "Journal", "Status", "Updated"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {manuscripts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-[var(--muted)] text-sm">No manuscripts yet.</td></tr>
                ) : manuscripts.map((m) => (
                  <tr key={m.id} className="hover:bg-[var(--surface)] transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/manuscripts/${getNumericId(m.id)}`} className="font-medium text-[var(--foreground)] hover:text-[var(--brand-600)] line-clamp-1 max-w-[250px] block">
                        {m.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">{m.author.name}</td>
                    <td className="px-6 py-4 text-[var(--muted)] text-xs">{m.journal.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(m.status)}`}>
                        {getStatusLabel(m.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--muted)]">{timeAgo(m.updatedAt)}</td>
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
