// app/[locale]/(public)/page.tsx
'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Zap, Target, BookOpen, ShieldCheck, Sparkles, Rocket, Clock, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('Pages.home');

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Hero Section */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center text-center gap-10 relative">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.3em] uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="h-4 w-4" /> {t('tagline')}
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-heading font-black uppercase tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Stop tracking in <br/>
          <span className="text-primary italic relative drop-shadow-[0_0_15px_rgba(0,69,255,0.3)]">
            spreadsheets
            <div className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 -rotate-1 -z-10" />
          </span>.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          {t('description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Link 
            href="/dashboard"
            className="px-10 py-6 bg-primary text-primary-foreground text-lg uppercase tracking-[0.2em] font-black hover:bg-primary/90 transition-all flex items-center justify-center gap-4 group rounded-2xl shadow-[0_20px_40px_rgba(0,69,255,0.3)] hover:shadow-[0_25px_60px_rgba(0,69,255,0.4)] transform hover:-translate-y-1.5 active:translate-y-0"
          >
            Get Started Free <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link 
            href="/blog"
            className="px-10 py-6 bg-secondary/10 border border-border text-foreground text-lg uppercase tracking-[0.2em] font-black hover:bg-secondary/20 transition-all flex items-center justify-center gap-4 group rounded-2xl backdrop-blur-sm"
          >
            Read the Blog <BookOpen className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        {/* Floating Badges */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"><CheckCircle2 className="h-4 w-4" /> AI Optimized</div>
           <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"><Clock className="h-4 w-4" /> High Speed</div>
           <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"><ShieldCheck className="h-4 w-4" /> Privacy First</div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="w-full bg-secondary/5 border-y border-border py-32 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <header className="mb-20 text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tight">Everything you need to <span className="text-primary italic">win</span>.</h2>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto italic leading-relaxed font-mono text-sm uppercase tracking-widest">"{t('aboutDescription')}"</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-10 bg-background border border-border/50 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                {t('features.tracking.title')}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">
                {t('features.tracking.description')}
              </p>
            </div>

            <div className="group p-10 bg-background border border-border/50 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Rocket className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                {t('features.cv.title')}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">
                {t('features.cv.description')}
              </p>
            </div>

            <div className="group p-10 bg-background border border-border/50 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                {t('features.prep.title')}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">
                {t('features.prep.description')}
              </p>
            </div>

            {/* Added Features */}
            <div className="group p-10 bg-background border border-border/50 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ArrowRight className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                {t('features.analytics.title')}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">
                {t('features.analytics.description')}
              </p>
            </div>

            <div className="group p-10 bg-background border border-border/50 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                {t('features.automation.title')}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">
                {t('features.automation.description')}
              </p>
            </div>

            <div className="group p-10 bg-background border border-border/50 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                {t('features.calendar.title')}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">
                {t('features.calendar.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="w-full py-40 bg-background">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
           <header className="mb-20 text-center">
             <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Pricing</div>
             <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight mb-6 leading-none">
               Simple, transparent <span className="text-primary italic">pricing</span>.
             </h2>
             <p className="text-muted-foreground font-medium leading-relaxed max-w-xl mx-auto italic text-sm">
                From a generous free tier to absolute professional dominance. Find the plan that fits your ambition.
             </p>
           </header>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
              <div className="p-8 bg-secondary/5 border border-border/50 rounded-3xl flex flex-col items-center text-center">
                 <h4 className="text-xl font-heading font-black uppercase tracking-tight mb-2">Starter</h4>
                 <div className="text-3xl font-heading font-black mb-4">$0</div>
                 <p className="text-xs text-muted-foreground italic mb-6">Good enough for daily tracking. Up to 10 active interviews. AI available via Top-ups.</p>
                 <div className="text-xs font-bold uppercase tracking-widest text-primary opacity-60">Free Forever</div>
              </div>
              <div className="p-8 bg-primary/5 border border-primary/30 rounded-3xl flex flex-col items-center text-center relative overflow-hidden transform md:-translate-y-4 shadow-[0_20px_40px_rgba(0,69,255,0.1)]">
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
                 <h4 className="text-xl font-heading font-black uppercase tracking-tight mb-2 text-primary">Accelerator</h4>
                 <div className="text-3xl font-heading font-black mb-4 text-primary">$15<span className="text-sm text-muted-foreground font-mono">/1mo pass</span></div>
                 <p className="text-xs text-muted-foreground italic mb-6">No subscriptions. Buy time-passes for seamless AI Copilot, unlimited interviews, and BYOK support.</p>
                 <div className="text-xs font-bold uppercase tracking-widest text-primary">Most Popular</div>
              </div>
              <div className="p-8 bg-secondary/5 border border-border/50 rounded-3xl flex flex-col items-center text-center">
                 <h4 className="text-xl font-heading font-black uppercase tracking-tight mb-2">Elite</h4>
                 <div className="text-3xl font-heading font-black mb-4">$49<span className="text-sm text-muted-foreground font-mono">/mo</span></div>
                 <p className="text-xs text-muted-foreground italic mb-6">Ultimate edge. Premium models, Priority support, 1-on-1 coaching.</p>
                 <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full">Waitlist</div>
              </div>
           </div>

           <Link 
             href="/pricing"
             className="px-10 py-5 bg-background border border-border text-foreground text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-secondary/20 transition-all flex items-center gap-3"
           >
             Compare All Plans <ArrowRight className="h-4 w-4" />
           </Link>
        </div>
      </section>

      {/* Why JobZapp */}
      <section className="w-full py-32 bg-secondary/10 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight leading-none">
                Built for <br/><span className="text-primary italic">Professionals</span>.
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl">
                We didn't build another spreadsheet. We built a high-performance engine to accelerate your career. No ads, no fluff, just speed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                <div className="space-y-2">
                   <div className="h-1 text-primary w-12 rounded-full mb-4" />
                   <h4 className="font-heading font-black uppercase tracking-tight">Zero Bloat</h4>
                   <p className="text-xs text-muted-foreground">Lightning fast navigation and instant updates.</p>
                </div>
                <div className="space-y-2">
                   <div className="h-1 text-primary w-12 rounded-full mb-4" />
                   <h4 className="font-heading font-black uppercase tracking-tight">Private & Secure</h4>
                   <p className="text-xs text-muted-foreground">Your career data is and will always be private.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
               {/* Visual metaphor for speed */}
               <div className="relative p-12 bg-background border border-border rounded-[40px] shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="space-y-6 relative z-10">
                     <div className="flex items-center gap-4 border-b border-border pb-6">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black italic">!</div>
                        <div className="flex-1">
                           <div className="h-2 w-32 bg-secondary rounded-full mb-2" />
                           <div className="h-2 w-20 bg-secondary/50 rounded-full" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="h-3 w-full bg-secondary/20 rounded-full" />
                        <div className="h-3 w-4/5 bg-secondary/20 rounded-full" />
                        <div className="h-3 w-3/5 bg-secondary/20 rounded-full" />
                     </div>
                     <div className="pt-6 flex justify-end">
                        <div className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">Accelerated</div>
                     </div>
                  </div>
                  {/* Motion lines */}
                  <div className="absolute top-1/4 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent to-primary/30 translate-x-32 group-hover:-translate-x-full transition-transform duration-1000" />
                  <div className="absolute top-1/2 right-0 w-48 h-[1px] bg-gradient-to-r from-transparent to-primary/30 translate-x-32 group-hover:-translate-x-full transition-transform duration-700 delay-100" />
                  <div className="absolute top-3/4 right-0 w-24 h-[1px] bg-gradient-to-r from-transparent to-primary/30 translate-x-32 group-hover:-translate-x-full transition-transform duration-1000 delay-200" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="w-full py-40 bg-background overflow-hidden relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Resources</div>
              <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight leading-none">
                Popular <span className="text-primary italic">Articles</span>.
              </h2>
            </div>
            <Link 
              href="/blog"
              className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              See all resources <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Getting a Job in 2026",
                desc: "The precision protocol for the modern job market.",
                href: "/blog/tips/getting-a-job-2026",
                tag: "Strategy"
              },
              {
                title: "Interview Prep Checklist",
                desc: "A 7-day guide to mastering high-stakes screens.",
                href: "/blog/interviews/interview-prep-checklist",
                tag: "Preparation"
              },
              {
                title: "Why Excel Fails",
                desc: "Why spreadsheets are holding your career back.",
                href: "/blog/tips/why-excel-fails",
                tag: "Insights"
              }
            ].map((article, i) => (
              <Link 
                key={article.href}
                href={article.href}
                className="group p-10 bg-secondary/5 border border-border/50 rounded-[32px] hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col justify-between aspect-square md:aspect-[4/5] lg:aspect-square"
              >
                <div className="space-y-6">
                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black tracking-widest uppercase inline-block">
                    {article.tag}
                  </div>
                  <h3 className="text-2xl font-heading font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium italic leading-relaxed">
                    {article.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pt-8">
                  Read Article <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-40">
        <div className="relative p-12 md:p-20 bg-primary rounded-[40px] overflow-hidden text-center flex flex-col items-center shadow-[0_40px_100px_rgba(0,69,255,0.2)]">
          {/* Visual fluff */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-black/10 blur-[100px] rounded-full" />
          
          <h2 className="text-4xl md:text-6xl font-heading font-black text-primary-foreground uppercase tracking-tight leading-none mb-8 relative z-10">
            Ready to accelerate <br/> your search?
          </h2>
          <p className="text-primary-foreground/80 font-medium text-lg md:text-xl max-w-xl mb-12 relative z-10">
            Join thousands of professionals using JobZapp to land their next role with precision and speed.
          </p>
          <Link 
            href="/dashboard"
            className="px-12 py-6 bg-white text-primary text-lg uppercase tracking-[0.2em] font-black hover:bg-white/90 transition-all flex items-center justify-center gap-4 group rounded-2xl relative z-10"
          >
            Get Started Now <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
