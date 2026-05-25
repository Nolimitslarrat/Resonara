import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

import { Search, ArrowRight, BookOpen, FileText, Users, ShieldCheck, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resonara Publishers — Peer-Reviewed Academic Publishing",
  description:
    "Resonara Publishers Pvt. Ltd. is a premier academic publishing platform. Submit manuscripts, track peer review progress, and publish open-access research across sciences and humanities.",
  keywords: [
    "Resonara Publishers",
    "Resonara Publishers Pvt Ltd",
    "academic publishing platform",
    "peer reviewed journals India",
    "manuscript submission system",
    "open access publishing",
    "scholarly article submission",
    "research journal publication",
  ],
  alternates: {
    canonical: "https://resonarapublishers.com",
  },
  openGraph: {
    type: "website",
    title: "Resonara Publishers — Peer-Reviewed Academic Publishing",
    description:
      "Submit manuscripts, manage peer review, and publish world-class research with Resonara Publishers Pvt. Ltd.",
    url: "https://resonarapublishers.com",
    siteName: "Resonara Publishers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resonara Publishers — Academic Publishing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonara Publishers — Peer-Reviewed Academic Publishing",
    description:
      "Submit, review, and publish world-class research with Resonara Publishers.",
    images: ["/og-image.png"],
  },
};

export default async function PublicHomePage() {
  const recentArticles = await prisma.manuscript.findMany({
    where: { status: { in: ["PUBLISHED", "ACCEPTED", "DRAFT"] } },
    include: { journal: true, author: true },
    orderBy: { createdAt: "desc" },
    take: 6
  });

  const featuredJournals = await prisma.journal.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { title: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero Section (Deep, Vibrant Gradient) ── */}
      <section className="relative pt-32 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-bg text-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[100%] rounded-full bg-gradient-to-b from-white/5 to-transparent blur-3xl transform rotate-12"></div>
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[80%] rounded-full bg-gradient-to-t from-[var(--brand-500)]/20 to-transparent blur-3xl transform -rotate-12"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-editorial font-bold tracking-tight leading-[1.1]">
            Research Publishing <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-200)] to-white">With Editorial Care</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--brand-100)] max-w-2xl mx-auto font-light leading-relaxed">
            A publication house dedicated to peer-reviewed scholarship across the sciences and humanities.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-12 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-300)] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <form action="/search" method="GET" className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 shadow-2xl">
              <Search className="w-6 h-6 text-white/70 ml-4" />
              <input 
                type="text" 
                name="q"
                placeholder="Search articles, journals, and authors..." 
                className="w-full bg-transparent border-none text-white placeholder:text-white/50 focus:outline-none focus:ring-0 px-4 py-3 text-lg font-medium"
              />
              <Button type="submit" className="bg-white text-[var(--brand-900)] hover:bg-[var(--brand-50)] rounded-full px-8 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Floating Stats Ribbon ── */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-8 sm:p-10 flex flex-wrap justify-between items-center gap-8 shadow-xl">
          {[
            { title: "Editorially Led", label: "Clear decisions with accountable review", icon: BookOpen },
            { title: "Author Focused", label: "Submission paths designed for clarity", icon: FileText },
            { title: "Reviewer Minded", label: "Structured review without unnecessary noise", icon: Users },
            { title: "Integrity First", label: "Careful checks before publication", icon: ShieldCheck }
          ].map((stat, idx) => (
             <div key={idx} className="flex-1 min-w-[190px] flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-xl bg-[var(--brand-50)] flex items-center justify-center group-hover:bg-[var(--brand-600)] transition-colors duration-300">
                 <stat.icon className="w-6 h-6 text-[var(--brand-600)] group-hover:text-white transition-colors duration-300" />
               </div>
               <div>
                 <div className="text-lg font-bold text-[var(--brand-900)] tracking-tight">{stat.title}</div>
                 <div className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">{stat.label}</div>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* ── Featured Journals (Card Grid) ── */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-editorial font-bold text-[var(--brand-900)] mb-4">Featured Journals</h2>
              <p className="text-[var(--muted)] max-w-2xl text-lg">Browse active journals organized for readers, authors, editors, and reviewers.</p>
            </div>
            <Link href="/journals" className="hidden sm:flex items-center gap-2 text-[var(--brand-600)] font-semibold hover:text-[var(--brand-700)] group">
              View Directory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJournals.map(journal => (
              <Link href={`/journals/${journal.slug}`} key={journal.id} className="block group">
                <div className="bg-white rounded-2xl p-6 border border-[var(--border)] card-hover h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-50)] rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110"></div>
                  
                  <div className="w-14 h-16 bg-white border border-[var(--border)] shadow-sm flex items-center justify-center mb-6 relative z-10 rounded-sm">
                    <BookOpen className="w-7 h-7 text-[var(--brand-500)]" />
                  </div>
                  
                  <h3 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3 leading-snug group-hover:text-[var(--brand-600)] transition-colors relative z-10">
                    {journal.title}
                  </h3>
                  
                  {journal.issnPrint && (
                    <p className="text-xs font-medium text-[var(--muted)] mb-4 uppercase tracking-wider relative z-10">ISSN: {journal.issnPrint}</p>
                  )}
                  
                  <div className="mt-auto flex items-center text-sm font-semibold text-[var(--brand-600)] group-hover:gap-2 transition-all relative z-10">
                    Explore Journal <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Research (Masonry/Grid Feed) ── */}
      <section className="py-24 bg-white border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-editorial font-bold text-[var(--brand-900)] mb-4">Recent Research</h2>
              <p className="text-[var(--muted)] max-w-2xl text-lg">Newly added manuscripts and articles from the editorial workflow.</p>
            </div>
            <Link href="/articles" className="hidden sm:flex items-center gap-2 text-[var(--brand-600)] font-semibold hover:text-[var(--brand-700)] group">
              Browse All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recentArticles.map((article) => (
              <div key={article.id} className="bg-[var(--background)] rounded-2xl p-8 border border-[var(--border)] card-hover flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-100)] text-[var(--brand-700)] uppercase tracking-wider">
                    {article.journal.title}
                  </span>
                  <span className="text-sm font-medium text-[var(--muted)]">{formatDate(article.createdAt)}</span>
                </div>
                
                <h3 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-3 leading-tight hover:text-[var(--brand-600)] transition-colors cursor-pointer">
                  <Link href={`/articles/${article.id}`}>{article.title}</Link>
                </h3>
                
                <p className="text-sm font-medium text-[var(--muted)] mb-5">
                  <span className="text-slate-800">{article.author.name}</span>
                  {article.author.affiliation && ` — ${article.author.affiliation}`}
                </p>
                
                <p className="text-[var(--muted-foreground)] leading-relaxed line-clamp-3 mb-8">
                  {article.abstract}
                </p>
                
                <div className="mt-auto flex items-center gap-3">
                  <Link href={`/articles/${article.id}`}>
                    <Button className="bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-full px-6 font-semibold shadow-sm">
                      Read Full Text
                    </Button>
                  </Link>
                  <Button variant="outline" className="rounded-full px-6 font-semibold border-[var(--border)] hover:bg-[var(--brand-50)] text-[var(--brand-700)]">
                    Download PDF
                  </Button>
                </div>
              </div>
            ))}
            
            {recentArticles.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <FileText className="w-12 h-12 text-[var(--border)] mx-auto mb-4" />
                <p className="text-lg text-[var(--muted)] font-medium">No articles published recently.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Call to Action (Authors & Reviewers) ── */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Author CTA */}
            <div className="relative overflow-hidden rounded-3xl bg-[var(--brand-900)] text-white p-10 sm:p-14 shadow-2xl card-hover group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-600)] rounded-full blur-3xl opacity-30 -mr-20 -mt-20 group-hover:opacity-50 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-editorial font-bold mb-4">Publish With Us</h3>
                <p className="text-white/80 mb-8 max-w-md text-lg leading-relaxed">
                  Share your manuscript through a focused submission flow built around review, revision, and editorial clarity.
                </p>
                <Link href="/dashboard/manuscripts/submit">
                  <Button className="bg-white text-[var(--brand-900)] hover:bg-[var(--brand-50)] rounded-full px-8 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105">
                    Submit Manuscript <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Reviewer CTA */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-[var(--border)] p-10 sm:p-14 shadow-xl card-hover group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--brand-100)] rounded-full blur-3xl opacity-50 -mr-20 -mb-20 group-hover:bg-[var(--brand-200)] transition-colors duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-editorial font-bold text-[var(--brand-900)] mb-4">Become a Reviewer</h3>
                <p className="text-[var(--muted)] mb-8 max-w-md text-lg leading-relaxed">
                  Support careful scholarship with structured review tools and a clear editorial handoff.
                </p>
                <Link href="/register">
                  <Button variant="outline" className="border-[var(--brand-200)] text-[var(--brand-700)] hover:bg-[var(--brand-50)] rounded-full px-8 py-6 text-base font-bold shadow-sm transition-transform hover:scale-105">
                    Join Review Board <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
