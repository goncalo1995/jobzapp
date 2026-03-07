import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'Cover Letters: How to Write One That Actually Gets Read | JobZapp',
  description: 'Most cover letters are ignored. Learn the 3-paragraph formula that catches a human eye and gets you the interview.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Tips"
      clusterHref="/blog"
      clusterContext="tips"
      title="Cover Letters: How to Write One That Actually Gets Read"
      description="Most cover letters are ignored. Learn the 3-paragraph formula that catches a human eye and gets you the interview."
      readingTime="5 min read"
    >
      <P>
        The biggest myth in hiring is that "nobody reads cover letters." While recruiters might skim 
        them, a well-written letter is often what tips the scale when two candidates have similar 
        technical skills. The key is to avoid the generic "I am writing to express my interest..." template.
      </P>

      <H2>The 3-Paragraph Formula</H2>
      
      <Strong>Paragraph 1: The Hook</Strong>
      <P>
        Start with a specific achievement or a genuine connection to the company's mission. 
        "I've been using JobZapp to manage my own career for two years, and I've seen firsthand 
        how it solves the spreadsheet chaos problem."
      </P>

      <Strong>Paragraph 2: The Solution</Strong>
      <P>
        Focus on how you can solve their current problems. Don't just list your skills; explain 
        how those skills translate into ROI for them. "In my previous role, I reduced churn by 15% 
        using precisely the kind of data-driven approach your team is currently implementing."
      </P>

      <Strong>Paragraph 3: The Close</Strong>
      <P>
        Keep it professional and confident. Suggest a specific next step. "I'd love to show you 
        how my background in AI-driven tools can help JobZapp scale its user base this year."
      </P>

      <UL>
        <LI><Strong>Tip:</Strong> Keep it under 250 words.</LI>
        <LI><Strong>Tip:</Strong> Match the company's voice. If they are formal, be formal. If they are a fast-paced startup, be punchy.</LI>
        <LI><Strong>Tip:</Strong> Never repeat what's already on your resume. Use the cover letter to add color and context.</LI>
      </UL>

      <Callout label="Warning">
        If you're using AI to write your cover letter, make sure you edit it. Recruiter-side AI 
        is getting very good at spotting "typical LLM prose." Add your own voice to stay human.
      </Callout>

      <Divider />
      
      <ArticleCTA context="tips" source="cover-letter-tips" />
    </ArticleLayout>
  );
}
