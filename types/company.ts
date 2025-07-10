// Company Types
export interface Company {
  id: string
  name: string
  cnpj: string
  responsible: string
  email: string
  phone: string
  status: "active" | "inactive" | "pending"
  planId: string
  planName?: string
  createdAt: string
  updatedAt: string
}
