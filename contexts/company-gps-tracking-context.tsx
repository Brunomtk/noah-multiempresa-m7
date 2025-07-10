"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import type { GPSTracking } from "@/types/gps-tracking"
import {
  getCompanyGpsTrackingRecords,
  getCompanyGpsTrackingRecord,
  getCompanyTeamGpsTrackingRecords,
  getCompanyProfessionalGpsTrackingRecords,
  getCompanyActiveGpsTracking,
  getCompanyInactiveGpsTracking,
  updateCompanyGpsTrackingStatus,
  getCompanyGpsTrackingByStatus,
  searchCompanyGpsTracking,
  type CompanyGpsTrackingFilters,
} from "@/lib/api/company-gps-tracking"

interface CompanyGpsTrackingContextType {
  gpsRecords: GPSTracking[]
  selectedGpsRecord: GPSTracking | null
  isLoading: boolean
  error: string | null
  filters: CompanyGpsTrackingFilters
  fetchGpsRecords: (companyId: string, filters?: CompanyGpsTrackingFilters) => Promise<void>
  fetchGpsRecord: (companyId: string, id: string) => Promise<void>
  fetchGpsRecordsByTeam: (companyId: string, teamId: string) => Promise<void>
  fetchGpsRecordsByProfessional: (companyId: string, professionalId: string) => Promise<void>
  fetchActiveGpsRecords: (companyId: string) => Promise<void>
  fetchInactiveGpsRecords: (companyId: string) => Promise<void>
  updateGpsStatus: (companyId: string, id: string, status: "active" | "inactive") => Promise<GPSTracking>
  fetchGpsRecordsByStatus: (companyId: string, status: "active" | "inactive" | "all") => Promise<void>
  searchGpsRecords: (companyId: string, query: string) => Promise<void>
  setFilters: (filters: CompanyGpsTrackingFilters) => void
  resetFilters: () => void
}

const CompanyGpsTrackingContext = createContext<CompanyGpsTrackingContextType | undefined>(undefined)

export function CompanyGpsTrackingProvider({ children }: { children: ReactNode }) {
  const [gpsRecords, setGpsRecords] = useState<GPSTracking[]>([])
  const [selectedGpsRecord, setSelectedGpsRecord] = useState<GPSTracking | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CompanyGpsTrackingFilters>({
    status: "all",
    searchQuery: "",
  })
  const { toast } = useToast()

  const fetchGpsRecords = async (companyId: string, customFilters?: CompanyGpsTrackingFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const filtersToUse = customFilters || filters
      const data = await getCompanyGpsTrackingRecords(companyId, filtersToUse)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch GPS tracking records"
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

  const fetchGpsRecord = async (companyId: string, id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyGpsTrackingRecord(companyId, id)
      setSelectedGpsRecord(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch GPS tracking record ${id}`
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

  const fetchGpsRecordsByTeam = async (companyId: string, teamId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyTeamGpsTrackingRecords(companyId, teamId)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to fetch GPS tracking records for team ${teamId}`
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

  const fetchGpsRecordsByProfessional = async (companyId: string, professionalId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyProfessionalGpsTrackingRecords(companyId, professionalId)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to fetch GPS tracking records for professional ${professionalId}`
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

  const fetchActiveGpsRecords = async (companyId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyActiveGpsTracking(companyId)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch active GPS tracking records"
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

  const fetchInactiveGpsRecords = async (companyId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyInactiveGpsTracking(companyId)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch inactive GPS tracking records"
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

  const updateGpsStatus = async (companyId: string, id: string, status: "active" | "inactive") => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedRecord = await updateCompanyGpsTrackingStatus(companyId, id, status)

      // Update records list
      setGpsRecords((prev) => prev.map((record) => (record.id === id ? updatedRecord : record)))

      // Update selected record if it's the one being edited
      if (selectedGpsRecord && selectedGpsRecord.id === id) {
        setSelectedGpsRecord(updatedRecord)
      }

      toast({
        title: "Success",
        description: `GPS tracking status updated to ${status}`,
      })

      return updatedRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update GPS tracking status for ${id}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGpsRecordsByStatus = async (companyId: string, status: "active" | "inactive" | "all") => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyGpsTrackingByStatus(companyId, status)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to fetch GPS tracking records with status ${status}`
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

  const searchGpsRecords = async (companyId: string, query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await searchCompanyGpsTracking(companyId, query)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search GPS tracking records"
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

  const resetFilters = () => {
    setFilters({
      status: "all",
      searchQuery: "",
    })
  }

  const value = {
    gpsRecords,
    selectedGpsRecord,
    isLoading,
    error,
    filters,
    fetchGpsRecords,
    fetchGpsRecord,
    fetchGpsRecordsByTeam,
    fetchGpsRecordsByProfessional,
    fetchActiveGpsRecords,
    fetchInactiveGpsRecords,
    updateGpsStatus,
    fetchGpsRecordsByStatus,
    searchGpsRecords,
    setFilters,
    resetFilters,
  }

  return <CompanyGpsTrackingContext.Provider value={value}>{children}</CompanyGpsTrackingContext.Provider>
}

export function useCompanyGpsTracking() {
  const context = useContext(CompanyGpsTrackingContext)
  if (context === undefined) {
    throw new Error("useCompanyGpsTracking must be used within a CompanyGpsTrackingProvider")
  }
  return context
}
