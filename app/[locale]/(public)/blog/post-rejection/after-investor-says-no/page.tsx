import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, Callout, Steps, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'What to Do in the 24 Hours After an Investor Rejects You | aiRoast.app',
  description: 'The process of turning a "No" into a roadmap. How to extract signal from investor rejection.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Post-Rejection"
      clusterHref="/blog"
      clusterContext="post_rejection"
      title="What to Do in the 24 Hours After an Investor Rejects You"
      description="The process of turning a 'No' into a roadmap. How to extract signal from investor rejection."
      readingTime="6 min read"
    >
      <P>
        Rejection is part of the job. But most founders waste the most valuable asset they get from a 
        failed pitch: the feedback (even the unspoken kind).
      </P>

      <H2>The 24-Hour Protocol</H2>
      
      <Steps
        items={[
          {
            title: 'The Immediate Review',
            body: 'Immediately after the call/email, write down every objection they raised while it is fresh.',
          },
          {
            title: 'Filter the Noise',
            body: "Strip away the polite language. If they said 'you're too early,' they might actually mean 'I don't believe your distribution plan.'",
          },
          {
            title: 'Update the FAQ',
            body: 'Add the objections to your internal Q&A. If one person asked it, ten others will think it.',
          },
          {
            title: 'The Pivot/Persist Check',
            body: 'Is this the 10th time you have heard the same objection? If so, the market is telling you something.',
          },
        ]}
      />

      <Callout label="Critical Mindset">
        A "No" is only a failure if you don't learn why it happened. Every rejection should make 
        your next pitch 1% harder to reject.
      </Callout>

      <H2>The Thank You (With a Hook)</H2>
      <P>
        Send a polite follow-up. Don't argue. Ask for one specific thing: "What is the one metric we 
        would need to hit for you to take another look in 6 months?"
      </P>

      <Divider />
      
      <ArticleCTA context="post_rejection" source="after-investor-says-no" />
    </ArticleLayout>
  );
}
