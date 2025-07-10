"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Company, PaginatedResponse } from "@/types"
import { companiesApi } from "@/lib/api/companies"
import { useToast } from "@/hooks/use-toast"

interface CompaniesContextType {
  companies: Company[]
  isLoading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  filters: {
    status: string
    search: string
  }
  fetchCompanies: (page?: number, limit?: number, status?: string, search?: string) => Promise<void>
  getCompanyById: (id: string) => Promise<Company | null>
  createCompany: (companyData: Omit<Company, "id" | "createdAt" | "updatedAt">) => Promise<Company | null>
  updateCompany: (id: string, companyData: Partial<Company>) => Promise<Company | null>
  deleteCompany: (id: string) => Promise<boolean>
  updateCompanyStatus: (id: string, status: "active" | "inactive") => Promise<Company | null>
  setFilters: (filters: { status?: string; search?: string }) => void
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(undefined)

export function CompaniesProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  })
  const [filters, setFiltersState] = useState({
    status: "all",
    search: "",
  })
  const { toast } = useToast()

  const fetchCompanies = useCallback(
    async (page = 1, limit = 10, status = filters.status, search = filters.search) => {
      // Evite atualizar o estado se já estiver carregando
      if (isLoading) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesApi.getCompanies(page, limit, status, search)

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
          const paginatedData = response.data as PaginatedResponse<Company>
          setCompanies(paginatedData.data)
          setPagination(paginatedData.meta)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch companies"
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
    [filters, toast, isLoading],
  )

  const getCompanyById = useCallback(
    async (id: string): Promise<Company | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesApi.getCompanyById(id)

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
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch company"
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
    [toast],
  )

  const createCompany = useCallback(
    async (companyData: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesApi.createCompany(companyData)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        toast({
          title: "Success",
          description: "Company created successfully",
        })

        // Refresh the companies list
        fetchCompanies(pagination.currentPage, pagination.itemsPerPage)

        return response.data || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create company"
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
    [fetchCompanies, pagination, toast],
  )

  const updateCompany = useCallback(
    async (id: string, companyData: Partial<Company>): Promise<Company | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesApi.updateCompany(id, companyData)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        toast({
          title: "Success",
          description: "Company updated successfully",
        })

        // Refresh the companies list
        fetchCompanies(pagination.currentPage, pagination.itemsPerPage)

        return response.data || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update company"
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
    [fetchCompanies, pagination, toast],
  )

  const deleteCompany = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesApi.deleteCompany(id)

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
          description: "Company deleted successfully",
          variant: "destructive",
        })

        // Refresh the companies list
        fetchCompanies(pagination.currentPage, pagination.itemsPerPage)

        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete company"
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
    [fetchCompanies, pagination, toast],
  )

  const updateCompanyStatus = useCallback(
    async (id: string, status: "active" | "inactive"): Promise<Company | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await companiesApi.updateCompanyStatus(id, status)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        toast({
          title: "Success",
          description: `Company ${status === "active" ? "activated" : "deactivated"} successfully`,
        })

        // Refresh the companies list
        fetchCompanies(pagination.currentPage, pagination.itemsPerPage)

        return response.data || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update company status"
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
    [fetchCompanies, pagination, toast],
  )

  const setFilters = useCallback(
    (newFilters: { status?: string; search?: string }) => {
      // Verifique se os filtros realmente mudaram antes de atualizar
      if (
        (newFilters.status !== undefined && newFilters.status !== filters.status) ||
        (newFilters.search !== undefined && newFilters.search !== filters.search)
      ) {
        const updatedFilters = {
          ...filters,
          ...newFilters,
        }
        setFiltersState(updatedFilters)
        fetchCompanies(1, pagination.itemsPerPage, updatedFilters.status, updatedFilters.search)
      }
    },
    [filters, fetchCompanies, pagination.itemsPerPage],
  )

  const value = {
    companies,
    isLoading,
    error,
    pagination,
    filters,
    fetchCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    updateCompanyStatus,
    setFilters,
  }

  return <CompaniesContext.Provider value={value}>{children}</CompaniesContext.Provider>
}

export function useCompanies() {
  const context = useContext(CompaniesContext)
  if (context === undefined) {
    throw new Error("useCompanies must be used within a CompaniesProvider")
  }
  return context
}
