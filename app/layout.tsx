import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import LayoutClient from "./LayoutClient";
import { SITE_CONFIG, getSiteJsonLd } from "./config/site";

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "arial"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.shortTitle}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: SITE_CONFIG.authors,
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.name,
  applicationName: SITE_CONFIG.name,
  category: "games",
  openGraph: {
    type: SITE_CONFIG.openGraph.type,
    locale: SITE_CONFIG.openGraph.locale,
    url: siteUrl,
    siteName: SITE_CONFIG.openGraph.siteName,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.openGraph.image.url,
        width: SITE_CONFIG.openGraph.image.width,
        height: SITE_CONFIG.openGraph.image.height,
        alt: SITE_CONFIG.openGraph.image.alt,
      },
    ],
  },
  twitter: {
    card: SITE_CONFIG.twitter.card,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.twitter.image],
    creator: SITE_CONFIG.twitter.creator,
  },
  robots: SITE_CONFIG.robots,
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const jsonLd = getSiteJsonLd();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
