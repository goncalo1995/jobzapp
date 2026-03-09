"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from 'next-intl';

export function SiteHeader() {
  const t = useTranslations('Pages.header');

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-heading font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">
          Job<span className="text-foreground">Zapp</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link 
            href="/pricing" 
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest hidden sm:block"
          >
            {t('nav.pricing')}
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest hidden sm:block"
          >
            {t('nav.blog')}
          </Link>
          <Link 
            href="/dashboard"
            className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.1em] rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {t('nav.dashboard')}
          </Link>
        </nav>
      </div>
    </header>
  )
}
