import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEditorialCandidates } from "@/app/actions/journal";
import { EditJournalForm } from "./EditJournalForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Journal | Resonara Publishers Pvt. Ltd.",
};

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    !["SUPER_ADMIN", "EDITOR"].includes(session.user.role)
  ) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: {
      editorialBoard: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!journal) notFound();

  const candidatesRaw = await getEditorialCandidates();
  const candidates = candidatesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    role: c.role,
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Edit Journal
          </h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            Update journal details, editorial board, and settings.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <EditJournalForm
          journal={{
            id: journal.id,
            title: journal.title,
            issnPrint: journal.issnPrint,
            issnOnline: journal.issnOnline,
            description: journal.description,
            scope: journal.scope,
            website: journal.website,
            reviewType: journal.reviewType,
            editorInChiefId: journal.editorInChiefId,
            isActive: journal.isActive,
            indexingServices: journal.indexingServices,
            abbreviation: journal.abbreviation,
            frequency: journal.frequency,
            doi: journal.doi,
            publisher: journal.publisher,
            startingYear: journal.startingYear,
            publicationFormat: journal.publicationFormat,
            language: journal.language,
            copyrightPolicy: journal.copyrightPolicy,
            impactFactor: journal.impactFactor,
            address: journal.address,
            editorialBoard: journal.editorialBoard.map((m) => ({
              id: m.id,
              userId: m.userId,
              role: m.role,
              order: m.order,
            })),
          }}
          initialCandidates={candidates}
        />
      </div>
    </div>
  );
}
