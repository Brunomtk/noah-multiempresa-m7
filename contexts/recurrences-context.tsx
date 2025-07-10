"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Recurrence } from "@/types/recurrence"
import {
  getRecurrences,
  getRecurrenceById,
  createRecurrence,
  updateRecurrence,
  deleteRecurrence,
  getRecurrencesByCompany,
  getRecurrencesByCustomer,
  getRecurrencesByTeam,
  getRecurrencesByStatus,
  getRecurrencesByType,
  searchRecurrences,
} from "@/lib/api/recurrences"
import { useToast } from "@/hooks/use-toast"

interface RecurrencesContextType {
  recurrences: Recurrence[]
  loading: boolean
  error: string | null
  selectedRecurrence: Recurrence | null
  fetchRecurrences: () => Promise<void>
  fetchRecurrenceById: (id: string) => Promise<Recurrence | null>
  addRecurrence: (data: Omit<Recurrence, "id" | "createdAt" | "updatedAt">) => Promise<Recurrence | null>
  editRecurrence: (id: string, data: Partial<Recurrence>) => Promise<Recurrence | null>
  removeRecurrence: (id: string) => Promise<boolean>
  selectRecurrence: (recurrence: Recurrence | null) => void
  fetchRecurrencesByCompany: (companyId: string) => Promise<void>
  fetchRecurrencesByCustomer: (customerId: string) => Promise<void>
  fetchRecurrencesByTeam: (teamId: string) => Promise<void>
  fetchRecurrencesByStatus: (status: string) => Promise<void>
  fetchRecurrencesByType: (type: string) => Promise<void>
  searchRecurrencesByQuery: (query: string) => Promise<void>
  filterRecurrences: (filters: RecurrenceFilters) => Recurrence[]
}

interface RecurrenceFilters {
  status?: string
  type?: string
  searchQuery?: string
}

const RecurrencesContext = createContext<RecurrencesContextType | undefined>(undefined)

export function RecurrencesProvider({ children }: { children: React.ReactNode }) {
  const [recurrences, setRecurrences] = useState<Recurrence[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRecurrence, setSelectedRecurrence] = useState<Recurrence | null>(null)
  const { toast } = useToast()

  const fetchRecurrences = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecurrences()
      setRecurrences(data)
    } catch (err) {
      setError("Failed to fetch recurrences")
      toast({
        title: "Error",
        description: "Failed to fetch recurrences. Please try again.",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchRecurrenceById = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await getRecurrenceById(id)
        return data
      } catch (err) {
        setError(`Failed to fetch recurrence with ID ${id}`)
        toast({
          title: "Error",
          description: `Failed to fetch recurrence details. Please try again.`,
          variant: "destructive",
        })
        console.error(err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const addRecurrence = useCallback(
    async (data: Omit<Recurrence, "id" | "createdAt" | "updatedAt">) => {
      setLoading(true)
      setError(null)
      try {
        const newRecurrence = await createRecurrence(data)
        setRecurrences((prev) => [...prev, newRecurrence])
        toast({
          title: "Success",
          description: "Recurrence created successfully.",
        })
        return newRecurrence
      } catch (err) {
        setError("Failed to create recurrence")
        toast({
          title: "Error",
          description: "Failed to create recurrence. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const editRecurrence = useCallback(
    async (id: string, data: Partial<Recurrence>) => {
      setLoading(true)
      setError(null)
      try {
        const updatedRecurrence = await updateRecurrence(id, data)
        setRecurrences((prev) => prev.map((recurrence) => (recurrence.id === id ? updatedRecurrence : recurrence)))
        toast({
          title: "Success",
          description: "Recurrence updated successfully.",
        })
        return updatedRecurrence
      } catch (err) {
        setError(`Failed to update recurrence with ID ${id}`)
        toast({
          title: "Error",
          description: "Failed to update recurrence. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const removeRecurrence = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        await deleteRecurrence(id)
        setRecurrences((prev) => prev.filter((recurrence) => recurrence.id !== id))
        toast({
          title: "Success",
          description: "Recurrence deleted successfully.",
        })
        return true
      } catch (err) {
        setError(`Failed to delete recurrence with ID ${id}`)
        toast({
          title: "Error",
          description: "Failed to delete recurrence. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return false
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const selectRecurrence = useCallback((recurrence: Recurrence | null) => {
    setSelectedRecurrence(recurrence)
  }, [])

  const fetchRecurrencesByCompany = useCallback(
    async (companyId: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await getRecurrencesByCompany(companyId)
        setRecurrences(data)
      } catch (err) {
        setError(`Failed to fetch recurrences for company ${companyId}`)
        toast({
          title: "Error",
          description: "Failed to fetch company recurrences. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const fetchRecurrencesByCustomer = useCallback(
    async (customerId: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await getRecurrencesByCustomer(customerId)
        setRecurrences(data)
      } catch (err) {
        setError(`Failed to fetch recurrences for customer ${customerId}`)
        toast({
          title: "Error",
          description: "Failed to fetch customer recurrences. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const fetchRecurrencesByTeam = useCallback(
    async (teamId: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await getRecurrencesByTeam(teamId)
        setRecurrences(data)
      } catch (err) {
        setError(`Failed to fetch recurrences for team ${teamId}`)
        toast({
          title: "Error",
          description: "Failed to fetch team recurrences. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const fetchRecurrencesByStatus = useCallback(
    async (status: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await getRecurrencesByStatus(status)
        setRecurrences(data)
      } catch (err) {
        setError(`Failed to fetch recurrences with status ${status}`)
        toast({
          title: "Error",
          description: "Failed to filter recurrences by status. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const fetchRecurrencesByType = useCallback(
    async (type: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await getRecurrencesByType(type)
        setRecurrences(data)
      } catch (err) {
        setError(`Failed to fetch recurrences with type ${type}`)
        toast({
          title: "Error",
          description: "Failed to filter recurrences by type. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const searchRecurrencesByQuery = useCallback(
    async (query: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchRecurrences(query)
        setRecurrences(data)
      } catch (err) {
        setError(`Failed to search recurrences with query "${query}"`)
        toast({
          title: "Error",
          description: "Failed to search recurrences. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const filterRecurrences = useCallback(
    (filters: RecurrenceFilters) => {
      let filtered = [...recurrences]

      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((r) => r.status === filters.status)
      }

      if (filters.type && filters.type !== "all") {
        filtered = filtered.filter((r) => r.type === filters.type)
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(query) || (r.customerName && r.customerName.toLowerCase().includes(query)),
        )
      }

      return filtered
    },
    [recurrences],
  )

  useEffect(() => {
    fetchRecurrences()
  }, [fetchRecurrences])

  const value = {
    recurrences,
    loading,
    error,
    selectedRecurrence,
    fetchRecurrences,
    fetchRecurrenceById,
    addRecurrence,
    editRecurrence,
    removeRecurrence,
    selectRecurrence,
    fetchRecurrencesByCompany,
    fetchRecurrencesByCustomer,
    fetchRecurrencesByTeam,
    fetchRecurrencesByStatus,
    fetchRecurrencesByType,
    searchRecurrencesByQuery,
    filterRecurrences,
  }

  return <RecurrencesContext.Provider value={value}>{children}</RecurrencesContext.Provider>
}

export const useRecurrencesContext = () => {
  const context = useContext(RecurrencesContext)
  if (context === undefined) {
    throw new Error("useRecurrencesContext must be used within a RecurrencesProvider")
  }
  return context
}
