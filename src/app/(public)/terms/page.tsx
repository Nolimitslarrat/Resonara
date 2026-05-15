import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Resonara",
  description: "Terms and conditions for using the Resonara academic publishing platform.",
};

const lastUpdated = "10 May 2026";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-slate-200">
        <h1 className="text-4xl font-editorial font-bold text-[var(--brand-900)] mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
      </div>

      <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
        {[
          {
            title: "1. Acceptance of Terms",
            body: `By creating a Resonara account or using the platform, you agree to be bound by these Terms of Service. If you do not agree, do not use our services. We may update these terms from time to time; continued use after notification constitutes acceptance of the revised terms.`,
          },
          {
            title: "2. Eligibility",
            body: `You must be at least 18 years old and have the legal capacity to enter into agreements to use Resonara. By registering, you represent and warrant that all information you provide is accurate and complete.`,
          },
          {
            title: "3. Author Responsibilities",
            body: `Authors warrant that submitted manuscripts are original, have not been published elsewhere, and are not under consideration by another publication. Authors accept responsibility for the accuracy of reported data and all ethical declarations made during submission. Plagiarism, data fabrication, or falsification will result in immediate rejection and possible account suspension.`,
          },
          {
            title: "4. Peer Review Confidentiality",
            body: `Reviewers agree to treat all manuscripts assigned to them as confidential. Manuscripts must not be shared, discussed with third parties, or used to advance the reviewer's own research before publication. Violations of this obligation may result in permanent exclusion from the reviewer pool.`,
          },
          {
            title: "5. Intellectual Property",
            body: `Authors retain copyright of their work. Upon acceptance, authors grant Resonara a non-exclusive, worldwide licence to publish, reproduce, and distribute the article under a Creative Commons Attribution 4.0 International (CC BY 4.0) licence. Platform software, branding, and design are the exclusive property of Resonara.`,
          },
          {
            title: "6. Prohibited Conduct",
            body: `You agree not to: (a) submit fraudulent or plagiarised content; (b) misrepresent your identity or credentials; (c) attempt to identify blinded authors or reviewers; (d) use the platform for any unlawful purpose; (e) attempt to gain unauthorised access to other accounts or system data.`,
          },
          {
            title: "7. Disclaimer of Warranties",
            body: `Resonara is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not warrant that the service will be uninterrupted, error-free, or secure. We make no representations regarding the accuracy of any content published on the platform.`,
          },
          {
            title: "8. Limitation of Liability",
            body: `To the maximum extent permitted by applicable law, Resonara shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the platform, even if we have been advised of the possibility of such damages.`,
          },
          {
            title: "9. Termination",
            body: `We reserve the right to suspend or terminate accounts that violate these Terms of Service, at our sole discretion, with or without notice. You may terminate your account at any time by contacting support.`,
          },
          {
            title: "10. Governing Law",
            body: `These Terms are governed by and construed in accordance with applicable law. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of competent courts.`,
          },
          {
            title: "11. Contact",
            body: `Questions about these Terms should be directed to legal@nexschoolar.com or through our Contact page.`,
          },
        ].map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-editorial font-bold text-[var(--brand-900)] mb-2 pb-1 border-b border-slate-100">
              {s.title}
            </h2>
            <p dangerouslySetInnerHTML={{ __html: s.body }} />
          </section>
        ))}

        <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
          <p>
            Related:{" "}
            <Link href="/privacy" className="text-[var(--brand-600)] underline">Privacy Policy</Link>
            {" · "}
            <Link href="/contact" className="text-[var(--brand-600)] underline">Contact Us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
