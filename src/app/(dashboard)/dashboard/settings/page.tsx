import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) return redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return <SettingsClient user={user} />;
}
