import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, UL, LI, Strong, Callout, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'The 7 Pitch Deck Mistakes That Kill Before Slide 3 | aiRoast.app',
  description: 'Data from over 500 AI-analyzed pitches reveals the most common errors founders make in their first slides.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Investor Prep"
      clusterHref="/blog"
      clusterContext="investor_prep"
      title="The 7 Pitch Deck Mistakes That Kill Before Slide 3"
      description="Data from over 500 AI-analyzed pitches reveals the most common errors founders make in their first slides."
      readingTime="8 min read"
    >
      <P>
        You have about 45 seconds to secure an investor's interest. Most decks fail before the founder 
        even gets to the "How it Works" slide.
      </P>

      <H2>1. The "Buzzword Soup" Intro</H2>
      <P>
        If your first slide uses words like "synergy," "disruptive ecosystem," or "AI-native cloud-based protocol" 
        without explaining what you actually *do*, the investor has already checked out.
      </P>

      <H2>2. The "Everyone is my Customer" TAM</H2>
      <P>
        "There are 8 billion people on Earth, if we get 1%..." No. If you don't have a hyper-specific ICP 
        (Ideal Customer Profile), you don't have a business; you have a wish.
      </P>

      <UL>
        <LI><Strong>Mistake 1:</Strong> Vague problem statements.</LI>
        <LI><Strong>Mistake 2:</Strong> Over-complicating the solution.</LI>
        <LI><Strong>Mistake 3:</Strong> Ignoring the competition.</LI>
        <LI><Strong>Mistake 4:</Strong> No clear distribution strategy.</LI>
        <LI><Strong>Mistake 5:</Strong> Poor design (signaling lack of attention to detail).</LI>
      </UL>

      <Callout label="Reality Check">
        Investors aren't looking for reasons to say yes. They are looking for reasons to say no so they 
        can move on to the next deck. Don't give them an easy one on Slide 1.
      </Callout>

      <Divider />
      
      <ArticleCTA context="investor_prep" source="pitch-deck-mistakes" />
    </ArticleLayout>
  );
}
