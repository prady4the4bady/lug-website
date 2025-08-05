
"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { Menu, TerminalIcon, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, signIn, signOutUser } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/council", label: "Council" },
    { href: "/events", label: "Events" },
    { href: "/forum", label: "Forum" },
  ];

  if (user) {
    navLinks.push({ href: "/profile", label: "Profile" });
  }
  
  if (isAdmin) {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <Image src="https://i.ibb.co/L0Sj9h2/tux.png" alt="LUG Logo" width={56} height={56} className="h-14 w-14" data-ai-hint="logo" />
            <div className="font-bold sm:inline-block relative overflow-hidden whitespace-nowrap">
              <span className="opacity-100 group-hover:opacity-0 transition-opacity duration-300">LUG</span>
              <span className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Linux User Group
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <Image src="https://i.ibb.co/L0Sj9h2/tux.png" alt="LUG Logo" width={56} height={56} className="mr-2 h-14 w-14" data-ai-hint="logo" />
              <span className="font-bold">LUG</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      pathname === link.href ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             {/* Future search bar can go here */}
          </div>
          <nav className="flex items-center gap-2">
            {user ? (
                <Button variant="ghost" size="sm" onClick={signOutUser}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            ) : (
              <Button asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
                <Link href="https://lug12.netlify.app/" target="_blank" rel="noopener noreferrer">
                    <TerminalIcon className="h-4 w-4 mr-2"/>
                    <span>Terminal View</span>
                </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
