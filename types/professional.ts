// Professional Types
export interface Professional {
  id: string
  name: string
  cpf: string
  email: string
  phone: string
  status: "active" | "inactive"
  teamId?: string
  companyId: string
  rating?: number
  completedServices?: number
  createdAt: string
  updatedAt: string
}
