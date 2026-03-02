"use client"

import { Link } from "@/i18n/navigation"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-heading font-bold text-primary tracking-tight">
            Job<span className="text-foreground">Zapp</span>
          </span>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  )
}