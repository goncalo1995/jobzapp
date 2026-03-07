import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Job Search Guides & Career Tips | JobZapp',
  description: 'Master your job search with frameworks for interviews, productivity hacks, and modern job tracking strategies.',
};

const ARTICLES = [
  {
    cluster: 'Interviews',
    context: 'interviews',
    items: [
      {
        href: '/blog/interviews/technical-screen-tips',
        title: 'Mastering the Technical Screen: 5 Strategies to Stand Out',
        desc: 'Learn how to communicate your thought process and solve complex problems during high-pressure technical interviews.',
      },
      {
        href: '/blog/interviews/interview-prep-checklist',
        title: 'The Ultimate Interview Prep Checklist: 7 Days to Mastery',
        desc: 'A day-by-day guide to preparing for your next high-stakes interview, from company research to the final follow-up.',
      }
    ],
  },
  {
    cluster: 'Tips',
    context: 'tips',
    items: [
      {
        href: '/blog/tips/getting-a-job-2026',
        title: 'Getting a Job in 2026: The Precision Protocol',
        desc: 'In 2026, volume is noise. Learn how to use precision-targeting and AI-driven workflows to land your next role.',
      },
      {
        href: '/blog/tips/salary-negotiation-2026',
        title: 'Salary Negotiation in 2026: Data-Driven and Confident',
        desc: 'Learn how to approach salary negotiations with hard data and confidence without burning bridges.',
      },
      {
        href: '/blog/tips/cover-letter-tips',
        title: 'Cover Letters: How to Write One That Actually Gets Read',
        desc: 'Most cover letters are ignored. Learn the 3-paragraph formula that catches a human eye and gets you the interview.',
      },
      {
        href: '/blog/tips/why-excel-fails',
        title: 'Why Your Job Search Spreadsheet is Holding You Back',
        desc: 'Spreadsheets are great for data, but terrible for momentum. Discover why a dedicated job tracker is the secret weapon of successful candidates.',
      },
    ],
  },
  {
    cluster: 'Productivity',
    context: 'productivity',
    items: [
      {
        href: '/blog/productivity/time-blocking-job-search',
        title: 'Timeboxing Your Job Search: Engineering Your Focus',
        desc: 'Treat your job search like a project sprint. Learn how timeboxing prevents burnout and increases high-quality output.',
      },
      {
        href: '/blog/productivity/follow-up-guide',
        title: 'The Art of the Follow-Up: Stay Top-of-Mind',
        desc: 'Templates and strategies for following up after every stage of the hiring process without being a pest.',
      },
    ],
  },
] as const;

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-20 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 text-[10px] font-bold tracking-[0.2em] uppercase">
           <BookOpen className="h-4 w-4" /> Career Resources
        </div>
        <h1 className="font-heading text-6xl md:text-7xl text-foreground mb-6 uppercase tracking-tighter leading-none">
          Job Search <span className="text-primary">Guides</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl font-mono">
          Master your job search with frameworks for technical interviews, productivity hacks, and modern job tracking strategies.
        </p>
      </header>

      <div className="space-y-20">
        {ARTICLES.map(({ cluster, context, items }) => (
          <section key={cluster}>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-sm tracking-[0.3em] uppercase text-primary font-bold">
                {cluster}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
              {items.map(({ href, title, desc }) => (
                <Link
                  key={href}
                  href={`${href}?context=${context}&source=blog-index`}
                  className="group bg-background p-8 hover:bg-secondary/20 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="text-foreground font-bold text-lg leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">{desc}</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Read Article <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-32 p-10 border border-primary/20 bg-secondary/10 rounded-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        
        <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4 font-bold">Stop the spreadsheet madness</p>
        <h2 className="text-3xl font-heading text-foreground mb-6 uppercase tracking-wide">
          Ready to track like a pro?
        </h2>
        <p className="text-muted-foreground mb-10 text-sm leading-relaxed max-w-md mx-auto font-mono">
          Centralize your applications, interviews, and CVs in one place. Start for free today.
        </p>
        <Link
          href="/auth/signup?source=blog-index"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-primary/90 transition-all rounded-lg"
        >
          Get Started <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
