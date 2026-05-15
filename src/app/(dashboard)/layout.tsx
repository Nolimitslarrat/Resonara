import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClientLayout } from "./DashboardClientLayout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, read: false }
  });

  return (
    <DashboardClientLayout unreadCount={unreadCount}>
      {children}
    </DashboardClientLayout>
  );
}
