import type { GPSTracking } from "@/types/gps-tracking"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

// Sample data for development
const sampleGpsData: GPSTracking[] = [
  {
    id: "GPS001",
    professionalId: "prof1",
    professionalName: "John Smith",
    companyId: "comp1",
    companyName: "CleanCo Services",
    vehicle: "Toyota Corolla - ABC1234",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Broadway, New York, NY 10001",
      accuracy: 5,
    },
    speed: 0,
    status: "active",
    battery: 85,
    notes: "On route to client",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "GPS002",
    professionalId: "prof2",
    professionalName: "Emily Johnson",
    companyId: "comp2",
    companyName: "GreenThumb Landscaping",
    vehicle: "Ford F-150 - XYZ5678",
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: "456 Hollywood Blvd, Los Angeles, CA 90028",
      accuracy: 8,
    },
    speed: 35,
    status: "active",
    battery: 72,
    notes: "Heading to next job site",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "GPS003",
    professionalId: "prof3",
    professionalName: "Michael Brown",
    companyId: "comp1",
    companyName: "CleanCo Services",
    vehicle: "Honda Civic - DEF9012",
    location: {
      latitude: 41.8781,
      longitude: -87.6298,
      address: "789 Michigan Ave, Chicago, IL 60611",
      accuracy: 10,
    },
    speed: 0,
    status: "inactive",
    battery: 45,
    notes: "Lunch break",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "GPS004",
    professionalId: "prof4",
    professionalName: "Sarah Wilson",
    companyId: "comp3",
    companyName: "ElectroPro Solutions",
    vehicle: "Chevrolet Express - GHI3456",
    location: {
      latitude: 29.7604,
      longitude: -95.3698,
      address: "101 Main St, Houston, TX 77002",
      accuracy: 3,
    },
    speed: 28,
    status: "active",
    battery: 90,
    notes: "Emergency call",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "GPS005",
    professionalId: "prof5",
    professionalName: "David Martinez",
    companyId: "comp2",
    companyName: "GreenThumb Landscaping",
    vehicle: "Nissan Frontier - JKL7890",
    location: {
      latitude: 33.4484,
      longitude: -112.074,
      address: "202 Central Ave, Phoenix, AZ 85004",
      accuracy: 7,
    },
    speed: 0,
    status: "active",
    battery: 65,
    notes: "At client location",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Interface for filtering GPS tracking data
export interface GpsTrackingFilters {
  status?: "active" | "inactive" | "all"
  companyId?: string
  professionalId?: string
  searchQuery?: string
  dateRange?: {
    from: Date
    to: Date
  }
}

// Get all GPS tracking records with optional filtering
export async function getGpsTrackingRecords(filters?: GpsTrackingFilters): Promise<GPSTracking[]> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/gps-tracking`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // if (!response.ok) throw new Error("Failed to fetch GPS tracking records")
    // const data = await response.json()
    // return data

    // For development, use sample data with filtering
    let filteredData = [...sampleGpsData]

    if (filters) {
      if (filters.status && filters.status !== "all") {
        filteredData = filteredData.filter((record) => record.status === filters.status)
      }

      if (filters.companyId) {
        filteredData = filteredData.filter((record) => record.companyId === filters.companyId)
      }

      if (filters.professionalId) {
        filteredData = filteredData.filter((record) => record.professionalId === filters.professionalId)
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filteredData = filteredData.filter(
          (record) =>
            record.professionalName?.toLowerCase().includes(query) ||
            record.location.address.toLowerCase().includes(query) ||
            record.vehicle.toLowerCase().includes(query),
        )
      }

      if (filters.dateRange) {
        const fromDate = new Date(filters.dateRange.from)
        const toDate = new Date(filters.dateRange.to)
        filteredData = filteredData.filter((record) => {
          const recordDate = new Date(record.timestamp)
          return recordDate >= fromDate && recordDate <= toDate
        })
      }
    }

    return filteredData
  } catch (error) {
    console.error("Error fetching GPS tracking records:", error)
    throw error
  }
}

// Get a specific GPS tracking record by ID
export async function getGpsTrackingRecord(id: string): Promise<GPSTracking> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/gps-tracking/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // if (!response.ok) throw new Error("Failed to fetch GPS tracking record")
    // const data = await response.json()
    // return data

    // For development, use sample data
    const record = sampleGpsData.find((r) => r.id === id)
    if (!record) throw new Error("GPS tracking record not found")
    return record
  } catch (error) {
    console.error(`Error fetching GPS tracking record ${id}:`, error)
    throw error
  }
}

// Create a new GPS tracking record
export async function createGpsTrackingRecord(
  data: Omit<GPSTracking, "id" | "createdAt" | "updatedAt">,
): Promise<GPSTracking> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/gps-tracking`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // })
    // if (!response.ok) throw new Error("Failed to create GPS tracking record")
    // const responseData = await response.json()
    // return responseData

    // For development, create a new record
    const newRecord: GPSTracking = {
      id: `GPS${String(sampleGpsData.length + 1).padStart(3, "0")}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real implementation, this would be handled by the API
    sampleGpsData.push(newRecord)
    return newRecord
  } catch (error) {
    console.error("Error creating GPS tracking record:", error)
    throw error
  }
}

// Update an existing GPS tracking record
export async function updateGpsTrackingRecord(
  id: string,
  data: Partial<Omit<GPSTracking, "id" | "createdAt" | "updatedAt">>,
): Promise<GPSTracking> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/gps-tracking/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // })
    // if (!response.ok) throw new Error("Failed to update GPS tracking record")
    // const responseData = await response.json()
    // return responseData

    // For development, update the record
    const recordIndex = sampleGpsData.findIndex((r) => r.id === id)
    if (recordIndex === -1) throw new Error("GPS tracking record not found")

    const updatedRecord: GPSTracking = {
      ...sampleGpsData[recordIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    // In a real implementation, this would be handled by the API
    sampleGpsData[recordIndex] = updatedRecord
    return updatedRecord
  } catch (error) {
    console.error(`Error updating GPS tracking record ${id}:`, error)
    throw error
  }
}

// Delete a GPS tracking record
export async function deleteGpsTrackingRecord(id: string): Promise<void> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/gps-tracking/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // if (!response.ok) throw new Error("Failed to delete GPS tracking record")

    // For development, remove the record
    const recordIndex = sampleGpsData.findIndex((r) => r.id === id)
    if (recordIndex === -1) throw new Error("GPS tracking record not found")

    // In a real implementation, this would be handled by the API
    sampleGpsData.splice(recordIndex, 1)
  } catch (error) {
    console.error(`Error deleting GPS tracking record ${id}:`, error)
    throw error
  }
}

// Get GPS tracking records by company
export async function getGpsTrackingByCompany(companyId: string): Promise<GPSTracking[]> {
  try {
    const filters: GpsTrackingFilters = { companyId }
    return getGpsTrackingRecords(filters)
  } catch (error) {
    console.error(`Error fetching GPS tracking records for company ${companyId}:`, error)
    throw error
  }
}

// Get GPS tracking records by professional
export async function getGpsTrackingByProfessional(professionalId: string): Promise<GPSTracking[]> {
  try {
    const filters: GpsTrackingFilters = { professionalId }
    return getGpsTrackingRecords(filters)
  } catch (error) {
    console.error(`Error fetching GPS tracking records for professional ${professionalId}:`, error)
    throw error
  }
}

// Get active GPS tracking records
export async function getActiveGpsTracking(): Promise<GPSTracking[]> {
  try {
    const filters: GpsTrackingFilters = { status: "active" }
    return getGpsTrackingRecords(filters)
  } catch (error) {
    console.error("Error fetching active GPS tracking records:", error)
    throw error
  }
}

// Get inactive GPS tracking records
export async function getInactiveGpsTracking(): Promise<GPSTracking[]> {
  try {
    const filters: GpsTrackingFilters = { status: "inactive" }
    return getGpsTrackingRecords(filters)
  } catch (error) {
    console.error("Error fetching inactive GPS tracking records:", error)
    throw error
  }
}

// Update GPS tracking status
export async function updateGpsTrackingStatus(id: string, status: "active" | "inactive"): Promise<GPSTracking> {
  try {
    return updateGpsTrackingRecord(id, { status })
  } catch (error) {
    console.error(`Error updating GPS tracking status for ${id}:`, error)
    throw error
  }
}

// Update GPS tracking location
export async function updateGpsTrackingLocation(
  id: string,
  location: {
    latitude: number
    longitude: number
    address: string
    accuracy: number
  },
): Promise<GPSTracking> {
  try {
    return updateGpsTrackingRecord(id, { location, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error(`Error updating GPS tracking location for ${id}:`, error)
    throw error
  }
}
