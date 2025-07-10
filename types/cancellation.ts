import type { UserRole } from "./user"

// Cancellation Types
export interface Cancellation {
  id: string
  appointmentId: string
  customerId: string
  customerName?: string
  companyId: string
  reason: string
  cancelledById: string
  cancelledByRole: UserRole
  cancelledAt: string
  refundStatus?: "pending" | "processed" | "rejected" | "not_applicable"
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CancellationFormData {
  appointmentId: string
  customerId: string
  companyId: string
  reason: string
  cancelledById: string
  cancelledByRole: UserRole
  refundStatus?: "pending" | "processed" | "rejected" | "not_applicable"
  notes?: string
}

export interface CancellationFilters {
  refundStatus?: string
  search?: string
  companyId?: string
  customerId?: string
  startDate?: string
  endDate?: string
}
