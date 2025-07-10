"use client"

import { useState, useEffect } from "react"
import type { GPSTracking } from "@/types/gps-tracking"
import {
  getCompanyGpsTrackingRecords,
  getCompanyGpsTrackingByStatus,
  type CompanyGpsTrackingFilters,
} from "@/lib/api/company-gps-tracking"

interface UseCompanyGpsTrackingProps {
  companyId: string
  initialFilters?: CompanyGpsTrackingFilters
}

export function useCompanyGpsTracking({ companyId, initialFilters }: UseCompanyGpsTrackingProps) {
  const [gpsRecords, setGpsRecords] = useState<GPSTracking[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CompanyGpsTrackingFilters>(
    initialFilters || {
      status: "all",
      searchQuery: "",
    },
  )

  const fetchGpsRecords = async () => {
    if (!companyId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyGpsTrackingRecords(companyId, filters)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch GPS tracking records"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (companyId) {
      fetchGpsRecords()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, filters])

  const updateFilters = (newFilters: Partial<CompanyGpsTrackingFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      status: "all",
      searchQuery: "",
    })
  }

  const fetchByStatus = async (status: "active" | "inactive" | "all") => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyGpsTrackingByStatus(companyId, status)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${status} GPS tracking records`
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to format status for display
  const formatStatus = (status: "active" | "inactive") => {
    return status === "active" ? "Active" : "Inactive"
  }

  // Helper function to get status color
  const getStatusColor = (status: "active" | "inactive") => {
    return status === "active" ? "green" : "red"
  }

  // Helper function to get professional status color
  const getProfessionalStatusColor = (status: string) => {
    switch (status) {
      case "on-service":
        return "bg-green-500/20 text-green-500 border-green-500"
      case "traveling":
        return "bg-blue-500/20 text-blue-500 border-blue-500"
      case "off-duty":
        return "bg-gray-500/20 text-gray-400 border-gray-500"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  // Helper function to format professional status for display
  const formatProfessionalStatus = (status: string) => {
    switch (status) {
      case "on-service":
        return "On Service"
      case "traveling":
        return "Traveling"
      case "off-duty":
        return "Off Duty"
      default:
        return status
    }
  }

  return {
    gpsRecords,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshData: fetchGpsRecords,
    fetchByStatus,
    formatStatus,
    getStatusColor,
    getProfessionalStatusColor,
    formatProfessionalStatus,
  }
}
