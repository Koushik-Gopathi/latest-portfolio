import type { MetadataRoute } from 'next'
import { siteUrl } from '@/config/url'

/** One page, one entry — enough for a search engine to find a new domain. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
