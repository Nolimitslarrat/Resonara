import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

import { BookOpen } from "lucide-react";

export default async function JournalsIndexPage() {
  const journals = await prisma.journal.findMany({
    where: { isActive: true },
    include: { categories: true },
    orderBy: { title: "asc" }
  });

  return (
    <div className="bg-white border border-slate-200 p-6 sm:p-10 rounded-sm min-h-[60vh]">
      <h1 className="text-3xl font-editorial font-bold text-[var(--brand-800)] mb-2">Journals A-Z</h1>
      <p className="text-sm text-slate-600 mb-8 pb-4 border-b border-slate-200">
        Browse our complete portfolio of open access, peer-reviewed academic journals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journals.map(journal => (
          <div key={journal.id} className="border border-slate-200 p-5 rounded-sm hover:border-[var(--brand-300)] hover:shadow-md transition-all group bg-slate-50">
            <div className="w-12 h-16 bg-white border border-slate-300 flex items-center justify-center mb-4 shadow-sm">
              <BookOpen className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="text-lg font-editorial font-bold text-[var(--brand-700)] group-hover:underline mb-2 line-clamp-2">
              <Link href={`/journals/${journal.slug}`}>{journal.title}</Link>
            </h3>
            {journal.issnPrint && (
              <p className="text-xs text-slate-500 mb-3">ISSN: {journal.issnPrint}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-auto">
              {journal.categories.slice(0, 2).map(cat => (
                <span key={cat.id} className="text-[0.65rem] bg-white text-slate-600 px-2 py-0.5 border border-slate-200 uppercase tracking-wider">
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        ))}

        {journals.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No journals available at this time.
          </div>
        )}
      </div>
    </div>
  );
}
