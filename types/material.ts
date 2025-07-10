// Material Types
export interface Material {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  minStock: number
  maxStock?: number
  price?: number
  supplierId?: string
  supplierName?: string
  companyId: string
  expiryDate?: string
  lastUsed?: string
  createdAt: string
  updatedAt: string
}

// Material Transaction Types
export interface MaterialTransaction {
  id: string
  materialId: string
  materialName: string
  type: "in" | "out"
  quantity: number
  reason: string
  appointmentId?: string
  appointmentName?: string
  notes?: string
  cost?: number
  invoiceNumber?: string
  source?: string
  expiryDate?: string
  createdBy: string
  createdByName: string
  companyId: string
  createdAt: string
}

// Material Category Types
export interface MaterialCategory {
  id: string
  name: string
  companyId: string
  createdAt: string
  updatedAt: string
}

// Material Supplier Types
export interface MaterialSupplier {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  companyId: string
  createdAt: string
  updatedAt: string
}

// Material Order Types
export interface MaterialOrder {
  id: string
  supplierId: string
  supplierName: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  totalAmount: number
  items: MaterialOrderItem[]
  companyId: string
  createdBy: string
  createdByName: string
  createdAt: string
  updatedAt: string
  expectedDeliveryDate?: string
  deliveredAt?: string
  notes?: string
}

export interface MaterialOrderItem {
  id: string
  orderId: string
  materialId: string
  materialName: string
  quantity: number
  price?: number
  unit: string
  totalPrice: number
}
