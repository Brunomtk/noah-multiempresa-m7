// Payment Types
export interface Payment {
  id: string
  companyId: string
  companyName?: string
  amount: number
  dueDate: string
  paymentDate?: string
  status: "pending" | "paid" | "overdue" | "cancelled"
  method?: "credit_card" | "debit_card" | "bank_transfer" | "pix"
  reference: string
  planId: string
  planName?: string
  createdAt: string
  updatedAt: string
}

// Payment form data
export interface PaymentFormData {
  companyId: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue" | "cancelled"
  method?: "credit_card" | "debit_card" | "bank_transfer" | "pix"
  reference: string
  planId: string
  paymentDate?: string
}

// Payment filters
export interface PaymentFilters {
  companyId?: string
  status?: "pending" | "paid" | "overdue" | "cancelled"
  search?: string
  startDate?: string
  endDate?: string
  planId?: string
}
