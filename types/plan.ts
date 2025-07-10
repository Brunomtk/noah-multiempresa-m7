// Plan Types
export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  limits: {
    professionals?: number
    teams?: number
    customers?: number
    appointments?: number
  }
  duration: number // in months
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface PlanFormData {
  name: string
  price: number
  features: string[]
  limits: {
    professionals?: number
    teams?: number
    customers?: number
    appointments?: number
  }
  duration: number
  status: "active" | "inactive"
}

export interface PlanFilters {
  status?: "active" | "inactive"
  search?: string
}

export interface PlanSubscription {
  id: string
  planId: string
  companyId: string
  startDate: string
  endDate: string
  status: "active" | "inactive" | "expired" | "cancelled"
  autoRenew: boolean
  createdAt: string
  updatedAt: string
}
