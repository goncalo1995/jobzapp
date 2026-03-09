export const dynamic = 'force-static';

import { getTranslations } from 'next-intl/server';
import { Check, Sparkles, ArrowRight, Zap, Target, BookOpen, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { WaitlistButton } from '@/components/waitlist-button';

type PricingParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: PricingParams }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.pricing' });

  return {
    title: `${t('title')} | JobZapp`,
    description: t('subtitle'),
  };
}

export default async function PricingPage() {
  const t = await getTranslations('Pages.pricing');

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-24 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <header className="text-center mb-20 space-y-6 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter leading-none">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
            "{t('subtitle')}"
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Starter Tier */}
          <div className="relative group p-8 lg:p-10 bg-secondary/5 border border-border rounded-[32px] flex flex-col justify-between hover:border-primary/50 transition-all duration-500">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Starter</span>
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-heading font-black mb-4">$0<span className="text-lg text-muted-foreground font-mono">/mo</span></div>
              <p className="text-xs text-muted-foreground italic mb-8 h-8">Good enough for daily tracking. Earn AI credits by sharing.</p>
              
              <div className="space-y-4 mb-12">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-50">Core Features</div>
                {[
                  "Unlimited Job Tracking",
                  "Basic CV Storage",
                  "Interview Stage Logs",
                  "Standard Dashboard"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Link 
              href="/dashboard"
              className="w-full py-5 bg-foreground text-background text-center text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-foreground/90 transition-all"
            >
              Start Free
            </Link>
          </div>

          {/* Accelerator Tier (Most Popular) */}
          <div className="relative group p-8 lg:p-10 bg-primary/5 border-2 border-primary/30 rounded-[32px] flex flex-col justify-between overflow-hidden transform md:-translate-y-4 shadow-[0_20px_40px_rgba(0,69,255,0.1)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            <div className="absolute top-0 right-0 p-4">
               <div className="bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Accelerator</span>
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-heading font-black mb-4 text-primary">$15<span className="text-lg text-muted-foreground font-mono">/mo</span></div>
              <p className="text-xs text-muted-foreground italic mb-8 h-8">The sweet spot. AI Copilot, unlimited storage, and advanced insights.</p>
              
              <div className="space-y-4 mb-12">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-50">Everything in Starter, plus:</div>
                {[
                  "AI CV Tailoring",
                  "AI Mock Interviews",
                  "Smart Company Research",
                  "Advanced Analytics"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="w-full py-5 bg-primary text-primary-foreground text-center text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all shadow-[0_10px_30px_rgba(0,69,255,0.3)] flex items-center justify-center gap-2 group"
            >
              Upgrade Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Elite Tier (Waitlist) */}
          <div className="relative group p-8 lg:p-10 bg-secondary/5 border border-border rounded-[32px] flex flex-col justify-between hover:border-primary/50 transition-all duration-500">
            <div className="absolute top-0 right-0 p-4">
               <div className="bg-secondary text-muted-foreground text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Waitlist</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Elite</span>
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-heading font-black mb-4">$49<span className="text-lg text-muted-foreground font-mono">/mo</span></div>
              <p className="text-xs text-muted-foreground italic mb-8 h-8">Ultimate edge. Premium models, Priority support, 1-on-1 coaching.</p>
              
              <div className="space-y-4 mb-12">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-50">Everything in Accelerator, plus:</div>
                {[
                  "1-on-1 Strategy Review",
                  "Unlimited Premium Models",
                  "Priority Email Support",
                  "Early Feature Access"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 opacity-50" />
                    <span className="text-sm font-medium leading-tight opacity-70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <WaitlistButton />
          </div>
        </div>

        {/* Info text */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-border pt-20">
          <div className="space-y-4">
             <ShieldCheck className="h-8 w-8 text-primary" />
             <h4 className="font-heading font-black uppercase tracking-tight">Your Data is Yours</h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               Core tracking features will always remain free. We don't sell your data to recruiters, and your OpenRouter API keys are stored only in your browser.
             </p>
          </div>
          <div className="space-y-4">
             <BookOpen className="h-8 w-8 text-primary" />
             <h4 className="font-heading font-black uppercase tracking-tight">Open Roadmap</h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               We're building JobZapp in the open. Our new credit-based AI Copilot lets you pay only for exactly what you use.
             </p>
          </div>
          <div className="space-y-4">
             <Zap className="h-8 w-8 text-primary" />
             <h4 className="font-heading font-black uppercase tracking-tight">High Speed</h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               Optimized for professionals who value their time. Maximum efficiency, zero bloat. Bring your own key for limitless automated edge testing.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
