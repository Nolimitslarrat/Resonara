import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  BookOpen,
  Users,
  Info,
  FileText,
  ChevronLeft,
  Globe,
  Calendar,
  Award,
  ArrowRight,
  Tag,
  Mail,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const journal = await prisma.journal.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      description: true,
      slug: true,
      issnPrint: true,
      issnOnline: true,
      createdAt: true,
    },
  });
  if (!journal) return { title: "Not Found" };

  const url = `https://resonarapublishers.com/journals/${journal.slug}`;
  const description =
    journal.description ||
    `Read peer-reviewed research published in ${journal.title} by Resonara Publishers.`;

  return {
    title: journal.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${journal.title} | Resonara Publishers`,
      description,
      siteName: "Resonara Publishers",
    },
    twitter: {
      card: "summary",
      title: `${journal.title} | Resonara Publishers`,
      description,
    },
  };
}

export default async function JournalPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const journal = await prisma.journal.findUnique({
    where: { slug: params.slug },
    include: {
      categories: true,
      editorInChief: true,
      editorialBoard: {
        include: { user: true },
        orderBy: { order: "asc" },
        take: 6,
      },
      manuscripts: {
        where: { status: "PUBLISHED" },
        include: { author: true, coAuthors: true },
        orderBy: { submittedAt: "desc" },
        take: 10,
      },
    },
  });

  if (!journal) notFound();

  const publishedCount = await prisma.manuscript.count({
    where: { journalId: journal.id, status: "PUBLISHED" },
  });

  const journalUrl = `https://resonarapublishers.com/journals/${journal.slug}`;

  const periodicalSchema = {
    "@context": "https://schema.org",
    "@type": "Periodical",
    "@id": `${journalUrl}#periodical`,
    name: journal.title,
    description: journal.description || `Peer-reviewed journal published by Resonara Publishers.`,
    url: journalUrl,
    issn: [journal.issnPrint, journal.issnOnline].filter(Boolean),
    publisher: {
      "@type": "Organization",
      "@id": "https://resonarapublishers.com/#organization",
      name: "Resonara Publishers Pvt. Ltd.",
    },
    ...(journal.editorInChief && {
      editor: {
        "@type": "Person",
        name: journal.editorInChief.name,
      },
    }),
    about: journal.categories.map((cat) => ({
      "@type": "Thing",
      name: cat.name,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://resonarapublishers.com" },
      { "@type": "ListItem", position: 2, name: "Journals", item: "https://resonarapublishers.com/journals" },
      { "@type": "ListItem", position: 3, name: journal.title, item: journalUrl },
    ],
  };

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(periodicalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* ── Journal Hero ── */}
      <div className="bg-[var(--brand-900)] text-white pt-20 pb-28 relative overflow-hidden">
        {/* decorative rings */}
        <div
          className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--brand-400) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -left-20 bottom-0 w-[400px] h-[400px] rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, var(--brand-300) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/journals"
            className="inline-flex items-center text-[var(--brand-300)] hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            All Journals
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Cover icon */}
            <div className="w-28 h-36 bg-white rounded-xl shadow-2xl flex items-center justify-center flex-shrink-0 border-4 border-white/20">
              <BookOpen className="w-14 h-14 text-[var(--brand-800)]" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {journal.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-[0.65rem] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-[var(--brand-100)] border border-white/20"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-editorial font-bold mb-5 leading-tight">
                {journal.title}
              </h1>

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--brand-200)] font-medium mb-6">
                {journal.issnPrint && (
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    ISSN (Print): <strong className="text-white">{journal.issnPrint}</strong>
                  </span>
                )}
                {journal.issnOnline && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    ISSN (Online): <strong className="text-white">{journal.issnOnline}</strong>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {journal.reviewType.replace(/_/g, " ")} Review
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {publishedCount} Published Articles
                </span>
              </div>

              {journal.editorInChief && (
                <p className="text-sm text-[var(--brand-200)]">
                  Editor-in-Chief:{" "}
                  <strong className="text-white">
                    {journal.editorInChief.name}
                  </strong>
                  {journal.editorInChief.affiliation &&
                    `, ${journal.editorInChief.affiliation}`}
                </p>
              )}
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 border-t border-white/10 pt-8">
            {[
              { label: "Published Articles", value: publishedCount },
              {
                label: "Editorial Members",
                value: (journal.editorialBoard?.length ?? 0) + (journal.editorInChief ? 1 : 0),
              },
              { label: "Review Type", value: journal.reviewType.replace(/_/g, " ") },
              { label: "Status", value: journal.isActive ? "Active" : "Inactive" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-[var(--brand-300)] mt-0.5 uppercase tracking-wider font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-0 overflow-x-auto" aria-label="Journal sections">
            {[
              { href: `#aims`, label: "Aims & Scope" },
              { href: `#articles`, label: "Articles" },
              { href: `#editorial-board`, label: "Editorial Board" },
              { href: `#info`, label: "Journal Info" },
            ].map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="px-5 py-4 text-sm font-semibold text-[var(--muted)] hover:text-[var(--brand-700)] whitespace-nowrap border-b-2 border-transparent hover:border-[var(--brand-500)] transition-colors"
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Aims & Scope */}
            <section id="aims" className="scroll-mt-20">
              <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="px-8 py-5 border-b border-[var(--border)] bg-slate-50/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--brand-100)] flex items-center justify-center">
                    <Info className="w-4 h-4 text-[var(--brand-600)]" />
                  </div>
                  <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)]">
                    Aims and Scope
                  </h2>
                </div>
                <div className="p-8">
                  <div className="prose prose-slate max-w-none text-[var(--muted)] leading-relaxed">
                    {journal.description ? (
                      <p>{journal.description}</p>
                    ) : (
                      <p>
                        This journal provides a rigorous, peer-reviewed platform
                        for original research and reviews. We welcome submissions
                        that advance understanding and practice across disciplines
                        related to our scope.
                      </p>
                    )}
                    {journal.scope && (
                      <>
                        <h4 className="font-semibold text-[var(--foreground)] mt-6 mb-2">
                          Topics Covered
                        </h4>
                        <p>{journal.scope}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Latest Articles */}
            <section id="articles" className="scroll-mt-20">
              <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="px-8 py-5 border-b border-[var(--border)] bg-slate-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-100)] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[var(--brand-600)]" />
                    </div>
                    <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)]">
                      Latest Articles
                    </h2>
                  </div>
                  {publishedCount > 10 && (
                    <Link
                      href={`/journals/${journal.slug}/articles`}
                      className="text-xs font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] flex items-center gap-1 transition-colors"
                    >
                      View all {publishedCount} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                <div className="divide-y divide-[var(--border-subtle)]">
                  {journal.manuscripts.length === 0 ? (
                    <div className="p-10 text-center text-[var(--muted)]">
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-semibold text-slate-600">No published articles yet</p>
                      <p className="text-sm mt-1">Be the first to submit your research to this journal.</p>
                    </div>
                  ) : (
                    journal.manuscripts.map((article, idx) => {
                      const allAuthors = [
                        article.author.name,
                        ...article.coAuthors.map((ca) => ca.name),
                      ];
                      return (
                        <div
                          key={article.id}
                          className="p-6 sm:p-8 group hover:bg-slate-50/60 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[var(--brand-100)] flex items-center justify-center flex-shrink-0 text-[var(--brand-700)] font-bold font-editorial text-sm mt-0.5 group-hover:bg-[var(--brand-200)] transition-colors">
                              {String(idx + 1).padStart(2, "0")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-600)] bg-[var(--brand-50)] border border-[var(--brand-200)] px-2 py-0.5 rounded">
                                  Research Article
                                </span>
                                <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(article.submittedAt || article.createdAt)}
                                </span>
                              </div>

                              <Link href={`/articles/${article.id}`}>
                                <h3 className="text-lg font-editorial font-bold text-[var(--brand-900)] leading-snug mb-2 group-hover:text-[var(--brand-600)] transition-colors">
                                  {article.title}
                                </h3>
                              </Link>

                              <p className="text-sm text-[var(--muted)] mb-3">
                                {allAuthors.join(", ")}
                                {article.author.affiliation &&
                                  ` — ${article.author.affiliation}`}
                              </p>

                              {article.keywords && article.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {article.keywords.slice(0, 4).map((kw) => (
                                    <span
                                      key={kw}
                                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium"
                                    >
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <Link href={`/articles/${article.id}`}>
                                <Button
                                  size="sm"
                                  className="bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-full text-xs font-semibold px-4 h-8 gap-1.5"
                                >
                                  Read Abstract <ArrowRight className="w-3 h-3" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

            {/* Editorial Board section */}
            <section id="editorial-board" className="scroll-mt-20">
              <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="px-8 py-5 border-b border-[var(--border)] bg-slate-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-100)] flex items-center justify-center">
                      <Users className="w-4 h-4 text-[var(--brand-600)]" />
                    </div>
                    <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)]">
                      Editorial Board
                    </h2>
                  </div>
                  <Link
                    href={`/journals/${journal.slug}/editorial-board`}
                    className="text-xs font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] flex items-center gap-1 transition-colors"
                  >
                    Full Board <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6">
                  {/* Editor in Chief spotlight */}
                  {journal.editorInChief && (
                    <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-700)] text-white flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 text-xl font-editorial font-bold backdrop-blur-sm border border-white/30">
                        {journal.editorInChief.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-300)] mb-0.5">
                          Editor-in-Chief
                        </p>
                        <p className="font-bold text-white text-base leading-tight">
                          {journal.editorInChief.name}
                        </p>
                        {journal.editorInChief.designation && (
                          <p className="text-xs text-[var(--brand-200)] mt-0.5">
                            {journal.editorInChief.designation}
                          </p>
                        )}
                        {journal.editorInChief.affiliation && (
                          <p className="text-xs text-[var(--brand-300)] mt-0.5">
                            {journal.editorInChief.affiliation}
                          </p>
                        )}
                      </div>
                      {journal.editorInChief.email && (
                        <a
                          href={`mailto:${journal.editorInChief.email}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-200)] hover:text-white transition-colors flex-shrink-0"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Contact
                        </a>
                      )}
                    </div>
                  )}

                  {/* Board member grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {journal.editorialBoard.slice(0, 6).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--brand-300)] hover:bg-[var(--brand-50)] transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[var(--brand-100)] flex items-center justify-center flex-shrink-0 font-bold text-[var(--brand-700)] font-editorial group-hover:bg-[var(--brand-200)] transition-colors">
                          {member.user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--foreground)] text-sm truncate">
                            {member.user.name}
                          </p>
                          {member.user.designation && (
                            <p className="text-[10px] text-[var(--brand-600)] font-medium truncate">
                              {member.user.designation}
                            </p>
                          )}
                          {member.user.affiliation && (
                            <p className="text-[10px] text-[var(--muted)] truncate">
                              {member.user.affiliation}
                            </p>
                          )}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex-shrink-0">
                          {member.role.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {journal.editorialBoard.length === 0 && !journal.editorInChief && (
                    <p className="text-sm text-[var(--muted)] text-center py-6">
                      Editorial board information is currently being updated.
                    </p>
                  )}

                  {journal.editorialBoard.length > 0 && (
                    <div className="mt-4 text-center">
                      <Link href={`/journals/${journal.slug}/editorial-board`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[var(--brand-300)] text-[var(--brand-700)] hover:bg-[var(--brand-50)] rounded-full font-semibold"
                        >
                          View All Board Members
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Submit CTA */}
            <div className="bg-gradient-to-br from-[var(--brand-900)] to-[var(--brand-700)] text-white rounded-2xl p-8 shadow-xl text-center">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-editorial font-bold mb-3">
                Submit Your Research
              </h3>
              <p className="text-sm text-white/80 mb-6 leading-relaxed">
                We are currently accepting high-quality submissions for upcoming
                issues.
              </p>
              <Link
                href={`/dashboard/manuscripts/submit?journal=${journal.id}`}
                className="block w-full"
              >
                <Button className="w-full bg-white text-[var(--brand-900)] hover:bg-[var(--brand-50)] rounded-full font-bold shadow-lg">
                  Submit Manuscript
                </Button>
              </Link>
            </div>

            {/* Journal Info */}
            <div
              id="info"
              className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden scroll-mt-20"
            >
              <div className="px-6 py-4 border-b border-[var(--border)] bg-slate-50/60">
                <h3 className="text-base font-editorial font-bold text-[var(--brand-900)]">
                  Journal Information
                </h3>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { label: "Publisher", value: "Resonara Publications" },
                  {
                    label: "ISSN (Print)",
                    value: journal.issnPrint || "—",
                  },
                  {
                    label: "ISSN (Online)",
                    value: journal.issnOnline || "—",
                  },
                  {
                    label: "Review Type",
                    value: journal.reviewType.replace(/_/g, " "),
                  },
                  {
                    label: "Access Type",
                    value: "Open Access",
                  },
                  {
                    label: "Frequency",
                    value: "Continuous Publication",
                  },
                  {
                    label: "Status",
                    value: journal.isActive ? "Active" : "Inactive",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 text-sm">
                    <span className="text-[var(--muted)] font-medium flex-shrink-0">
                      {label}
                    </span>
                    <span className="font-semibold text-[var(--foreground)] text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Indexing */}
            {journal.indexingServices && journal.indexingServices.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-7 py-5 border-b border-slate-100">
                  <h3 className="text-xl font-editorial font-bold text-[var(--brand-900)] tracking-tight">
                    Abstracting & Indexing
                  </h3>
                </div>
                <div className="px-7 py-6">
                  <div className="space-y-4">
                    {journal.indexingServices.map((index: string) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-[15px]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span className="text-slate-800 font-medium tracking-tight">
                          {index}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            {journal.categories.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)] bg-slate-50/60">
                  <h3 className="text-base font-editorial font-bold text-[var(--brand-900)]">
                    Subject Areas
                  </h3>
                </div>
                <div className="p-6 flex flex-wrap gap-2">
                  {journal.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="text-xs bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-200)] px-3 py-1.5 rounded-full font-semibold"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
