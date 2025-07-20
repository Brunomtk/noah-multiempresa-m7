import { fetchApi } from "./utils"
import type { Leader, CreateLeaderRequest, UpdateLeaderRequest } from "@/types/leader"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44394/api"

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("noah_token")
  }
  return null
}

// Helper function to create headers
function createHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    accept: "*/*",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const leadersApi = {
  // Get all leaders
  getAll: async (): Promise<Leader[]> => {
    const response = await fetchApi("/Leader")
    return response
  },

  // Get leader by ID
  getById: async (id: number): Promise<Leader> => {
    const response = await fetchApi(`/Leader/${id}`)
    return response
  },

  // Create new leader
  create: async (data: CreateLeaderRequest): Promise<Leader> => {
    const response = await fetchApi("/Leader", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response
  },

  // Update leader
  update: async (id: number, data: UpdateLeaderRequest): Promise<void> => {
    await fetchApi(`/Leader/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Delete leader
  delete: async (id: number): Promise<void> => {
    await fetchApi(`/Leader/${id}`, {
      method: "DELETE",
    })
  },
}
