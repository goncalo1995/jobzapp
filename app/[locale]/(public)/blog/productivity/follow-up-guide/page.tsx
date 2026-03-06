import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'The Art of the Follow-Up: Stay Top-of-Mind | JobZapp',
  description: 'Templates and strategies for following up after every stage of the hiring process without being a pest.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Productivity"
      clusterHref="/blog"
      clusterContext="productivity"
      title="The Art of the Follow-Up: Stay Top-of-Mind"
      description="Templates and strategies for following up after every stage of the hiring process without being a pest."
      readingTime="7 min read"
    >
      <P>
        Silence is the loudest part of the job search. But most candidates mistake silence for rejection. 
        In reality, recruiters are busy, hiring managers are in meetings, and your application 
        sometimes just needs a gentle nudge to the top of the pile.
      </P>

      <H2>1. The 24-Hour Rule</H2>
      <P>
        Always send a thank-you note within 24 hours of an interview. It shouldn't just be "Thanks for 
        your time." It should reference something specific you discussed. "I really enjoyed our 
        conversation about the new design system—it gave me a great idea for how I could contribute 
        to the team's velocity."
      </P>

      <H2>2. The Value-Add Follow-Up</H2>
      <P>
        If you haven't heard back after the initial "thank you," don't just ask if there's an update. 
        Send something useful. "I saw this article about [industry trend] and thought of our 
        conversation last week." This shows you are engaged and thinking about the company's 
        challenges.
      </P>

      <UL>
        <LI><Strong>Touchpoint 1:</Strong> Post-interview thank you (Immediate).</LI>
        <LI><Strong>Touchpoint 2:</Strong> The 1-week "Checking in" (Tactful).</LI>
        <LI><Strong>Touchpoint 3:</Strong> The 2-week "Value add" (Professional).</LI>
      </UL>

      <Callout label="Keep track">
        Use JobZapp's interaction log to record exactly who you spoke to and when you last followed 
        up. Consistency is what wins offers.
      </Callout>

      <Divider />
      
      <ArticleCTA context="productivity" source="follow-up-guide" />
    </ArticleLayout>
  );
}
