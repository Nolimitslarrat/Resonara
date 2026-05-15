"use client";

import { FileText, BookOpen, Users, TrendingUp, Activity, ArrowUpRight, Plus, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

interface Props {
  stats: { totalManuscripts: number; totalJournals: number; totalReviewers: number; publishedArticles: number };
  recentLogs: Array<{ id: string; action: string; entity: string; createdAt: Date; user: { name: string; image: string | null } }>;
}

const StatCard = ({ title, value, icon: Icon, trend, color }: { title: string; value: number; icon: React.ElementType; trend?: string; color: string }) => (
  <Card className="card-hover overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
          <p className="text-3xl font-bold text-[var(--foreground)] tabular-nums">{value.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {trend}
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function SuperAdminDashboard({ stats, recentLogs }: Props) {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Platform Overview</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Monitor all platform activity and manage operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/journals">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-3.5 h-3.5" />
              New Journal
            </Button>
          </Link>
          <Link href="/dashboard/users">
            <Button size="sm" className="gap-2">
              <UserPlus className="w-3.5 h-3.5" />
              Invite User
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Manuscripts" value={stats.totalManuscripts} icon={FileText} trend="+12% this month" color="bg-[var(--brand-600)]" />
        <StatCard title="Active Journals" value={stats.totalJournals} icon={BookOpen} trend="+2 this month" color="bg-purple-600" />
        <StatCard title="Active Reviewers" value={stats.totalReviewers} icon={Users} trend="+8% this month" color="bg-amber-500" />
        <StatCard title="Published Articles" value={stats.publishedArticles} icon={TrendingUp} trend="+18% this month" color="bg-emerald-600" />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Submission Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 flex items-end gap-2 px-2">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => {
                const h = [40,55,35,70,85,60,90,75,80,65,95,88][i];
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-[var(--brand-600)] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ height: `${h * 1.8}px` }}
                      title={`${m}: ${h} submissions`}
                    />
                    <span className="text-[10px] text-[var(--muted)]">{m.slice(0,1)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Link href="/dashboard/logs" className="text-xs text-[var(--brand-600)] hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 divide-y divide-[var(--border)]">
              {recentLogs.length === 0 ? (
                <p className="text-sm text-[var(--muted)] p-4">No activity yet.</p>
              ) : (
                recentLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 px-6 py-3">
                    <div className="w-7 h-7 rounded-full bg-[var(--brand-100)] dark:bg-[var(--brand-900)] flex items-center justify-center text-xs font-bold text-[var(--brand-700)] flex-shrink-0 mt-0.5">
                      {log.user.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        <span className="font-semibold">{log.user.name}</span>{" "}
                        {log.action.toLowerCase()} {log.entity.toLowerCase()}
                      </p>
                      <p className="text-[10px] text-[var(--muted)] mt-0.5">{timeAgo(log.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">94%</p>
                <p className="text-xs text-[var(--muted)]">Reviewer acceptance rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">28%</p>
                <p className="text-xs text-[var(--muted)]">Acceptance rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">18d</p>
                <p className="text-xs text-[var(--muted)]">Avg. review turnaround</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
