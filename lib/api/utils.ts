// Get API base URL from environment variables with fallback
const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || "https://localhost:44394/api"
  } else {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || "https://localhost:44394/api"
  }
}

// Export API URL constant
export const API_URL = getApiBaseUrl()

// Export delay function
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Export the apiDelay function
export const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// URL base da API
const API_BASE_URL = getApiBaseUrl()

// Função para obter o token de autenticação
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("noah_token")
}

// Função para criar headers de autenticação
export function createAuthHeaders(): HeadersInit {
  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Função principal para fazer requisições à API
export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Generic API request function
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  // Construir URL corretamente - verificar se endpoint é string válida
  if (!endpoint || typeof endpoint !== "string") {
    throw new Error("Invalid endpoint provided to apiRequest")
  }

  const fullUrl = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  try {
    const response = await fetch(fullUrl, config)

    // Se não autorizado, limpar token e redirecionar
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("noah_token")
        window.location.href = "/login"
      }
      throw new Error("Unauthorized")
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Verificar se a resposta tem conteúdo
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    } else {
      // Se não for JSON, retornar como texto
      const text = await response.text()
      return text as T
    }
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Utility function for making authenticated API requests
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  // Get token from localStorage
  const token = localStorage.getItem("token")

  // Prepare headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Make the request
  return fetch(url, {
    ...options,
    headers,
  })
}

// Utility function to get API base URL
export function getApiUrl(): string {
  return getApiBaseUrl()
}

// Utility function to get user data from localStorage
export function getUserData() {
  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

// Utility function to get company ID from user data
export function getCompanyId(): number | null {
  const user = getUserData()
  return user?.companyId || null
}

// Helper function to build query parameters
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

// Helper function for handling API errors
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  if (error?.message) {
    return error.message
  }

  return "An unexpected error occurred"
}

// Helper function to format API responses
export function formatApiResponse<T>(response: any): T {
  // Handle different response formats
  if (response?.data) {
    return response.data
  }

  if (response?.results) {
    return response.results
  }

  return response
}

// Helper function for pagination
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export function buildPaginationParams(params: PaginationParams): Record<string, any> {
  return {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    sortBy: params.sortBy || "id",
    sortOrder: params.sortOrder || "asc",
  }
}
