// Customer Types
export interface Customer {
  id: string
  name: string
  document: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  status: "active" | "inactive"
  companyId: string
  observations?: string
  createdAt: string
  updatedAt: string
}
