import type { Material, MaterialTransaction, MaterialCategory, MaterialSupplier, MaterialOrder } from "@/types/material"
import type { PaginatedResponse, PaginationParams } from "@/types/api"
import { apiRequest } from "./utils"

// Interface para filtros de materiais
export interface MaterialFilters {
  search?: string
  category?: string
  status?: "all" | "in-stock" | "low-stock" | "out-of-stock"
  sortBy?: "name" | "quantity" | "lastUsed" | "category"
  sortOrder?: "asc" | "desc"
}

// Interface para parâmetros de uso de material
export interface UseMaterialParams {
  materialId: string
  quantity: number
  reason: string
  appointmentId?: string
  notes?: string
}

// Interface para parâmetros de adição de material
export interface AddMaterialStockParams {
  materialId: string
  quantity: number
  source: string
  invoiceNumber?: string
  cost?: number
  expiryDate?: string
  notes?: string
}

// Interface para parâmetros de criação/atualização de material
export interface MaterialParams {
  name: string
  category: string
  unit: string
  quantity: number
  minStock: number
  maxStock?: number
  price?: number
  supplierId?: string
  notes?: string
}

// API para materiais da empresa
export const companyMaterialsApi = {
  // Listar materiais da empresa com paginação e filtros
  list: async (
    companyId: string,
    params: PaginationParams & MaterialFilters = {},
  ): Promise<PaginatedResponse<Material>> => {
    const queryParams = new URLSearchParams()

    // Adicionar parâmetros de paginação
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    // Adicionar filtros
    if (params.search) queryParams.append("search", params.search)
    if (params.category) queryParams.append("category", params.category)
    if (params.status && params.status !== "all") queryParams.append("status", params.status)
    if (params.sortBy) queryParams.append("sortBy", params.sortBy)
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder)

    // Sempre filtrar por companyId
    queryParams.append("companyId", companyId)

    return apiRequest(`/api/materials?${queryParams.toString()}`)
  },

  // Obter detalhes de um material específico
  get: async (materialId: string, companyId: string): Promise<Material> => {
    return apiRequest(`/api/materials/${materialId}?companyId=${companyId}`)
  },

  // Criar um novo material
  create: async (companyId: string, data: MaterialParams): Promise<Material> => {
    return apiRequest("/api/materials", {
      method: "POST",
      body: JSON.stringify({ ...data, companyId }),
    })
  },

  // Atualizar um material existente
  update: async (materialId: string, companyId: string, data: Partial<MaterialParams>): Promise<Material> => {
    return apiRequest(`/api/materials/${materialId}`, {
      method: "PUT",
      body: JSON.stringify({ ...data, companyId }),
    })
  },

  // Excluir um material
  delete: async (materialId: string, companyId: string): Promise<void> => {
    return apiRequest(`/api/materials/${materialId}?companyId=${companyId}`, {
      method: "DELETE",
    })
  },

  // Registrar uso de material (saída de estoque)
  useMaterial: async (companyId: string, params: UseMaterialParams): Promise<MaterialTransaction> => {
    return apiRequest("/api/materials/transactions", {
      method: "POST",
      body: JSON.stringify({
        ...params,
        companyId,
        type: "out",
      }),
    })
  },

  // Adicionar estoque de material (entrada)
  addStock: async (companyId: string, params: AddMaterialStockParams): Promise<MaterialTransaction> => {
    return apiRequest("/api/materials/transactions", {
      method: "POST",
      body: JSON.stringify({
        ...params,
        companyId,
        type: "in",
      }),
    })
  },

  // Obter histórico de transações de um material
  getTransactions: async (
    materialId: string,
    companyId: string,
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<MaterialTransaction>> => {
    const queryParams = new URLSearchParams()

    // Adicionar parâmetros de paginação
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    // Sempre filtrar por companyId e materialId
    queryParams.append("companyId", companyId)
    queryParams.append("materialId", materialId)

    return apiRequest(`/api/materials/transactions?${queryParams.toString()}`)
  },

  // Obter categorias de materiais
  getCategories: async (companyId: string): Promise<MaterialCategory[]> => {
    return apiRequest(`/api/materials/categories?companyId=${companyId}`)
  },

  // Criar uma nova categoria de material
  createCategory: async (companyId: string, name: string): Promise<MaterialCategory> => {
    return apiRequest("/api/materials/categories", {
      method: "POST",
      body: JSON.stringify({ name, companyId }),
    })
  },

  // Obter fornecedores de materiais
  getSuppliers: async (companyId: string): Promise<MaterialSupplier[]> => {
    return apiRequest(`/api/materials/suppliers?companyId=${companyId}`)
  },

  // Criar um novo fornecedor
  createSupplier: async (
    companyId: string,
    data: { name: string; email?: string; phone?: string; address?: string },
  ): Promise<MaterialSupplier> => {
    return apiRequest("/api/materials/suppliers", {
      method: "POST",
      body: JSON.stringify({ ...data, companyId }),
    })
  },

  // Obter pedidos de materiais
  getOrders: async (companyId: string, params: PaginationParams = {}): Promise<PaginatedResponse<MaterialOrder>> => {
    const queryParams = new URLSearchParams()

    // Adicionar parâmetros de paginação
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    // Sempre filtrar por companyId
    queryParams.append("companyId", companyId)

    return apiRequest(`/api/materials/orders?${queryParams.toString()}`)
  },

  // Criar um novo pedido de material
  createOrder: async (
    companyId: string,
    data: { supplierId: string; items: Array<{ materialId: string; quantity: number; price?: number }> },
  ): Promise<MaterialOrder> => {
    return apiRequest("/api/materials/orders", {
      method: "POST",
      body: JSON.stringify({ ...data, companyId }),
    })
  },

  // Atualizar status de um pedido
  updateOrderStatus: async (
    orderId: string,
    companyId: string,
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
  ): Promise<MaterialOrder> => {
    return apiRequest(`/api/materials/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, companyId }),
    })
  },

  // Obter estatísticas de uso de materiais
  getUsageStats: async (
    companyId: string,
    params: { startDate?: string; endDate?: string; materialId?: string; categoryId?: string },
  ): Promise<any> => {
    const queryParams = new URLSearchParams()

    // Adicionar filtros
    if (params.startDate) queryParams.append("startDate", params.startDate)
    if (params.endDate) queryParams.append("endDate", params.endDate)
    if (params.materialId) queryParams.append("materialId", params.materialId)
    if (params.categoryId) queryParams.append("categoryId", params.categoryId)

    // Sempre filtrar por companyId
    queryParams.append("companyId", companyId)

    return apiRequest(`/api/materials/stats/usage?${queryParams.toString()}`)
  },

  // Obter materiais com estoque baixo
  getLowStockMaterials: async (companyId: string): Promise<Material[]> => {
    return apiRequest(`/api/materials/low-stock?companyId=${companyId}`)
  },
}
