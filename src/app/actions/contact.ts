"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleContactReadStatus(id: string, currentStatus: boolean) {
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: !currentStatus },
  });
  revalidatePath("/dashboard/contacts");
}
