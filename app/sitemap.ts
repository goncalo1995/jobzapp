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
  ]
  
  // Generate for each locale
  const locales = ['en']
  const staticUrls = locales.flatMap(locale =>
    staticRoutes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: (route.startsWith('/blog') ? 'monthly' : 'weekly') as 'monthly' | 'weekly',
      priority: route === '' ? 1.0 : route.startsWith('/blog') ? 0.8 : 0.5,
    }))
  )

  return [...staticUrls]
}