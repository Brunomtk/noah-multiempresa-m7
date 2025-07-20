"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { PlansProvider } from "@/contexts/plans-context"
import { CompaniesProvider } from "@/contexts/companies-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <PlansProvider>
          <CompaniesProvider>
            {children}
            <Toaster />
          </CompaniesProvider>
        </PlansProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
