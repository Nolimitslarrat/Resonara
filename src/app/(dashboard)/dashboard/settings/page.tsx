import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let session;
  try {
    session = await auth();
  } catch {
    return redirect("/login");
  }
  
  if (!session?.user?.id) return redirect("/login");

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        affiliation: true,
        bio: true,
        orcid: true,
        designation: true,
        institutionalProfile: true,
        apidProfile: true,
        isActive: true,
      },
    });
  } catch (e) {
    console.error("Settings page DB error:", e);
  }

  return <SettingsClient user={user as any} />;
}
