"use client"

import { useCallback, useMemo } from "react"
import { useCompanyMaterialsContext } from "@/contexts/company-materials-context"

export function useCompanyMaterials() {
  const context = useCompanyMaterialsContext()

  // Format currency for display
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }, [])

  // Format date for display
  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }, [])

  // Get stock status color
  const getStockStatusColor = useCallback((currentStock: number, minStock: number): string => {
    if (currentStock === 0) return "text-red-500"
    if (currentStock <= minStock) return "text-yellow-500"
    return "text-green-500"
  }, [])

  // Get stock status label
  const getStockStatusLabel = useCallback((currentStock: number, minStock: number): string => {
    if (currentStock === 0) return "Sem estoque"
    if (currentStock <= minStock) return "Estoque baixo"
    return "Em estoque"
  }, [])

  // Calculate stock percentage
  const getStockPercentage = useCallback((currentStock: number, maxStock: number): number => {
    if (maxStock === 0) return 0
    return Math.min((currentStock / maxStock) * 100, 100)
  }, [])

  // Get category color
  const getCategoryColor = useCallback((category: string): string => {
    const colors: Record<string, string> = {
      "Produtos de Limpeza": "bg-blue-100 text-blue-800",
      Equipamentos: "bg-green-100 text-green-800",
      Descartáveis: "bg-yellow-100 text-yellow-800",
      Uniformes: "bg-purple-100 text-purple-800",
      Outros: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["Outros"]
  }, [])

  // Filter materials by search term
  const filteredMaterials = useMemo(() => {
    if (!context.searchTerm) return context.materials

    const searchLower = context.searchTerm.toLowerCase()
    return context.materials.filter(
      (material) =>
        material.name.toLowerCase().includes(searchLower) ||
        material.category.toLowerCase().includes(searchLower) ||
        material.supplier.toLowerCase().includes(searchLower),
    )
  }, [context.materials, context.searchTerm])

  // Get low stock materials
  const lowStockMaterials = useMemo(() => {
    return context.materials.filter((material) => material.currentStock <= material.minStock)
  }, [context.materials])

  // Get out of stock materials
  const outOfStockMaterials = useMemo(() => {
    return context.materials.filter((material) => material.currentStock === 0)
  }, [context.materials])

  // Calculate total value
  const totalValue = useMemo(() => {
    return context.materials.reduce((total, material) => total + material.currentStock * material.unitPrice, 0)
  }, [context.materials])

  // Actions with proper error handling
  const actions = {
    reloadData: useCallback(() => {
      context.reloadData()
    }, [context]),

    setPage: useCallback(
      (page: number) => {
        context.setPage(page)
      },
      [context],
    ),

    updateFilters: useCallback(
      (filters: any) => {
        context.updateFilters(filters)
      },
      [context],
    ),

    // Mock implementations for functions that don't have endpoints yet
    createMaterial: useCallback(async (materialData: any) => {
      // TODO: Implement when endpoint is available
      console.log("Creating material:", materialData)
      throw new Error("Create material endpoint not implemented yet")
    }, []),

    updateMaterial: useCallback(async (materialId: number, materialData: any) => {
      // TODO: Implement when endpoint is available
      console.log("Updating material:", materialId, materialData)
      throw new Error("Update material endpoint not implemented yet")
    }, []),

    deleteMaterial: useCallback(async (materialId: number) => {
      // TODO: Implement when endpoint is available
      console.log("Deleting material:", materialId)
      throw new Error("Delete material endpoint not implemented yet")
    }, []),

    useMaterial: useCallback(async (materialId: number, quantity: number, reason: string) => {
      // TODO: Implement when endpoint is available
      console.log("Using material:", materialId, quantity, reason)
      throw new Error("Use material endpoint not implemented yet")
    }, []),

    addStock: useCallback(async (materialId: number, quantity: number, reason: string) => {
      // TODO: Implement when endpoint is available
      console.log("Adding stock:", materialId, quantity, reason)
      throw new Error("Add stock endpoint not implemented yet")
    }, []),

    getTransactions: useCallback(async (materialId: number) => {
      // TODO: Implement when endpoint is available
      console.log("Getting transactions for material:", materialId)
      return []
    }, []),

    fetchCategories: useCallback(async () => {
      // TODO: Implement when endpoint is available
      return ["Produtos de Limpeza", "Equipamentos", "Descartáveis", "Uniformes", "Outros"]
    }, []),

    fetchSuppliers: useCallback(async () => {
      // TODO: Implement when endpoint is available
      return ["Fornecedor A", "Fornecedor B", "Fornecedor C"]
    }, []),
  }

  return {
    ...context,
    formatCurrency,
    formatDate,
    getStockStatusColor,
    getStockStatusLabel,
    getStockPercentage,
    getCategoryColor,
    filteredMaterials,
    lowStockMaterials,
    outOfStockMaterials,
    totalValue,
    ...actions,
  }
}

// Add this export at the end of the file
export function useCompanyMaterialsUtils(companyId: number) {
  const materials = useCompanyMaterials()

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const formatQuantity = (material: any): string => {
    if (!material) return "0"
    return `${material.currentStock || 0} ${material.unit || ""}`
  }

  const calculateTotalValue = (material: any): number => {
    if (!material) return 0
    return (material.currentStock || 0) * (material.unitPrice || 0)
  }

  const getMaterialStatusText = (material: any): string => {
    if (!material) return "Unknown"
    if (material.currentStock === 0) return "Out of Stock"
    if (material.currentStock <= material.minStock) return "Low Stock"
    return "In Stock"
  }

  const isNearExpiry = (expirationDate: string): boolean => {
    if (!expirationDate) return false
    const expiry = new Date(expirationDate)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = (expirationDate: string): boolean => {
    if (!expirationDate) return false
    const expiry = new Date(expirationDate)
    const now = new Date()
    return expiry < now
  }

  const getDaysUntilExpiry = (expirationDate: string): number | null => {
    if (!expirationDate) return null
    const expiry = new Date(expirationDate)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const createMaterial = async (data: any) => {
    // Mock implementation
    console.log("Creating material:", data)
    return Promise.resolve({ id: Date.now(), ...data })
  }

  const updateMaterial = async (id: number, data: any) => {
    // Mock implementation
    console.log("Updating material:", id, data)
    return Promise.resolve({ id, ...data })
  }

  const useMaterial = async (data: any) => {
    // Mock implementation
    console.log("Using material:", data)
    return Promise.resolve()
  }

  const addStock = async (data: any) => {
    // Mock implementation
    console.log("Adding stock:", data)
    return Promise.resolve()
  }

  const getTransactions = async (materialId: number) => {
    // Mock implementation
    console.log("Getting transactions for:", materialId)
    return Promise.resolve([])
  }

  const categories = ["Produtos de Limpeza", "Equipamentos", "Descartáveis", "Uniformes", "Outros"]
  const suppliers = ["Fornecedor A", "Fornecedor B", "Fornecedor C"]

  return {
    ...materials,
    formatCurrency,
    formatDate,
    formatQuantity,
    calculateTotalValue,
    getMaterialStatusText,
    isNearExpiry,
    isExpired,
    getDaysUntilExpiry,
    createMaterial,
    updateMaterial,
    useMaterial,
    addStock,
    getTransactions,
    categories,
    suppliers,
  }
}
