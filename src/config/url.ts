/**
 * The site's public origin, resolved once and shared by the page metadata,
 * the sitemap and robots.txt.
 *
 * Order matters:
 *   1. NEXT_PUBLIC_SITE_URL — an explicit override, if you ever set one.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — set by Vercel at build time to the
 *      project's production domain: the *.vercel.app address today, and your
 *      own domain automatically once one is attached. No code change needed
 *      when you buy the domain — but the site is prerendered, so the URL is
 *      baked in at build time: redeploy once after attaching it.
 *   3. localhost, for `npm run dev`.
 *
 * Without this, share previews resolve their image against a guessed origin
 * and the card shows up with no picture.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`

  return 'http://localhost:3000'
}

export const siteUrl = resolveSiteUrl()
