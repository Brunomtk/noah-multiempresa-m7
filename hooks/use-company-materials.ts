"use client"

import { useCallback } from "react"
import { useCompanyMaterials } from "@/contexts/company-materials-context"
import type { Material, MaterialTransaction } from "@/types/material"

// Hook para facilitar o trabalho com materiais da empresa
export function useCompanyMaterialsUtils(companyId: string) {
  const {
    materials,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    filters,
    categories,
    suppliers,
    lowStockMaterials,
    fetchMaterials,
    fetchMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    useMaterial,
    addStock,
    getTransactions,
    fetchCategories,
    createCategory,
    fetchSuppliers,
    createSupplier,
    getOrders,
    createOrder,
    updateOrderStatus,
    getUsageStats,
    fetchLowStockMaterials,
    setFilters,
    resetFilters,
  } = useCompanyMaterials()

  // Carregar dados iniciais
  const loadInitialData = useCallback(async () => {
    await Promise.all([
      fetchMaterials(companyId),
      fetchCategories(companyId),
      fetchSuppliers(companyId),
      fetchLowStockMaterials(companyId),
    ])
  }, [companyId, fetchMaterials, fetchCategories, fetchSuppliers, fetchLowStockMaterials])

  // Verificar se um material está com estoque baixo
  const isLowStock = useCallback((material: Material): boolean => {
    return material.quantity <= material.minStock
  }, [])

  // Verificar se um material está sem estoque
  const isOutOfStock = useCallback((material: Material): boolean => {
    return material.quantity <= 0
  }, [])

  // Obter status de um material
  const getMaterialStatus = useCallback(
    (material: Material): "in-stock" | "low-stock" | "out-of-stock" => {
      if (isOutOfStock(material)) return "out-of-stock"
      if (isLowStock(material)) return "low-stock"
      return "in-stock"
    },
    [isOutOfStock, isLowStock],
  )

  // Obter texto de status de um material
  const getMaterialStatusText = useCallback(
    (material: Material): string => {
      const status = getMaterialStatus(material)
      if (status === "out-of-stock") return "Out of Stock"
      if (status === "low-stock") return "Low Stock"
      return "In Stock"
    },
    [getMaterialStatus],
  )

  // Formatar quantidade de material
  const formatQuantity = useCallback((material: Material): string => {
    return `${material.quantity} ${material.unit}`
  }, [])

  // Calcular valor total de um material
  const calculateTotalValue = useCallback((material: Material): number => {
    return material.quantity * (material.price || 0)
  }, [])

  // Formatar valor monetário
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }, [])

  // Formatar data
  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }, [])

  // Obter tipo de transação em texto
  const getTransactionTypeText = useCallback((transaction: MaterialTransaction): string => {
    return transaction.type === "in" ? "Stock Added" : "Stock Used"
  }, [])

  // Calcular dias até o vencimento de um material
  const getDaysUntilExpiry = useCallback((expiryDate: string | null | undefined): number | null => {
    if (!expiryDate) return null

    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }, [])

  // Verificar se um material está próximo do vencimento
  const isNearExpiry = useCallback(
    (expiryDate: string | null | undefined, daysThreshold = 30): boolean => {
      const daysUntilExpiry = getDaysUntilExpiry(expiryDate)
      if (daysUntilExpiry === null) return false

      return daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0
    },
    [getDaysUntilExpiry],
  )

  // Verificar se um material está vencido
  const isExpired = useCallback(
    (expiryDate: string | null | undefined): boolean => {
      const daysUntilExpiry = getDaysUntilExpiry(expiryDate)
      if (daysUntilExpiry === null) return false

      return daysUntilExpiry <= 0
    },
    [getDaysUntilExpiry],
  )

  // Calcular quantidade a pedir
  const calculateOrderQuantity = useCallback((material: Material): number => {
    const maxStock = material.maxStock || material.minStock * 2
    return Math.max(0, maxStock - material.quantity)
  }, [])

  // Ações
  const fetchMaterialsAction = useCallback(
    (page?: number, limit?: number) => fetchMaterials(companyId, page, limit),
    [companyId, fetchMaterials],
  )
  const fetchMaterialAction = useCallback(
    (materialId: string) => fetchMaterial(materialId, companyId),
    [companyId, fetchMaterial],
  )
  const createMaterialAction = useCallback((data: any) => createMaterial(companyId, data), [companyId, createMaterial])
  const updateMaterialAction = useCallback(
    (materialId: string, data: any) => updateMaterial(materialId, companyId, data),
    [companyId, updateMaterial],
  )
  const deleteMaterialAction = useCallback(
    (materialId: string) => deleteMaterial(materialId, companyId),
    [companyId, deleteMaterial],
  )
  const useMaterialAction = useCallback((params: any) => useMaterial(companyId, params), [companyId, useMaterial])
  const addStockAction = useCallback((params: any) => addStock(companyId, params), [companyId, addStock])
  const getTransactionsAction = useCallback(
    (materialId: string, page?: number, limit?: number) => getTransactions(materialId, companyId, page, limit),
    [companyId, getTransactions],
  )
  const fetchCategoriesAction = useCallback(() => fetchCategories(companyId), [companyId, fetchCategories])
  const createCategoryAction = useCallback(
    (name: string) => createCategory(companyId, name),
    [companyId, createCategory],
  )
  const fetchSuppliersAction = useCallback(() => fetchSuppliers(companyId), [companyId, fetchSuppliers])
  const createSupplierAction = useCallback((data: any) => createSupplier(companyId, data), [companyId, createSupplier])
  const getOrdersAction = useCallback(
    (page?: number, limit?: number) => getOrders(companyId, page, limit),
    [companyId, getOrders],
  )
  const createOrderAction = useCallback((data: any) => createOrder(companyId, data), [companyId, createOrder])
  const updateOrderStatusAction = useCallback(
    (orderId: string, status: any) => updateOrderStatus(orderId, companyId, status),
    [companyId, updateOrderStatus],
  )
  const getUsageStatsAction = useCallback((params: any) => getUsageStats(companyId, params), [companyId, getUsageStats])
  const fetchLowStockMaterialsAction = useCallback(
    () => fetchLowStockMaterials(companyId),
    [companyId, fetchLowStockMaterials],
  )

  return {
    // Estado
    materials,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    filters,
    categories,
    suppliers,
    lowStockMaterials,

    // Ações
    fetchMaterials: fetchMaterialsAction,
    fetchMaterial: fetchMaterialAction,
    createMaterial: createMaterialAction,
    updateMaterial: updateMaterialAction,
    deleteMaterial: deleteMaterialAction,
    useMaterial: useMaterialAction,
    addStock: addStockAction,
    getTransactions: getTransactionsAction,
    fetchCategories: fetchCategoriesAction,
    createCategory: createCategoryAction,
    fetchSuppliers: fetchSuppliersAction,
    createSupplier: createSupplierAction,
    getOrders: getOrdersAction,
    createOrder: createOrderAction,
    updateOrderStatus: updateOrderStatusAction,
    getUsageStats: getUsageStatsAction,
    fetchLowStockMaterials: fetchLowStockMaterialsAction,
    loadInitialData,

    // Filtros
    setFilters,
    resetFilters,

    // Utilitários
    isLowStock,
    isOutOfStock,
    getMaterialStatus,
    getMaterialStatusText,
    formatQuantity,
    calculateTotalValue,
    formatCurrency,
    formatDate,
    getTransactionTypeText,
    getDaysUntilExpiry,
    isNearExpiry,
    isExpired,
    calculateOrderQuantity,
  }
}
