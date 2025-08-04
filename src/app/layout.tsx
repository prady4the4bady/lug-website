import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Linux User Group - BITS Pilani Dubai',
  description: 'Homepage for the Linux User Group at BITS Pilani Dubai Campus.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider defaultTheme="dark" storageKey="lug-theme">
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Button
              asChild
              className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white shadow-lg"
              aria-label="Report a bug"
            >
              <Link href="https://lug.im/bugs" target="_blank">
                <Bug className="mr-2 h-4 w-4" />
                Report a Bug
              </Link>
            </Button>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
