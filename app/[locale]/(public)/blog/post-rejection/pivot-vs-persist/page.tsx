import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'Pivot vs. Persist: The Framework Investors Use | aiRoast.app',
  description: 'How to decide if your startup idea is broken or just needs a better execution strategy.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Post-Rejection"
      clusterHref="/blog"
      clusterContext="post_rejection"
      title="Pivot vs. Persist: The Framework Investors Use"
      description="How to decide if your startup idea is broken or just needs a better execution strategy."
      readingTime="8 min read"
    >
      <P>
        The hardest decision for a founder is knowing when to stay the course and when to 
        change direction.
      </P>

      <H2>The 3-Signal Test</H2>
      <P>
        Investors look for these three signals to determine if a pivot is necessary:
      </P>
      
      <UL>
        <LI><Strong>Market Pull:</Strong> Are customers trying to use the product in a way you didn't intend?</LI>
        <LI><Strong>Retention:</Strong> Does the small group of people who use it *keep* using it? (If not, the problem might be fundamental.)</LI>
        <LI><Strong>Distribution:</Strong> Is the cost of acquisition (CAC) consistently 3x lower than the lifetime value (LTV)?</LI>
      </UL>

      <Callout label="Reality Check">
        Persistence is a virtue, but stubborness in the face of data is a death sentence. 
        A pivot isn't a failure; it's a sign of a founder who is listening to the market.
      </Callout>

      <H2>When to Pivot</H2>
      <P>
        If you have spent 6 months and have zero customer retention despite "polishing" the UI, 
        it's time to re-evaluate the core problem you are solving.
      </P>

      <Divider />
      
      <ArticleCTA context="post_rejection" source="pivot-vs-persist" />
    </ArticleLayout>
  );
}
