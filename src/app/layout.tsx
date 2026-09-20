import type { Metadata, Viewport } from 'next'
import { site } from '@/config/site'
import { siteUrl } from '@/config/url'
import SmoothScroll from '@/components/ui/SmoothScroll'
import Cursor from '@/components/ui/Cursor'
import './globals.css'

/**
 * The favicon, Apple touch icon and share image are not listed here: they are
 * files beside this layout (icon.svg, apple-icon.png, opengraph-image.jpg) and
 * Next wires them in by name. `metadataBase` is what turns that share image
 * into an absolute URL — WhatsApp, LinkedIn and X all ignore a relative one.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.meta.title,
  description: site.meta.description,
  applicationName: site.meta.shortName,
  authors: [{ name: site.meta.shortName, url: siteUrl }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.meta.shortName,
    title: site.meta.title,
    description: site.meta.description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.meta.title,
    description: site.meta.description,
  },
}

export const viewport: Viewport = {
  // The first thing the visitor sees is the full-bleed red landing, so the
  // browser chrome is red too — not the old paper stock.
  themeColor: '#ee0000',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/archivo-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SmoothScroll />
        <Cursor />
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to work
        </a>
        {children}
      </body>
    </html>
  )
}
