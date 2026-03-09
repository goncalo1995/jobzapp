export const dynamic = 'force-static';

import { getTranslations } from 'next-intl/server'
import { ShieldCheck, Lock, EyeOff } from 'lucide-react'

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
  const lastUpdated = '2026-03-06'

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-16 space-y-4">
        <h1 className="font-heading text-5xl md:text-6xl text-foreground uppercase tracking-tighter leading-none">
          Data <span className="text-primary italic">Privacy</span>
        </h1>
        <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase border-t border-border pt-4">
          {t('lastUpdated', { date: lastUpdated })}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div className="md:col-span-2 space-y-16">
          {/* Hero context */}
          <section className="bg-primary/5 border border-primary/20 p-8 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
            <h2 className="text-xl font-heading font-black text-primary uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" /> {t('hero.weDontCollect')}
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10 font-medium">
              {t('hero.subtext')}
            </p>
          </section>

          {/* Core promise */}
          <section className="space-y-6">
            <h2 className="text-xs font-black text-foreground uppercase tracking-[0.3em] font-mono border-b border-border pb-4">
              Our Core Promise
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Secure Auth', desc: 'Managed by Supabase Enterprise Grade Security.' },
                { label: 'Privacy First', desc: 'Your applications and CVs are encrypted and private. OpenRouter keys are stored locally, not on our servers.' },
                { label: 'No Data Selling', desc: 'We do not sell your professional data to third parties.' },
                { label: 'Full Control', desc: 'Delete your account and all associated data instantly.' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-secondary/10 rounded-xl border border-border/50">
                  <div className="text-xs font-black uppercase text-primary mb-1 tracking-tight">{item.label}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Third parties */}
          <section className="space-y-6">
            <h2 className="text-xs font-black text-foreground uppercase tracking-[0.3em] font-mono border-b border-border pb-4">
              Trusted Partners
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Provider</th>
                    <th className="py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: 'Polar', purpose: 'Payment Processing' },
                    { name: 'Supabase', purpose: 'Database & Authentication' },
                    { name: 'Vercel', purpose: 'Hosting & Analytics' },
                    { name: 'Resend', purpose: 'Transactional Emails' },
                  ].map((p, i) => (
                    <tr key={i} className="group">
                      <td className="py-4 font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</td>
                      <td className="py-4 text-muted-foreground font-mono text-[11px]">{p.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact */}
          <section className="pt-12 border-t border-border space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest">Contact Privacy Team</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For any questions regarding your data, please contact:
              <br />
              <a href="mailto:privacy@jobzapp.com" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                privacy@jobzapp.com
              </a>
            </p>
          </section>
        </div>

        {/* Sidebar Mini-Nav / Info */}
        <div className="space-y-8 sticky top-32">
          <div className="bg-secondary/5 border border-border p-6 rounded-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Identity</h3>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                JobZapp is a product of Cereja Investment, Lda.
                <br /><br />
                Travessa do Girassol, n61 3D
                <br />
                2775-811 Carcavelos
                <br />
                Portugal
              </p>
            </div>
            <div className="flex items-center gap-4 text-primary">
              <Lock className="h-5 w-5" />
              <EyeOff className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
