import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: "Why Investors Actually Say No (It's Not What They Tell You) | aiRoast.app",
  description: "Understanding the difference between the 'polite reason' and the 'real reason' for rejection.",
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Post-Rejection"
      clusterHref="/blog"
      clusterContext="post_rejection"
      title="Why Investors Actually Say No"
      description="Understanding the difference between the 'polite reason' and the 'real reason' for rejection."
      readingTime="7 min read"
    >
      <P>
        "You're a bit too early for us" is the "It's not you, it's me" of venture capital. 
        It's rarely the complete truth.
      </P>

      <H2>The Translation Guide</H2>
      
      <UL>
        <LI><Strong>Polite:</Strong> "We need to see more traction." <br/><Strong>Real:</Strong> "Your growth is linear, and I don't see how it becomes exponential."</LI>
        <LI><Strong>Polite:</Strong> "We have a conflict in our portfolio." <br/><Strong>Real:</Strong> "Your competitor is actually better, and I'm betting on them."</LI>
        <LI><Strong>Polite:</Strong> "I'm not sure about the market size." <br/><Strong>Real:</Strong> "I think your TAM is a hallucination and you haven't validated it."</LI>
      </UL>

      <Callout label="Insights">
        Investors rejection often stems from a lack of "Conviction." Conviction isn't built on 
        spreadsheets; it's built on a founder's ability to demonstrate a unique insight into a 
        hard problem.
      </Callout>

      <H2>How to Get the Real Story</H2>
      <P>
        If you have a good relationship with the associate, ask them off the record: 
        "What was the main reason the partners said no?" or "What would you change about the deck 
        before I pitch to [Competitor Fund]?"
      </P>

      <Divider />
      
      <ArticleCTA context="post_rejection" source="why-rejected-data" />
    </ArticleLayout>
  );
}
