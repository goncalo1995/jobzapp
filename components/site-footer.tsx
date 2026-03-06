"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('Pages.footer');

  return (
    <footer className="border-t border-border/50 bg-secondary/5 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-heading font-black text-primary tracking-tighter">
              Job<span className="text-foreground">Zapp</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium italic">
              " {t('headline')} "
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-6">
            <nav className="flex items-center gap-8">
              <Link href="/pricing" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                {t('links.pricing')}
              </Link>
              <Link href="/blog" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                {t('links.blog')}
              </Link>
              <Link href="/privacy-policy" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                {t('links.privacyPolicy')}
              </Link>
            </nav>
            <div className="text-[10px] text-muted-foreground/50 tracking-[0.2em] font-bold uppercase">
              {t('copyright', { year: new Date().getFullYear() })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}