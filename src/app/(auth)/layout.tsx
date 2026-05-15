import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Resonara account",
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

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-24 h-24 flex items-center justify-center transition-all duration-500 hover:scale-110">
              <img src="/logo.png" alt="Resonara Logo" className="object-contain w-full h-full drop-shadow-2xl scale-150" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="font-editorial text-4xl font-bold text-white leading-tight">
              Where research meets its{" "}
              <span className="text-[var(--brand-300)]">global audience.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              The enterprise platform powering manuscript submission, peer review, and academic publishing for institutions worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "50K+", label: "Manuscripts" },
              { value: "12K+", label: "Reviewers" },
              { value: "500+", label: "Journals" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="glass rounded-2xl p-6 space-y-3">
            <p className="text-slate-200 text-sm leading-relaxed italic">
              &ldquo;Resonara transformed how we manage our journal submissions. The workflow is seamless and the interface is unlike anything else in academic publishing.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-400)] to-[var(--brand-700)] flex items-center justify-center text-white text-xs font-bold">
                DR
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Dr. Rebecca Osei</p>
                <p className="text-slate-400 text-xs">Editor-in-Chief, Journal of Biosciences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-slate-500 text-xs">
          © {new Date().getFullYear()} Resonara. All rights reserved.
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--background)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="w-20 h-20 flex items-center justify-center">
              <img src="/logo.png" alt="Resonara Logo" className="object-contain w-full h-full drop-shadow-xl scale-125" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
