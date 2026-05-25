import { Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Contact Us | Resonara",
  description: "Get in touch with the Resonara editorial and support team.",
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
          <form className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="Jane" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Smith" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email Address</Label>
              <Input id="contact-email" type="email" placeholder="jane@university.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              >
                <option value="">Select a topic…</option>
                <option value="submission">Manuscript Submission</option>
                <option value="review">Peer Review</option>
                <option value="account">Account / Login</option>
                <option value="technical">Technical Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                rows={5}
                placeholder="Describe your enquiry in detail…"
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 gap-2">
              <Mail className="w-4 h-4" /> Send Message
            </Button>
          </form>
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
            <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
              <Clock className="w-5 h-5 text-[var(--brand-600)]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Working Hours</p>
                <p className="text-sm font-semibold text-[var(--foreground)]">Monday to Friday</p>
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

