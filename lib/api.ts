import type { ApiResponse, LoginCredentials, AuthUser, User, RegisterUserData, PaginatedResponse } from "@/types"

// Simulação de delay para simular chamadas de API
const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Base URL da API (será substituída pela URL real quando disponível)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.noah-platform.com"

// Função auxiliar para simular erros aleatórios (para testes)
const simulateRandomError = (probability = 0.1): boolean => {
  return Math.random() < probability
}

// Função genérica para fazer requisições à API
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    // Simular delay de rede
    await apiDelay(300)

    // Quando tivermos a API real, substituiremos por:
    // const response = await fetch(`${API_URL}${endpoint}`, {
    //   ...options,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     ...getAuthHeader(),
    //     ...options.headers,
    //   },
    // });
    // const data = await response.json();
    // return { data, status: response.status };

    // Por enquanto, retornamos dados simulados
    return {
      data: {} as T,
      status: 200,
    }
  } catch (error) {
    console.error("API request failed:", error)
    return {
      error: "Failed to fetch data from API",
      status: 500,
    }
  }
}

// Função para obter o header de autenticação
export const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("noah_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {}
}

// API de Autenticação
export const authApi = {
  // Login
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      await apiDelay(800) // Simular delay de rede

      // Simulação de login (será substituída pela chamada real à API)
      if (credentials.email === "admin@example.com" && credentials.password === "password") {
        const mockUser: AuthUser = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          token: "mock-jwt-token-for-admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        }

        // Salvar token no localStorage
        localStorage.setItem("noah_token", mockUser.token)

        return { data: mockUser, status: 200 }
      } else if (credentials.email === "company@example.com" && credentials.password === "password") {
        const mockUser: AuthUser = {
          id: "2",
          name: "Company User",
          email: "company@example.com",
          role: "company",
          token: "mock-jwt-token-for-company",
          companyId: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        }

        localStorage.setItem("noah_token", mockUser.token)

        return { data: mockUser, status: 200 }
      } else if (credentials.email === "professional@example.com" && credentials.password === "password") {
        const mockUser: AuthUser = {
          id: "3",
          name: "Professional User",
          email: "professional@example.com",
          role: "professional",
          token: "mock-jwt-token-for-professional",
          companyId: "1",
          professionalId: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        }

        localStorage.setItem("noah_token", mockUser.token)

        return { data: mockUser, status: 200 }
      }

      return {
        error: "Invalid credentials",
        status: 401,
      }
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
      await apiDelay(300)

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
      await apiDelay(500)

      const token = localStorage.getItem("noah_token")

      if (!token) {
        return {
          error: "Not authenticated",
          status: 401,
        }
      }

      // Simulação de verificação de token (será substituída pela chamada real à API)
      if (token === "mock-jwt-token-for-admin") {
        return {
          data: {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            token,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "active",
          },
          status: 200,
        }
      } else if (token === "mock-jwt-token-for-company") {
        return {
          data: {
            id: "2",
            name: "Company User",
            email: "company@example.com",
            role: "company",
            token,
            companyId: "1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "active",
          },
          status: 200,
        }
      } else if (token === "mock-jwt-token-for-professional") {
        return {
          data: {
            id: "3",
            name: "Professional User",
            email: "professional@example.com",
            role: "professional",
            token,
            companyId: "1",
            professionalId: "1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "active",
          },
          status: 200,
        }
      }

      return {
        error: "Invalid token",
        status: 401,
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
  async register(userData: RegisterUserData): Promise<ApiResponse<User>> {
    try {
      await apiDelay(1000)

      // Simulação de registro (será substituída pela chamada real à API)
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        companyId: userData.companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
      }

      return { data: mockUser, status: 201 }
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
  async getUsers(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      await apiDelay(800)

      // Simulação de lista de usuários (será substituída pela chamada real à API)
      const mockUsers: User[] = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        },
        {
          id: "2",
          name: "Company User",
          email: "company@example.com",
          role: "company",
          companyId: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        },
        {
          id: "3",
          name: "Professional User",
          email: "professional@example.com",
          role: "professional",
          companyId: "1",
          professionalId: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        },
      ]

      const paginatedResponse: PaginatedResponse<User> = {
        data: mockUsers,
        meta: {
          currentPage: page,
          totalPages: 1,
          totalItems: mockUsers.length,
          itemsPerPage: limit,
        },
      }

      return { data: paginatedResponse, status: 200 }
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
    try {
      await apiDelay(500)

      // Simulação de busca de usuário por ID (será substituída pela chamada real à API)
      const mockUsers: Record<string, User> = {
        "1": {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        },
        "2": {
          id: "2",
          name: "Company User",
          email: "company@example.com",
          role: "company",
          companyId: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        },
        "3": {
          id: "3",
          name: "Professional User",
          email: "professional@example.com",
          role: "professional",
          companyId: "1",
          professionalId: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
        },
      }

      const user = mockUsers[id]

      if (!user) {
        return {
          error: "User not found",
          status: 404,
        }
      }

      return { data: user, status: 200 }
    } catch (error) {
      console.error("Failed to fetch user:", error)
      return {
        error: "Failed to fetch user",
        status: 500,
      }
    }
  },

  // Atualizar usuário
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      await apiDelay(700)

      // Simulação de atualização de usuário (será substituída pela chamada real à API)
      const mockUser: User = {
        id,
        name: userData.name || "Updated User",
        email: userData.email || "updated@example.com",
        role: userData.role || "admin",
        companyId: userData.companyId,
        professionalId: userData.professionalId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: userData.status || "active",
      }

      return { data: mockUser, status: 200 }
    } catch (error) {
      console.error("Failed to update user:", error)
      return {
        error: "Failed to update user",
        status: 500,
      }
    }
  },

  // Excluir usuário
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    try {
      await apiDelay(600)

      // Simulação de exclusão de usuário (será substituída pela chamada real à API)
      return { status: 204 }
    } catch (error) {
      console.error("Failed to delete user:", error)
      return {
        error: "Failed to delete user",
        status: 500,
      }
    }
  },
}
