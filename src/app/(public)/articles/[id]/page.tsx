import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { ChevronLeft, Download, FileText, Share2, Quote, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const article = await prisma.manuscript.findUnique({
    where: { id: params.id },
    include: {
      journal: true,
      author: true,
      coAuthors: true,
      article: { include: { issue: true } }
    },
  });

  if (!article) return { title: "Article Not Found" };

  const allAuthors = [
    article.author.name,
    ...article.coAuthors.map((ca) => ca.name),
  ];

  const publishDate = article.article?.publishedAt || article.submittedAt || article.createdAt;
  const articleUrl = `https://resonarapublishers.com/articles/${article.id}`;
  const description = article.abstract.substring(0, 160);

  return {
    title: article.title,
    description,
    alternates: { canonical: articleUrl },
    openGraph: {
      type: "article",
      url: articleUrl,
      title: `${article.title} | Resonara Publishers`,
      description,
      siteName: "Resonara Publishers",
      publishedTime: publishDate.toISOString(),
      authors: allAuthors,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
    other: {
      "citation_title": article.title,
      "citation_author": allAuthors,
      "citation_publication_date": publishDate.toISOString().split('T')[0],
      "citation_journal_title": article.journal.title,
      "citation_volume": article.article?.issue?.volume?.toString() || "",
      "citation_issue": article.article?.issue?.issue?.toString() || "",
      "citation_issn": article.journal.issnOnline || article.journal.issnPrint || "",
      "citation_pdf_url": `${articleUrl}/pdf`,
      "citation_abstract_html_url": articleUrl,
      "citation_language": "en",
    },
  };
}

export default async function ArticlePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const article = await prisma.manuscript.findUnique({
    where: { id: params.id },
    include: {
      journal: true,
      author: true,
      coAuthors: { orderBy: { order: "asc" } }
    }
  });

  if (!article || article.status !== "PUBLISHED") notFound();

  // Combine authors for display
  const allAuthors = [
    { name: article.author.name, affiliation: article.author.affiliation, isCorresponding: true },
    ...article.coAuthors.map(ca => ({ name: ca.name, affiliation: ca.affiliation, isCorresponding: ca.isCorresponding }))
  ];

  const articleUrl = `https://resonarapublishers.com/articles/${article.id}`;
  const publishDate = article.submittedAt || article.createdAt;

  const scholarlyArticleSchema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    name: article.title,
    description: article.abstract.substring(0, 300),
    url: articleUrl,
    datePublished: publishDate.toISOString(),
    dateModified: article.updatedAt?.toISOString() || publishDate.toISOString(),
    inLanguage: "en",
    author: [
      {
        "@type": "Person",
        name: article.author.name,
        ...(article.author.affiliation && { affiliation: { "@type": "Organization", name: article.author.affiliation } }),
        ...(article.author.orcid && { identifier: { "@type": "PropertyValue", propertyID: "ORCID", value: `https://orcid.org/${article.author.orcid}` } }),
      },
      ...article.coAuthors.map(ca => ({
        "@type": "Person",
        name: ca.name,
        ...(ca.affiliation && { affiliation: { "@type": "Organization", name: ca.affiliation } }),
      })),
    ],
    isPartOf: {
      "@type": "Periodical",
      "@id": `https://resonarapublishers.com/journals/${article.journal.slug}#periodical`,
      name: article.journal.title,
      issn: [article.journal.issnPrint, article.journal.issnOnline].filter(Boolean),
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://resonarapublishers.com/#organization",
      name: "Resonara Publishers Pvt. Ltd.",
    },
    keywords: article.keywords?.join(", ") || "",
    abstract: article.abstract,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://resonarapublishers.com" },
      { "@type": "ListItem", position: 2, name: article.journal.title, item: `https://resonarapublishers.com/journals/${article.journal.slug}` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scholarlyArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* ── Article Header ── */}
      <div className="bg-white border-b border-[var(--border)] pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/journals/${article.journal.slug}`} className="inline-flex items-center text-[var(--brand-600)] hover:text-[var(--brand-800)] text-sm font-semibold mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Return to {article.journal.title}
          </Link>
          
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-100)] text-[var(--brand-700)] uppercase tracking-wider">
              Research Article
            </span>
            <span className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> {article.journal.title}
            </span>
            <span className="text-sm font-medium text-[var(--muted)]">
              • Published {formatDate(article.submittedAt || article.createdAt)}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-editorial font-bold text-[var(--brand-900)] mb-8 leading-[1.15]">
            {article.title}
          </h1>

          <div className="mb-8">
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-lg font-medium text-[var(--brand-800)]">
              {allAuthors.map((author, index) => (
                <span key={index}>
                  {author.name}
                  {author.isCorresponding && <sup className="text-[var(--brand-500)] ml-0.5">*</sup>}
                  {index < allAuthors.length - 1 && <span className="text-[var(--muted)]">,</span>}
                </span>
              ))}
            </div>
            
            <div className="mt-4 space-y-1">
              {Array.from(new Set(allAuthors.map(a => a.affiliation).filter(Boolean))).map((affiliation, index) => (
                <p key={index} className="text-sm text-[var(--muted)] italic">
                  {affiliation}
                </p>
              ))}
              <p className="text-xs text-[var(--muted)] mt-2">
                <span className="text-[var(--brand-500)]">*</span> Correspondence: {article.author.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href={`/api/articles/${article.id}/pdf`} target="_blank">
              <Button className="bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-full px-8 py-6 font-bold shadow-lg">
                <Download className="w-5 h-5 mr-2" /> Download PDF
              </Button>
            </Link>
            <Button variant="outline" className="border-[var(--border)] text-[var(--brand-700)] hover:bg-[var(--brand-50)] rounded-full px-6 py-6 font-semibold shadow-sm">
              <Quote className="w-5 h-5 mr-2" /> Cite
            </Button>
            <Button variant="outline" className="border-[var(--border)] text-[var(--brand-700)] hover:bg-[var(--brand-50)] rounded-full px-6 py-6 font-semibold shadow-sm">
              <Share2 className="w-5 h-5 mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* ── Article Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8 sm:p-12">
          
          <div className="mb-12">
            <h2 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[var(--brand-500)]" /> Abstract
            </h2>
            <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed">
              <p>{article.abstract}</p>
            </div>
          </div>

          {article.keywords && article.keywords.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw, idx) => (
                  <span key={idx} className="bg-[var(--brand-50)] text-[var(--brand-800)] border border-[var(--brand-200)] px-3 py-1 rounded-full text-sm font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-[var(--border)] pt-12">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-[var(--muted)]">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Full Text Available in PDF</h3>
              <p className="text-sm mb-6 max-w-md mx-auto">The full text of this article is currently available exclusively in PDF format. A web-native HTML reader is in development.</p>
              <Link href={`/api/articles/${article.id}/pdf`} target="_blank">
                <Button className="bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white shadow-md">
                  <Download className="w-4 h-4 mr-2" /> View PDF version
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
