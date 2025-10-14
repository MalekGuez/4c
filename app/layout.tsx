import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import LayoutClient from "./LayoutClient";

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "arial"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://4chaos.com'),
  title: "4Chaos - The Era of PVP - Reborn",
  description: "Join 4Chaos, the most intense PvP server. Battle, conquer, and dominate in epic player vs player combat.",
  keywords: "4Chaos, PvP, gaming, multiplayer, online game, player vs player",
  authors: [{ name: "4Chaos Team" }],
  creator: "4Chaos",
  publisher: "4Chaos",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://4chaos.com",
    siteName: "4Chaos",
    title: "4Chaos - The Era of PVP - Reborn",
    description: "Join 4Chaos, the most intense PvP server. Battle, conquer, and dominate in epic player vs player combat.",
    images: [
      {
        url: "/images/4Chaos.png",
        width: 1200,
        height: 630,
        alt: "4Chaos - The Era of PVP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "4Chaos - The Era of PVP - Reborn",
    description: "Join 4Chaos, the most intense PvP server. Battle, conquer, and dominate in epic player vs player combat.",
    images: ["/images/4Chaos.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
