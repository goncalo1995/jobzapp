import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'Why Your Job Search Spreadsheet is Holding You Back | JobZapp',
  description: 'Spreadsheets are great for data, but terrible for momentum. Discover why a dedicated job tracker is the secret weapon of successful candidates.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Tips"
      clusterHref="/blog"
      clusterContext="tips"
      title="Why Your Job Search Spreadsheet is Holding You Back"
      description="Spreadsheets are great for data, but terrible for momentum. Discover why a dedicated job tracker is the secret weapon of successful candidates."
      readingTime="5 min read"
    >
      <P>
        We've all done it. A column for "Company," another for "Status," and a notes field that 
        starts small but ends up a disorganized mess of dates and names. But when you're applying to 
        30+ roles, the spreadsheet becomes a chores list, not a strategy.
      </P>

      <H2>1. Static Data vs. Active Reminders</H2>
      <P>
        A spreadsheet doesn't tell you that you haven't followed up on that interview from Tuesday. 
        It doesn't alert you that a deadline is approaching. It just sits there, waiting for you 
        to manually update it—which, let's be honest, you eventually stop doing accurately.
      </P>

      <H2>2. The Resume Matching Problem</H2>
      <P>
        In a spreadsheet, you can't easily see which version of your CV you sent to which company. 
        When you get that unexpected call for a screen, hunting through your "Downloads" folder 
        while trying to sound professional is a recipe for stress.
      </P>

      <UL>
        <LI><Strong>Problem:</Strong> Lack of automated reminders.</LI>
        <LI><Strong>Problem:</Strong> Disconnected files (CVs, cover letters, portfolios).</LI>
        <LI><Strong>Problem:</Strong> Zero insights into what's actually working in your funnel.</LI>
      </UL>

      <Callout label="The JobZapp Advantage">
        JobZapp centralizes your contacts, interviews, and CVs in one dynamic dashboard. It's not 
        just a record; it's a workflow engine for your career.
      </Callout>

      <Divider />
      
      <ArticleCTA context="tips" source="why-excel-fails" />
    </ArticleLayout>
  );
}
