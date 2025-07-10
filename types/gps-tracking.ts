// GPS Tracking Types
export interface GPSTracking {
  id: string
  professionalId: string
  professionalName?: string
  companyId: string
  companyName?: string
  vehicle: string
  location: {
    latitude: number
    longitude: number
    address: string
    accuracy: number
  }
  speed: number
  status: "active" | "inactive"
  battery: number
  notes?: string
  timestamp: string
  createdAt: string
  updatedAt: string
}

export interface GPSTrackingFormData {
  professionalId: string
  professionalName?: string
  companyId: string
  companyName?: string
  vehicle: string
  latitude: number
  longitude: number
  address: string
  accuracy: number
  speed: number
  status: "active" | "inactive"
  battery: number
  notes?: string
}

export interface GPSTrackingFilters {
  status?: "active" | "inactive" | "all"
  companyId?: string
  professionalId?: string
  searchQuery?: string
  dateRange?: {
    from: Date
    to: Date
  }
}
