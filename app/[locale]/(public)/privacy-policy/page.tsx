import { getTranslations } from 'next-intl/server'

type PrivacyPolicyParams = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: PrivacyPolicyParams }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Pages.privacyPolicy' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('Pages.privacyPolicy')
  const lastUpdated = '2026-02-28' // Fixed date, not dynamic

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero section — make privacy a feature */}
      <div className="mb-12 border-l-4 border-primary pl-6 bg-primary/5 py-4 pr-4 rounded-r">
        <p className="text-lg font-medium text-foreground">
          🔥 {t('hero.weDontCollect')}
        </p>
        <p className="text-muted-foreground mt-2">
          {t('hero.subtext')}
        </p>
      </div>

      <h1 className="font-serif text-4xl text-foreground">{t('title')}</h1>
      <p className="mt-4 text-sm text-muted-foreground">{t('lastUpdated', { date: lastUpdated })}</p>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-foreground/85">
        
        {/* Who we are */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.controller.title')}</h2>
          <p>{t('sections.controller.body')}</p>
          <p className="text-sm bg-muted/30 p-3 rounded border border-border">
            📍 {t('sections.controller.registered')}
          </p>
        </section>

        {/* Core promise — NEW SECTION */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground flex items-center gap-2">
            <span className="text-primary">🔥</span> {t('sections.corePromise.title')}
          </h2>
          <div className="bg-primary/5 border border-primary/20 p-5 rounded space-y-3">
            <p className="font-medium">{t('sections.corePromise.noAccounts')}</p>
            <p>{t('sections.corePromise.noEmail')}</p>
            <p>{t('sections.corePromise.noStorage')}</p>
            <p className="text-sm border-t border-primary/20 pt-3 mt-2">
              ⏱️ {t('sections.corePromise.lifetime')}
            </p>
          </div>
        </section>

        {/* What we actually collect */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.dataCollected.title')}</h2>
          <p className="text-sm italic text-muted-foreground mb-2">
            {t('sections.dataCollected.limited')}
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">{t('sections.dataCollected.items.payment.title')}</span>
              <br />
              <span className="text-sm text-muted-foreground">
                {t('sections.dataCollected.items.payment.description')}
              </span>
            </li>
            <li>
              <span className="font-medium">{t('sections.dataCollected.items.analytics.title')}</span>
              <br />
              <span className="text-sm text-muted-foreground">
                {t('sections.dataCollected.items.analytics.description')}
              </span>
              <ul className="list-circle pl-5 mt-1 text-sm text-muted-foreground">
                <li>{t('sections.dataCollected.items.analytics.sub.trigger')}</li>
                <li>{t('sections.dataCollected.items.analytics.sub.funnel')}</li>
                <li>{t('sections.dataCollected.items.analytics.sub.referrer')}</li>
                <li>{t('sections.dataCollected.items.analytics.sub.country')}</li>
              </ul>
            </li>
            {/* <li className="opacity-50 line-through">
              <span className="font-medium">{t('sections.dataCollected.items.email.title')}</span>
              <br />
              <span className="text-sm text-muted-foreground">
                {t('sections.dataCollected.items.email.description')}
              </span>
            </li> */}
          </ul>
        </section>

        {/* How we use it */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.purposes.title')}</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">{t('sections.purposes.items.analytics.title')}</span>
              <br />
              <span className="text-sm text-muted-foreground">
                {t('sections.purposes.items.analytics.description')}
              </span>
            </li>
            <li>
              <span className="font-medium">{t('sections.purposes.items.improvement.title')}</span>
              <br />
              <span className="text-sm text-muted-foreground">
                {t('sections.purposes.items.improvement.description')}
              </span>
            </li>
            <li className="opacity-50 line-through">
              <span className="font-medium">{t('sections.purposes.items.marketing')}</span>
            </li>
          </ul>
        </section>

        {/* Legal basis */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.legalBasis.title')}</h2>
          <p>{t('sections.legalBasis.body')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="bg-muted/30 p-3 rounded border border-border text-sm">
              <span className="font-medium">GDPR (EU):</span> {t('sections.legalBasis.gdpr')}
            </div>
            <div className="bg-muted/30 p-3 rounded border border-border text-sm">
              <span className="font-medium">CCPA (California):</span> {t('sections.legalBasis.ccpa')}
            </div>
          </div>
        </section>

        {/* Third parties */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.thirdParties.title')}</h2>
          <p>{t('sections.thirdParties.body')}</p>
          <table className="w-full text-sm border-collapse mt-3">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium">{t('sections.thirdParties.table.provider')}</th>
                <th className="text-left py-2 font-medium">{t('sections.thirdParties.table.purpose')}</th>
                <th className="text-left py-2 font-medium">{t('sections.thirdParties.table.privacyPolicy')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-2">Stripe</td>
                <td className="py-2 text-muted-foreground">{t('sections.thirdParties.table.stripe')}</td>
                <td className="py-2">
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                    stripe.com/privacy
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2">OpenRouter</td>
                <td className="py-2 text-muted-foreground">{t('sections.thirdParties.table.openrouter')}</td>
                <td className="py-2">
                  <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                    openrouter.ai/privacy
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2">Anthropic (Claude)</td>
                <td className="py-2 text-muted-foreground">{t('sections.thirdParties.table.anthropic')}</td>
                <td className="py-2">
                  <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                    anthropic.com/privacy
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2">Supabase</td>
                <td className="py-2 text-muted-foreground">{t('sections.thirdParties.table.supabase')}</td>
                <td className="py-2">
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                    supabase.com/privacy
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2">Vercel</td>
                <td className="py-2 text-muted-foreground">{t('sections.thirdParties.table.vercel')}</td>
                <td className="py-2">
                  <a href="https://vercel.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">
                    vercel.com/privacy
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Data retention — CRITICAL for your model */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.retention.title')}</h2>
          <div className="bg-muted/30 p-4 rounded border border-border space-y-3">
            <p>
              <span className="font-medium block mb-1">{t('sections.retention.pitchData.title')}</span>
              {t('sections.retention.pitchData.description')}
            </p>
            <p>
              <span className="font-medium block mb-1">{t('sections.retention.analytics.title')}</span>
              {t('sections.retention.analytics.description')}
            </p>
            <p>
              <span className="font-medium block mb-1">{t('sections.retention.payment.title')}</span>
              {t('sections.retention.payment.description')}
            </p>
            <p className="text-xs border-t border-border pt-2 mt-2">
              🔍 {t('sections.retention.audit')}
            </p>
          </div>
        </section>

        {/* Your rights */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.rights.title')}</h2>
          <p>{t('sections.rights.body')}</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{t('sections.rights.items.access')}</li>
            <li>{t('sections.rights.items.deletion')}</li>
            <li>{t('sections.rights.items.export')}</li>
            <li>{t('sections.rights.items.object')}</li>
          </ul>
          <p className="mt-3 text-sm">
            {t('sections.rights.contact')}{' '}
            <a href="mailto:privacy@airoast.app" className="text-primary hover:underline">
              privacy@airoast.app
            </a>
          </p>
        </section>

        {/* Cookies */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.cookies.title')}</h2>
          <p>{t('sections.cookies.body')}</p>
          <p className="text-sm text-muted-foreground">
            {t('sections.cookies.manage')}{' '}
            <button className="text-primary hover:underline underline-offset-2">
              {t('sections.cookies.preferences')}
            </button>
          </p>
        </section>

        {/* Changes */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-foreground">{t('sections.changes.title')}</h2>
          <p>{t('sections.changes.body')}</p>
          <p className="text-sm text-muted-foreground">{t('sections.changes.lastUpdated', { date: lastUpdated })}</p>
        </section>

        {/* Contact */}
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="font-serif text-xl text-foreground">{t('sections.contact.title')}</h2>
          <p className="text-sm">
            {t('sections.contact.email')}{' '}
            <a href="mailto:privacy@airoast.app" className="text-primary hover:underline">
              privacy@airoast.app
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            {t('sections.contact.response')}
          </p>
        </section>
      </div>
    </main>
  )
}
