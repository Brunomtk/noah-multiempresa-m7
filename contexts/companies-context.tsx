"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Company } from "@/types"
import { fetchApi } from "@/lib/api/utils"
import { toast } from "sonner"

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
  createCompany: (companyData: any) => Promise<Company | null>
  updateCompany: (id: string, companyData: any) => Promise<Company | null>
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

  const fetchCompanies = useCallback(
    async (page = 1, limit = 10, status = filters.status, search = filters.search) => {
      if (isLoading) return

      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          pageNumber: page.toString(),
          pageSize: limit.toString(),
        })

        if (search) {
          params.append("Name", search)
        }

        const response = await fetchApi(`/Companies/paged?${params.toString()}`)

        if (response && response.data) {
          setCompanies(response.data)
          setPagination(response.meta)
        } else {
          setCompanies([])
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch companies"
        setError(errorMessage)
        toast.error(errorMessage)
        setCompanies([])
      } finally {
        setIsLoading(false)
      }
    },
    [filters, isLoading],
  )

  const getCompanyById = useCallback(async (id: string): Promise<Company | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi(`/Companies/${id}`)
      return response || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch company"
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createCompany = useCallback(
    async (companyData: any): Promise<Company | null> => {
      setIsLoading(true)
      setError(null)

      try {
        await fetchApi("/Companies/create", {
          method: "POST",
          body: JSON.stringify(companyData),
        })

        toast.success("Company created successfully")

        // Refresh the companies list
        await fetchCompanies(pagination.currentPage, pagination.itemsPerPage)

        return companyData as Company
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create company"
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetchCompanies, pagination],
  )

  const updateCompany = useCallback(
    async (id: string, companyData: any): Promise<Company | null> => {
      setIsLoading(true)
      setError(null)

      try {
        await fetchApi(`/Companies/${id}`, {
          method: "PUT",
          body: JSON.stringify(companyData),
        })

        toast.success("Company updated successfully")

        // Refresh the companies list
        await fetchCompanies(pagination.currentPage, pagination.itemsPerPage)

        return companyData as Company
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update company"
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetchCompanies, pagination],
  )

  const deleteCompany = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        await fetchApi(`/Companies/${id}`, {
          method: "DELETE",
        })

        toast.success("Company deleted successfully")

        // Refresh the companies list
        await fetchCompanies(pagination.currentPage, pagination.itemsPerPage)

        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete company"
        setError(errorMessage)
        toast.error(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [fetchCompanies, pagination],
  )

  const updateCompanyStatus = useCallback(
    async (id: string, status: "active" | "inactive"): Promise<Company | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const statusValue = status === "active" ? 1 : 0
        await fetchApi(`/Companies/${id}`, {
          method: "PUT",
          body: JSON.stringify({ status: statusValue }),
        })

        toast.success(`Company ${status === "active" ? "activated" : "deactivated"} successfully`)

        // Refresh the companies list
        await fetchCompanies(pagination.currentPage, pagination.itemsPerPage)

        return null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update company status"
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetchCompanies, pagination],
  )

  const setFilters = useCallback(
    (newFilters: { status?: string; search?: string }) => {
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
