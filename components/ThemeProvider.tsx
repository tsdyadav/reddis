"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.classList.toggle("dark", e.matches);
      localStorage.setItem("theme", newTheme);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Apply theme to document
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Apply theme to all elements with data-theme attribute
    document.querySelectorAll('[data-theme]').forEach(el => {
      el.setAttribute('data-theme', newTheme);
    });
    
    // Apply theme to body for global styling
    document.body.classList.toggle('dark-theme', newTheme === "dark");
    document.body.classList.toggle('light-theme', newTheme === "light");
    
    // Apply theme to specific components
    document.querySelectorAll('.community-card').forEach(el => {
      el.classList.toggle('dark-card', newTheme === "dark");
      el.classList.toggle('light-card', newTheme === "light");
    });
    
    // Apply theme to posts
    document.querySelectorAll('article').forEach(el => {
      el.classList.toggle('dark-post', newTheme === "dark");
      el.classList.toggle('light-post', newTheme === "light");
    });
    
    // Apply theme to buttons
    document.querySelectorAll('button').forEach(el => {
      el.classList.toggle('dark-button', newTheme === "dark");
      el.classList.toggle('light-button', newTheme === "light");
    });
    
    // Apply theme to sidebar
    document.querySelectorAll('.sidebar').forEach(el => {
      el.classList.toggle('dark-sidebar', newTheme === "dark");
      el.classList.toggle('light-sidebar', newTheme === "light");
    });
    
    // Apply theme to header
    document.querySelectorAll('header').forEach(el => {
      el.classList.toggle('dark-header', newTheme === "dark");
      el.classList.toggle('light-header', newTheme === "light");
    });
    
    // Store theme preference
    localStorage.setItem("theme", newTheme);
    
    // Dispatch custom event for components that need to react to theme changes
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}