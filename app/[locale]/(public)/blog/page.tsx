import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Startup Validation Guides | aiRoast.app',
  description: 'Frameworks and honest analysis for founders preparing to pitch, recovering from rejection, or stress-testing an idea before building.',
};

const ARTICLES = [
  {
    cluster: 'Investor Prep',
    context: 'investor_prep',
    items: [
      {
        href: '/blog/investor-prep/stress-test-pitch',
        title: 'How to Stress-Test Your Pitch Before the Meeting',
        desc: 'The pre-mortem framework investors use — applied to your pitch before you walk in.',
      },
      {
        href: '/blog/investor-prep/questions-investors-wont-say',
        title: '10 Questions Investors Will Think But Never Ask',
        desc: "What's going through their head while you're presenting.",
      },
      {
        href: '/blog/investor-prep/pre-mortem-template',
        title: 'Pre-Mortem Template for Founders',
        desc: 'A structured template to find your fatal flaws before investors do.',
      },
      {
        href: '/blog/investor-prep/pitch-deck-mistakes',
        title: 'The 7 Pitch Deck Mistakes That Kill Before Slide 3',
        desc: 'Data from 500+ AI-analyzed pitches on what kills deals earliest.',
      },
    ],
  },
  {
    cluster: 'Post-Rejection',
    context: 'post_rejection',
    items: [
      {
        href: '/blog/post-rejection/after-investor-says-no',
        title: 'What to Do in the 24 Hours After an Investor Rejects You',
        desc: 'The debrief process that turns a no into a roadmap.',
      },
      {
        href: '/blog/post-rejection/why-rejected-data',
        title: "Why Investors Actually Say No (It's Not What They Tell You)",
        desc: 'The real reasons behind polite rejections.',
      },
      {
        href: '/blog/post-rejection/debrief-failed-pitch',
        title: 'How to Debrief a Failed Pitch',
        desc: 'A structured template for extracting signal from rejection.',
      },
      {
        href: '/blog/post-rejection/pivot-vs-persist',
        title: 'Pivot vs. Persist: The Framework Investors Use',
        desc: 'How to decide if the idea is broken or just the execution.',
      },
    ],
  },
] as const;

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-20 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/20 text-[#FF4500] mb-6 text-[10px] font-bold tracking-[0.2em] uppercase">
           <BookOpen className="h-4 w-4" /> Founder Resources
        </div>
        <h1 className="font-heading text-6xl md:text-7xl text-[#F5F0E8] mb-6 uppercase tracking-tighter leading-none">
          Startup Validation <span className="text-[#FF4500]">Guides</span>
        </h1>
        <p className="text-[#F5F0E8]/50 text-xl leading-relaxed max-w-2xl font-mono">
          Frameworks and honest analysis for founders preparing to pitch, recovering from rejection, or stress-testing an idea before building.
        </p>
      </header>

      <div className="space-y-20">
        {ARTICLES.map(({ cluster, context, items }) => (
          <section key={cluster}>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-sm tracking-[0.3em] uppercase text-[#FF4500] font-bold">
                {cluster}
              </h2>
              <div className="flex-1 h-px bg-[#2D2D2D]" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D2D2D] border border-[#2D2D2D]">
              {items.map(({ href, title, desc }) => (
                <Link
                  key={href}
                  href={`${href}?context=${context}&source=blog-index`}
                  className="group bg-[#0D0D0D] p-8 hover:bg-[#1A1A1A] transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="text-[#F5F0E8] font-bold text-lg leading-tight group-hover:text-[#FF4500] transition-colors uppercase tracking-tight">
                      {title}
                    </h3>
                    <p className="text-sm text-[#F5F0E8]/40 leading-relaxed font-mono">{desc}</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-[#FF4500] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Read Article <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-32 p-10 border border-[#FF4500]/20 bg-[#1A1A1A] text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF4500]/5 blur-[100px] rounded-full" />
        
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#FF4500] mb-4 font-bold">Skip the theory</p>
        <h2 className="text-3xl font-heading text-[#F5F0E8] mb-6 uppercase tracking-wide">
          Ready to get roasted?
        </h2>
        <p className="text-[#F5F0E8]/50 mb-10 text-sm leading-relaxed max-w-md mx-auto font-mono">
          Get the same analysis applied directly to your pitch. Takes 5 minutes.
        </p>
        <Link
          href="/roast?source=blog-index"
          className="inline-flex items-center gap-3 bg-[#FF4500] text-[#0D0D0D] px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#FF8C00] transition-all"
        >
          Roast My Idea <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
