"use client"

import { useState, useEffect, useCallback } from "react"
import type { Material } from "@/types/material"
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  addStock,
  useMaterial,
} from "@/lib/api/company-materials"

export interface MaterialFilters {
  search?: string
  category?: string
  isActive?: boolean
  lowStock?: boolean
  sortBy?: "name" | "category" | "currentStock" | "costPerUnit" | "createdAt"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface MaterialStats {
  totalMaterials: number
  activeMaterials: number
  lowStockMaterials: number
  totalValue: number
  categories: string[]
}

export function useCompanyMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MaterialFilters>({
    page: 1,
    limit: 10,
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

  const loadMaterials = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getMaterials(filters)
      setMaterials(response.materials)
      setTotalCount(response.totalCount)
      setTotalPages(response.totalPages)
      setStats(response.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load materials")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadMaterials()
  }, [loadMaterials])

  const updateFilters = useCallback((newFilters: Partial<MaterialFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const reloadData = useCallback(() => {
    loadMaterials()
  }, [loadMaterials])

  const createNewMaterial = useCallback(
    async (materialData: Omit<Material, "id" | "createdAt" | "updatedAt">) => {
      try {
        await createMaterial(materialData)
        await loadMaterials()
      } catch (err) {
        throw err
      }
    },
    [loadMaterials],
  )

  const updateExistingMaterial = useCallback(
    async (id: string, materialData: Partial<Material>) => {
      try {
        await updateMaterial(id, materialData)
        await loadMaterials()
      } catch (err) {
        throw err
      }
    },
    [loadMaterials],
  )

  const deleteMaterialById = useCallback(
    async (id: string) => {
      try {
        await deleteMaterial(id)
        await loadMaterials()
      } catch (err) {
        throw err
      }
    },
    [loadMaterials],
  )

  const addStockToMaterial = useCallback(
    async (id: string, quantity: number, notes?: string) => {
      try {
        await addStock(id, quantity, notes)
        await loadMaterials()
      } catch (err) {
        throw err
      }
    },
    [loadMaterials],
  )

  const useMaterialFromStock = useCallback(
    async (id: string, quantity: number, notes?: string) => {
      try {
        await useMaterial(id, quantity, notes)
      } catch (err) {
        throw err
      }
    },
    [loadMaterials],
  )

  return {
    materials,
    loading,
    error,
    filters,
    stats,
    totalCount,
    totalPages,
    updateFilters,
    setPage,
    reloadData,
    createMaterial: createNewMaterial,
    updateMaterial: updateExistingMaterial,
    deleteMaterial: deleteMaterialById,
    addStock: addStockToMaterial,
    useMaterial: useMaterialFromStock,
  }
}

// Export utility functions
export const useCompanyMaterialsUtils = {
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  },

  getStockStatus: (material: Material) => {
    if (!material || material.currentStock === null || material.currentStock === undefined) {
      return { label: "Unknown", color: "bg-gray-100 text-gray-800 border-gray-200" }
    }

    if (material.currentStock <= 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" }
    }
    if (material.currentStock <= material.minimumStock) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    }
    return { label: "In Stock", color: "bg-green-100 text-green-800 border-green-200" }
  },

  calculateTotalValue: (materials: Material[]) => {
    return materials.reduce((total, material) => {
      if (material && material.currentStock && material.costPerUnit) {
        return total + material.currentStock * material.costPerUnit
      }
      return total
    }, 0)
  },
}
