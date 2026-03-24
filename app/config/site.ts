export const SITE_CONFIG = {
  name: "4Chaos",
  title: "4Chaos - The Era of PvP - Reborn",
  shortTitle: "4Chaos",
  description:
    "4Chaos — intense PvP MMORPG private server. Epic battles, ranked modes, cash shop, and a competitive community. Download the client, register, and dominate in player vs player combat.",
  url: "https://4chaos.com",
  domain: "4chaos.com",
  /** Meta keywords — 4story / 4Chaos only. */
  keywords: [
    "4Chaos",
    "4Chaos server",
    "4Chaos private server",
    "4Chaos pserver",
    "4Chaos online",
    "4Chaos 4story",
    "4story",
    "4Story",
    "4s",
    "4story MMORPG",
    "4story private server",
    "4story pserver",
    "4story privateserver",
    "4story server",
    "4story online",
    "4Chaos",
    "4Chaos 4story",
    "4Chaos private server",
    "4Chaos download",
    "Play 4Chaos",
    "4Chaos registration",
    "Join 4Chaos",
  ] as string[],
  authors: [{ name: "4Chaos Team" }] as { name: string }[],
  creator: "4Chaos Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "4Chaos",
    image: {
      url: "/images/4Chaos.png",
      width: 1200,
      height: 630,
      alt: "4Chaos Official Logo",
    },
  },
  twitter: {
    card: "summary_large_image",
    creator: "@4chaos",
    image: "/images/4Chaos.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
} as const;

export function getSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        inLanguage: "en",
        publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.url}${SITE_CONFIG.openGraph.image.url}`,
        },
      },
    ],
  };
}
