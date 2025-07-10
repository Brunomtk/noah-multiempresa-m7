"use client"

import { useState, useCallback } from "react"
import { useRecurrencesContext } from "@/contexts/recurrences-context"

interface UseRecurrencesOptions {
  initialFilters?: {
    status?: string
    type?: string
    searchQuery?: string
  }
}

export function useRecurrences(options: UseRecurrencesOptions = {}) {
  const {
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
  } = useRecurrencesContext()

  const [filters, setFilters] = useState({
    status: options.initialFilters?.status || "all",
    type: options.initialFilters?.type || "all",
    searchQuery: options.initialFilters?.searchQuery || "",
  })

  const filteredRecurrences = filterRecurrences(filters)

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      updateFilters({ searchQuery: query })
    },
    [updateFilters],
  )

  const handleStatusFilter = useCallback(
    (status: string) => {
      updateFilters({ status })
    },
    [updateFilters],
  )

  const handleTypeFilter = useCallback(
    (type: string) => {
      updateFilters({ type })
    },
    [updateFilters],
  )

  const resetFilters = useCallback(() => {
    setFilters({
      status: "all",
      type: "all",
      searchQuery: "",
    })
  }, [])

  // Helper function to get the day name from a number
  const getDayName = useCallback((day: number | undefined, frequency: string): string => {
    if (day === undefined) return ""

    if (frequency === "daily") {
      if (day === 0) return "Every day"
      if (day === 1) return "Every weekday"
      if (day === 2) return "Every weekend"
      return "Custom"
    }

    if (frequency === "weekly" || frequency === "biweekly") {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      return days[day % 7] || "Unknown"
    }

    if (frequency === "monthly") {
      if (day === 1) return "First Monday"
      if (day === 2) return "First Tuesday"
      if (day === 3) return "First Wednesday"
      if (day === 4) return "First Thursday"
      if (day === 5) return "First Friday"
      if (day === 25) return "Last Monday"
      if (day === 29) return "Last Friday"
      if (day === 31) return "Last day"
      return `${day}${getDaySuffix(day)}`
    }

    return `Day ${day}`
  }, [])

  // Helper function to get the day suffix (st, nd, rd, th)
  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "th"

    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  // Helper function to get frequency label
  const getFrequencyLabel = useCallback((frequency: string): string => {
    switch (frequency) {
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "biweekly":
        return "Bi-weekly"
      case "monthly":
        return "Monthly"
      default:
        return frequency
    }
  }, [])

  // Helper function to format duration
  const formatDuration = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins} minute${mins !== 1 ? "s" : ""}`
    if (mins === 0) return `${hours} hour${hours !== 1 ? "s" : ""}`

    return `${hours} hour${hours !== 1 ? "s" : ""} and ${mins} minute${mins !== 1 ? "s" : ""}`
  }, [])

  return {
    recurrences: filteredRecurrences,
    allRecurrences: recurrences,
    loading,
    error,
    selectedRecurrence,
    filters,
    fetchRecurrences,
    fetchRecurrenceById,
    addRecurrence,
    editRecurrence,
    removeRecurrence,
    selectRecurrence,
    fetchRecurrencesByCompany,
    fetchRecurrencesByCustomer,
    fetchRecurrencesByTeam,
    updateFilters,
    handleSearch,
    handleStatusFilter,
    handleTypeFilter,
    resetFilters,
    getDayName,
    getFrequencyLabel,
    formatDuration,
  }
}
