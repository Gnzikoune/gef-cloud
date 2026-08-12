import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEF Cloud — Dashboard de métriques DORA",
  description: "SaaS de gouvernance d'ingénierie avec dashboard de métriques DORA pour les équipes IA-first",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
