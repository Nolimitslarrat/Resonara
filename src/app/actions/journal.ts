"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createJournal(formData: FormData) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "MANAGING_EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const issnPrint = formData.get("issnPrint") as string;
  const issnOnline = formData.get("issnOnline") as string;
  const description = formData.get("description") as string;
  const scope = formData.get("scope") as string;
  
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
    await prisma.journal.create({
      data: {
        title,
        slug,
        issnPrint: issnPrint || null,
        issnOnline: issnOnline || null,
        description: description || null,
        scope: scope || null,
        isActive: true,
      }
    });

    revalidatePath("/dashboard/journals");
    revalidatePath("/journals");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create journal:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "A journal with this title or slug already exists." };
    }
    return { success: false, error: "Failed to create journal. Please try again." };
  }
}

export async function updateJournal(id: string, formData: FormData) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "MANAGING_EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const issnPrint = formData.get("issnPrint") as string;
  const issnOnline = formData.get("issnOnline") as string;
  const description = formData.get("description") as string;
  const scope = formData.get("scope") as string;
  const isActive = formData.get("isActive") === "true";

  try {
    await prisma.journal.update({
      where: { id },
      data: {
        title,
        issnPrint: issnPrint || null,
        issnOnline: issnOnline || null,
        description: description || null,
        scope: scope || null,
        isActive,
      }
    });

    revalidatePath("/dashboard/journals");
    revalidatePath("/journals");
    return { success: true };
  } catch (error) {
    console.error("Failed to update journal:", error);
    return { success: false, error: "Failed to update journal." };
  }
}
