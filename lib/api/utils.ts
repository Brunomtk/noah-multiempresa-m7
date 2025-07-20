// Função para fazer delay nas requisições (simulação)
export const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44394/api"

// Função para obter o token de autenticação
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("noah_token")
}

// Função principal para fazer requisições à API
export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, config)

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

// Alias para compatibilidade
export const fetchWithAuth = fetchApi
export const apiRequest = fetchApi
