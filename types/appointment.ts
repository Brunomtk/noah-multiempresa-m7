// Appointment Types
export interface Appointment {
  id: string
  title: string
  customerId: string
  customerName?: string
  address: string
  teamId?: string
  teamName?: string
  professionalId?: string
  professionalName?: string
  companyId: string
  start: Date | string // Can be Date object in frontend, string in API
  end: Date | string // Can be Date object in frontend, string in API
  status: "scheduled" | "completed" | "cancelled" | "in_progress"
  type: "regular" | "deep" | "specialized" | string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentFormData {
  title: string
  customer: string
  address: string
  team: string
  start: string
  startTime: string
  end: string
  endTime: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  type: "regular" | "deep" | "specialized"
  notes: string
}

export interface AppointmentFilters {
  teams?: string[]
  statuses?: string[]
  types?: string[]
  startDate?: string
  endDate?: string
  companyId?: string
  customerId?: string
  professionalId?: string
  teamId?: string
}
