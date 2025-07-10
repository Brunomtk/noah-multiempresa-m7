// User Types
export type UserRole = "admin" | "company" | "professional"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
  status: "active" | "inactive"
  companyId?: string // Para usuários de empresa ou profissionais
  professionalId?: string // Para usuários profissionais
}

export interface RegisterUserData {
  name: string
  email: string
  password: string
  role: UserRole
  companyId?: string
}
