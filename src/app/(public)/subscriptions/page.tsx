import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, Printer, ShieldCheck, CreditCard, Building2, HelpCircle, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Subscriptions | Resonara Publishers Pvt. Ltd.",
  description: "Subscribe to the International Journal of Science Transformation and Engineering Innovations (IJSTEI). View pricing, formats, and bank account details.",
};

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero Banner ── */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-bg text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[100%] rounded-full bg-gradient-to-b from-white/5 to-transparent blur-3xl transform rotate-12"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-sm uppercase tracking-widest font-bold text-[var(--brand-200)]">Journal Access</h1>
          <h2 className="text-4xl sm:text-5xl font-editorial font-bold tracking-tight">
            Subscriptions & Access
          </h2>
          <p className="text-lg text-[var(--brand-100)] max-w-2xl mx-auto font-light leading-relaxed">
            Get comprehensive, bi-annual print and digital access to our leading research publication.
          </p>
        </div>
      </section>

      {/* ── Main Subscription Card Section ── */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Plan Card */}
            <div className="lg:col-span-7 space-y-8">
              <div className="text-left space-y-4">
                <h3 className="text-sm uppercase tracking-wider font-bold text-[var(--brand-600)]">Available Plan</h3>
                <h4 className="text-3xl font-editorial font-bold text-[var(--brand-900)]">IJSTEI Annual Subscription</h4>
                <p className="text-slate-600">
                  Subscribe today to receive complete bi-annual print volumes and online repository access for our flagship engineering and sciences journal.
                </p>
              </div>

              {/* Premium Pricing Grid */}
              <div className="bg-[var(--background)] rounded-3xl border border-[var(--border)] p-8 sm:p-10 shadow-sm relative overflow-hidden group hover:border-[var(--brand-300)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-50)] rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110"></div>
                
                <div className="relative z-10 space-y-8">
                  {/* Journal Title */}
                  <div className="space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-100)] text-[var(--brand-700)] uppercase tracking-wider">
                      Flagship Journal
                    </span>
                    <h5 className="text-2xl font-editorial font-bold text-[var(--brand-900)] leading-tight">
                      International Journal of Science Transformation and Engineering Innovations (IJSTEI)
                    </h5>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Plan Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-[var(--border)] shadow-sm text-[var(--brand-600)]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Frequency</div>
                        <div className="text-base font-bold text-[var(--brand-900)]">Bi-Annual</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-[var(--border)] shadow-sm text-[var(--brand-600)]">
                        <Printer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format</div>
                        <div className="text-base font-bold text-[var(--brand-900)]">Print + Online</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-[var(--border)] shadow-sm text-[var(--brand-600)]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</div>
                        <div className="text-base font-bold text-green-600 flex items-center gap-1">
                          Active <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Price Block */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Annual Price</span>
                      <div className="text-4xl sm:text-5xl font-editorial font-bold text-[var(--brand-900)] mt-1">
                        Rs. 3,500<span className="text-lg font-sans font-normal text-slate-500"> / year</span>
                      </div>
                    </div>
                    
                    <Link href="/contact" className="sm:w-auto">
                      <Button className="bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-full px-8 py-6 font-bold shadow-md hover:shadow-lg transition-all text-base w-full">
                        Inquire Now <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Account Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[var(--brand-600)] shadow-sm">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--brand-900)]">Payment Details</h4>
                    <p className="text-xs text-slate-500">Direct Bank Transfer details</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  To subscribe or settle invoices, please transfer the amount to our corporate current account and email the transaction proof alongside your mailing address to <a href="mailto:info@resonarapublishers.com" className="text-[var(--brand-600)] hover:underline font-medium">info@resonarapublishers.com</a>.
                </p>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current A/C Details</div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Account Type</span>
                      <span className="font-semibold text-slate-800">Current Account</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Account Number</span>
                      <span className="font-mono font-bold text-slate-800 tracking-wider">315XXXXX</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Beneficiary Name</span>
                      <span className="font-semibold text-slate-800">Resonara Publishers Pvt. Ltd.</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Payment Purpose</span>
                      <span className="font-semibold text-[var(--brand-600)]">IJSTEI Subscription</span>
                    </div>
                  </div>
                </div>


              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Subscriptions benefits (Engaging visual area) ── */}
      <section className="py-24 bg-[var(--background)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-sm uppercase tracking-widest font-bold text-[var(--muted)]">Subscriber Benefits</h3>
            <h4 className="text-4xl font-editorial font-bold text-[var(--brand-900)]">Why Subscribe to IJSTEI?</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Peer-Reviewed Precision",
                desc: "Gain access to articles that undergo double-blind peer review and strict editorial screening by global specialists."
              },
              {
                title: "Print & Online Hybrid Format",
                desc: "Enjoy traditional, high-quality offset print issues for archives and concurrent online logins for desktop/mobile accessibility."
              },
              {
                title: "Comprehensive Research Coverage",
                desc: "Stay updated with bi-annual volumes detailing ground-breaking advancements in science, computer science, and engineering innovations."
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-[var(--border)] hover:border-[var(--brand-200)] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[var(--brand-50)] flex items-center justify-center mb-6 text-[var(--brand-600)]">
                  <Check className="w-5 h-5" />
                </div>
                <h5 className="text-xl font-bold text-[var(--brand-900)] mb-3">{benefit.title}</h5>
                <p className="text-slate-600 leading-relaxed text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <HelpCircle className="w-10 h-10 text-[var(--brand-500)] mx-auto" />
            <h3 className="text-3xl font-editorial font-bold text-[var(--brand-900)]">Subscription FAQs</h3>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How can I obtain a GST Invoice for my institutional purchase?",
                a: "Please email your institution name, GSTIN, and registration details to info@resonarapublishers.com. Our accounts department will generate and share a formal tax invoice with you."
              },
              {
                q: "When are the bi-annual print issues dispatched?",
                a: "Dispatches occur twice a year, typically in June and December. Subscribers receive a tracking code via email as soon as the speed post leaves our warehouse."
              },
              {
                q: "Can we request multi-year institutional subscriptions?",
                a: "Yes, we support multi-year subscription plans (3-year and 5-year terms) at discounted rates. Contact our subscription team to receive a custom proposal."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                <h5 className="font-bold text-[var(--brand-900)] text-base mb-2">{faq.q}</h5>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
