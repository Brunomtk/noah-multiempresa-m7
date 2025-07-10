"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { CompaniesProvider } from "@/contexts/companies-context"
import { ProfessionalsProvider } from "@/contexts/professionals-context"
import { TeamsProvider } from "@/contexts/teams-context"
import { RecurrencesProvider } from "@/contexts/recurrences-context"
import { GpsTrackingProvider } from "@/contexts/gps-tracking-context"
import { ReviewsProvider } from "@/contexts/reviews-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <CompaniesProvider>
          <ProfessionalsProvider>
            <TeamsProvider>
              <RecurrencesProvider>
                <GpsTrackingProvider>
                  <ReviewsProvider>{children}</ReviewsProvider>
                </GpsTrackingProvider>
              </RecurrencesProvider>
            </TeamsProvider>
          </ProfessionalsProvider>
        </CompaniesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
