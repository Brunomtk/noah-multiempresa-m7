// Função para fazer delay nas requisições (simulação)
export const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// URL base da API - agora usando variável de ambiente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://206.189.191.51:5000/api"

// Função para obter o token de autenticação
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || "maids_flow_token"
  return localStorage.getItem(tokenKey)
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

// Nova função apiRequest que usa a estrutura correta
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
        const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || "maids_flow_token"
        localStorage.removeItem(tokenKey)
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
  const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || "maids_flow_token"
  const token = localStorage.getItem(tokenKey)

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
  return API_BASE_URL
}

// Utility function to get user data from localStorage
export function getUserData() {
  const userKey = process.env.NEXT_PUBLIC_USER_KEY || "maids_flow_user"
  const userData = localStorage.getItem(userKey)
  return userData ? JSON.parse(userData) : null
}

// Utility function to get company ID from user data
export function getCompanyId(): number | null {
  const user = getUserData()
  return user?.companyId || null
}

// Utility function to clear authentication data
export function clearAuthData(): void {
  if (typeof window === "undefined") return

  const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || "maids_flow_token"
  const userKey = process.env.NEXT_PUBLIC_USER_KEY || "maids_flow_user"

  localStorage.removeItem(tokenKey)
  localStorage.removeItem(userKey)
}

// Utility function to set authentication data
export function setAuthData(token: string, user: any): void {
  if (typeof window === "undefined") return

  const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || "maids_flow_token"
  const userKey = process.env.NEXT_PUBLIC_USER_KEY || "maids_flow_user"

  localStorage.setItem(tokenKey, token)
  localStorage.setItem(userKey, JSON.stringify(user))
}

// Utility function to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || "maids_flow_token"
  const token = localStorage.getItem(tokenKey)

  return !!token
}
