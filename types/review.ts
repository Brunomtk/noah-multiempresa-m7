// Review Types
export interface Review {
  id: string
  customerId: string
  customerName?: string
  professionalId?: string
  professionalName?: string
  teamId?: string
  teamName?: string
  companyId: string
  companyName?: string
  appointmentId: string
  rating: number
  comment?: string
  date: string
  serviceType: string
  status: "pending" | "published" | "rejected"
  response?: string
  responseDate?: string
  createdAt: string
  updatedAt: string
}

export interface ReviewFormData {
  customerId: string
  customerName?: string
  professionalId?: string
  professionalName?: string
  teamId?: string
  teamName?: string
  companyId: string
  companyName?: string
  appointmentId: string
  rating: number
  comment?: string
  date: string
  serviceType: string
  status: "pending" | "published" | "rejected"
  response?: string
  responseDate?: string
}

export interface ReviewFilters {
  status: string
  rating: string
  searchQuery: string
}

export interface ReviewResponse {
  id: string
  name: string
  template: string
}
