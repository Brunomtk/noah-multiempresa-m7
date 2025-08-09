// Environment variables
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44394"

// Helper function to get API base URL
export const getApiBaseUrl = (): string => {
  return API_URL
}

// Safe localStorage access
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("noah_token")
}

export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("noah_token", token)
  }
}

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("noah_token")
  }
}

export const getUserData = (): any => {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("noah_user")
  return userData ? JSON.parse(userData) : null
}

export const getCompanyId = (): number | null => {
  if (typeof window === "undefined") return null
  const userData = getUserData()
  return userData?.companyId || null
}

// Delay function for API simulation
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// API delay for development
export const apiDelay = async (ms = 1000): Promise<void> => {
  if (process.env.NODE_ENV === "development") {
    await delay(ms)
  }
}

// Generic API request function
export const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken()
  const baseUrl = getApiBaseUrl()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Fetch API wrapper with authentication
export const fetchApi = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  return apiRequest(endpoint, options)
}

// Helper function to make API calls with authentication (legacy support)
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  const baseUrl = getApiBaseUrl()

  if (!token && typeof window !== "undefined") {
    throw new Error("No authentication token found")
  }

  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Format date
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
}

// Format datetime
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
