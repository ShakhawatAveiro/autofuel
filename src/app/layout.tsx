import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { Fuel, Map, Activity } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoFuel Station Automation",
  description: "Find stations and log your fuel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 glass border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
              <Fuel className="w-6 h-6" />
              <span className="font-bold text-lg tracking-tight">AutoFuel</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/map" className="flex items-center gap-2 hover:text-primary transition-colors text-zinc-300">
                <Map className="w-4 h-4" /> Map
              </Link>
              <Link href="/feed" className="flex items-center gap-2 hover:text-primary transition-colors text-zinc-300">
                <Activity className="w-4 h-4" /> Feed
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
