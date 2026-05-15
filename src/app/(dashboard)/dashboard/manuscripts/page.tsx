import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStatusLabel, getStatusClass, formatDate } from "@/lib/utils";

export const metadata = {
  title: "Manuscripts | NexScholar",
};

export default async function ManuscriptsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isAdminOrEditor = session.user.role === "SUPER_ADMIN" || session.user.role === "MANAGING_EDITOR";

  const manuscripts = await prisma.manuscript.findMany({
    where: isAdminOrEditor ? {} : { authorId: session.user.id },
    include: {
      author: true,
      journal: true,
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Manuscripts</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            {isAdminOrEditor ? "Manage all submitted manuscripts across the platform." : "View all your submissions."}
          </p>
        </div>
        {!isAdminOrEditor && (
          <Link href="/dashboard/manuscripts/submit">
            <Button>Submit Manuscript</Button>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search manuscripts..." className="pl-9 bg-white" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50">
                {["Title", "Author", "Journal", "Status", "Last Updated", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {manuscripts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <FileText className="w-8 h-8 text-[var(--muted)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--muted)] text-sm">No manuscripts found.</p>
                  </td>
                </tr>
              ) : manuscripts.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--surface)] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[var(--foreground)] line-clamp-1 max-w-[300px]">{m.title}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{m.id.split("-")[0].toUpperCase()}</p>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)] text-sm">{m.author.name}</td>
                  <td className="px-6 py-4 text-[var(--muted)] text-sm">{m.journal.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(m.status)}`}>
                      {getStatusLabel(m.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--muted)]">{formatDate(m.updatedAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/manuscripts/${m.id}`}>
                      <Button size="sm" variant="ghost" className="gap-1 text-[var(--brand-600)]">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
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
