// Company Types
export interface Company {
  id: number
  name: string
  cnpj: string
  responsible: string
  email: string
  phone: string
  planId: number
  status: number // 1 = active, 0 = inactive
  plan?: Plan | null
  users?: User[] | null
  createdDate: string
  updatedDate: string
}

export interface Plan {
  id: number
  name: string
  price: number
  features: string[]
  professionalsLimit: number
  teamsLimit: number
  customersLimit: number
  appointmentsLimit: number
  duration: number
  status: number
  subscriptions: any
  createdDate: string
  updatedDate: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: number
  avatar?: string | null
  companyId?: number | null
  professionalId?: number | null
  createdDate: string
  updatedDate: string
}

export interface CreateCompanyData {
  name: string
  cnpj: string
  responsible: string
  email: string
  phone: string
  planId: number
  status: number
}

export interface UpdateCompanyData {
  name?: string
  cnpj?: string
  responsible?: string
  email?: string
  phone?: string
  planId?: number
  status?: number
}
