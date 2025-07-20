import type { ApiResponse, LoginCredentials, AuthUser, User, RegisterUserData, PaginatedResponse } from "@/types"
import type { AuthResponse } from "@/types/auth"

// Base URL da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44394/api"

// Função para obter o header de autenticação
export const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("noah_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {}
}

// Função genérica para fazer requisições à API
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        error: errorText || `HTTP error! status: ${response.status}`,
        status: response.status,
      }
    }

    const data = await response.json()
    return { data, status: response.status }
  } catch (error) {
    console.error("API request failed:", error)
    return {
      error: "Failed to fetch data from API",
      status: 500,
    }
  }
}

// API de Autenticação
export const authApi = {
  // Login
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await fetch(`${API_URL}/Users/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          error: errorText || "Invalid credentials",
          status: response.status,
        }
      }

      const authResponse: AuthResponse = await response.json()

      // Converter a resposta da API para o formato esperado
      const authUser: AuthUser = {
        id: authResponse.id,
        name: authResponse.name,
        email: authResponse.email,
        role: authResponse.role as any,
        avatar: authResponse.avatar,
        status: authResponse.status,
        token: authResponse.token,
        companyId: authResponse.companyId,
        professionalId: authResponse.professionalId,
        createdDate: authResponse.createdDate,
        updatedDate: authResponse.updatedDate,
      }

      // Salvar token no localStorage
      localStorage.setItem("noah_token", authUser.token)

      return { data: authUser, status: 200 }
    } catch (error) {
      console.error("Login failed:", error)
      return {
        error: "Authentication failed",
        status: 500,
      }
    }
  },

  // Logout
  async logout(): Promise<ApiResponse<null>> {
    try {
      // Remover token do localStorage
      localStorage.removeItem("noah_token")
      return { status: 200 }
    } catch (error) {
      console.error("Logout failed:", error)
      return {
        error: "Logout failed",
        status: 500,
      }
    }
  },

  // Verificar autenticação atual
  async checkAuth(): Promise<ApiResponse<AuthUser>> {
    try {
      const token = localStorage.getItem("noah_token")

      if (!token) {
        return {
          error: "Not authenticated",
          status: 401,
        }
      }

      // Decodificar o JWT para obter informações do usuário
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        const userId = payload.UserId

        if (!userId) {
          return {
            error: "Invalid token",
            status: 401,
          }
        }

        // Buscar dados atualizados do usuário
        const response = await fetch(`${API_URL}/Users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          return {
            error: "Invalid token",
            status: 401,
          }
        }

        const userData = await response.json()

        const authUser: AuthUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          status: userData.status,
          token: token,
          companyId: userData.companyId,
          professionalId: userData.professionalId,
          createdDate: userData.createdDate,
          updatedDate: userData.updatedDate,
        }

        return { data: authUser, status: 200 }
      } catch (decodeError) {
        return {
          error: "Invalid token",
          status: 401,
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      return {
        error: "Authentication check failed",
        status: 500,
      }
    }
  },

  // Registrar novo usuário
  async register(userData: RegisterUserData): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${API_URL}/Users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          error: errorText || "Registration failed",
          status: response.status,
        }
      }

      const result = await response.json()
      return { data: result, status: 201 }
    } catch (error) {
      console.error("Registration failed:", error)
      return {
        error: "Registration failed",
        status: 500,
      }
    }
  },
}

// API de Usuários
export const usersApi = {
  // Listar usuários (com paginação)
  async getUsers(page = 1, limit = 10, name?: string): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const params = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: limit.toString(),
      })

      if (name) {
        params.append("Name", name)
      }

      const response = await fetchApi<PaginatedResponse<User>>(`/Users/paged?${params}`)
      return response
    } catch (error) {
      console.error("Failed to fetch users:", error)
      return {
        error: "Failed to fetch users",
        status: 500,
      }
    }
  },

  // Obter usuário por ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return fetchApi<User>(`/Users/${id}`)
  },

  // Atualizar usuário
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<boolean>> {
    return fetchApi<boolean>(`/Users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },

  // Excluir usuário
  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    return fetchApi<boolean>(`/Users/${id}`, {
      method: "DELETE",
    })
  },

  // Listar todos os usuários
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return fetchApi<User[]>("/Users")
  },
}
