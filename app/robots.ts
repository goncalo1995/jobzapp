// app/robots.ts
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',           // Block all admin routes
          '/api/',
          '/*/dashboard/',         // Block any locale admin
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      }
    ],
    sitemap: 'https://jobs.rochanegra.com/sitemap.xml',
  }
}