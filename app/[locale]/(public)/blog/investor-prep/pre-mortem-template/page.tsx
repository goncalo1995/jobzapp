import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, Callout, Steps, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'Pre-Mortem Template for Founders | aiRoast.app',
  description: 'A structured template to help you find your startup fatal flaws before investors or the market does.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Investor Prep"
      clusterHref="/blog"
      clusterContext="investor_prep"
      title="Pre-Mortem Template for Founders"
      description="A structured template to help you find your startup fatal flaws before investors or the market does."
      readingTime="5 min read"
    >
      <P>
        Optimism is a founder's greatest asset, but also their most dangerous blind spot. 
        A pre-mortem is the process of intentionally looking for why you will fail.
      </P>

      <H2>The 15-Minute Framework</H2>
      <P>
        Run this exercise with your co-founders once a month. Use this specific sequence:
      </P>
      
      <Steps
        items={[
          {
            title: 'Establish the Failure',
            body: 'Assume it is 12 months from now and the company is dead. You have €0 in the bank and no remaining customers.',
          },
          {
            title: 'Individual Brainstorm',
            body: 'Spend 5 minutes writing down every possible reason for failure. No idea is too small or too "unlikely".',
          },
          {
            title: 'The Truth Map',
            body: 'Group the reasons into Market, Team, Product, and Distribution categories.',
          },
          {
            title: 'The Mitigation Plan',
            body: 'Identify the top 3 risks and assign a specific action to mitigate them in the next 30 days.',
          },
        ]}
      />

      <Callout label="Key Insight">
        The goal isn't to be pessimistic; it's to be prepared. If you know the 3 things that could kill you, 
        you can stop them. If you don't know them, they'll hit you when it's too late.
      </Callout>

      <H2>Common Categories</H2>
      <P>
        Most startups fail for one of these reasons:
      </P>
      <P>
        - High CAC that doesn't scale.
        <br />- Building a product nobody actually wants to pay for.
        <br />- Running out of cash before hitting the next milestone.
      </P>

      <Divider />
      
      <ArticleCTA context="investor_prep" source="pre-mortem-template" />
    </ArticleLayout>
  );
}
