import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Users, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { InviteUserModal } from "./InviteUserModal";
import { ManageRoleModal } from "./ManageRoleModal";
import { UserSearchForm } from "./UserSearchForm";
import { EditUserModal } from "./EditUserModal";

export const metadata = {
  title: "User Management | Resonara Publishers Pvt. Ltd.",
};

export default async function UsersManagerPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      ...(q ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      } : {})
    },
    orderBy: { createdAt: "desc" }
  });

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-700 border-red-200",
    EDITOR: "bg-purple-100 text-purple-700 border-purple-200",
    REVIEWER: "bg-amber-100 text-amber-700 border-amber-200",
    AUTHOR: "bg-emerald-100 text-emerald-700 border-emerald-200"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">User Management</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage accounts, roles, and platform access.</p>
        </div>
        <InviteUserModal />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-slate-50">
          <Suspense fallback={<div className="h-10 w-64 bg-slate-100 animate-pulse rounded-lg" />}>
            <UserSearchForm initialQuery={q} />
          </Suspense>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50">
                {["User", "Role", "Affiliation", "Joined", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Users className="w-8 h-8 text-[var(--muted)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--muted)] text-sm">No users found.</p>
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--surface)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-100)] flex items-center justify-center text-[var(--brand-700)] font-bold">
                        {u.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{u.name}</p>
                        <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleColors[u.role]}`}>
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)] text-sm max-w-[200px] truncate">
                    {u.affiliation || "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--muted)]">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <EditUserModal user={{
                      id: u.id,
                      name: u.name,
                      email: u.email,
                      role: u.role,
                      orcid: u.orcid,
                      affiliation: u.affiliation,
                      designation: u.designation,
                      institutionalProfile: u.institutionalProfile,
                      apidProfile: u.apidProfile,
                      bio: u.bio,
                    }} />
                    <ManageRoleModal userId={u.id} currentRole={u.role} userName={u.name || u.email} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
