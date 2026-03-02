import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: '10 Questions Investors Will Think But Never Ask | aiRoast.app',
  description: "What's going through an investor's head while you're presenting? Hint: It's usually about risk and distribution.",
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Investor Prep"
      clusterHref="/blog"
      clusterContext="investor_prep"
      title="10 Questions Investors Will Think But Never Ask"
      description="What's going through an investor's head while you're presenting? Hint: It's usually about risk and distribution."
      readingTime="6 min read"
    >
      <P>
        Investors are polite by default. They want to maintain proprietary deal flow, which means they 
        can't afford to be known as "the person who was mean to a founder." But being polite doesn't 
        mean they aren't skeptical.
      </P>

      <H2>The Silent Objections</H2>
      <P>
        Here are 10 questions that sit behind the polite smiles and "that's interesting" comments:
      </P>
      
      <UL>
        <LI><Strong>Why won't Google/Amazon/Meta just build this?</Strong> (They don't care about your tech; they care about your distribution.)</LI>
        <LI><Strong>Is this a feature or a company?</Strong> (A feature is something that belongs in a larger product.)</LI>
        <LI><Strong>Why hasn't this worked before?</Strong> (The "graveyard check" for your industry.)</LI>
        <LI><Strong>Is the founder actually technical or just playing building blocks with APIs?</Strong></LI>
        <LI><Strong>How long can they survive if the next round takes 12 months?</Strong></LI>
        <LI><Strong>Is this a 'vitamin' or a 'painkiller'?</Strong></LI>
        <LI><Strong>Will I be ashamed to pitch this to my partners?</Strong></LI>
        <LI><Strong>Is the TAM real or a '1% of China' hallucination?</Strong></LI>
        <LI><Strong>What happens if their main distribution channel changes an algorithm?</Strong></LI>
        <LI><Strong>Do they have a secret or just a plan?</Strong></LI>
      </UL>

      <Callout label="Founder Tip">
        If you address these questions *before* they are asked, you signal a level of self-awareness that 
        separates you from 95% of other founders.
      </Callout>

      <H2>Breaking the Signal</H2>
      <P>
        The best way to answer these is through evidence, not words. If you show a 0% churn rate over 6 months, 
        the "feature vs. company" question dies automatically.
      </P>

      <Divider />
      
      <ArticleCTA context="investor_prep" source="questions-investors-wont-say" />
    </ArticleLayout>
  );
}
