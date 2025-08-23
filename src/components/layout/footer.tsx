
"use client";

import Link from 'next/link';
import { Github, Linkedin, Instagram } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center">
            <Image src="/images/lug_logo.png" alt="LUG Logo" width={50} height={50} data-ai-hint="logo" />
            <div className="ml-3">
              <p className="text-lg font-bold">Linux User Group</p>
              <p className="text-sm text-muted-foreground">BITS Pilani, Dubai Campus</p>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/council" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Council</Link>
            <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Events</Link>
            <Link href="/join-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Join Us</Link>
          </nav>
          <div className="flex space-x-4">
            <a href="https://github.com/lugbpdc" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/company/lugbpdc/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/lugbpdc/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Linux User Group BPDC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
