"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getEditorialCandidates() {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  return users;
}

export async function createJournal(formData: FormData) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const issnPrint = formData.get("issnPrint") as string;
  const issnOnline = formData.get("issnOnline") as string;
  const description = formData.get("description") as string;
  const scope = formData.get("scope") as string;
  const website = formData.get("website") as string;
  const reviewType = (formData.get("reviewType") as string) || "DOUBLE_BLIND";
  const editorInChiefId = formData.get("editorInChiefId") as string;
  const abbreviation = formData.get("abbreviation") as string;
  const frequency = formData.get("frequency") as string;
  const doi = formData.get("doi") as string;
  const publisher = formData.get("publisher") as string;
  const startingYear = formData.get("startingYear") as string;
  const publicationFormat = formData.get("publicationFormat") as string;
  const language = formData.get("language") as string;
  const copyrightPolicy = formData.get("copyrightPolicy") as string;
  const impactFactor = formData.get("impactFactor") as string;
  const address = formData.get("address") as string;
  const editorialBoardRaw = formData.get("editorialBoard") as string;
  const indexingServicesRaw = formData.get("indexingServices") as string;
  
  const indexingServices = indexingServicesRaw 
    ? indexingServicesRaw.split(",").map(s => s.trim()).filter(Boolean)
    : [];
  
  if (!title) {
    return { success: false, error: "Journal title is required" };
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    type EditorialBoardInput = {
      userId: unknown;
      role?: unknown;
      order?: unknown;
    };

    const isBoardInput = (val: unknown): val is EditorialBoardInput => {
      return typeof val === "object" && val !== null && "userId" in val;
    };

    const editorialBoard = (() => {
      if (!editorialBoardRaw) return [];
      try {
        const parsed: unknown = JSON.parse(editorialBoardRaw);
        if (!Array.isArray(parsed)) return [];
        return parsed
          .filter(isBoardInput)
          .map((x) => ({
            userId: typeof x.userId === "string" ? x.userId : String(x.userId || ""),
            role: typeof x.role === "string" && x.role.trim().length ? x.role : "EDITORIAL_BOARD",
            order: Number.isFinite(Number(x.order)) ? Number(x.order) : 0,
          }))
          .filter((x) => x.userId.length > 0);
      } catch {
        return [];
      }
    })();

    await prisma.journal.create({
      data: {
        title,
        slug,
        issnPrint: issnPrint || null,
        issnOnline: issnOnline || null,
        description: description || null,
        scope: scope || null,
        website: website || null,
        reviewType,
        abbreviation: abbreviation || null,
        frequency: frequency || null,
        doi: doi || null,
        publisher: publisher || null,
        startingYear: startingYear || null,
        publicationFormat: publicationFormat || null,
        language: language || null,
        copyrightPolicy: copyrightPolicy || null,
        impactFactor: impactFactor || null,
        address: address || null,
        editorInChiefId: editorInChiefId || null,
        isActive: true,
        indexingServices,
        editorialBoard: editorialBoard.length
          ? {
              create: editorialBoard,
            }
          : undefined,
      }
    });

    revalidatePath("/dashboard/journals");
    revalidatePath("/journals");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to create journal:", error);
    const maybeCode = typeof error === "object" && error !== null && "code" in error ? (error as { code?: unknown }).code : undefined;
    if (maybeCode === "P2002") {
      return { success: false, error: "A journal with this title or slug already exists." };
    }
    return { success: false, error: "Failed to create journal. Please try again." };
  }
}

export async function updateJournal(id: string, formData: FormData) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const issnPrint = formData.get("issnPrint") as string;
  const issnOnline = formData.get("issnOnline") as string;
  const description = formData.get("description") as string;
  const scope = formData.get("scope") as string;
  const website = formData.get("website") as string;
  const reviewType = (formData.get("reviewType") as string) || "DOUBLE_BLIND";
  const editorInChiefId = formData.get("editorInChiefId") as string;
  const abbreviation = formData.get("abbreviation") as string;
  const frequency = formData.get("frequency") as string;
  const doi = formData.get("doi") as string;
  const publisher = formData.get("publisher") as string;
  const startingYear = formData.get("startingYear") as string;
  const publicationFormat = formData.get("publicationFormat") as string;
  const language = formData.get("language") as string;
  const copyrightPolicy = formData.get("copyrightPolicy") as string;
  const impactFactor = formData.get("impactFactor") as string;
  const address = formData.get("address") as string;
  // isActive is explicitly sent as the string "true" or "false" from our toggle
  const isActive = formData.get("isActive") === "true";
  const indexingServicesRaw = formData.get("indexingServices") as string;
  const editorialBoardRaw = formData.get("editorialBoard") as string;

  const indexingServices = indexingServicesRaw
    ? indexingServicesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  type EditorialBoardInput = {
    userId: unknown;
    role?: unknown;
    order?: unknown;
  };

  const isBoardInput = (val: unknown): val is EditorialBoardInput => {
    return typeof val === "object" && val !== null && "userId" in val;
  };

  const editorialBoard = (() => {
    if (!editorialBoardRaw) return [];
    try {
      const parsed: unknown = JSON.parse(editorialBoardRaw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(isBoardInput)
        .map((x) => ({
          userId: typeof x.userId === "string" ? x.userId : String(x.userId || ""),
          role:
            typeof x.role === "string" && x.role.trim().length
              ? x.role
              : "Editorial Board Member",
          order: Number.isFinite(Number(x.order)) ? Number(x.order) : 0,
        }))
        .filter((x) => x.userId.length > 0);
    } catch {
      return [];
    }
  })();

  try {
    // Update core journal fields
    await prisma.journal.update({
      where: { id },
      data: {
        title,
        issnPrint: issnPrint || null,
        issnOnline: issnOnline || null,
        description: description || null,
        scope: scope || null,
        website: website || null,
        reviewType,
        abbreviation: abbreviation || null,
        frequency: frequency || null,
        doi: doi || null,
        publisher: publisher || null,
        startingYear: startingYear || null,
        publicationFormat: publicationFormat || null,
        language: language || null,
        copyrightPolicy: copyrightPolicy || null,
        impactFactor: impactFactor || null,
        address: address || null,
        editorInChiefId: editorInChiefId || null,
        isActive,
        indexingServices,
      },
    });

    // Sync editorial board: delete all existing, then recreate from form data
    // This is the simplest correct approach for a replace-all board update
    await prisma.editorialBoard.deleteMany({ where: { journalId: id } });

    if (editorialBoard.length > 0) {
      await prisma.editorialBoard.createMany({
        data: editorialBoard.map((m) => ({
          journalId: id,
          userId: m.userId,
          role: m.role,
          order: m.order,
        })),
        skipDuplicates: true,
      });
    }

    revalidatePath("/dashboard/journals");
    revalidatePath(`/dashboard/journals/${id}/edit`);
    revalidatePath("/journals");
    return { success: true };
  } catch (error) {
    console.error("Failed to update journal:", error);
    return { success: false, error: "Failed to update journal: " + (error instanceof Error ? error.message : String(error)) };
  }
}
