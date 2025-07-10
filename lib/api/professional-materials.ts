import type { Material } from "@/types/material"
import type { ApiResponse, PaginatedResponse } from "@/types/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface MaterialConsumption {
  id: string
  materialId: string
  material: Material
  professionalId: string
  appointmentId?: string
  quantity: number
  consumedAt: string
  notes?: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  createdAt: string
  updatedAt: string
}

export interface MaterialRequest {
  id: string
  materialId: string
  material: Material
  professionalId: string
  requestedQuantity: number
  status: "pending" | "approved" | "rejected" | "delivered"
  priority: "low" | "medium" | "high" | "urgent"
  reason: string
  notes?: string
  requestedAt: string
  approvedAt?: string
  deliveredAt?: string
  approvedBy?: string
  rejectedReason?: string
  createdAt: string
  updatedAt: string
}

export interface MaterialStock {
  materialId: string
  material: Material
  currentStock: number
  minimumStock: number
  lastUpdated: string
}

export interface MaterialFilters {
  search?: string
  category?: string
  availability?: "available" | "low_stock" | "out_of_stock"
  page?: number
  limit?: number
}

export interface ConsumptionFilters {
  search?: string
  materialId?: string
  appointmentId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface RequestFilters {
  search?: string
  materialId?: string
  status?: string
  priority?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// Buscar materiais disponíveis para o profissional
export async function getProfessionalMaterials(
  professionalId: string,
  filters: MaterialFilters = {},
): Promise<PaginatedResponse<MaterialStock>> {
  const params = new URLSearchParams()

  if (filters.search) params.append("search", filters.search)
  if (filters.category) params.append("category", filters.category)
  if (filters.availability) params.append("availability", filters.availability)
  if (filters.page) params.append("page", filters.page.toString())
  if (filters.limit) params.append("limit", filters.limit.toString())

  const response = await fetch(`${API_URL}/api/professionals/${professionalId}/materials?${params}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar materiais")
  }

  const data = await response.json()

  return {
    ...data,
    data: data.data.map((item: any) => ({
      ...item,
      lastUpdated: new Date(item.lastUpdated),
    })),
  }
}

// Registrar consumo de material
export async function registerMaterialConsumption(
  professionalId: string,
  consumption: Omit<MaterialConsumption, "id" | "material" | "createdAt" | "updatedAt">,
): Promise<ApiResponse<MaterialConsumption>> {
  const response = await fetch(`${API_URL}/api/professionals/${professionalId}/materials/consumption`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(consumption),
  })

  if (!response.ok) {
    throw new Error("Erro ao registrar consumo de material")
  }

  const data = await response.json()

  return {
    ...data,
    data: {
      ...data.data,
      consumedAt: new Date(data.data.consumedAt),
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
    },
  }
}

// Buscar histórico de consumo
export async function getMaterialConsumptionHistory(
  professionalId: string,
  filters: ConsumptionFilters = {},
): Promise<PaginatedResponse<MaterialConsumption>> {
  const params = new URLSearchParams()

  if (filters.search) params.append("search", filters.search)
  if (filters.materialId) params.append("materialId", filters.materialId)
  if (filters.appointmentId) params.append("appointmentId", filters.appointmentId)
  if (filters.startDate) params.append("startDate", filters.startDate)
  if (filters.endDate) params.append("endDate", filters.endDate)
  if (filters.page) params.append("page", filters.page.toString())
  if (filters.limit) params.append("limit", filters.limit.toString())

  const response = await fetch(`${API_URL}/api/professionals/${professionalId}/materials/consumption?${params}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar histórico de consumo")
  }

  const data = await response.json()

  return {
    ...data,
    data: data.data.map((item: any) => ({
      ...item,
      consumedAt: new Date(item.consumedAt),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })),
  }
}

// Solicitar reposição de material
export async function requestMaterialRestock(
  professionalId: string,
  request: Omit<MaterialRequest, "id" | "material" | "status" | "createdAt" | "updatedAt" | "requestedAt">,
): Promise<ApiResponse<MaterialRequest>> {
  const response = await fetch(`${API_URL}/api/professionals/${professionalId}/materials/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error("Erro ao solicitar reposição de material")
  }

  const data = await response.json()

  return {
    ...data,
    data: {
      ...data.data,
      requestedAt: new Date(data.data.requestedAt),
      approvedAt: data.data.approvedAt ? new Date(data.data.approvedAt) : undefined,
      deliveredAt: data.data.deliveredAt ? new Date(data.data.deliveredAt) : undefined,
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
    },
  }
}

// Buscar solicitações de reposição
export async function getMaterialRequests(
  professionalId: string,
  filters: RequestFilters = {},
): Promise<PaginatedResponse<MaterialRequest>> {
  const params = new URLSearchParams()

  if (filters.search) params.append("search", filters.search)
  if (filters.materialId) params.append("materialId", filters.materialId)
  if (filters.status) params.append("status", filters.status)
  if (filters.priority) params.append("priority", filters.priority)
  if (filters.startDate) params.append("startDate", filters.startDate)
  if (filters.endDate) params.append("endDate", filters.endDate)
  if (filters.page) params.append("page", filters.page.toString())
  if (filters.limit) params.append("limit", filters.limit.toString())

  const response = await fetch(`${API_URL}/api/professionals/${professionalId}/materials/requests?${params}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar solicitações de reposição")
  }

  const data = await response.json()

  return {
    ...data,
    data: data.data.map((item: any) => ({
      ...item,
      requestedAt: new Date(item.requestedAt),
      approvedAt: item.approvedAt ? new Date(item.approvedAt) : undefined,
      deliveredAt: item.deliveredAt ? new Date(item.deliveredAt) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })),
  }
}

// Cancelar solicitação de reposição
export async function cancelMaterialRequest(
  professionalId: string,
  requestId: string,
): Promise<ApiResponse<MaterialRequest>> {
  const response = await fetch(
    `${API_URL}/api/professionals/${professionalId}/materials/requests/${requestId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.ok) {
    throw new Error("Erro ao cancelar solicitação de reposição")
  }

  const data = await response.json()

  return {
    ...data,
    data: {
      ...data.data,
      requestedAt: new Date(data.data.requestedAt),
      approvedAt: data.data.approvedAt ? new Date(data.data.approvedAt) : undefined,
      deliveredAt: data.data.deliveredAt ? new Date(data.data.deliveredAt) : undefined,
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
    },
  }
}

// Obter estatísticas de consumo
export async function getMaterialConsumptionStats(
  professionalId: string,
  period: "week" | "month" | "quarter" | "year" = "month",
): Promise<
  ApiResponse<{
    totalConsumption: number
    mostUsedMaterials: Array<{
      material: Material
      quantity: number
      percentage: number
    }>
    consumptionByCategory: Array<{
      category: string
      quantity: number
      percentage: number
    }>
    consumptionTrend: Array<{
      date: string
      quantity: number
    }>
    lowStockAlerts: number
    pendingRequests: number
  }>
> {
  const response = await fetch(`${API_URL}/api/professionals/${professionalId}/materials/stats?period=${period}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar estatísticas de consumo")
  }

  const data = await response.json()

  return {
    ...data,
    data: {
      ...data.data,
      consumptionTrend: data.data.consumptionTrend.map((item: any) => ({
        ...item,
        date: new Date(item.date),
      })),
    },
  }
}
