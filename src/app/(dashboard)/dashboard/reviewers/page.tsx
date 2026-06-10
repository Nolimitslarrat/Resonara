import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Search, Star, Fingerprint, Building2 } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Reviewers | Resonara Publishers Pvt. Ltd." };

export default async function ReviewersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) redirect("/dashboard");

  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';

  const reviewers = await prisma.user.findMany({
    where: { 
      role: "REVIEWER",
      ...(q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } }
        ]
      } : {})
    },
    include: {
      _count: {
        select: { reviewerAssignments: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const activeCount = reviewers.filter((r) => r.isActive).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Reviewer Pool</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            {reviewers.length} registered reviewer{reviewers.length !== 1 ? "s" : ""} •{" "}
            {activeCount} active
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchInput placeholder="Search reviewers by name or email..." />
      </div>

      {/* Reviewer cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviewers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-[var(--border)] py-20 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">No reviewers yet</h3>
            <p className="text-sm text-slate-500 mt-1">
              Reviewers will appear here once they register on the platform.
            </p>
          </div>
        ) : (
          reviewers.map((reviewer) => (
            <div
              key={reviewer.id}
              className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm flex-shrink-0">
                  {reviewer.name?.[0]?.toUpperCase() ?? "R"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--foreground)] truncate">{reviewer.name}</p>
                  <p className="text-xs text-[var(--muted)] truncate">{reviewer.email}</p>
                </div>
                <span
                  className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    reviewer.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {reviewer.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[var(--muted)]">
                {reviewer.affiliation && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{reviewer.affiliation}</span>
                  </div>
                )}
                {reviewer.orcid && (
                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3 flex-shrink-0" />
                    <span className="font-mono">{reviewer.orcid}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 flex-shrink-0 text-amber-500" />
                  <span>{reviewer._count.reviewerAssignments} total assignments</span>
                </div>
              </div>

              {reviewer.expertise && reviewer.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {reviewer.expertise.slice(0, 3).map((exp) => (
                    <span
                      key={exp}
                      className="text-[0.6rem] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Joined {formatDate(reviewer.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
