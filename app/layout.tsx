import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alliant",
  description:
    "Alliant is the parent home for Sovereign Engine, SoulMaster, and Anthologies: projects that help creators retain ownership and build passive-income paths from their work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
