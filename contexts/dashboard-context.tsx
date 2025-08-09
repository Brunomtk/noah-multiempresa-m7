"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useDashboard, type DashboardStats } from "@/hooks/use-dashboard"

interface DashboardContextType {
  stats: DashboardStats
  isLoading: boolean
  refresh: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const dashboardData = useDashboard()

  return <DashboardContext.Provider value={dashboardData}>{children}</DashboardContext.Provider>
}

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a DashboardProvider")
  }
  return context
}
