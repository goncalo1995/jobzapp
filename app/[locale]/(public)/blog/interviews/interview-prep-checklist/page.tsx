import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, H3, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'The Ultimate Interview Prep Checklist: 7 Days to Mastery | JobZapp',
  description: 'A day-by-day guide to preparing for your next high-stakes interview, from company research to the final follow-up.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Interviews"
      clusterHref="/blog"
      clusterContext="interviews"
      title="The Ultimate Interview Prep Checklist: 7 Days to Mastery"
      description="A day-by-day guide to preparing for your next high-stakes interview, from company research to the final follow-up."
      readingTime="8 min read"
    >
      <P>
        Interviewing is a performance. Like any performance, it requires rehearsals, research, and a clear 
        strategy. This 7-day checklist is designed to take you from "clueless" to "fully prepared" for 
        any modern professional role.
      </P>

      <H3>Day 1: Strategic Research</H3>
      <P>
        Go beyond the "About Us" page. Read their latest funding news, their engineering blog, 
        and check their Glassdoor for common interview patterns. Identify the 3 biggest challenges 
        the company is currently facing.
      </P>

      <H3>Day 2: Mapping Your Experience</H3>
      <P>
        Look at the job description and identify the 5 core competencies they are looking for. 
        Map two "success stories" from your past to each competency using the <Strong>STAR method</Strong> 
        (Situation, Task, Action, Result).
      </P>

      <H3>Day 3: Technical / Craft Deep Dive</H3>
      <P>
        Review the fundamentals of your role. If you are an engineer, practice LeetCode or system design. 
        If you are a manager, review your framework for handling conflict and delivering projects.
      </P>

      <H2>The Final Stretch</H2>
      <P>
        As the interview approaches, shift your focus from learning new things to refining your delivery. 
        Confidence comes from knowing you have the answers ready.
      </P>

      <UL>
        <LI><Strong>Day 4:</Strong> Practice your "Tell me about yourself" pitch until it sounds natural.</LI>
        <LI><Strong>Day 5:</Strong> Prepare 5 thoughtful questions for the interviewer that show you've done your research.</LI>
        <LI><Strong>Day 6:</Strong> Final mock interview. Record yourself and check for filler words.</LI>
        <LI><Strong>Day 7:</Strong> Logistics. Check your internet, background, and prepare your outfit.</LI>
      </UL>

      <Callout label="Pro Tip">
        Always follow up within 2-4 hours of the interview with a personalized note referencing a 
        specific point you discussed. It shows you were engaged and proactive.
      </Callout>

      <Divider />
      
      <ArticleCTA context="interviews" source="interview-prep-checklist" />
    </ArticleLayout>
  );
}
