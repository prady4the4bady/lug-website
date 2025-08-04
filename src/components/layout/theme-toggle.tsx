"use client"

import * as React from "react"
import { Moon, Sun, TerminalIcon } from "lucide-react"
import { useTheme } from "@/components/layout/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export function TerminalViewToggle() {
    const { isTerminal, setIsTerminal } = useTheme()
    return (
        <div className="flex items-center space-x-2">
            <Label htmlFor="terminal-mode" className="text-sm font-medium flex items-center gap-2">
                <TerminalIcon className="h-4 w-4"/>
                <span>Terminal View</span>
            </Label>
            <Switch
                id="terminal-mode"
                checked={isTerminal}
                onCheckedChange={setIsTerminal}
            />
        </div>
    )
}
