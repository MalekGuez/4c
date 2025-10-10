'use client';

import { Inter } from "next/font/google";
import "./styles/globals.css";
import Nav from "./components/Nav";
import { AuthProvider } from "./contexts/AuthContext";
import { usePathname } from "next/navigation";

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "arial"],
  display: "swap",
});

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode}>) {
  const pathname = usePathname();
  const isMaintenancePage = pathname === '/maintenance';
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
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
          {!isMaintenancePage && <Nav />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
