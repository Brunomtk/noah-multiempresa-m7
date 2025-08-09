"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { companyCancellationsApi } from "@/lib/api/company-cancellations"
import { useAuth } from "@/contexts/auth-context"
import type {
  Cancellation,
  CancellationFormData,
  CancellationFilters,
  CancellationUpdateData,
  RefundProcessData,
  CancellationStats,
} from "@/types/cancellation"

interface CompanyCancellationsContextType {
  cancellations: Cancellation[]
  loading: boolean
  error: string | null
  stats: CancellationStats | null
  filters: CancellationFilters
  setFilters: (filters: CancellationFilters) => void
  fetchCancellations: () => Promise<void>
  fetchStats: () => Promise<void>
  addCancellation: (data: CancellationFormData) => Promise<void>
  updateCancellation: (id: number, data: CancellationUpdateData) => Promise<void>
  deleteCancellation: (id: number) => Promise<void>
  processRefund: (id: number, data: RefundProcessData) => Promise<void>
  exportCancellations: (format: "csv" | "excel" | "pdf") => Promise<void>
}

const CompanyCancellationsContext = createContext<CompanyCancellationsContextType | undefined>(undefined)

export function useCompanyCancellationsContext() {
  const context = useContext(CompanyCancellationsContext)
  if (!context) {
    throw new Error("useCompanyCancellationsContext must be used within a CompanyCancellationsProvider")
  }
  return context
}

interface CompanyCancellationsProviderProps {
  children: React.ReactNode
}

export function CompanyCancellationsProvider({ children }: CompanyCancellationsProviderProps) {
  const { user } = useAuth()
  const [cancellations, setCancellations] = useState<Cancellation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<CancellationStats | null>(null)
  const [filters, setFilters] = useState<CancellationFilters>({})

  const fetchCancellations = useCallback(async () => {
    if (!user?.companyId) return

    setLoading(true)
    setError(null)
    try {
      const data = await companyCancellationsApi.getCancellations(user.companyId, filters)
      setCancellations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cancellations")
      console.error("Error fetching cancellations:", err)
    } finally {
      setLoading(false)
    }
  }, [user?.companyId, filters])

  const fetchStats = useCallback(async () => {
    if (!user?.companyId) return

    try {
      const data = await companyCancellationsApi.getCancellationStats(user.companyId, filters)
      setStats(data)
    } catch (err) {
      console.error("Error fetching cancellation stats:", err)
    }
  }, [user?.companyId, filters])

  const addCancellation = useCallback(
    async (data: CancellationFormData) => {
      setLoading(true)
      setError(null)
      try {
        const newCancellation = await companyCancellationsApi.createCancellation(data)
        setCancellations((prev) => [newCancellation, ...prev])
        await fetchStats()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create cancellation")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchStats],
  )

  const updateCancellation = useCallback(
    async (id: number, data: CancellationUpdateData) => {
      setLoading(true)
      setError(null)
      try {
        const updatedCancellation = await companyCancellationsApi.updateCancellation(id, data)
        setCancellations((prev) =>
          prev.map((cancellation) => (cancellation.id === id ? updatedCancellation : cancellation)),
        )
        await fetchStats()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update cancellation")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchStats],
  )

  const deleteCancellation = useCallback(
    async (id: number) => {
      setLoading(true)
      setError(null)
      try {
        await companyCancellationsApi.deleteCancellation(id)
        setCancellations((prev) => prev.filter((cancellation) => cancellation.id !== id))
        await fetchStats()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete cancellation")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchStats],
  )

  const processRefund = useCallback(
    async (id: number, data: RefundProcessData) => {
      setLoading(true)
      setError(null)
      try {
        const updatedCancellation = await companyCancellationsApi.processRefund(id, data)
        setCancellations((prev) =>
          prev.map((cancellation) => (cancellation.id === id ? updatedCancellation : cancellation)),
        )
        await fetchStats()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process refund")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchStats],
  )

  const exportCancellations = useCallback(
    async (format: "csv" | "excel" | "pdf") => {
      if (!user?.companyId) return

      try {
        const blob = await companyCancellationsApi.exportCancellations(user.companyId, format, filters)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `cancellations.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to export cancellations")
        throw err
      }
    },
    [user?.companyId, filters],
  )

  const value: CompanyCancellationsContextType = {
    cancellations,
    loading,
    error,
    stats,
    filters,
    setFilters,
    fetchCancellations,
    fetchStats,
    addCancellation,
    updateCancellation,
    deleteCancellation,
    processRefund,
    exportCancellations,
  }

  return <CompanyCancellationsContext.Provider value={value}>{children}</CompanyCancellationsContext.Provider>
}
