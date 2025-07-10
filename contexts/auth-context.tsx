"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { AuthUser, LoginCredentials, RegisterUserData } from "@/types"
import { authApi } from "@/lib/api"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => Promise<void>
  register: (userData: RegisterUserData) => Promise<boolean>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const response = await authApi.checkAuth()

        if (response.data) {
          setUser(response.data)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.login(credentials)

      if (response.data) {
        setUser(response.data)

        // Redirecionar com base no papel do usuário
        if (response.data.role === "admin") {
          router.push("/admin/dashboard")
        } else if (response.data.role === "company") {
          router.push("/company/dashboard")
        } else if (response.data.role === "professional") {
          router.push("/professional/dashboard")
        }

        return true
      } else {
        setError(response.error || "Login failed")
        return false
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = async (): Promise<void> => {
    setIsLoading(true)

    try {
      await authApi.logout()
      setUser(null)
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Registro
  const register = async (userData: RegisterUserData): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.register(userData)

      if (response.data) {
        // Após o registro bem-sucedido, redirecionar para login
        router.push("/login")
        return true
      } else {
        setError(response.error || "Registration failed")
        return false
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
