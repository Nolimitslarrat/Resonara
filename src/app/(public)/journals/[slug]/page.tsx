import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Users, Info, ArrowRight, FileText, ChevronLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function JournalPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const journal = await prisma.journal.findUnique({
    where: { slug: params.slug },
    include: {
      categories: true,
      editorInChief: true,
      manuscripts: {
        where: { status: "PUBLISHED" },
        include: { author: true },
        orderBy: { submittedAt: "desc" },
        take: 10,
      }
    }
  });

  if (!journal) notFound();

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24">
      {/* ── Journal Hero ── */}
      <div className="bg-[var(--brand-900)] text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--brand-600)]/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/journals" className="inline-flex items-center text-[var(--brand-300)] hover:text-white text-sm font-medium mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Journals
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-32 bg-white rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-12 h-12 text-[var(--brand-900)]" />
            </div>
            <div>
              <div className="flex gap-2 mb-3">
                {journal.categories.map(cat => (
                  <span key={cat.id} className="text-[0.65rem] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-[var(--brand-100)] border border-white/20">
                    {cat.name}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-editorial font-bold mb-4 leading-tight">{journal.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-[var(--brand-200)] font-medium">
                {journal.issnPrint && <span>ISSN (Print): {journal.issnPrint}</span>}
                {journal.issnOnline && <span>ISSN (Online): {journal.issnOnline}</span>}
                <span>Open Access</span>
                <span>Peer-Reviewed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8 sm:p-10">
              <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-6 flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <Info className="w-6 h-6 text-[var(--brand-500)]" /> Aims and Scope
              </h2>
              <div className="prose prose-slate max-w-none text-[var(--muted)] leading-relaxed">
                {journal.description ? (
                  <p>{journal.description}</p>
                ) : (
                  <p>This journal provides a specialized forum for the publication of peer-reviewed research. We welcome submissions from scholars globally that advance theoretical and applied knowledge in this domain.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8 sm:p-10">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[var(--brand-500)]" /> Latest Articles
                </h2>
              </div>
              
              <div className="space-y-6">
                {journal.manuscripts.map(article => (
                  <div key={article.id} className="group border-b border-[var(--border-subtle)] pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-[var(--brand-600)] uppercase tracking-wider">Research Article</span>
                      <span className="text-xs font-medium text-[var(--muted)]">{formatDate(article.submittedAt || article.createdAt)}</span>
                    </div>
                    <h3 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-2 group-hover:text-[var(--brand-600)] transition-colors">
                      <Link href={`/articles/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p className="text-sm font-medium text-[var(--muted)] mb-3">
                      <span className="text-slate-800">{article.author.name}</span>
                      {article.author.affiliation && ` — ${article.author.affiliation}`}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Link href={`/articles/${article.id}`}>
                        <Button size="sm" className="bg-[var(--brand-100)] text-[var(--brand-800)] hover:bg-[var(--brand-200)] rounded-full font-semibold">
                          Read Abstract
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {journal.manuscripts.length === 0 && (
                  <p className="text-[var(--muted)] py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No articles published in this journal yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[var(--brand-900)] text-white rounded-2xl p-8 shadow-xl text-center">
              <h3 className="text-xl font-editorial font-bold mb-4">Submit Your Research</h3>
              <p className="text-sm text-white/80 mb-6 leading-relaxed">
                We are currently accepting submissions for upcoming issues.
              </p>
              <Link href={`/dashboard/manuscripts/submit?journal=${journal.id}`} className="block w-full">
                <Button className="w-full bg-white text-[var(--brand-900)] hover:bg-[var(--brand-50)] rounded-full font-bold shadow-lg">
                  Submit Manuscript
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8">
              <h3 className="text-lg font-editorial font-bold text-[var(--brand-900)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-3">
                <Users className="w-5 h-5 text-[var(--brand-500)]" /> Editorial Board
              </h3>
              {journal.editorInChief ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Editor-in-Chief</p>
                  <p className="font-semibold text-slate-800">{journal.editorInChief.name}</p>
                  {journal.editorInChief.affiliation && <p className="text-xs text-[var(--muted)]">{journal.editorInChief.affiliation}</p>}
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">Editorial board information is currently being updated.</p>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8">
              <h3 className="text-lg font-editorial font-bold text-[var(--brand-900)] mb-4 border-b border-[var(--border)] pb-3">
                Journal Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Impact Factor</p>
                  <p className="text-2xl font-bold text-[var(--brand-700)]">Pending</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Time to First Decision</p>
                  <p className="text-2xl font-bold text-[var(--brand-700)]">14 Days</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
