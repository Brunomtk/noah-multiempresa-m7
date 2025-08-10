"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getDashboardStats } from "@/lib/api/dashboard"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  companies: {
    total: number
    active: number
    loading: boolean
  }
  customers: {
    total: number
    active: number
    loading: boolean
  }
  appointments: {
    total: number
    scheduled: number
    completed: number
    cancelled: number
    loading: boolean
  }
  checkRecords: {
    total: number
    checkedIn: number
    checkedOut: number
    loading: boolean
  }
  payments: {
    total: number
    paid: number
    pending: number
    overdue: number
    totalAmount: number
    loading: boolean
  }
}

interface DashboardContextType {
  stats: DashboardStats
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider")
  }
  return context
}

interface DashboardProviderProps {
  children: ReactNode
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [stats, setStats] = useState<DashboardStats>({
    companies: { total: 0, active: 0, loading: true },
    customers: { total: 0, active: 0, loading: true },
    appointments: { total: 0, scheduled: 0, completed: 0, cancelled: 0, loading: true },
    checkRecords: { total: 0, checkedIn: 0, checkedOut: 0, loading: true },
    payments: { total: 0, paid: 0, pending: 0, overdue: 0, totalAmount: 0, loading: true },
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("Fetching dashboard stats...")
      const dashboardStats = await getDashboardStats()
      console.log("Dashboard stats received:", dashboardStats)
      setStats(dashboardStats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard stats"
      console.error("Dashboard stats error:", errorMessage)
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refresh = async () => {
    await fetchStats()
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const value: DashboardContextType = {
    stats,
    isLoading,
    error,
    refresh,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
