import Link from "next/link";
import { Search, Menu, User, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] font-sans">
      {/* Modern Floating Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-600)] to-[#8b5cf6] flex items-center justify-center rounded-xl shadow-[var(--shadow-glass)] group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-editorial font-bold text-[var(--brand-900)] leading-none tracking-tight">NexScholar</span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-500)] mt-1">Publishing</span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/journals" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Journals</Link>
              <Link href="/articles" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Articles</Link>
              <Link href="/guidelines" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors animated-underline py-1">Information</Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[var(--brand-600)] transition-colors">
                <User className="w-4 h-4" /> Sign In
              </Link>
              <Link href="/register" className="hidden lg:flex text-sm font-semibold text-[var(--brand-600)] hover:text-[var(--brand-800)] transition-colors">
                Register
              </Link>
              <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>
              <Link href="/dashboard/manuscripts/submit">
                <Button className="bg-[var(--brand-900)] hover:bg-[var(--brand-800)] text-white rounded-full h-10 px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Submit Manuscript
                </Button>
              </Link>
              <button className="md:hidden p-2 text-slate-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="bg-[var(--brand-900)] text-slate-300 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-xl backdrop-blur-sm border border-white/10">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-editorial font-bold text-white tracking-tight">NexScholar</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Redefining the future of open-access academic publishing. Accelerating global research dissemination through beautiful technology.
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
            <p>© {new Date().getFullYear()} NexScholar Publishing. All rights reserved.</p>
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
