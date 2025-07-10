"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import {
  companyMaterialsApi,
  type MaterialFilters,
  type UseMaterialParams,
  type AddMaterialStockParams,
  type MaterialParams,
} from "@/lib/api/company-materials"
import type { Material, MaterialTransaction, MaterialCategory, MaterialSupplier, MaterialOrder } from "@/types/material"
import type { PaginatedResponse } from "@/types/api"
import { useToast } from "@/hooks/use-toast"

// Interface para o contexto
interface CompanyMaterialsContextType {
  // Estado
  materials: Material[]
  loading: boolean
  error: string | null
  totalItems: number
  currentPage: number
  totalPages: number
  filters: MaterialFilters
  categories: MaterialCategory[]
  suppliers: MaterialSupplier[]
  lowStockMaterials: Material[]

  // Ações
  fetchMaterials: (companyId: string, page?: number, limit?: number) => Promise<void>
  fetchMaterial: (materialId: string, companyId: string) => Promise<Material | null>
  createMaterial: (companyId: string, data: MaterialParams) => Promise<Material | null>
  updateMaterial: (materialId: string, companyId: string, data: Partial<MaterialParams>) => Promise<Material | null>
  deleteMaterial: (materialId: string, companyId: string) => Promise<boolean>
  useMaterial: (companyId: string, params: UseMaterialParams) => Promise<MaterialTransaction | null>
  addStock: (companyId: string, params: AddMaterialStockParams) => Promise<MaterialTransaction | null>
  getTransactions: (
    materialId: string,
    companyId: string,
    page?: number,
    limit?: number,
  ) => Promise<PaginatedResponse<MaterialTransaction> | null>
  fetchCategories: (companyId: string) => Promise<void>
  createCategory: (companyId: string, name: string) => Promise<MaterialCategory | null>
  fetchSuppliers: (companyId: string) => Promise<void>
  createSupplier: (
    companyId: string,
    data: { name: string; email?: string; phone?: string; address?: string },
  ) => Promise<MaterialSupplier | null>
  getOrders: (companyId: string, page?: number, limit?: number) => Promise<PaginatedResponse<MaterialOrder> | null>
  createOrder: (
    companyId: string,
    data: { supplierId: string; items: Array<{ materialId: string; quantity: number; price?: number }> },
  ) => Promise<MaterialOrder | null>
  updateOrderStatus: (
    orderId: string,
    companyId: string,
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
  ) => Promise<MaterialOrder | null>
  getUsageStats: (
    companyId: string,
    params: { startDate?: string; endDate?: string; materialId?: string; categoryId?: string },
  ) => Promise<any>
  fetchLowStockMaterials: (companyId: string) => Promise<void>

  // Filtros
  setFilters: (filters: Partial<MaterialFilters>) => void
  resetFilters: () => void
}

// Valores padrão para o contexto
const defaultFilters: MaterialFilters = {
  search: "",
  category: undefined,
  status: "all",
  sortBy: "name",
  sortOrder: "asc",
}

// Criar o contexto
const CompanyMaterialsContext = createContext<CompanyMaterialsContextType | undefined>(undefined)

// Provider component
export function CompanyMaterialsProvider({ children }: { children: React.ReactNode }) {
  // Estado
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFiltersState] = useState<MaterialFilters>(defaultFilters)
  const [categories, setCategories] = useState<MaterialCategory[]>([])
  const [suppliers, setSuppliers] = useState<MaterialSupplier[]>([])
  const [lowStockMaterials, setLowStockMaterials] = useState<Material[]>([])

  const { toast } = useToast()

  // Buscar materiais
  const fetchMaterials = useCallback(
    async (companyId: string, page = 1, limit = 10) => {
      setLoading(true)
      setError(null)

      try {
        const response = await companyMaterialsApi.list(companyId, {
          page,
          limit,
          ...filters,
        })

        setMaterials(response.data)
        setTotalItems(response.total)
        setCurrentPage(response.page)
        setTotalPages(response.totalPages)
      } catch (err) {
        setError("Failed to fetch materials")
        toast({
          title: "Error",
          description: "Failed to fetch materials. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [filters, toast],
  )

  // Buscar um material específico
  const fetchMaterial = useCallback(
    async (materialId: string, companyId: string): Promise<Material | null> => {
      try {
        return await companyMaterialsApi.get(materialId, companyId)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch material details. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Criar um novo material
  const createMaterial = useCallback(
    async (companyId: string, data: MaterialParams): Promise<Material | null> => {
      try {
        const newMaterial = await companyMaterialsApi.create(companyId, data)
        toast({
          title: "Success",
          description: "Material created successfully.",
        })
        return newMaterial
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to create material. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Atualizar um material
  const updateMaterial = useCallback(
    async (materialId: string, companyId: string, data: Partial<MaterialParams>): Promise<Material | null> => {
      try {
        const updatedMaterial = await companyMaterialsApi.update(materialId, companyId, data)
        toast({
          title: "Success",
          description: "Material updated successfully.",
        })
        return updatedMaterial
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update material. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Excluir um material
  const deleteMaterial = useCallback(
    async (materialId: string, companyId: string): Promise<boolean> => {
      try {
        await companyMaterialsApi.delete(materialId, companyId)
        toast({
          title: "Success",
          description: "Material deleted successfully.",
        })
        return true
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete material. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return false
      }
    },
    [toast],
  )

  // Registrar uso de material
  const useMaterialAction = useCallback(
    async (companyId: string, params: UseMaterialParams): Promise<MaterialTransaction | null> => {
      try {
        const transaction = await companyMaterialsApi.useMaterial(companyId, params)
        toast({
          title: "Success",
          description: "Material usage recorded successfully.",
        })
        return transaction
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to record material usage. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Adicionar estoque de material
  const addStockAction = useCallback(
    async (companyId: string, params: AddMaterialStockParams): Promise<MaterialTransaction | null> => {
      try {
        const transaction = await companyMaterialsApi.addStock(companyId, params)
        toast({
          title: "Success",
          description: "Stock added successfully.",
        })
        return transaction
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to add stock. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Obter histórico de transações
  const getTransactionsAction = useCallback(
    async (
      materialId: string,
      companyId: string,
      page = 1,
      limit = 10,
    ): Promise<PaginatedResponse<MaterialTransaction> | null> => {
      try {
        return await companyMaterialsApi.getTransactions(materialId, companyId, { page, limit })
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch transaction history. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Buscar categorias
  const fetchCategoriesAction = useCallback(
    async (companyId: string) => {
      try {
        const categories = await companyMaterialsApi.getCategories(companyId)
        setCategories(categories)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch categories. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      }
    },
    [toast],
  )

  // Criar categoria
  const createCategoryAction = useCallback(
    async (companyId: string, name: string): Promise<MaterialCategory | null> => {
      try {
        const newCategory = await companyMaterialsApi.createCategory(companyId, name)
        toast({
          title: "Success",
          description: "Category created successfully.",
        })
        // Atualizar a lista de categorias
        fetchCategoriesAction(companyId)
        return newCategory
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to create category. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [fetchCategoriesAction, toast],
  )

  // Buscar fornecedores
  const fetchSuppliersAction = useCallback(
    async (companyId: string) => {
      try {
        const suppliers = await companyMaterialsApi.getSuppliers(companyId)
        setSuppliers(suppliers)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch suppliers. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      }
    },
    [toast],
  )

  // Criar fornecedor
  const createSupplierAction = useCallback(
    async (
      companyId: string,
      data: { name: string; email?: string; phone?: string; address?: string },
    ): Promise<MaterialSupplier | null> => {
      try {
        const newSupplier = await companyMaterialsApi.createSupplier(companyId, data)
        toast({
          title: "Success",
          description: "Supplier created successfully.",
        })
        // Atualizar a lista de fornecedores
        fetchSuppliersAction(companyId)
        return newSupplier
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to create supplier. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [fetchSuppliersAction, toast],
  )

  // Obter pedidos
  const getOrdersAction = useCallback(
    async (companyId: string, page = 1, limit = 10): Promise<PaginatedResponse<MaterialOrder> | null> => {
      try {
        return await companyMaterialsApi.getOrders(companyId, { page, limit })
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Criar pedido
  const createOrderAction = useCallback(
    async (
      companyId: string,
      data: { supplierId: string; items: Array<{ materialId: string; quantity: number; price?: number }> },
    ): Promise<MaterialOrder | null> => {
      try {
        const newOrder = await companyMaterialsApi.createOrder(companyId, data)
        toast({
          title: "Success",
          description: "Order created successfully.",
        })
        return newOrder
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Atualizar status de pedido
  const updateOrderStatusAction = useCallback(
    async (
      orderId: string,
      companyId: string,
      status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
    ): Promise<MaterialOrder | null> => {
      try {
        const updatedOrder = await companyMaterialsApi.updateOrderStatus(orderId, companyId, status)
        toast({
          title: "Success",
          description: "Order status updated successfully.",
        })
        return updatedOrder
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update order status. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Obter estatísticas de uso
  const getUsageStatsAction = useCallback(
    async (
      companyId: string,
      params: { startDate?: string; endDate?: string; materialId?: string; categoryId?: string },
    ) => {
      try {
        return await companyMaterialsApi.getUsageStats(companyId, params)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch usage statistics. Please try again.",
          variant: "destructive",
        })
        console.error(err)
        return null
      }
    },
    [toast],
  )

  // Buscar materiais com estoque baixo
  const fetchLowStockMaterialsAction = useCallback(
    async (companyId: string) => {
      try {
        const materials = await companyMaterialsApi.getLowStockMaterials(companyId)
        setLowStockMaterials(materials)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch low stock materials. Please try again.",
          variant: "destructive",
        })
        console.error(err)
      }
    },
    [toast],
  )

  // Atualizar filtros
  const setFiltersAction = useCallback((newFilters: Partial<MaterialFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Resetar filtros
  const resetFiltersAction = useCallback(() => {
    setFiltersState(defaultFilters)
  }, [])

  // Valor do contexto
  const value = {
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
    fetchMaterials,
    fetchMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
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

    // Filtros
    setFilters: setFiltersAction,
    resetFilters: resetFiltersAction,
  }

  return <CompanyMaterialsContext.Provider value={value}>{children}</CompanyMaterialsContext.Provider>
}

// Hook para usar o contexto
export function useCompanyMaterials() {
  const context = useContext(CompanyMaterialsContext)

  if (context === undefined) {
    throw new Error("useCompanyMaterials must be used within a CompanyMaterialsProvider")
  }

  return context
}
