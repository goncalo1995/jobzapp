"use client"

import { Link } from '@/i18n/navigation';
import { Flame, ArrowRight } from 'lucide-react';

interface ArticleCTAProps {
  context: string;
  source: string;
}

export function ArticleCTA({ context, source }: ArticleCTAProps) {
  return (
    <div className="mt-20 p-8 border border-[#FF4500]/20 bg-[#1A1A1A] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Flame className="h-24 w-24" />
      </div>
      
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#FF4500] mb-4 font-bold relative z-10">
        Stop guessing. Start knowing.
      </p>
      
      <h3 className="text-2xl font-heading text-[#F5F0E8] mb-4 uppercase tracking-wide relative z-10">
        Apply this analysis to your pitch
      </h3>
      
      <p className="text-[#F5F0E8]/50 text-sm leading-relaxed mb-8 font-mono relative z-10">
        Our AI runs Pre-Mortem, Fermi, and Inversion models on your specific idea. 
        You get a structured teardown of every assumption you're making.
      </p>

      <Link 
        href={`/roast?context=${context}&source=${source}`}
        className="inline-flex items-center gap-3 bg-[#FF4500] text-[#0D0D0D] px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#FF8C00] transition-all relative z-10"
      >
        Run Analysis <ArrowRight className="h-4 w-4" />
      </Link>
      
      <div className="mt-6 flex items-center gap-4 text-[10px] text-[#F5F0E8]/20 tracking-[0.1em] font-bold relative z-10">
        <span>€2.99 ONE-TIME</span>
        <span className="h-1 w-1 rounded-full bg-white/10" />
        <span>NO ACCOUNT REQUIRED</span>
        <span className="h-1 w-1 rounded-full bg-white/10" />
        <span>INSTANT PDF</span>
      </div>
    </div>
  );
}
