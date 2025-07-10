"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { cancellationsApi } from "@/lib/api/cancellations"
import type { Cancellation, CancellationFormData, CancellationFilters } from "@/types/cancellation"
import { useToast } from "@/hooks/use-toast"

interface CancellationsContextType {
  cancellations: Cancellation[]
  loading: boolean
  error: string | null
  filters: CancellationFilters
  fetchCancellations: () => Promise<void>
  fetchCancellationById: (id: string) => Promise<Cancellation | null>
  addCancellation: (data: CancellationFormData) => Promise<void>
  updateCancellation: (id: string, data: Partial<CancellationFormData>) => Promise<void>
  deleteCancellation: (id: string) => Promise<void>
  fetchCancellationsByCompany: (companyId: string) => Promise<void>
  fetchCancellationsByCustomer: (customerId: string) => Promise<void>
  fetchCancellationsByRefundStatus: (status: string) => Promise<void>
  processRefund: (id: string, status: "processed" | "rejected", notes?: string) => Promise<void>
  setFilters: (filters: CancellationFilters) => void
  resetFilters: () => void
}

const CancellationsContext = createContext<CancellationsContextType | undefined>(undefined)

export function CancellationsProvider({ children }: { children: ReactNode }) {
  const [cancellations, setCancellations] = useState<Cancellation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CancellationFilters>({})
  const { toast } = useToast()

  const fetchCancellations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await cancellationsApi.getCancellations(filters)
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
  }, [filters, toast])

  const fetchCancellationById = useCallback(
    async (id: string) => {
      try {
        const data = await cancellationsApi.getCancellationById(id)
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
    [toast],
  )

  const addCancellation = useCallback(
    async (data: CancellationFormData) => {
      setLoading(true)
      setError(null)
      try {
        const newCancellation = await cancellationsApi.createCancellation(data)
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
    [toast],
  )

  const updateCancellation = useCallback(
    async (id: string, data: Partial<CancellationFormData>) => {
      setLoading(true)
      setError(null)
      try {
        const updatedCancellation = await cancellationsApi.updateCancellation(id, data)
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
    [toast],
  )

  const deleteCancellation = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        await cancellationsApi.deleteCancellation(id)
        setCancellations((prev) => prev.filter((c) => c.id !== id))
        toast({
          title: "Success",
          description: "Cancellation deleted successfully",
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete cancellation"
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
    [toast],
  )

  const fetchCancellationsByCompany = useCallback(
    async (companyId: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await cancellationsApi.getCancellationsByCompany(companyId)
        setCancellations(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch cancellations by company"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const fetchCancellationsByCustomer = useCallback(
    async (customerId: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await cancellationsApi.getCancellationsByCustomer(customerId)
        setCancellations(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch cancellations by customer"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const fetchCancellationsByRefundStatus = useCallback(
    async (status: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await cancellationsApi.getCancellationsByRefundStatus(status)
        setCancellations(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch cancellations by refund status"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const processRefund = useCallback(
    async (id: string, status: "processed" | "rejected", notes?: string) => {
      setLoading(true)
      setError(null)
      try {
        const updatedCancellation = await cancellationsApi.processRefund(id, status, notes)
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
    [toast],
  )

  const resetFilters = useCallback(() => {
    setFilters({})
  }, [])

  const value = {
    cancellations,
    loading,
    error,
    filters,
    fetchCancellations,
    fetchCancellationById,
    addCancellation,
    updateCancellation,
    deleteCancellation,
    fetchCancellationsByCompany,
    fetchCancellationsByCustomer,
    fetchCancellationsByRefundStatus,
    processRefund,
    setFilters,
    resetFilters,
  }

  return <CancellationsContext.Provider value={value}>{children}</CancellationsContext.Provider>
}

export function useCancellationsContext() {
  const context = useContext(CancellationsContext)
  if (context === undefined) {
    throw new Error("useCancellationsContext must be used within a CancellationsProvider")
  }
  return context
}
