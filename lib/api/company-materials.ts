import type {
  Material,
  MaterialsResponse,
  MaterialFilters,
  CreateMaterialRequest,
  UpdateMaterialRequest,
} from "@/types/material"
import { fetchApi } from "@/lib/api/utils"

const BASE_URL = "/Materials"

export const companyMaterialsApi = {
  async list(filters: MaterialFilters = {}): Promise<MaterialsResponse> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value))
      }
    })
    return fetchApi<MaterialsResponse>(`${BASE_URL}?${params.toString()}`)
  },

  async getById(id: number): Promise<Material> {
    return fetchApi<Material>(`${BASE_URL}/${id}`)
  },

  async create(data: CreateMaterialRequest): Promise<Material> {
    return fetchApi<Material>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async update(id: number, data: UpdateMaterialRequest): Promise<void> {
    return fetchApi<void>(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async delete(id: number): Promise<void> {
    return fetchApi<void>(`${BASE_URL}/${id}`, {
      method: "DELETE",
    })
  },

  // Mocked functions for transactions and orders as endpoints were not provided
  async getTransactions(materialId: number): Promise<any[]> {
    console.log(`Fetching transactions for material ${materialId}`)
    // In a real scenario, this would be an API call:
    // return fetchApi(`/api/Materials/${materialId}/transactions`);
    return Promise.resolve([]) // Returning empty array for now
  },

  async getOrders(materialId: number): Promise<any[]> {
    console.log(`Fetching orders for material ${materialId}`)
    // In a real scenario, this would be an API call:
    // return fetchApi(`/api/Materials/${materialId}/orders`);
    return Promise.resolve([]) // Returning empty array for now
  },
}
