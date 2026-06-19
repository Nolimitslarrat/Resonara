"use client";

import React from "react";
import Link from "next/link";
import { Menu, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
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
              <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">About Us</Link>
              <Link href="/journals" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Journals</Link>
              <Link href="/articles" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Articles</Link>
              <Link href="/subscriptions" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Subscriptions</Link>
              <Link href="/guidelines" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Submission Guidelines</Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {session?.user ? (
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[var(--brand-600)] flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors">
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                  <Link href="/register" className="hidden lg:flex text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors">
                    Register
                  </Link>
                </>
              )}
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
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-[var(--brand-600)] py-2 border-b border-slate-50">About Us</Link>
              <Link href="/journals" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-[var(--brand-600)] py-2 border-b border-slate-50">Journals</Link>
              <Link href="/articles" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-[var(--brand-600)] py-2 border-b border-slate-50">Articles</Link>
              <Link href="/subscriptions" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-[var(--brand-600)] py-2 border-b border-slate-50">Subscriptions</Link>
              <Link href="/guidelines" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-[var(--brand-600)] py-2 border-b border-slate-50">Submission Guidelines</Link>

              <div className="pt-4 flex flex-col gap-3">
                {session?.user ? (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2 text-slate-600">
                      <div className="w-6 h-6 rounded-full bg-[var(--brand-600)] flex items-center justify-center text-white text-[10px] font-bold">
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2 text-slate-600">
                        <User className="w-4 h-4" /> Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start text-[var(--brand-600)]">Register</Button>
                    </Link>
                  </>
                )}
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
