import type { Metadata } from "next";
import { BookOpen, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Resonara Publishers Pvt. Ltd.account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[var(--navy-900)] flex-col justify-between p-12">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--brand-600)] opacity-20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#8b5cf6] opacity-15 blur-[100px]" />
          <div className="absolute top-[40%] right-[10%] w-[200px] h-[200px] rounded-full bg-[#06b6d4] opacity-10 blur-[80px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-64 h-32 flex items-center justify-center transition-all duration-500 hover:scale-105">
              <img src="/logo.png" alt="Resonara Publishers Pvt. Ltd.Logo" className="object-contain w-full h-full drop-shadow-2xl scale-110" />
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="font-editorial text-4xl font-bold text-white leading-tight">
              Research workflows with{" "}
              <span className="text-[var(--brand-300)]">editorial structure.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              Sign in to manage manuscripts, review tasks, editorial decisions, and publication records in one workspace.
            </p>
          </div>

          {/* Workflow cues */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: FileText, label: "Submissions" },
              { icon: ShieldCheck, label: "Review" },
              { icon: BookOpen, label: "Publishing" },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-4 text-center">
                <item.icon className="w-6 h-6 text-[var(--brand-300)] mx-auto" />
                <div className="text-xs text-slate-300 mt-3">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Guidance */}
          <div className="glass rounded-2xl p-6 space-y-3">
            <p className="text-slate-200 text-sm leading-relaxed">
              Use the role assigned to your account to access the tools available to you.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Authors, reviewers, editors, and production teams may see different dashboards after sign-in.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-slate-500 text-xs">
          © {new Date().getFullYear()} Resonara Publishers Pvt. Ltd.. All rights reserved.
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--background)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <Link href="/" className="w-48 h-24 flex items-center justify-center">
              <img src="/logo.png" alt="Resonara Publishers Pvt. Ltd.Logo" className="object-contain w-full h-full drop-shadow-xl scale-110" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
