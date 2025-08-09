// Material Types based on real API
export interface Material {
  id: number
  name: string
  description: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  supplier: string
  supplierContact: string
  barcode: string
  location: string
  expirationDate: string
  status: number
  companyId: number
  createdDate: string
  updatedDate: string
  company?: any // Define more specific type if needed
  transactions?: any[] // Define more specific type if needed
  orders?: any[] // Define more specific type if needed
}

// Material Transaction Types
export interface MaterialTransaction {
  id: number
  materialId: number
  type: number // 0 = out, 1 = in
  quantity: number
  unitPrice: number
  totalValue: number
  reason: string
  professionalId?: number
  appointmentId?: number
  notes?: string
  date: string
  companyId: number
  material?: string
  professional?: Professional
  appointment?: Appointment
  company?: Company
  createdDate: string
  updatedDate: string
}

// Material Order Types
export interface MaterialOrder {
  id: number
  materialId: number
  requestedQuantity: number
  approvedQuantity: number
  unitPrice: number
  totalValue: number
  status: number
  priority: number
  requestedBy: string
  requestedByName: string
  approvedBy?: string
  approvedByName?: string
  supplier: string
  expectedDelivery?: string
  actualDelivery?: string
  notes?: string
  companyId: number
  material?: string
  company?: Company
  createdDate: string
  updatedDate: string
}

// Auxiliary interfaces
interface Company {
  id: number
  name: string
  cnpj: string
  responsible: string
  email: string
  phone: string
  planId: number
  status: number
  createdDate: string
  updatedDate: string
}

interface Professional {
  id: number
  name: string
  cpf: string
  email: string
  phone: string
  teamId?: number
  companyId: number
  status: number
  rating: number
  completedServices: number
  createdDate: string
  updatedDate: string
}

interface Appointment {
  id: number
  title: string
  address: string
  start: string
  end: string
  companyId: number
  customerId?: number
  teamId?: number
  professionalId?: number
  status: number
  type: number
  notes?: string
  createdDate: string
  updatedDate: string
}

// Filter types
export interface MaterialFilters {
  category?: string
  status?: string
  supplier?: string
  lowStock?: boolean
  expiring?: boolean
  search?: string
  sortBy?: string
  sortOrder?: string
  companyId?: number
  page?: number
  pageSize?: number
}

// Types for creation/update
export interface CreateMaterialRequest {
  name: string
  description: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  supplier: string
  supplierContact: string
  barcode: string
  location: string
  expirationDate: string
  status: string // API expects string for status on create/update
  companyId: number
}

export type UpdateMaterialRequest = Omit<CreateMaterialRequest, "companyId">

// API Response
export interface MaterialsResponse {
  results: Material[]
  currentPage: number
  pageCount: number
  pageSize: number
  totalItems: number
}

// Material Category
export interface MaterialCategory {
  id: string
  name: string
  description?: string
}

// Material Supplier
export interface MaterialSupplier {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
}

// Use Material Params
export interface UseMaterialParams {
  materialId: number
  quantity: number
  reason: string
  professionalId?: number
  appointmentId?: number
  notes?: string
}

// Add Material Stock Params
export interface AddMaterialStockParams {
  materialId: number
  quantity: number
  unitPrice: number
  reason: string
  supplier?: string
  invoiceNumber?: string
  notes?: string
}

// Material Params
export interface MaterialParams {
  name: string
  description: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  supplier: string
  supplierContact: string
  barcode: string
  location: string
  expirationDate: string
  status: string
}
