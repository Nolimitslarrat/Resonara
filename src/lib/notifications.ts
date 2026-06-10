import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

interface NotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Creates a notification for a specific user
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link
}: NotificationParams) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      }
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

/**
 * Notifies all admins and managing editors
 */
export async function notifyAdmins({
  type,
  title,
  message,
  link
}: Omit<NotificationParams, "userId">) {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ["SUPER_ADMIN", "EDITOR"]
        }
      },
      select: { id: true }
    });

    if (admins.length === 0) return [];

    return await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId: admin.id,
        type,
        title,
        message,
        link,
      }))
    });
  } catch (error) {
    console.error("Failed to notify admins:", error);
    return null;
  }
}
