"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/api/utils"

export interface Material {
  id: number
  name: string
  description: string
  category: string
  unit: string
  costPerUnit: number
  currentStock: number
  minimumStock: number
  supplierId?: number
  supplierName?: string
  isActive: boolean
  createdDate: string
  updatedDate: string
}

export interface MaterialFilters {
  search?: string
  category?: string
  isActive?: boolean
  lowStock?: boolean
  supplierId?: number
  sortBy?: "name" | "category" | "currentStock" | "costPerUnit" | "createdDate"
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
}

export interface MaterialFormData {
  name: string
  description: string
  category: string
  unit: string
  costPerUnit: number
  currentStock: number
  minimumStock: number
  supplierId?: number
  isActive: boolean
}

export interface MaterialStats {
  totalMaterials: number
  activeMaterials: number
  lowStockMaterials: number
  totalValue: number
  categories: string[]
}

interface ApiResponse<T> {
  results?: T[]
  data?: T[]
  items?: T[]
  totalCount?: number
  totalPages?: number
  currentPage?: number
}

export function useAdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MaterialFilters>({
    page: 1,
    pageSize: 10,
    sortBy: "name",
    sortOrder: "asc",
  })
  const [stats, setStats] = useState<MaterialStats>({
    totalMaterials: 0,
    activeMaterials: 0,
    lowStockMaterials: 0,
    totalValue: 0,
    categories: [],
  })
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { toast } = useToast()

  const extractArrayFromResponse = <T,>(response: any): { data: T[]; totalCount: number; totalPages: number } => {
    if (Array.isArray(response)) {
      return { data: response, totalCount: response.length, totalPages: 1 }
    }
    if (response?.results && Array.isArray(response.results)) {
      return {
        data: response.results,
        totalCount: response.totalCount || response.results.length,
        totalPages: response.totalPages || 1,
      }
    }
    if (response?.data && Array.isArray(response.data)) {
      return {
        data: response.data,
        totalCount: response.totalCount || response.data.length,
        totalPages: response.totalPages || 1,
      }
    }
    if (response?.items && Array.isArray(response.items)) {
      return {
        data: response.items,
        totalCount: response.totalCount || response.items.length,
        totalPages: response.totalPages || 1,
      }
    }
    return { data: [], totalCount: 0, totalPages: 0 }
  }

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.category) params.append("category", filters.category)
      if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString())
      if (filters.lowStock) params.append("lowStock", filters.lowStock.toString())
      if (filters.supplierId) params.append("supplierId", filters.supplierId.toString())
      if (filters.sortBy) params.append("sortBy", filters.sortBy)
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder)
      if (filters.page) params.append("page", filters.page.toString())
      if (filters.pageSize) params.append("pageSize", filters.pageSize.toString())

      const queryString = params.toString()
      const endpoint = queryString ? `/Material?${queryString}` : "/Material"

      console.log("Fetching materials from:", endpoint)
      const response = await apiRequest<ApiResponse<Material> | Material[]>(endpoint)

      const { data: materialsData, totalCount: count, totalPages: pages } = extractArrayFromResponse<Material>(response)

      // Ensure all materials have required properties with safe defaults
      const safeMaterials = materialsData.map((material) => ({
        ...material,
        currentStock: typeof material.currentStock === "number" ? material.currentStock : 0,
        minimumStock: typeof material.minimumStock === "number" ? material.minimumStock : 0,
        costPerUnit: typeof material.costPerUnit === "number" ? material.costPerUnit : 0,
        isActive: typeof material.isActive === "boolean" ? material.isActive : true,
        name: material.name || "Unknown Material",
        category: material.category || "Uncategorized",
        unit: material.unit || "unit",
        description: material.description || "",
      }))

      setMaterials(safeMaterials)
      setTotalCount(count)
      setTotalPages(pages)

      // Calculate stats with safe defaults
      const totalMaterials = safeMaterials.length
      const activeMaterials = safeMaterials.filter((m) => m.isActive).length
      const lowStockMaterials = safeMaterials.filter(
        (m) =>
          typeof m.currentStock === "number" && typeof m.minimumStock === "number" && m.currentStock <= m.minimumStock,
      ).length
      const totalValue = safeMaterials.reduce((sum, m) => {
        const stock = typeof m.currentStock === "number" ? m.currentStock : 0
        const cost = typeof m.costPerUnit === "number" ? m.costPerUnit : 0
        return sum + stock * cost
      }, 0)
      const categories = [...new Set(safeMaterials.map((m) => m.category))].filter(Boolean)

      setStats({
        totalMaterials,
        activeMaterials,
        lowStockMaterials,
        totalValue,
        categories,
      })

      console.log(`Loaded ${safeMaterials.length} materials`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch materials"
      setError(errorMessage)
      console.error("Error fetching materials:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, toast])

  const createMaterial = async (materialData: MaterialFormData): Promise<Material | null> => {
    try {
      console.log("Creating material:", materialData)
      const response = await apiRequest<Material>("/Material", {
        method: "POST",
        body: JSON.stringify(materialData),
      })

      toast({
        title: "Success",
        description: "Material created successfully",
      })

      await fetchMaterials() // Refresh the list
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create material"
      console.error("Error creating material:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    }
  }

  const updateMaterial = async (id: number, materialData: Partial<MaterialFormData>): Promise<Material | null> => {
    try {
      console.log("Updating material:", id, materialData)
      const response = await apiRequest<Material>(`/Material/${id}`, {
        method: "PUT",
        body: JSON.stringify(materialData),
      })

      toast({
        title: "Success",
        description: "Material updated successfully",
      })

      await fetchMaterials() // Refresh the list
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update material"
      console.error("Error updating material:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    }
  }

  const deleteMaterial = async (id: number): Promise<boolean> => {
    try {
      console.log("Deleting material:", id)
      await apiRequest(`/Material/${id}`, {
        method: "DELETE",
      })

      toast({
        title: "Success",
        description: "Material deleted successfully",
      })

      await fetchMaterials() // Refresh the list
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete material"
      console.error("Error deleting material:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  const getMaterialById = async (id: number): Promise<Material | null> => {
    try {
      console.log("Fetching material by ID:", id)
      const response = await apiRequest<Material>(`/Material/${id}`)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch material"
      console.error("Error fetching material by ID:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    }
  }

  const updateStock = async (id: number, newStock: number): Promise<boolean> => {
    try {
      console.log("Updating stock for material:", id, "New stock:", newStock)
      await apiRequest(`/Material/${id}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ currentStock: newStock }),
      })

      toast({
        title: "Success",
        description: "Stock updated successfully",
      })

      await fetchMaterials() // Refresh the list
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update stock"
      console.error("Error updating stock:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  const updateFilters = (newFilters: Partial<MaterialFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })) // Reset to page 1 when filters change
  }

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const reloadData = () => {
    fetchMaterials()
  }

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  return {
    materials,
    loading,
    error,
    filters,
    stats,
    totalCount,
    totalPages,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
    updateStock,
    updateFilters,
    setPage,
    reloadData,
  }
}
