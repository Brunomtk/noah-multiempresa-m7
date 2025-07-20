"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, LoginCredentials, RegisterData } from "@/types"
import { fetchApi } from "@/lib/api/utils"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true)

      const response = await fetch("https://localhost:44394/api/Users/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorText = await response.text()
        toast.error("Login failed: " + errorText)
        return false
      }

      const data = await response.json()

      // Salvar o token no localStorage
      localStorage.setItem("noah_token", data.token)

      // Criar objeto user com os dados recebidos
      const userData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        avatar: data.avatar,
        companyId: data.companyId,
        professionalId: data.professionalId,
        createdDate: data.createdDate,
        updatedDate: data.updatedDate,
      }

      setUser(userData)
      toast.success("Login successful!")
      return true
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true)

      const response = await fetchApi("/Users/create", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          status: 1,
          companyId: data.companyId || null,
          professionalId: data.professionalId || null,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        toast.error("Registration failed: " + errorText)
        return false
      }

      const result = await response.json()

      if (result === true) {
        toast.success("Registration successful! Please login.")
        return true
      } else {
        toast.error("Registration failed. Please try again.")
        return false
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("noah_token")
    setUser(null)
    toast.success("Logged out successfully")
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("noah_token")

      if (!token) {
        setIsLoading(false)
        return
      }

      // Decodificar o JWT para obter o ID do usuário
      const payload = JSON.parse(atob(token.split(".")[1]))
      const userId = payload.UserId

      if (!userId) {
        localStorage.removeItem("noah_token")
        setIsLoading(false)
        return
      }

      // Buscar dados atualizados do usuário
      const response = await fetchApi(`/Users/${userId}`)

      if (!response.ok) {
        localStorage.removeItem("noah_token")
        setIsLoading(false)
        return
      }

      const userData = await response.json()

      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        avatar: userData.avatar,
        companyId: userData.companyId,
        professionalId: userData.professionalId,
        createdDate: userData.createdDate,
        updatedDate: userData.updatedDate,
      }

      setUser(user)
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("noah_token")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
