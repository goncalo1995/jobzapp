"use client"

import { Link } from '@/i18n/navigation';
import { Flame, ArrowRight } from 'lucide-react';

interface ArticleCTAProps {
  context: string;
  source: string;
}

export function ArticleCTA({ context, source }: ArticleCTAProps) {
  return (
    <div className="mt-20 p-8 border border-primary/20 bg-muted/50 relative overflow-hidden group rounded-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Flame className="h-24 w-24" />
      </div>
      
      <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4 font-bold relative z-10">
        Stop the manual grind.
      </p>
      
      <h3 className="text-2xl font-heading text-foreground mb-4 uppercase tracking-wide relative z-10">
        Accelerate your job search
      </h3>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-mono relative z-10">
        Join JobZapp to track applications, tailor your CV with AI, and master your interview preparation—all in one place.
      </p>
 
      <Link 
        href="/dashboard"
        className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-primary/90 transition-all relative z-10 rounded-xl"
      >
        Sign Up Free <ArrowRight className="h-4 w-4" />
      </Link>
      
      <div className="mt-6 flex items-center gap-4 text-[10px] text-foreground/20 tracking-[0.1em] font-bold relative z-10">
        <span>CORE IS FREE</span>
        <span className="h-1 w-1 rounded-full bg-white/10" />
        <span>SECURE & PRIVATE</span>
        <span className="h-1 w-1 rounded-full bg-white/10" />
        <span>AI-POWERED</span>
      </div>
    </div>
  );
}
