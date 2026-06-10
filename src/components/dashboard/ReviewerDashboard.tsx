"use client";

import { Star, Clock, CheckCircle2, Mail, ArrowRight, Calendar, PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { timeAgo, formatDate, truncate } from "@/lib/utils";
import type { ReviewStatus } from "@prisma/client";

interface Assignment {
  id: string; status: ReviewStatus; dueDate: Date | null; invitedAt: Date;
  manuscript: { title: string; abstract: string; journal: { title: string } };
}

interface Props {
  stats: { pendingInvitations: number; activeReviews: number; completedReviews: number };
  assignments: Assignment[];
}

export function ReviewerDashboard({ stats, assignments }: Props) {
  const pending = assignments.filter((a) => a.status === "PENDING");
  const active = assignments.filter((a) => a.status === "ACCEPTED");
  const completed = assignments.filter((a) => a.status === "COMPLETED");

  function getDaysLeft(due: Date | null) {
    if (!due) return null;
    const diff = Math.ceil((new Date(due).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Reviewer Dashboard</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage your review invitations and active assignments.</p>
        </div>
        <Link href="/dashboard/manuscripts/submit">
          <Button className="gap-2">
            <PenLine className="w-4 h-4" />
            Submit Manuscript
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Pending Invitations", value: stats.pendingInvitations, icon: Mail, color: "bg-amber-500" },
          { label: "Active Reviews", value: stats.activeReviews, icon: Clock, color: "bg-[var(--brand-600)]" },
          { label: "Completed Reviews", value: stats.completedReviews, icon: CheckCircle2, color: "bg-emerald-600" },
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

      {/* Invitations */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Pending Invitations</h2>
          <div className="grid gap-4">
            {pending.map((a) => (
              <Card key={a.id} className="border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-900/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Invitation</span>
                        <span className="text-xs text-[var(--muted)]">·</span>
                        <span className="text-xs text-[var(--muted)]">{a.manuscript.journal.title}</span>
                      </div>
                      <h3 className="font-semibold text-[var(--foreground)] leading-snug">{a.manuscript.title}</h3>
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{truncate(a.manuscript.abstract, 180)}</p>
                      {a.dueDate && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                          <Calendar className="w-3.5 h-3.5" />
                          Review deadline: {formatDate(a.dueDate)}
                        </div>
                      )}
                    </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={async () => {
                          const { acceptReview } = await import('@/app/actions/reviewer');
                          await acceptReview(a.id);
                        }}>Accept</Button>
                        <Button size="sm" variant="outline" onClick={async () => {
                          const { declineReview } = await import('@/app/actions/reviewer');
                          await declineReview(a.id);
                        }}>Decline</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Reviews */}
      {active.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Active Reviews</h2>
          <div className="grid gap-3">
            {active.map((a) => {
              const daysLeft = getDaysLeft(a.dueDate);
              return (
                <Card key={a.id} className="card-hover">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--foreground)] line-clamp-1">{a.manuscript.title}</h3>
                      <p className="text-xs text-[var(--muted)] mt-1">{a.manuscript.journal.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {daysLeft !== null && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          daysLeft <= 3 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                          daysLeft <= 7 ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}
                        </span>
                      )}
                      <Link href={`/dashboard/reviews/${a.id}`}>
                        <Button size="sm" className="gap-1">Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Completed Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {completed.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)] line-clamp-1">{a.manuscript.title}</p>
                    <p className="text-xs text-[var(--muted)]">{a.manuscript.journal.title}</p>
                  </div>
                  <span className="text-xs text-[var(--muted)]">{timeAgo(a.invitedAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pending.length === 0 && active.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Star className="w-10 h-10 text-[var(--muted-foreground)] mx-auto mb-3" />
            <p className="text-[var(--foreground)] font-medium">No active reviews</p>
            <p className="text-sm text-[var(--muted)] mt-1">You&apos;ll receive email invitations when manuscripts need review.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
