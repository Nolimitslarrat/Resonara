import type { Metadata } from "next";
import Link from "next/link";
import { Award, Globe, Heart, ShieldCheck, Target, Eye, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | Resonara Publishers Pvt. Ltd.",
  description: "At Resonara Publishers Pvt. Ltd., we believe that knowledge is a catalyst for global progress. Learn about our mission, vision, and author-centric philosophy.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Header Hero Section ── */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-bg text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[100%] rounded-full bg-gradient-to-b from-white/5 to-transparent blur-3xl transform rotate-12"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-sm uppercase tracking-widest font-bold text-[var(--brand-200)]">Who We Are</h1>
          <h2 className="text-4xl sm:text-5xl font-editorial font-bold tracking-tight">
            About Resonara Publishers Pvt. Ltd.
          </h2>
          <p className="text-lg text-[var(--brand-100)] max-w-2xl mx-auto font-light leading-relaxed">
            Nurturing impactful scholarly works and bridging the gap between groundbreaking research and global readers.
          </p>
        </div>
      </section>

      {/* ── Introduction Block ── */}
      <section className="py-20 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <p className="text-xl text-slate-700 leading-relaxed font-light">
            At <span className="font-semibold text-[var(--brand-900)]">Resonara Publishers Pvt. Ltd.</span>, we believe that knowledge is a catalyst for global progress. Founded on the principles of academic integrity, innovation, and inclusivity, we are a fast-growing, premier publishing house dedicated to bringing impactful scholarly and literary works to life.
          </p>
          <div className="h-px w-20 bg-[var(--brand-300)] mx-auto"></div>
          <p className="text-lg text-slate-600 leading-relaxed">
            We bridge the gap between groundbreaking research and global readers, ensuring that vital discoveries, theories, and narratives resonate across borders, generations, and disciplines.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision Section (Side by Side Cards) ── */}
      <section className="py-20 bg-[var(--background)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-3xl border border-[var(--border)] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--brand-50)] rounded-bl-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-110"></div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-50)] flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-[var(--brand-600)]" />
                </div>
                <h3 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-4">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  To discover, nurture, and disseminate high-quality scholarly research and literary works that push the boundaries of knowledge and inspire intellectual growth worldwide.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-10 rounded-3xl border border-[var(--border)] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--brand-50)] rounded-bl-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-110"></div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-50)] flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-[var(--brand-600)]" />
                </div>
                <h3 className="text-2xl font-editorial font-bold text-[var(--brand-900)] mb-4">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  To be a globally recognized, author-first publishing platform known for digital innovation, exceptional editorial standards, and an unwavering commitment to advancing scholarly communication through subscription-based, hybrid, and open-access journals that promote accessible learning worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Resonara Difference (Grid layout) ── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-sm uppercase tracking-widest font-bold text-[var(--muted)]">Core Strengths</h2>
            <h3 className="text-4xl font-editorial font-bold text-[var(--brand-900)]">The Resonara Difference</h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              What sets Resonara apart is our deep-seated belief that publishing is a partnership. We don’t just print manuscripts; we champion ideas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Difference 1 */}
            <div className="bg-[var(--background)] p-8 rounded-2xl border border-[var(--border)] flex flex-col h-full hover:border-[var(--brand-300)] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-[var(--border)]">
                <ShieldCheck className="w-6 h-6 text-[var(--brand-600)]" />
              </div>
              <h4 className="text-xl font-bold text-[var(--brand-900)] mb-3">🌟 Quality and Integrity First</h4>
              <p className="text-slate-600 leading-relaxed">
                Every journal article we publish undergoes a rigorous peer-review and editorial process. We work alongside a distinguished board of global educators, researchers, and industry experts to maintain the highest academic standards.
              </p>
            </div>

            {/* Difference 2 */}
            <div className="bg-[var(--background)] p-8 rounded-2xl border border-[var(--border)] flex flex-col h-full hover:border-[var(--brand-300)] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-[var(--border)]">
                <Globe className="w-6 h-6 text-[var(--brand-600)]" />
              </div>
              <h4 className="text-xl font-bold text-[var(--brand-900)] mb-3">🌐 Global Reach, Digital Innovation</h4>
              <p className="text-slate-600 leading-relaxed">
                Through our advanced digital distribution network, your work is made available to leading university libraries, research repositories, and major book retailers across the globe. We embrace both traditional print and modern digital layouts to maximize readability and impact.
              </p>
            </div>

            {/* Difference 3 */}
            <div className="bg-[var(--background)] p-8 rounded-2xl border border-[var(--border)] flex flex-col h-full hover:border-[var(--brand-300)] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-[var(--border)]">
                <Heart className="w-6 h-6 text-[var(--brand-600)]" />
              </div>
              <h4 className="text-xl font-bold text-[var(--brand-900)] mb-3">🤝 An Author-Centric Philosophy</h4>
              <p className="text-slate-600 leading-relaxed">
                Writing is a labor of love and intellect. We honor your hard work by providing a transparent, supportive publishing journey. From developmental copyediting and professional typesetting to eye-catching cover design and post-launch marketing, our team is with you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Publish & Meet Leadership ── */}
      <section className="py-20 bg-[var(--background)] border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* What We Publish */}
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-editorial font-bold text-[var(--brand-900)]">What We Publish</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              We cater to a diverse spectrum of intellectual and creative minds, specializing in:
            </p>
            <div className="inline-block bg-white border border-[var(--border)] px-6 py-4 rounded-xl shadow-sm">
              <span className="font-bold text-[var(--brand-800)] flex items-center gap-2 justify-center">
                <BookOpen className="w-5 h-5 text-[var(--brand-600)]" /> Peer-Reviewed Journals: High-impact periodicals covering Science and Technology.
              </span>
            </div>
          </div>

          {/* Leadership */}
          <div className="h-px bg-slate-200"></div>

          <div className="text-center space-y-4">
            <h3 className="text-3xl font-editorial font-bold text-[var(--brand-900)]">Meet Our Leadership & Editorial Board</h3>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Resonara is guided by a diverse team of seasoned publishing professionals, academic scholars, and digital media experts. Driven by a shared passion for learning, our leadership ensures that the company remains at the forefront of modern publishing trends while strictly adhering to ethical publishing practices.
            </p>
          </div>
        </div>
      </section>

      {/* ── Partner With Us (Call to Action) ── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <h3 className="text-4xl font-editorial font-bold text-[var(--brand-900)]">Partner With Us</h3>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Whether you are an established researcher looking to publish your next monograph, a professor crafting a comprehensive textbook, or an institution seeking a trusted partner for conference proceedings, Resonara welcomes you.
          </p>
          <p className="text-xl text-[var(--brand-700)] font-semibold font-editorial">
            Let us help your voice resonate globally.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/guidelines">
              <Button className="bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-full px-8 py-6 text-base font-bold shadow-md hover:shadow-lg transition-all">
                Learn About Submission Guidelines <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-2 border-[var(--brand-200)] text-[var(--brand-900)] hover:bg-[var(--brand-50)] rounded-full px-8 py-6 text-base font-bold transition-all">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
