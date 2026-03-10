import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '../globals.css'
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { ProfileProvider } from "@/components/providers/profile-provider"
import { ReferralTracker } from '@/components/referral-tracker';
import QueryProvider from '@/components/providers/query-provider';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-heading',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'JobZapp - Ultimate Career Search & Intelligence Platform',
  description: 'Track job applications, generate AI-tailored CVs, prepare with mock interviews, and organize your job search in one powerful dashboard.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://jobzapp.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobzapp.com',
    siteName: 'JobZapp',
    title: 'JobZapp | AI Job Tracker & Career OS',
    description: 'High-speed job application tracking with AI precision. Manage interviews, tailor your CV, and master your career.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JobZapp Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobZapp | AI Job Tracker',
    description: 'High-speed job application tracking with AI precision.',
  },
}

export const viewport: Viewport = {
  themeColor: '#4F6BF6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale?: string}>;
};

export default async function RootLayout({
  children,
  params
}: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  
  return (
    <html lang={locale} data-scroll-behavior="smooth" className="dark">
      {/* <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
               "@context": "https://schema.org",
               "@type": "WebSite",
               "name": "JobZapp",
               "url": "https://jobs.rochanegra.com",
               "potentialAction": {
                 "@type": "SearchAction",
                 "target": "https://jobs.rochanegra.com/blog?q={search_term_string}",
                 "query-input": "required name=search_term_string"
               }
             })
          }}
        />
      </head> */}
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}>
        <QueryProvider>
          <ProfileProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <main className="flex-1">
                {children}
              </main>
              <Toaster />
              <Sonner position="top-center" />
            </NextIntlClientProvider>
            <Suspense fallback={null}>
              <ReferralTracker />
            </Suspense>
          </ProfileProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
