"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { companyCancellationsApi } from "@/lib/api/company-cancellations"
import type { Cancellation, CancellationFormData, CancellationFilters } from "@/types/cancellation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface CancellationStats {
  total: number
  pending: number
  processed: number
  rejected: number
  totalRefunded: number
  averageRefundTime: number
  topReasons: Array<{ reason: string; count: number }>
}

interface CompanyCancellationsContextType {
  cancellations: Cancellation[]
  loading: boolean
  error: string | null
  filters: CancellationFilters
  stats: CancellationStats | null
  fetchCancellations: () => Promise<void>
  fetchCancellationById: (id: string) => Promise<Cancellation | null>
  addCancellation: (data: CancellationFormData) => Promise<void>
  updateCancellation: (id: string, data: Partial<CancellationFormData>) => Promise<void>
  processRefund: (id: string, status: "processed" | "rejected", notes?: string) => Promise<void>
  fetchStats: () => Promise<void>
  exportCancellations: (format: "csv" | "excel" | "pdf") => Promise<void>
  setFilters: (filters: CancellationFilters) => void
  resetFilters: () => void
}

const CompanyCancellationsContext = createContext<CompanyCancellationsContextType | undefined>(undefined)

export function CompanyCancellationsProvider({ children }: { children: ReactNode }) {
  const [cancellations, setCancellations] = useState<Cancellation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CancellationFilters>({})
  const [stats, setStats] = useState<CancellationStats | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const companyId = user?.companyId || ""

  const fetchCancellations = useCallback(async () => {
    if (!companyId) return

    setLoading(true)
    setError(null)
    try {
      const data = await companyCancellationsApi.getCancellations(companyId, filters)
      setCancellations(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch cancellations"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [companyId, filters, toast])

  const fetchCancellationById = useCallback(
    async (id: string) => {
      if (!companyId) return null

      try {
        const data = await companyCancellationsApi.getCancellationById(companyId, id)
        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch cancellation"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      }
    },
    [companyId, toast],
  )

  const addCancellation = useCallback(
    async (data: CancellationFormData) => {
      if (!companyId) return

      setLoading(true)
      setError(null)
      try {
        const newCancellation = await companyCancellationsApi.createCancellation(companyId, data)
        setCancellations((prev) => [...prev, newCancellation])
        toast({
          title: "Success",
          description: "Cancellation created successfully",
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create cancellation"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [companyId, toast],
  )

  const updateCancellation = useCallback(
    async (id: string, data: Partial<CancellationFormData>) => {
      if (!companyId) return

      setLoading(true)
      setError(null)
      try {
        const updatedCancellation = await companyCancellationsApi.updateCancellation(companyId, id, data)
        setCancellations((prev) => prev.map((c) => (c.id === id ? updatedCancellation : c)))
        toast({
          title: "Success",
          description: "Cancellation updated successfully",
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update cancellation"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [companyId, toast],
  )

  const processRefund = useCallback(
    async (id: string, status: "processed" | "rejected", notes?: string) => {
      if (!companyId) return

      setLoading(true)
      setError(null)
      try {
        const updatedCancellation = await companyCancellationsApi.processRefund(companyId, id, status, notes)
        setCancellations((prev) => prev.map((c) => (c.id === id ? updatedCancellation : c)))
        toast({
          title: "Success",
          description: `Refund ${status === "processed" ? "processed" : "rejected"} successfully`,
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to process refund"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [companyId, toast],
  )

  const fetchStats = useCallback(async () => {
    if (!companyId) return

    try {
      const data = await companyCancellationsApi.getCancellationStats(companyId, filters)
      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch cancellation stats"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [companyId, filters, toast])

  const exportCancellations = useCallback(
    async (format: "csv" | "excel" | "pdf") => {
      if (!companyId) return

      try {
        const blob = await companyCancellationsApi.exportCancellations(companyId, format, filters)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `cancellations-${new Date().toISOString().split("T")[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast({
          title: "Success",
          description: "Cancellations exported successfully",
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to export cancellations"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    },
    [companyId, filters, toast],
  )

  const resetFilters = useCallback(() => {
    setFilters({})
  }, [])

  const value = {
    cancellations,
    loading,
    error,
    filters,
    stats,
    fetchCancellations,
    fetchCancellationById,
    addCancellation,
    updateCancellation,
    processRefund,
    fetchStats,
    exportCancellations,
    setFilters,
    resetFilters,
  }

  return <CompanyCancellationsContext.Provider value={value}>{children}</CompanyCancellationsContext.Provider>
}

export function useCompanyCancellationsContext() {
  const context = useContext(CompanyCancellationsContext)
  if (context === undefined) {
    throw new Error("useCompanyCancellationsContext must be used within a CompanyCancellationsProvider")
  }
  return context
}
