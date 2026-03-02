import type { Metadata } from 'next';
import { ArticleLayout } from '@/components/article-layout';
import { ArticleCTA } from '@/components/article-cta';
import { H2, P, UL, LI, Callout, Steps, Divider } from '@/components/prose';

export const metadata: Metadata = {
  title: 'How to Stress-Test Your Pitch Before the Investor Meeting | aiRoast.app',
  description: 'Most founders walk into investor meetings with untested assumptions. The pre-mortem method finds the holes before they do.',
};

export default function Page() {
  return (
    <ArticleLayout
      cluster="Investor Prep"
      clusterHref="/blog"
      clusterContext="investor_prep"
      title="How to Stress-Test Your Pitch Before the Meeting"
      description="Most founders walk into investor meetings with untested assumptions. The pre-mortem method finds the holes before they do."
      readingTime="7 min read"
    >
      <P>
        You've rehearsed the deck. You know the numbers. You've practised the answer to "what's your moat?" 
        But there's a category of question investors ask that most founders have never thought about — 
        and it's not on any pitch prep checklist.
      </P>

      <H2>Why Preparation Usually Fails</H2>
      <P>
        Most pitch prep is defensive. You anticipate the questions you've been asked before and polish the answers. 
        The problem: investors aren't asking the questions you expect. They're probing the assumptions underneath your answers.
      </P>
      <Callout label="The pattern">
        You say "our TAM is €2B." They hear "has this founder done a real Fermi estimate or are they using a Gartner report as a shield?"
      </Callout>

      <H2>The Pre-Mortem Method</H2>
      <P>
        Pre-mortem analysis — developed by psychologist Gary Klein — asks you to imagine the project has already failed, 
        then reconstruct why. Applied to pitching, it looks like this:
      </P>
      <Steps
        items={[
          {
            title: 'Set the scene',
            body: 'It is 18 months from now. The company failed. Not ran out of money — failed. What happened?',
          },
          {
            title: 'Write without editing',
            body: 'The constraint is important. Your first answers reveal what you actually believe, not what you wish were true.',
          },
          {
            title: 'Categorise by type',
            body: 'Group your failure reasons: market timing, distribution, defensibility, unit economics, team, regulation.',
          },
          {
            title: 'Prepare answers',
            body: "Don't memorise a script. Have a real answer to what kills this in each category and what you are doing about it.",
          },
        ]}
      />

      <H2>The Fermi Check on Your Market</H2>
      <P>
        The single most common fatal flaw in pitches we've analyzed: unqualified TAM claims. 
        A Fermi estimation takes 5 minutes and tells you if your market number is real.
      </P>
      <UL>
        <LI>How many companies/people fit your exact ICP?</LI>
        <LI>What percentage of them have the problem you solve right now?</LI>
        <LI>Of those, what percentage would actually pay for your solution?</LI>
        <LI>What would they pay per year?</LI>
      </UL>
      <P>
        Multiply those four numbers. That's your real TAM. If it's 90% smaller than what's in your deck, 
        you have 24 hours to either fix the deck or build a better answer.
      </P>

      <Divider />
      
      <ArticleCTA context="investor_prep" source="stress-test-pitch" />
    </ArticleLayout>
  );
}
