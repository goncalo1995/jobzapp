import { updateSession } from "@/lib/supabase/proxy"
import { type NextRequest, NextResponse } from "next/server"
import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

const intlMiddleware = createMiddleware({
  ...routing,
});

const PUBLIC_FILE_PATTERNS = [
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/manifest.webmanifest',
];

/** Check if the resolved path is a protected dashboard route */
function isDashboardRoute(pathname: string): boolean {
  return /\/dashboard(\/|$)/.test(pathname)
}

/** Extract locale from path like /en/... or /pt/... */
function extractLocale(pathname: string): string {
  const match = pathname.match(/^\/([a-z]{2})\//)
  return match ? match[1] : 'en'
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ── 1. Skip static files ────────────────────────────────────────────────
  if (PUBLIC_FILE_PATTERNS.some((p) => pathname === p || pathname.startsWith(`${p}?`))) {
    return NextResponse.next();
  }

  // ── 2. Run next-intl middleware ──────────────────────────────────────────
  const intlResponse = intlMiddleware(request);
  const isRedirect = intlResponse.headers.has('location')

  // Only honor locale *redirects* (e.g. / -> /en/) immediately.
  // Rewrites must continue through the auth pipeline below.
  if (isRedirect) return intlResponse

  // ── 3. Supabase session refresh + dashboard protection ──────────────────
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    const response = await updateSession(request)

    // Merge intl headers (locale cookie, rewrite target) into supabase response
    intlResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') return
      response.headers.set(key, value)
    })

    // Protect /dashboard — redirect to login if no session
    if (isDashboardRoute(pathname)) {
      const { createServerClient } = await import("@supabase/ssr")
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll() },
            setAll() {},
          },
        }
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        const locale = extractLocale(pathname)
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/auth/login`
        return NextResponse.redirect(url)
      }
    }

    return response
  }

  // ── 4. No Supabase configured — block dashboard ─────────────────────────
  if (isDashboardRoute(pathname)) {
    const locale = extractLocale(pathname)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth/login`
    return NextResponse.redirect(url)
  }

  // Pass through with intl headers
  const next = NextResponse.next()
  intlResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') return
    next.headers.set(key, value)
  })
  return next
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml)$).*)',
  ],
}
