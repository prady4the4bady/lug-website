
"use client"

import React, { createContext, useContext, useEffect, useState, useMemo } from "react"

type Theme = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isTerminal: boolean
  setIsTerminal: (isTerminal: boolean) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  isTerminal: false,
  setIsTerminal: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "lug-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isTerminal, setIsTerminal] = useState(false);


  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      }
      const storedTerminal = localStorage.getItem(`${storageKey}-terminal`) === 'true';
      setIsTerminal(storedTerminal);
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "terminal")
    
    if(isTerminal) {
      root.classList.add("terminal");
    } else {
      root.classList.add(theme)
    }

  }, [theme, isTerminal])

  const value = useMemo(() => ({
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch (e) {
        // Ignore localStorage errors
      }
      setTheme(newTheme)
    },
    isTerminal,
    setIsTerminal: (newIsTerminal: boolean) => {
      try {
        localStorage.setItem(`${storageKey}-terminal`, String(newIsTerminal));
      } catch (e) {
        // Ignore localStorage errors
      }
      setIsTerminal(newIsTerminal);
    }
  }), [theme, storageKey, isTerminal]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
