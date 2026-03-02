// app/[locale]/(public)/page.tsx
'use client';

import { Link } from '@/i18n/navigation';
import { ArrowRight, Zap, Target, BookOpen, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#0D0D0D] text-[#F5F0E8] selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <header className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center gap-8 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
          <Zap className="h-4 w-4" /> Phase 1: MVP under construction
        </div>
        
        <h1 className="text-6xl md:text-8xl font-heading uppercase tracking-tighter leading-[0.9]">
          Stop tracking in <br/>
          <span className="text-primary italic">spreadsheets</span>.
        </h1>
        
        <p className="text-xl md:text-2xl text-[#F5F0E8]/50 font-mono leading-relaxed max-w-2xl">
          JobZapp: The high-speed job application tracker. Manage your career with AI-powered precision.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            href="/dashboard"
            className="px-8 py-5 bg-primary text-[#0D0D0D] text-lg uppercase tracking-[0.2em] font-black hover:bg-primary/80 transition-all flex items-center justify-center gap-3 group shadow-[0_0_40px_rgba(0,69,255,0.4)] hover:shadow-[0_0_60px_rgba(0,69,255,0.6)] transform hover:-translate-y-1 active:translate-y-0"
          >
            ENTER DASHBOARD <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Simplified Info */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5">
        <div className="space-y-4">
          <Target className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-bold uppercase tracking-wide">Job Tracking</h3>
          <p className="text-[#F5F0E8]/50 font-mono text-sm leading-relaxed">
            Manage your applications, interviews, and offers in one place. No more lost tabs.
          </p>
        </div>
        <div className="space-y-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-bold uppercase tracking-wide">CV Management</h3>
          <p className="text-[#F5F0E8]/50 font-mono text-sm leading-relaxed">
            Store and tailor multiple versions of your CV. AI-assisted keyword optimization.
          </p>
        </div>
        <div className="space-y-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-bold uppercase tracking-wide">Interview Prep</h3>
          <p className="text-[#F5F0E8]/50 font-mono text-sm leading-relaxed">
            Structured preparation for every round. Record feedback and track your success.
          </p>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="w-full px-6 py-20 border-t border-white/5 text-center mt-auto">
        <div className="text-3xl font-heading text-primary tracking-wide uppercase">
          Job<span className="text-[#F5F0E8]">Zapp</span>
        </div>
        <p className="text-[9px] text-[#F5F0E8]/20 tracking-[0.3em] font-bold uppercase mt-4">
          Built for the modern job market.
        </p>
      </footer>
    </div>
  );
}
