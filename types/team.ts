// Team Types
export interface Team {
  id: string
  name: string
  leaderId?: string
  region?: string
  description?: string
  status: "active" | "inactive"
  companyId: string
  rating?: number
  completedServices?: number
  createdAt: string
  updatedAt: string
}
