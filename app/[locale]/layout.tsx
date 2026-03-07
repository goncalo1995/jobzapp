import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import '../globals.css'
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700', '800'],
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'JobZapp | AI Job Tracker & Career OS',
    template: '%s | JobZapp',
  },
  description: 'High-speed job application tracking with AI precision. Tailor your CV, prepare for interviews, and manage your career effortlessly.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://jobs.rochanegra.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobs.rochanegra.com',
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
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  
  return (
    <html lang={locale} data-scroll-behavior="smooth" className="dark">
      <head>
        <meta name="theme-color" content="#4F6BF6" />
        {/* This meta tag prevents auto-zooming on form inputs on mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
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
      </head>
      <body className={`${plusJakarta.variable} ${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="flex-1">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
