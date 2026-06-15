import { Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact Us | Resonara Publishers Pvt. Ltd.",
  description: "Get in touch with the Resonara Publishers Pvt. Ltd.editorial and support team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-editorial font-bold text-[var(--brand-900)]">
          Contact Us
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll
          respond as soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Contact form */}
        <div className="lg:col-span-3 bg-white border border-[var(--border)] rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)] mb-6">
            Send a Message
          </h2>
          <ContactForm />
        </div>

        {/* Contact details */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-xl font-editorial font-bold text-[var(--brand-900)]">
            Get in Touch
          </h2>
          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              For any enquiries regarding manuscript submission, peer review, or technical issues, please use the contact form to reach out to our team. We typically respond within 1-2 business days.
            </p>
            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[var(--brand-600)] mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Email</p>
                  <a href="mailto:Info@resonarapublishers.com" className="text-sm font-semibold text-[var(--brand-600)] hover:underline">Info@resonarapublishers.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--brand-600)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Phone &amp; WhatsApp</p>
                  <a href="tel:+918602264005" className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--brand-600)] transition-colors">+91 8602264005</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--brand-600)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Address</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Unit No 603-604, 6th Floor, Bhutani Alphathums, Nepz Post Office, Gautam Buddha Nagar, Noida, Uttar Pradesh, India, 201305</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--brand-600)]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Working Hours</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Monday to Saturday</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ shortcut */}
          <div className="bg-[var(--brand-50)] border border-[var(--brand-200)] rounded-xl p-5 mt-6">
            <p className="text-sm font-bold text-[var(--brand-800)] mb-1">Before reaching out…</p>
            <p className="text-xs text-[var(--brand-700)] leading-relaxed">
              Check our{" "}
              <a href="/guidelines" className="underline font-semibold">
                Submission Guidelines
              </a>{" "}
              — many common questions are answered there.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

