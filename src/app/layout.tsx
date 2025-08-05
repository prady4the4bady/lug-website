
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import Link from 'next/link';
import { AuthProvider } from '@/hooks/use-auth';

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
      <body className="font-body antialiased min-h-screen bg-background text-foreground font-sans" suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" storageKey="lug-theme">
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
                <Button
                    asChild
                    className="group fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 ease-in-out hover:w-40 rounded-full"
                    aria-label="Report a bug"
                >
                    <Link href="/report-a-bug" className="w-12 h-12 flex items-center justify-center">
                        <Bug className="h-5 w-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:-translate-x-5" />
                        <span className="whitespace-nowrap absolute opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-4 duration-300 ease-in-out">
                            Report a Bug
                        </span>
                    </Link>
                </Button>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
