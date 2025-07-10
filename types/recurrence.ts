// Recurrence Types
export interface Recurrence {
  id: string
  title: string
  customerId: string
  customerName?: string
  address: string
  teamId?: string
  teamName?: string
  companyId: string
  frequency: "daily" | "weekly" | "biweekly" | "monthly"
  day?: number // Day of week (0-6) or day of month (1-31) depending on frequency
  time: string
  duration: number // in minutes
  status: "active" | "paused" | "completed"
  type: "regular" | "deep" | "specialized"
  startDate: string
  endDate?: string
  notes?: string
  lastExecution?: string
  nextExecution?: string | null
  createdAt: string
  updatedAt: string
}

export interface RecurrenceFormData {
  title: string
  customerId: string
  address: string
  teamId?: string
  companyId: string
  frequency: "daily" | "weekly" | "biweekly" | "monthly"
  day?: number
  time: string
  duration: number
  status: "active" | "paused" | "completed"
  type: "regular" | "deep" | "specialized"
  startDate: string
  endDate?: string
  notes?: string
}

export interface RecurrenceFilters {
  status?: string
  type?: string
  searchQuery?: string
  companyId?: string
  teamId?: string
  customerId?: string
  dateRange?: {
    start: string
    end: string
  }
}
