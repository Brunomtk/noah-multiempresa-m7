// CheckIn/CheckOut Types
export interface CheckRecord {
  id: string
  professionalId: string
  professionalName?: string
  companyId: string
  customerId: string
  customerName?: string
  appointmentId: string
  address: string
  teamId?: string
  teamName?: string
  checkInTime?: string | null
  checkOutTime?: string | null
  status: "pending" | "checked_in" | "checked_out"
  serviceType: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CheckRecordFormData {
  professionalId: string
  professionalName?: string
  companyId: string
  customerId: string
  customerName?: string
  appointmentId: string
  address: string
  teamId?: string
  teamName?: string
  checkInTime?: string | null
  checkOutTime?: string | null
  status?: "pending" | "checked_in" | "checked_out"
  serviceType: string
  notes?: string
}
