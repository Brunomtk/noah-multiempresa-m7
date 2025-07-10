"use client"

import { useState, useEffect } from "react"
import type { GPSTracking, GPSTrackingFilters } from "@/types/gps-tracking"
import { getGpsTrackingRecords } from "@/lib/api/gps-tracking"

export function useGpsTracking(initialFilters?: GPSTrackingFilters) {
  const [gpsRecords, setGpsRecords] = useState<GPSTracking[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<GPSTrackingFilters>(
    initialFilters || {
      status: "all",
      searchQuery: "",
    },
  )

  const fetchGpsRecords = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getGpsTrackingRecords(filters)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch GPS tracking records"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGpsRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const updateFilters = (newFilters: Partial<GPSTrackingFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      status: "all",
      searchQuery: "",
    })
  }

  // Helper function to format status for display
  const formatStatus = (status: "active" | "inactive") => {
    return status === "active" ? "Active" : "Inactive"
  }

  // Helper function to get status color
  const getStatusColor = (status: "active" | "inactive") => {
    return status === "active" ? "green" : "red"
  }

  return {
    gpsRecords,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshData: fetchGpsRecords,
    formatStatus,
    getStatusColor,
  }
}
