/**
 * ---------------------------------------------------------------------------
 * SITE CONFIG
 * ---------------------------------------------------------------------------
 * The few strings that more than one place needs: what the page calls itself
 * in search results and link previews, and where the CV lives.
 *
 * Section copy lives with its section. There was once a config here holding
 * every word on the site, inherited from the template this started from; it
 * outlived the design it described, so it is gone.
 * ---------------------------------------------------------------------------
 */

export const site = {
  /**
   * What search results and link previews say. The description is cut from the
   * About bio, so the line under the name on Google or WhatsApp matches what
   * the page itself says.
   */
  meta: {
    title: 'Koushik Gopathi — Developer & Designer',
    shortName: 'Koushik Gopathi',
    description:
      'B.Tech Cybersecurity student building full-stack web apps, cross-platform mobile apps, and interfaces that feel as intentional as the code behind them.',
    ogImageAlt: 'Koushik Gopathi — Developer and Designer. Portfolio 2026.',
  },

  /** The CV, served straight from /public. */
  resume: {
    href: '/Koushik-Gopathi-Resume.pdf',
    meta: 'PDF · 82 KB',
  },
} as const

export type Site = typeof site
