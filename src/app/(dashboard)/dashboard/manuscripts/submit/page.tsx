import { prisma } from "@/lib/prisma";
import { SubmissionWizard } from "./SubmissionWizard";

export const metadata = {
  title: "Submit Manuscript | Resonara",
};

export default async function SubmitManuscriptPage(props: { searchParams: Promise<{ journal?: string }> }) {
  const searchParams = await props.searchParams;
  
  const journals = await prisma.journal.findMany({
    where: { isActive: true },
    select: { id: true, title: true, slug: true },
    orderBy: { title: "asc" },
  });

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-editorial font-bold text-[var(--brand-800)] mb-2">Submit New Manuscript</h1>
      <p className="text-slate-600 mb-8 text-sm">Complete the steps below to submit your research for peer review.</p>

      <SubmissionWizard 
        journals={journals} 
        categories={categories} 
        defaultJournalId={searchParams.journal} 
      />
    </div>
  );
}
