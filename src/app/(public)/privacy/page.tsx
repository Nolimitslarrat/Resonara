import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Resonara Publishers Pvt. Ltd.",
  description: "How Resonara Publishers Pvt. Ltd.collects, uses, and protects your personal data.",
};

const lastUpdated = "10 May 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-slate-200">
        <h1 className="text-4xl font-editorial font-bold text-[var(--brand-900)] mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            1. Who We Are
          </h2>
          <p className="text-sm">
            Resonara Publishers Pvt. Ltd.(&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the academic publication
            management platform available at resonarapublishers.com. This Privacy Policy explains how we
            collect, use, disclose, and protect information about you when you use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            2. Information We Collect
          </h2>
          <p className="text-sm mb-3">We collect the following categories of personal data:</p>
          <ul className="list-disc list-inside space-y-2 text-sm pl-2">
            <li><strong>Account information:</strong> name, email address, institutional affiliation, and role.</li>
            <li><strong>Profile data:</strong> ORCID iD, biography, and area of expertise (optional).</li>
            <li><strong>Manuscript data:</strong> submitted manuscripts, abstracts, keywords, co-author details, and cover letters.</li>
            <li><strong>Review data:</strong> peer review reports you submit for assigned manuscripts.</li>
            <li><strong>Usage data:</strong> IP address, browser type, pages visited, and interaction logs for security and analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm pl-2">
            <li>To operate and maintain your Resonara Publishers Pvt. Ltd.account.</li>
            <li>To manage the manuscript submission and peer review workflow.</li>
            <li>To send transactional notifications about your submissions and reviews.</li>
            <li>To improve platform performance and user experience.</li>
            <li>To comply with our legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            4. Data Sharing
          </h2>
          <p className="text-sm">
            We do not sell your personal data. We may share data with service providers
            used to operate the platform, such as hosting or email delivery. Reviewer
            identity handling depends on the review model configured for the journal or workflow.
            Published article records may display author names and affiliations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            5. Data Retention
          </h2>
          <p className="text-sm">
            We retain account, manuscript, and workflow data as needed to operate the platform,
            maintain editorial records, and meet applicable legal or administrative requirements.
            You may request deletion of your account data by contacting us, subject to those
            requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            6. Your Rights
          </h2>
          <p className="text-sm mb-3">Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-sm pl-2">
            <li>Access the personal data we hold about you.</li>
            <li>Correct inaccurate or incomplete data.</li>
            <li>Request deletion of your personal data.</li>
            <li>Object to or restrict certain processing activities.</li>
            <li>Data portability in a machine-readable format.</li>
          </ul>
          <p className="text-sm mt-3">
            To exercise any of these rights, contact{" "}
            <a href="mailto:Info@resonarapublishers.com" className="text-[var(--brand-600)] underline">
              Info@resonarapublishers.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            7. Cookies
          </h2>
          <p className="text-sm">
            We use essential cookies to maintain your session and preferences. We do not use
            third-party advertising cookies. You can control cookie settings through your browser
            preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            8. Security
          </h2>
          <p className="text-sm">
            We use security controls such as password hashing and role-based access within the platform.
            No system is completely secure;
            please contact us immediately if you suspect unauthorised access to your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-3">
            9. Contact
          </h2>
          <p className="text-sm">
            For questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:Info@resonarapublishers.com" className="text-[var(--brand-600)] underline">
              Info@resonarapublishers.com
            </a>{" "}
            or visit our{" "}
            <Link href="/contact" className="text-[var(--brand-600)] underline">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
