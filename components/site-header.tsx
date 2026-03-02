"use client"

import { Link } from "@/i18n/navigation"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-heading font-bold text-primary tracking-tight">
          Job<span className="text-foreground">Zapp</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard"
            className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  )
}
