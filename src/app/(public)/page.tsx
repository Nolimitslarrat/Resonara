import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

import { Search, ArrowRight, BookOpen, FileText, Users, ShieldCheck, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resonara Publishers Pvt. Ltd.— Peer-Reviewed Academic Publishing",
  description:
    "Resonara Publishers Pvt. Ltd.is a premier academic publishing platform. Submit manuscripts, track peer review progress, and publish open-access research across sciences and humanities.",
  keywords: [
    "Resonara Publishers Pvt. Ltd.",
    "Resonara Publishers Pvt. Ltd.Pvt Ltd",
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
    title: "Resonara Publishers Pvt. Ltd.— Peer-Reviewed Academic Publishing",
    description:
      "Submit manuscripts, manage peer review, and publish world-class research with Resonara Publishers Pvt. Ltd.",
    url: "https://resonarapublishers.com",
    siteName: "Resonara Publishers Pvt. Ltd.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resonara Publishers Pvt. Ltd.— Academic Publishing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonara Publishers Pvt. Ltd.— Peer-Reviewed Academic Publishing",
    description:
      "Submit, review, and publish world-class research with Resonara Publishers Pvt. Ltd..",
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
            A publication house dedicated to peer-reviewed scholarship across the Science, Engineering and Humanities
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

      {/* ── Empowering Voices ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--brand-50)] rounded-full blur-[100px] opacity-50 -mr-[400px] -mt-[400px] pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-editorial font-bold text-[var(--brand-900)]">Empowering Voices. Advancing Knowledge.</h2>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
            Welcome to <span className="font-semibold text-[var(--foreground)]">Resonara Publishers Pvt. Ltd.</span>, where groundbreaking ideas meet world-class publishing. We are a premier academic and literary publishing house dedicated to amplifying the voices of researchers, educators, scientists, and authors globally.
          </p>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
            By blending rigorous editorial standards with cutting-edge digital distribution, we transform raw manuscripts into impactful publications that resonate across disciplines.
          </p>
        </div>
      </section>

      {/* ── Why Partner with Resonara? ── */}
      <section className="py-24 bg-[var(--background)] border-y border-[var(--border)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-editorial font-bold text-[var(--brand-900)] mb-6">Why Partner with Resonara?</h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto text-lg leading-relaxed">
              At Resonara, we believe that every manuscript holds the potential to inspire change, spark innovation, or advance human understanding. We don't just print journals; <span className="text-[var(--brand-600)] font-semibold">we nurture intellectual property.</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Global Distribution Network", desc: "Your work reaches leading global libraries, academic repositories, and major online retailers." },
              { title: "Rigorous Editorial Excellence", desc: "Our dedicated team of editors and peer-reviewers ensures the highest standards of accuracy, academic integrity, and presentation." },
              { title: "Author-Centric Approach", desc: "We offer tailored support at every stage—from initial manuscript evaluation and professional formatting to post-publication marketing." },
              { title: "Diverse Publishing Models", desc: "We offer flexible publishing pathways across subscription-based, hybrid, and open-access journals." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-50)] flex items-center justify-center mb-6">
                  <span className="text-[var(--brand-600)] font-bold text-xl">{idx + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-900)] mb-3">{feature.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Publishing Area ── */}
      <section className="py-20 bg-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-5 bg-[var(--brand-50)] rounded-full mb-8 shadow-inner border border-[var(--brand-100)]">
            <BookOpen className="w-8 h-8 text-[var(--brand-600)]" />
          </div>
          <h2 className="text-sm uppercase tracking-widest font-bold text-[var(--muted)] mb-4">Our Core Publishing Area</h2>
          <h3 className="text-4xl font-editorial font-bold text-[var(--brand-900)] mb-6">🔬 Scientific Journals</h3>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-3xl mx-auto">
            High-impact, peer-reviewed monographs and specialized journals spanning Science, Technology, Medicine, Humanities, and Social Sciences.
          </p>
        </div>
      </section>

      {/* ── The Resonara Journey ── */}
      <section className="py-24 bg-[var(--background)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-editorial font-bold text-[var(--brand-900)] text-center mb-16">The Resonara Journey: How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[var(--brand-200)] to-transparent"></div>
            {[
              { step: "Submission", desc: "Share your manuscript or proposal with our editorial board via our secure portal." },
              { step: "Evaluation", desc: "Our experts review your work for quality, relevance, and market potential." },
              { step: "Production", desc: "Benefit from professional copyediting, typesetting, and stunning cover designs." },
              { step: "Distribution", desc: "Your work is published in print and digital formats, accessible worldwide." }
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="w-16 h-16 mx-auto bg-white border-2 border-[var(--brand-100)] shadow-sm rounded-full flex items-center justify-center mb-6 text-xl font-bold text-[var(--brand-600)] relative z-10">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-900)] mb-3">{item.step}</h3>
                <p className="text-[var(--muted)] leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
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

      {/* ── Ready to Publish Your Work? (CTA) ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-editorial font-bold text-[var(--brand-900)]">Ready to Publish Your Work?</h2>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-3xl mx-auto">
            Whether you are an established academician, a first-time researcher, or an institution looking to publish conference proceedings, Resonara is your trusted literary partner. Let’s collaborate to make your words resonate across the globe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-[var(--brand-50)] p-10 rounded-3xl border border-[var(--brand-100)] text-left hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-[var(--brand-900)] mb-4">Connect With Us</h3>
              <p className="text-[var(--muted)] mb-8 text-lg">
                Have questions about our publishing guidelines or timelines? Get in touch with our team today.
              </p>
              <div className="space-y-4 mb-8">
                <a href="mailto:info@resonarapublishers.com" className="flex items-center gap-3 text-[var(--brand-700)] hover:text-[var(--brand-900)] font-semibold transition-colors">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><FileText className="w-5 h-5" /></div>
                  info@resonarapublishers.com
                </a>
                <a href="tel:9818499209" className="flex items-center gap-3 text-[var(--brand-700)] hover:text-[var(--brand-900)] font-semibold transition-colors">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><Users className="w-5 h-5" /></div>
                  +91 9818499209
                </a>
              </div>
              <Link href="/contact">
                <Button className="w-full bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-xl py-6 text-base font-bold shadow-sm transition-transform hover:scale-105">
                  Schedule a Consultation <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-[var(--surface-elevated)] p-10 rounded-3xl border border-[var(--border)] text-left shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-[var(--brand-900)] mb-4">Start Your Journey</h3>
              <p className="text-[var(--muted)] mb-8 text-lg">
                Share your manuscript through our secure portal and track its progress through the peer-review process.
              </p>
              <Link href="/dashboard/manuscripts/submit">
                <Button className="w-full bg-white border-2 border-[var(--brand-200)] text-[var(--brand-900)] hover:bg-[var(--brand-50)] rounded-xl py-6 text-base font-bold shadow-sm transition-transform hover:scale-105 mb-4">
                  Submit Manuscript <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="ghost" className="w-full text-[var(--muted)] hover:text-[var(--brand-700)] hover:bg-transparent rounded-xl py-6 text-base font-bold transition-colors">
                  Become a Reviewer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
