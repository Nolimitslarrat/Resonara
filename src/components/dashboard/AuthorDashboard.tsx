"use client";

import { FileText, Eye, AlertCircle, Globe, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getStatusLabel, getStatusClass, timeAgo, getNumericId } from "@/lib/utils";
import type { ManuscriptStatus } from "@prisma/client";

interface Manuscript {
  id: string; title: string; status: ManuscriptStatus; updatedAt: Date;
  journal: { title: string };
}

interface Props {
  stats: { totalSubmissions: number; underReview: number; revisionsNeeded: number; published: number };
  manuscripts: Manuscript[];
}

export function AuthorDashboard({ stats, manuscripts }: Props) {
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--foreground)]">My Submissions</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Track your manuscript status and manage revisions.</p>
        </div>
        <Link href="/dashboard/manuscripts/submit" className="w-full sm:w-auto">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            New Submission
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { label: "Total Submissions", value: stats.totalSubmissions, icon: FileText, color: "bg-[var(--brand-600)]" },
          { label: "Under Review", value: stats.underReview, icon: Eye, color: "bg-amber-500" },
          { label: "Revisions Needed", value: stats.revisionsNeeded, icon: AlertCircle, color: "bg-orange-500" },
          { label: "Published", value: stats.published, icon: Globe, color: "bg-emerald-600" },
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

      {/* Manuscripts */}
      {manuscripts.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <FileText className="w-10 h-10 text-[var(--muted-foreground)] mx-auto mb-4" />
            <p className="font-semibold text-[var(--foreground)]">No submissions yet</p>
            <p className="text-sm text-[var(--muted)] mt-2 mb-6">Submit your first manuscript to get started.</p>
            <Link href="/dashboard/manuscripts/submit">
              <Button>Submit Manuscript</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {manuscripts.map((m) => {
            const isRevision = m.status === "MINOR_REVISION" || m.status === "MAJOR_REVISION";
            return (
              <Card key={m.id} className={`card-hover ${isRevision ? "border-orange-200 dark:border-orange-800/50" : ""}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      {isRevision && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Revision Required
                        </div>
                      )}
                      <h3 className="font-semibold text-[var(--foreground)] leading-snug line-clamp-2 text-sm md:text-base">{m.title}</h3>
                      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${getStatusClass(m.status)}`}>
                          {getStatusLabel(m.status)}
                        </span>
                        <span className="text-[10px] md:text-xs text-[var(--muted)]">{m.journal.title}</span>
                        <span className="text-[10px] md:text-xs text-[var(--muted)]">Updated {timeAgo(m.updatedAt)}</span>
                      </div>
                    </div>
                    <Link href={`/dashboard/manuscripts/${getNumericId(m.id)}`} className="w-full md:w-auto">
                      <Button size="sm" variant={isRevision ? "default" : "outline"} className="gap-1 w-full md:w-auto flex-shrink-0">
                        {isRevision ? "Action Required" : "View Details"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
