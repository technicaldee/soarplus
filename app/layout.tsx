import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SOAR+ | Safety Audit & Resolution of Safety Issues Platform",
  description:
    "Enterprise-grade safety audit platform with risk assessment, corrective action tracking, and ROSI process. Supports IOSA, FAA IASA, CASE, and DoD compliance audits.",
  keywords: [
    "safety audit",
    "SOAR+",
    "risk assessment",
    "aviation safety",
    "compliance",
    "audit management",
    "corrective actions",
    "IOSA",
    "FAA",
    "SMS",
  ],
  authors: [{ name: "SOAR+ System" }],
  creator: "SOAR+ Team",
  publisher: "SOAR+ Enterprise",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://soarplus.app"),
  alternates: {
    canonical: "https://soarplus.app",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://soarplus.app",
    siteName: "SOAR+",
    title: "SOAR+ | Safety Audit & Resolution of Safety Issues Platform",
    description:
      "Enterprise safety audit platform with integrated ROSI process, risk assessment, and compliance tracking.",
    images: [
      {
        url: "https://soarplus.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SOAR+ Safety Audit Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOAR+ | Safety Audit Platform",
    description: "Enterprise safety audit with risk assessment and ROSI process",
    creator: "@soarplus",
    images: ["https://soarplus.app/twitter-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SOAR+",
              description: "Enterprise safety audit platform with risk assessment and compliance tracking",
              url: "https://soarplus.app",
              applicationCategory: "BusinessApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "125",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
