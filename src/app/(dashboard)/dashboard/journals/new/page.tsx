import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getEditorialCandidates } from "@/app/actions/journal";
import { AddJournalForm } from "./AddJournalForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Add New Journal | Resonara Publishers Pvt. Ltd.",
};

export default async function NewJournalPage() {
  const session = await auth();
  if (!session?.user || !["SUPER_ADMIN", "MANAGING_EDITOR"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const candidatesRaw = await getEditorialCandidates();
  const candidates = candidatesRaw.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    role: c.role
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/journals" 
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Add New Journal</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Create a new journal and set up its editorial board.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <AddJournalForm initialCandidates={candidates} />
      </div>
    </div>
  );
}
