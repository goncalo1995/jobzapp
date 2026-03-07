// app/sitemap.ts
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jobs.rochanegra.com'
  
  // 1. Static routes (with locales)
  const staticRoutes = [
    '',           // home
    '/blog',
    '/pricing',
    '/privacy-policy',
    '/blog/interviews/technical-screen-tips',
    '/blog/interviews/interview-prep-checklist',
    '/blog/tips/getting-a-job-2026',
    '/blog/tips/salary-negotiation-2026',
    '/blog/tips/cover-letter-tips',
    '/blog/tips/why-excel-fails',
    '/blog/productivity/time-blocking-job-search',
    '/blog/productivity/follow-up-guide',
  ]
  
  const staticUrls = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route.startsWith('/blog') ? 'monthly' : 'weekly') as 'monthly' | 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/blog') ? 0.8 : 0.5,
  }))

  return [...staticUrls]
}