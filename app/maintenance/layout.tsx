import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release Date | 4Chaos",
  description: "The 4Chaos server will be available soon. Join us for an epic adventure!",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

