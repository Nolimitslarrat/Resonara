"use client";

import React from "react";
import Link from "next/link";
import { Menu, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] font-sans">
      {/* Modern Floating Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-28">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative h-20 w-56 md:h-32 md:w-80 flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                  <img 
                    src="/logo.png" 
                    alt="Resonara Publishers Pvt. Ltd." 
                    className="object-contain w-full h-full filter drop-shadow-md scale-110 md:scale-110" 
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/journals" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Journals</Link>
              <Link href="/articles" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Articles</Link>
              <Link href="/guidelines" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Submission Guidelines</Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors">
                <User className="w-4 h-4" /> Sign In
              </Link>
              <Link href="/register" className="hidden lg:flex text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors">
                Register
              </Link>
              <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>
              <Link href="/dashboard/manuscripts/submit" className="hidden xs:block">
                <Button className="bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-full h-9 md:h-10 px-4 md:px-6 text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Submit Manuscript
                </Button>
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-[var(--border)] animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4 space-y-4">
              <Link href="/journals" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-[var(--brand-600)] py-2 border-b border-slate-50">Journals</Link>
              <Link href="/articles" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-[var(--brand-600)] py-2 border-b border-slate-50">Articles</Link>
              <Link href="/guidelines" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-[var(--brand-600)] py-2 border-b border-slate-50">Submission Guidelines</Link>

              <div className="pt-4 flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2 text-slate-600">
                    <User className="w-4 h-4" /> Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start text-[var(--brand-600)]">Register</Button>
                </Link>
                <Link href="/dashboard/manuscripts/submit" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[var(--brand-900)] text-white">Submit Manuscript</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--brand-900)] text-slate-300 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center">
                <Link href="/" className="relative w-80 h-40 flex items-center justify-center bg-white/5 rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-[inner_0_2px_10px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-all duration-500 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                  <img 
                    src="/logo.png" 
                    alt="Resonara Publishers Pvt. Ltd.Logo" 
                    className="object-contain w-full h-full drop-shadow-2xl brightness-0 invert opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 relative z-10" 
                  />
                </Link>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Thoughtful publishing tools for journals, authors, reviewers, and editorial teams.
              </p>
            </div>
            
            <div className="md:col-span-2 md:col-start-6">
              <h3 className="font-semibold text-white mb-5 uppercase text-xs tracking-widest opacity-80">Explore</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/journals" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> Journals A-Z</Link></li>
                <li><Link href="/articles" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> Articles</Link></li>
                <li><Link href="/special-issues" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> Special Issues</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-white mb-5 uppercase text-xs tracking-widest opacity-80">Information</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/authors" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> For Authors</Link></li>
                <li><Link href="/reviewers" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> For Reviewers</Link></li>
                <li><Link href="/editors" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> For Editors</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-white mb-5 uppercase text-xs tracking-widest opacity-80">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" /> Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium tracking-wide">
            <p>© {new Date().getFullYear()} Resonara Publishers Pvt. Ltd. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                Made with ❤️ by <span className="text-white/80 font-semibold cursor-help group relative">nolimitslarrat
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-left font-sans cursor-auto">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="https://github.com/nolimitslarrat.png" alt="nolimitslarrat" className="w-12 h-12 rounded-full border border-slate-200 shadow-sm" />
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">Shubham</div>
                        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Full-Stack Developer</div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                      <a href="mailto:shubham.stmj@gmail.com" className="text-sm text-slate-600 hover:text-[var(--brand-600)] transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        shubham.stmj@gmail.com
                      </a>
                      <a href="https://github.com/nolimitslarrat" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        github.com/nolimitslarrat
                      </a>
                    </div>
                  </div>
                </span>
              </span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
