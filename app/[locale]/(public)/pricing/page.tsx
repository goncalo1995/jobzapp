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
              <p className="text-xs text-muted-foreground italic mb-8 h-8">Good enough for daily tracking. AI features available via one-off top-ups or earn credits by sharing.</p>
              
              <div className="space-y-4 mb-12">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-50">Core Capabilities</div>
                {[
                  "Unlimited Job Tracking",
                  "Basic CV Storage",
                  "Max 10 Active Interviews",
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
               <div className="bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">One-Time Passes</div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Accelerator</span>
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl lg:text-5xl font-heading font-black mb-2 text-primary">
                  $15<span className="text-lg text-muted-foreground font-mono">/mo</span>
                </div>
                <div className="flex flex-col gap-1 text-xs font-mono font-bold text-muted-foreground">
                   <span>+350 AI Credits Included</span>
                   <span className="mt-2 text-sm">$35/3mo (+1250 AI Credits)</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic mb-8 h-8">No subscriptions. Buy time-passes for seamless AI Copilot, unlimited interviews, and BYOK support.</p>
              
              <div className="space-y-4 mb-12">
                 <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-50">Unlocked Features:</div>
                {[
                  "Unlimited Active Interviews",
                  "Bring-Your-Own-Key (BYOK)",
                  "AI CV Tailoring & Mock Interviews",
                  "Advanced Analytics"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Link 
                href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_ACCELERATOR_1_MONTH || ''}`}
                className="w-full py-4 bg-primary text-primary-foreground text-center text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all shadow-[0_10px_30px_rgba(0,69,255,0.3)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                Buy 1 Month Pass <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
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
        {/* Credit Estimation Section */}
        <div className="mt-24 max-w-3xl w-full mx-auto text-center space-y-6 bg-secondary/10 p-8 rounded-3xl border border-border">
           <h3 className="text-2xl font-heading font-black tracking-tight flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              How AI Credits Work
           </h3>
           <p className="text-muted-foreground text-sm leading-relaxed">
              We charge based on usage so you only pay for what you actually use. 
              The amount of credits used per action depends on the underlying AI model's complexity and context length.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-left mt-6">
              <div className="bg-background p-4 rounded-xl border border-border">
                 <div className="font-bold mb-2 text-primary">Estimated Costs:</div>
                 <ul className="space-y-2 text-muted-foreground">
                    <li className="flex justify-between border-b border-border/50 pb-1"><span>Resume Tailoring</span> <span className="font-mono font-bold text-foreground">~5-15 credits</span></li>
                    <li className="flex justify-between border-b border-border/50 pb-1"><span>Interview Prep Gen</span> <span className="font-mono font-bold text-foreground">~5-10 credits</span></li>
                    <li className="flex justify-between"><span>Bullet Point Rewrite</span> <span className="font-mono font-bold text-foreground">~1-3 credits</span></li>
                 </ul>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                 <div className="font-bold mb-2 text-primary">Need more credits?</div>
                 <p className="text-muted-foreground mb-4 text-xs">
                    If you run out of credits from your Accelerator pass, you can buy instant top-ups from your dashboard at any time or earn 5 credits for every friend you refer.
                 </p>
                 <div className="text-foreground font-black text-lg bg-secondary/20 py-2 px-3 rounded-md text-center">€5 Top-Up = 100 Credits</div>
              </div>
           </div>
        </div>

        {/* Add on Section */}
        <div className="mt-12 w-full max-w-5xl">
           <div className="p-8 bg-secondary/10 border border-border rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                 <h4 className="font-heading font-black uppercase tracking-tight text-xl mb-2">Need more AI power?</h4>
                 <p className="text-sm text-muted-foreground italic">Top-up your account with one-off credit packs. Available for all users.</p>
              </div>
              <Link 
                href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_TOPUP_50 || ''}`}
                className="px-8 py-4 bg-background border border-border hover:bg-secondary/20 transition-all rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shrink-0"
              >
                Buy Credits <ArrowRight className="h-3 w-3" />
              </Link>
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
