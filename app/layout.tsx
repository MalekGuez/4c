import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Nav from "./components/Nav";
import { AuthProvider } from "./contexts/AuthContext";
import { SITE_CONFIG } from "./config/site";

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "arial"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: SITE_CONFIG.authors,
  creator: SITE_CONFIG.creator,
  openGraph: {
    type: SITE_CONFIG.openGraph.type,
    locale: SITE_CONFIG.openGraph.locale,
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.openGraph.siteName,
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
    creator: SITE_CONFIG.twitter.creator,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.twitter.image],
  },
  robots: SITE_CONFIG.robots,
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* Global background image - loaded once for all pages */}
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: 'url("/images/bg.png") no-repeat center center',
          backgroundSize: 'cover',
          filter: 'blur(4px)',
          pointerEvents: 'none',
          width: '100vw',
          height: '100vh',
          opacity: 1,
          transition: 'filter 0.3s'
        }} />
        
        <AuthProvider>
          <Nav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
