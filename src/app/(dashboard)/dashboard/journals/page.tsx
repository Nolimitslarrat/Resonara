import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Manage Journals | NexScholar",
};

export default async function JournalsManagerPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGING_EDITOR") {
    redirect("/dashboard");
  }

  const journals = await prisma.journal.findMany({
    include: {
      _count: {
        select: { manuscripts: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Journals</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage platform journals and their metadata.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Journal
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {journals.map((journal) => (
          <div key={journal.id} className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--brand-600)]">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-50)] flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[var(--brand-600)]" />
            </div>
            
            <h3 className="text-lg font-editorial font-bold text-[var(--foreground)] mb-1 leading-tight">{journal.title}</h3>
            <p className="text-sm text-[var(--muted)] mb-4 line-clamp-2">{journal.scope || "No scope provided."}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted)]">ISSN (Print)</span>
                <span className="font-mono text-slate-700">{journal.issnPrint || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted)]">ISSN (Online)</span>
                <span className="font-mono text-slate-700">{journal.issnOnline || "N/A"}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted)]">Status</span>
                <span className={`text-xs font-bold ${journal.isActive ? "text-emerald-600" : "text-amber-600"}`}>
                  {journal.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted)]">Manuscripts</span>
                <span className="text-xs font-bold text-[var(--foreground)]">{journal._count.manuscripts}</span>
              </div>
            </div>
          </div>
        ))}

        {journals.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border border-[var(--border)] border-dashed">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 mb-1">No journals yet</h3>
            <p className="text-sm text-slate-500 mb-4">Create your first journal to start accepting manuscripts.</p>
            <Button>Create Journal</Button>
          </div>
        )}
      </div>
    </div>
  );
}
