export interface Customer {
  id: number
  name: string
  document: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  observations?: string
  companyId: number
  company?: {
    id: number
    name: string
  }
  status: number
  createdDate: string
  updatedDate?: string
}

export interface CreateCustomerRequest {
  name: string
  document: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  observations?: string
  companyId: number
}

export interface UpdateCustomerRequest {
  id: number
  name: string
  document: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  observations?: string
  status: number
}

export interface CustomerFilters {
  name?: string
  document?: string
  email?: string
  companyId?: number
  status?: number
  pageNumber?: number
  pageSize?: number
}

export interface CustomerResponse {
  results: Customer[]
  currentPage: number
  pageCount: number
  pageSize: number
  totalItems: number
  firstRowOnPage: number
  lastRowOnPage: number
}
