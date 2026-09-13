import type { MetadataRoute } from 'next'
import { siteUrl } from '@/config/url'

/**
 * Open to every crawler. Vercel already sends `noindex` on preview
 * deployments, so only the production domain gets indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
