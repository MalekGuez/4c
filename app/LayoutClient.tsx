'use client';

import { usePathname } from "next/navigation";
import Nav from "./components/Nav";
import TokenValidator from "./components/TokenValidator";
import { AuthProvider } from "./contexts/AuthContext";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMaintenancePage = pathname === '/maintenance';

  return (
    <>
      <div
        style={{
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
          transition: 'filter 0.3s',
        }}
      />

      <AuthProvider>
        <TokenValidator />
        {!isMaintenancePage && <Nav />}
        {children}
      </AuthProvider>
    </>
  );
}

