import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Author & Submission Guidelines | NexScholar",
  description: "Comprehensive submission guidelines, review policies, ethics standards, and formatting requirements for NexScholar.",
};

const sections = [
  {
    id: "scope",
    title: "Scope & Aims",
    content: `NexScholar publishes original research articles, systematic reviews, meta-analyses, and methodological papers across a broad range of academic disciplines. We accept submissions in English only. Submitted manuscripts must represent original work not published or under consideration elsewhere.`,
  },
  {
    id: "formatting",
    title: "Formatting Requirements",
    content: `Manuscripts should be submitted in Microsoft Word (.docx) or PDF format. Use 12pt Times New Roman or Arial, 1.5 line spacing, and 2.5 cm margins on all sides. Include page and line numbers throughout. Figures and tables should be embedded in the text at their approximate location.`,
  },
  {
    id: "abstract",
    title: "Abstract & Keywords",
    content: `All manuscripts require a structured abstract of 200–300 words with the following subheadings: Background, Objectives, Methods, Results, and Conclusions. Provide 4–8 keywords that are not present in the title. Keywords must be taken from MeSH or equivalent controlled vocabulary where applicable.`,
  },
  {
    id: "peer-review",
    title: "Peer Review Policy",
    content: `NexScholar operates a double-blind peer review process. Author identities are withheld from reviewers, and reviewer identities are withheld from authors. Manuscripts are assigned to a minimum of two independent expert reviewers. The Managing Editor makes all final decisions.`,
  },
  {
    id: "ethics",
    title: "Research Ethics",
    content: `Studies involving human subjects must have been approved by an appropriate ethics committee and comply with the Declaration of Helsinki. Studies involving animals must have institutional ethics approval. Authors must include an ethics statement in their manuscript.`,
  },
  {
    id: "data",
    title: "Data Availability",
    content: `Authors are encouraged to make their underlying research data openly available. Data should be deposited in a recognised repository (e.g. Zenodo, figshare, DRYAD) and the DOI or accession number included in the manuscript.`,
  },
  {
    id: "apc",
    title: "Article Processing Charges",
    content: `NexScholar is an open-access publisher. An Article Processing Charge (APC) may apply upon acceptance. Authors in low-income countries may be eligible for a full or partial fee waiver. Contact the editorial office before submission to discuss waiver eligibility.`,
  },
];

export default function GuidelinesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-14 border-b border-slate-200 pb-10">
        <h1 className="text-4xl font-editorial font-bold text-[var(--brand-900)] mb-3">
          Submission Guidelines
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Please read these guidelines carefully before preparing your manuscript.
          Adherence to our requirements ensures a smooth review process.
        </p>
        <div className="flex gap-4 mt-6 flex-wrap">
          <Link
            href="/authors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors"
          >
            For Authors <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/reviewers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors"
          >
            For Reviewers <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/editors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors"
          >
            For Editors <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sticky TOC */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4">
              On This Page
            </p>
            <nav className="space-y-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-slate-600 hover:text-[var(--brand-600)] hover:font-medium transition-colors py-0.5"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3 space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3 pb-2 border-b border-slate-200">
                {s.title}
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{s.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
