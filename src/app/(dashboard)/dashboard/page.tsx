import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { EditorDashboard } from "@/components/dashboard/EditorDashboard";
import { ReviewerDashboard } from "@/components/dashboard/ReviewerDashboard";
import { AuthorDashboard } from "@/components/dashboard/AuthorDashboard";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as Role;
  const userId = session.user.id;

  // Fetch role-specific data
  if (role === "SUPER_ADMIN") {
    const [totalManuscripts, totalJournals, totalReviewers, publishedArticles, recentLogs, monthlyData] = await Promise.all([
      prisma.manuscript.count(),
      prisma.journal.count(),
      prisma.user.count({ where: { role: "REVIEWER", isActive: true } }),
      prisma.article.count({ where: { publishedAt: { not: null } } }),
      prisma.activityLog.findMany({ take: 15, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, image: true } } } }),
      // Monthly submissions for last 6 months
      Promise.resolve([]),
    ]);
    return (
      <SuperAdminDashboard
        stats={{ totalManuscripts, totalJournals, totalReviewers, publishedArticles }}
        recentLogs={recentLogs}
      />
    );
  }

  if (role === "EDITOR") {
    const [awaiting, pendingAssignment, overdue, decisionPending, manuscripts] = await Promise.all([
      prisma.manuscript.count({ where: { status: "SUBMITTED", editorAssignments: { some: { editorId: userId } } } }),
      prisma.manuscript.count({ where: { status: "UNDER_SCREENING", editorAssignments: { some: { editorId: userId } } } }),
      prisma.reviewerAssignment.count({ where: { status: "OVERDUE", manuscript: { editorAssignments: { some: { editorId: userId } } } } }),
      prisma.manuscript.count({ where: { status: "UNDER_REVIEW", editorAssignments: { some: { editorId: userId } } } }),
      prisma.manuscript.findMany({
        where: { editorAssignments: { some: { editorId: userId } } },
        take: 10,
        orderBy: { updatedAt: "desc" },
        include: { author: { select: { name: true } }, journal: { select: { title: true } } }
      }),
    ]);
    return (
      <EditorDashboard
        stats={{ awaiting, pendingAssignment, overdue, decisionPending }}
        manuscripts={manuscripts}
      />
    );
  }

  if (role === "REVIEWER") {
    const [pendingInvitations, activeReviews, completedReviews, assignments] = await Promise.all([
      prisma.reviewerAssignment.count({ where: { reviewerId: userId, status: "PENDING" } }),
      prisma.reviewerAssignment.count({ where: { reviewerId: userId, status: "ACCEPTED" } }),
      prisma.reviewerAssignment.count({ where: { reviewerId: userId, status: "COMPLETED" } }),
      prisma.reviewerAssignment.findMany({
        where: { reviewerId: userId },
        take: 10,
        orderBy: { invitedAt: "desc" },
        include: { manuscript: { select: { title: true, abstract: true, journal: { select: { title: true } } } } },
      }),
    ]);
    return (
      <ReviewerDashboard
        stats={{ pendingInvitations, activeReviews, completedReviews }}
        assignments={assignments}
      />
    );
  }

  if (role === "AUTHOR") {
    const [totalSubmissions, underReview, revisionsNeeded, published, manuscripts] = await Promise.all([
      prisma.manuscript.count({ where: { authorId: userId } }),
      prisma.manuscript.count({ where: { authorId: userId, status: "UNDER_REVIEW" } }),
      prisma.manuscript.count({ where: { authorId: userId, status: { in: ["MINOR_REVISION", "MAJOR_REVISION"] } } }),
      prisma.manuscript.count({ where: { authorId: userId, status: "PUBLISHED" } }),
      prisma.manuscript.findMany({
        where: { authorId: userId },
        orderBy: { updatedAt: "desc" },
        include: { journal: { select: { title: true } } },
      }),
    ]);
    return (
      <AuthorDashboard
        stats={{ totalSubmissions, underReview, revisionsNeeded, published }}
        manuscripts={manuscripts}
      />
    );
  }

  redirect("/login");
}
