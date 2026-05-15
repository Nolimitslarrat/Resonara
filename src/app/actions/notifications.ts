"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.notification.updateMany({
      where: { 
        userId: session.user.id,
        read: false 
      },
      data: { read: true }
    });
    
    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return { success: false, error: "Failed to update notifications" };
  }
}

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.notification.update({
      where: { 
        id: notificationId,
        userId: session.user.id 
      },
      data: { read: true }
    });
    
    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update notification" };
  }
}
