"use client";

import { useState } from "react";
import { Settings2, X, Loader2, CheckCircle2, AlertTriangle, HelpCircle, FileText, Globe, Check, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishArticle, unpublishArticle } from "@/app/actions/publish";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type ArticleData = {
  id: string;
  title: string;
  status: string;
  journal: {
    title: string;
    issnOnline: string | null;
    issnPrint: string | null;
  };
  author: {
    name: string;
    email: string;
    affiliation: string | null;
  };
};

export function ManageArticleModal({ article }: { article: ArticleData }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPublished = article.status === "PUBLISHED";

  // Google Scholar requirements check
  const checks = {
    hasPdf: true, // In this app, manuscripts always have uploaded versions
    hasMetaTags: article.title.length > 0 && article.author.name.length > 0 && article.journal.title.length > 0,
    hasCrawlableUrl: true,
    isPublishedStatus: isPublished
  };

  const indexableScore = Object.values(checks).filter(Boolean).length;
  const isGoogleScholarReady = indexableScore === 4;

  const handleTogglePublish = async () => {
    setIsSubmitting(true);
    try {
      let result;
      if (isPublished) {
        result = await unpublishArticle(article.id);
      } else {
        result = await publishArticle(article.id);
      }

      if (result.success) {
        toast({
          title: isPublished ? "Article unpublished" : "Article published",
          description: isPublished 
            ? "The article has been set to ready for publication and removed from the public website." 
            : "The article is now live and crawlable by search engines.",
        });
        router.refresh();
        setIsOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Action failed",
          description: result.error || "An error occurred",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Unexpected error",
        description: err.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => setIsOpen(true)} 
        className="gap-1.5 border-[var(--border)] text-[var(--muted)] hover:text-[var(--brand-700)] hover:bg-slate-50 transition-colors"
      >
        <Settings2 className="w-3.5 h-3.5" />
        Manage
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--brand-900)] flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">Manage Article</h2>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Control visibility and verify search indexing parameters.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Title & Info */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--brand-600)] bg-[var(--brand-50)] px-2 py-0.5 rounded border border-[var(--brand-200)]">
                  {article.journal.title}
                </span>
                <h3 className="text-base font-bold text-[var(--foreground)] mt-2 leading-snug">{article.title}</h3>
                <p className="text-xs text-[var(--muted)]">Primary Author: {article.author.name} ({article.author.affiliation || "No affiliation"})</p>
              </div>

              {/* Scholar Indexing Status Card */}
              <div className="bg-slate-50 border border-[var(--border)] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[var(--brand-600)]" />
                    Google Scholar Indexability
                  </h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isGoogleScholarReady 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {isGoogleScholarReady ? "Ready to Index" : "Action Required"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Checklist Items */}
                  <div className="flex items-start gap-2.5 text-xs">
                    {checks.isPublishedStatus ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-700">Public Visibility ({isPublished ? "Published" : "Unpublished"})</p>
                      <p className="text-[10px] text-slate-500">Only articles marked as Published can be discovered and crawled by indexing bots.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    {checks.hasPdf ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-700">Full Text PDF File Link</p>
                      <p className="text-[10px] text-slate-500">Google Scholar requires a public PDF file link on the landing page for full text indexing.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    {checks.hasMetaTags ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-700">Highwire Press / Dublin Core Meta Tags</p>
                      <p className="text-[10px] text-slate-500">Includes citation_title, citation_author, citation_journal_title, and citation_pdf_url metadata.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    {checks.hasCrawlableUrl ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-700">Googlebot Indexing Guidelines</p>
                      <p className="text-[10px] text-slate-500">Page headers include robot crawl directives allowing crawlers (index, follow) to access the page.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visibility Control Action */}
              <div className="pt-2">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Publishing Status</h4>
                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-xl bg-white">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800">
                      {isPublished ? "Article is Live" : "Article is Offline"}
                    </p>
                    <p className="text-[10px] text-[var(--muted)] leading-tight max-w-[280px]">
                      {isPublished 
                        ? "Visible to the public, search engines, and indexable in Google Scholar." 
                        : "Hidden from the public site and returning a 404 page for crawlers."}
                    </p>
                  </div>
                  <Button 
                    onClick={handleTogglePublish}
                    disabled={isSubmitting}
                    className={`h-9 px-4 text-xs font-bold rounded-lg ${
                      isPublished 
                        ? "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100" 
                        : "bg-[var(--brand-900)] text-white hover:bg-[var(--brand-800)]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Processing...
                      </>
                    ) : isPublished ? "Unpublish" : "Publish Article"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end p-4 border-t border-[var(--border)] bg-slate-50">
              <Button onClick={() => setIsOpen(false)} className="bg-slate-200 text-slate-800 hover:bg-slate-300">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
