"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { IssueStatus } from "@prisma/client";

function parsePositiveInt(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function requireSuperAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createIssue(formData: FormData) {
  await requireSuperAdmin();

  const journalId = String(formData.get("journalId") || "");
  const volume = parsePositiveInt(formData.get("volume"));
  const issue = parsePositiveInt(formData.get("issue"));
  const year = parsePositiveInt(formData.get("year"));
  const title = String(formData.get("title") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const status = String(formData.get("status") || "DRAFT") as IssueStatus;

  if (!journalId || !volume || !issue || !year) {
    return { success: false, error: "Journal, volume, issue, and year are required." };
  }

  if (!["DRAFT", "PUBLISHED"].includes(status)) {
    return { success: false, error: "Invalid issue status." };
  }

  try {
    await prisma.publicationIssue.create({
      data: {
        journalId,
        volume,
        issue,
        year,
        title: title || null,
        coverImage: coverImage || null,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/dashboard/issues");
    revalidatePath("/special-issues");
    return { success: true };
  } catch (error) {
    console.error("Failed to create issue", error);
    return { success: false, error: "Failed to create issue." };
  }
}

export async function updateIssue(issueId: string, formData: FormData) {
  await requireSuperAdmin();

  const journalId = String(formData.get("journalId") || "");
  const volume = parsePositiveInt(formData.get("volume"));
  const issue = parsePositiveInt(formData.get("issue"));
  const year = parsePositiveInt(formData.get("year"));
  const title = String(formData.get("title") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const status = String(formData.get("status") || "DRAFT") as IssueStatus;

  if (!journalId || !volume || !issue || !year) {
    return { success: false, error: "Journal, volume, issue, and year are required." };
  }

  if (!["DRAFT", "PUBLISHED"].includes(status)) {
    return { success: false, error: "Invalid issue status." };
  }

  try {
    const existing = await prisma.publicationIssue.findUnique({
      where: { id: issueId },
      select: { publishedAt: true },
    });

    await prisma.publicationIssue.update({
      where: { id: issueId },
      data: {
        journalId,
        volume,
        issue,
        year,
        title: title || null,
        coverImage: coverImage || null,
        status,
        publishedAt: status === "PUBLISHED" ? existing?.publishedAt ?? new Date() : null,
      },
    });

    revalidatePath("/dashboard/issues");
    revalidatePath("/special-issues");
    return { success: true };
  } catch (error) {
    console.error("Failed to update issue", error);
    return { success: false, error: "Failed to update issue." };
  }
}

export async function deleteIssue(issueId: string) {
  await requireSuperAdmin();

  try {
    const articleCount = await prisma.article.count({ where: { issueId } });
    if (articleCount > 0) {
      return { success: false, error: "Remove articles from this issue before deleting it." };
    }

    await prisma.publicationIssue.delete({ where: { id: issueId } });

    revalidatePath("/dashboard/issues");
    revalidatePath("/special-issues");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete issue", error);
    return { success: false, error: "Failed to delete issue." };
  }
}
