import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import ClientLayout from "./ClientLayout";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, read: false }
  });

  return (
    <ClientLayout unreadCount={unreadCount}>
      {children}
    </ClientLayout>
  );
}
