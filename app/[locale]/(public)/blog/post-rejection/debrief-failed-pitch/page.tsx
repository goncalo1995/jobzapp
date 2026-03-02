import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, Callout, Steps, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'How to Debrief a Failed Pitch | aiRoast.app',
  description: 'A structured template for extracting signal from rejection. Don’t waste your failures.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Post-Rejection"
      clusterHref="/blog"
      clusterContext="post_rejection"
      title="How to Debrief a Failed Pitch"
      description="A structured template for extracting signal from rejection. Don’t waste your failures."
      readingTime="5 min read"
    >
      <P>
        A pitch shouldn't just be an attempt to get money; it's a high-bandwidth testing session 
        for your business thesis.
      </P>

      <H2>The Post-Game Analysis</H2>
      
      <Steps
        items={[
          {
            title: 'The Objection List',
            body: 'What was the specific point where the investor stopped nodding and started looking at their watch?',
          },
          {
            title: 'Knowledge Gaps',
            body: 'Did they ask for a number you didn’t have? That’s a signal you don’t know your business well enough.',
          },
          {
            title: 'The Pattern Match',
            body: 'Are multiple investors asking the same "boring" question? If so, your deck isn’t answering it clearly enough.',
          },
        ]}
      />

      <Callout label="Pro Tip">
        Record your pitches (if on Zoom) or have a co-founder take notes specifically on the 
        investor's body language and the *timing* of their questions.
      </Callout>

      <Divider />
      
      <ArticleCTA context="post_rejection" source="debrief-failed-pitch" />
    </ArticleLayout>
  );
}
