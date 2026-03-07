import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, H3, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'Timeboxing Your Job Search: Engineering Your Focus | JobZapp',
  description: 'Treat your job search like a project sprint. Learn how timeboxing prevents burnout and increases high-quality output.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Productivity"
      clusterHref="/blog"
      clusterContext="productivity"
      title="Timeboxing Your Job Search: Engineering Your Focus"
      description="Treat your job search like a project sprint. Learn how timeboxing prevents burnout and increases high-quality output."
      readingTime="5 min read"
    >
      <P>
        A job search naturally expands to fill the time available. If you have eight hours to search for jobs, 
        you will spend eight hours scrolling job boards, feeling productive but accomplishing very little. 
        The antidote to this infinite scroll is <Strong>Timeboxing</Strong>.
      </P>

      <H2>The Problem with "Open-Ended" Searching</H2>
      <P>
        When you sit down "to apply for jobs," you lack constraints. This leads to decision fatigue, 
        procrastination via endless research, and ultimately, burnout. Your brain needs clear start 
        and stop conditions.
      </P>

      <H2>Implementing the Timebox</H2>
      <P>
        Instead of browsing aimlessly, allocate strict, non-negotiable blocks of time to specific tasks. 
        Once the timer rings, you stop. No exceptions.
      </P>

      <H3>The 3-Hour Daily Sprint Protocol</H3>
      <UL>
        <LI><Strong>Block 1 (45 mins): Discovery.</Strong> Identify and save 5-10 high-quality roles. Do not apply yet. Just source.</LI>
        <LI><Strong>Block 2 (90 mins): Deep Work Output.</Strong> Tailor your CV and write cover letters for the top 3 roles found during discovery. Apply.</LI>
        <LI><Strong>Block 3 (45 mins): Networking & Follow-up.</Strong> Send cold outreaches on LinkedIn, update your trackers, and reply to emails.</LI>
      </UL>

      <Callout label="Insight">
        By limiting discovery to 45 minutes, you force yourself to quickly judge what is worth your time 
        and what isn't. The constraint breeds quality.
      </Callout>

      <H2>Track Output, Not Time</H2>
      <P>
        At the end of the day, measure your success by actions taken, not hours spent staring at a screen. 
        Did you send 3 tailored applications? Did you reach out to 2 hiring managers? If yes, the day 
        was a success, even if it only took two hours. Close your laptop and recharge.
      </P>

      <Divider />
      
      <ArticleCTA context="productivity" source="time-blocking-job-search" />
    </ArticleLayout>
  );
}
