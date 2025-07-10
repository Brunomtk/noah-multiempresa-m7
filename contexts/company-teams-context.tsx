"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import type { Team, Professional } from "@/types"
import {
  getCompanyTeams,
  getCompanyTeamById,
  createCompanyTeam,
  updateCompanyTeam,
  deleteCompanyTeam,
  getCompanyTeamMembers,
  getCompanyTeamPerformance,
  getCompanyTeamUpcomingServices,
  getCompanyAvailableProfessionals,
  getCompanyTeamStats,
} from "@/lib/api/company-teams"
import { useToast } from "@/hooks/use-toast"

interface CompanyTeamsContextType {
  teams: Team[]
  isLoading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  statusFilter: string
  searchQuery: string
  companyId: string | null
  stats: {
    totalTeams: number
    activeTeams: number
    inactiveTeams: number
    totalMembers: number
    averageRating: number
    totalCompletedServices: number
  } | null
  fetchTeams: (page?: number, status?: string, search?: string) => Promise<void>
  getTeam: (id: string) => Promise<Team | null>
  addTeam: (team: Partial<Team>) => Promise<Team | null>
  editTeam: (id: string, team: Partial<Team>) => Promise<Team | null>
  removeTeam: (id: string) => Promise<boolean>
  getMembers: (teamId: string) => Promise<Professional[]>
  getPerformance: (teamId: string) => Promise<{
    onTimeCompletion: number
    customerSatisfaction: number
    qualityScore: number
    efficiency: number
  } | null>
  getUpcomingServices: (teamId: string) => Promise<Array<{
    id: string
    date: string
    time: string
    customer: string
    address: string
    type: string
  }> | null>
  getAvailableProfessionals: () => Promise<Professional[]>
  fetchStats: () => Promise<void>
  setStatusFilter: (status: string) => void
  setSearchQuery: (query: string) => void
  setCompanyId: (id: string) => void
}

const CompanyTeamsContext = createContext<CompanyTeamsContextType | undefined>(undefined)

export function CompanyTeamsProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    totalTeams: number
    activeTeams: number
    inactiveTeams: number
    totalMembers: number
    averageRating: number
    totalCompletedServices: number
  } | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  })
  const { toast } = useToast()

  const fetchTeams = useCallback(
    async (page = 1, status = statusFilter, search = searchQuery) => {
      if (!companyId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await getCompanyTeams(companyId, page, pagination.itemsPerPage, status, search)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return
        }

        if (response.data) {
          setTeams(response.data.data)
          setPagination(response.data.meta)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch teams"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [companyId, statusFilter, searchQuery, pagination.itemsPerPage, toast],
  )

  const fetchStats = useCallback(async () => {
    if (!companyId) return

    try {
      const response = await getCompanyTeamStats(companyId)
      if (response.data) {
        setStats(response.data)
      }
    } catch (err) {
      console.error("Failed to fetch team stats:", err)
    }
  }, [companyId])

  const getTeam = useCallback(
    async (id: string): Promise<Team | null> => {
      if (!companyId) return null

      setIsLoading(true)
      setError(null)

      try {
        const response = await getCompanyTeamById(companyId, id)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        return response.data || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch team"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [companyId, toast],
  )

  const addTeam = useCallback(
    async (team: Partial<Team>): Promise<Team | null> => {
      if (!companyId) return null

      setIsLoading(true)
      setError(null)

      try {
        const response = await createCompanyTeam(companyId, team)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        if (response.data) {
          toast({
            title: "Success",
            description: response.message || "Team created successfully",
          })
          // Refresh teams list and stats
          fetchTeams()
          fetchStats()
          return response.data
        }

        return null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create team"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [companyId, fetchTeams, fetchStats, toast],
  )

  const editTeam = useCallback(
    async (id: string, team: Partial<Team>): Promise<Team | null> => {
      if (!companyId) return null

      setIsLoading(true)
      setError(null)

      try {
        const response = await updateCompanyTeam(companyId, id, team)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        if (response.data) {
          toast({
            title: "Success",
            description: response.message || "Team updated successfully",
          })
          // Refresh teams list and stats
          fetchTeams()
          fetchStats()
          return response.data
        }

        return null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update team"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [companyId, fetchTeams, fetchStats, toast],
  )

  const removeTeam = useCallback(
    async (id: string): Promise<boolean> => {
      if (!companyId) return false

      setIsLoading(true)
      setError(null)

      try {
        const response = await deleteCompanyTeam(companyId, id)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return false
        }

        toast({
          title: "Success",
          description: response.message || "Team deleted successfully",
        })
        // Refresh teams list and stats
        fetchTeams()
        fetchStats()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete team"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [companyId, fetchTeams, fetchStats, toast],
  )

  const getMembers = useCallback(
    async (teamId: string): Promise<Professional[]> => {
      if (!companyId) return []

      try {
        const response = await getCompanyTeamMembers(companyId, teamId)

        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return []
        }

        return response.data || []
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch team members"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return []
      }
    },
    [companyId, toast],
  )

  const getPerformance = useCallback(
    async (
      teamId: string,
    ): Promise<{
      onTimeCompletion: number
      customerSatisfaction: number
      qualityScore: number
      efficiency: number
    } | null> => {
      if (!companyId) return null

      try {
        const response = await getCompanyTeamPerformance(companyId, teamId)

        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        return response.data || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch team performance"
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

  const getUpcomingServices = useCallback(
    async (
      teamId: string,
    ): Promise<Array<{
      id: string
      date: string
      time: string
      customer: string
      address: string
      type: string
    }> | null> => {
      if (!companyId) return null

      try {
        const response = await getCompanyTeamUpcomingServices(companyId, teamId)

        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        return response.data || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch upcoming services"
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

  const getAvailableProfessionals = useCallback(async (): Promise<Professional[]> => {
    if (!companyId) return []

    try {
      const response = await getCompanyAvailableProfessionals(companyId)

      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return []
      }

      return response.data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch available professionals"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return []
    }
  }, [companyId, toast])

  // Fetch teams and stats when companyId changes
  useEffect(() => {
    if (companyId) {
      fetchTeams()
      fetchStats()
    }
  }, [companyId, fetchTeams, fetchStats])

  // Update when filters change
  useEffect(() => {
    if (companyId) {
      fetchTeams(1, statusFilter, searchQuery)
    }
  }, [statusFilter, searchQuery, companyId, fetchTeams])

  const value = useMemo(
    () => ({
      teams,
      isLoading,
      error,
      pagination,
      statusFilter,
      searchQuery,
      companyId,
      stats,
      fetchTeams,
      getTeam,
      addTeam,
      editTeam,
      removeTeam,
      getMembers,
      getPerformance,
      getUpcomingServices,
      getAvailableProfessionals,
      fetchStats,
      setStatusFilter,
      setSearchQuery,
      setCompanyId,
    }),
    [
      teams,
      isLoading,
      error,
      pagination,
      statusFilter,
      searchQuery,
      companyId,
      stats,
      fetchTeams,
      getTeam,
      addTeam,
      editTeam,
      removeTeam,
      getMembers,
      getPerformance,
      getUpcomingServices,
      getAvailableProfessionals,
      fetchStats,
    ],
  )

  return <CompanyTeamsContext.Provider value={value}>{children}</CompanyTeamsContext.Provider>
}

export function useCompanyTeams() {
  const context = useContext(CompanyTeamsContext)
  if (context === undefined) {
    throw new Error("useCompanyTeams must be used within a CompanyTeamsProvider")
  }
  return context
}
