"use client";

import Link from 'next/link';
import { Github, Linkedin, Instagram, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-background border-t overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
       <div className="container mx-auto py-12 px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <Image src="/images/lug_logo.png" alt="LUG Logo" width={60} height={60} data-ai-hint="logo" />
              <div className="ml-4">
                <p className="text-xl font-bold">Linux User Group</p>
                <p className="text-sm text-muted-foreground">BITS Pilani, Dubai Campus</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The home of open-source enthusiasts, fostering innovation and collaboration.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link href="/council" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Council</Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">Club Events</Link>
              <Link href="/join-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">Join The Community</Link>
            </nav>
          </div>

          {/* Column 3: Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://github.com/lugbpdc" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/company/lugbpdc/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/lugbpdc/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Linux User Group BPDC. All Rights Reserved.</p>
          <Button variant="ghost" size="sm" onClick={scrollToTop} className="mt-4 sm:mt-0">
             Back to Top <ArrowUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}