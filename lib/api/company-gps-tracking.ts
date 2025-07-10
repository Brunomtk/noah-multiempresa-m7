import type { GPSTracking, GPSTrackingFilters } from "@/types/gps-tracking"
import { getGpsTrackingRecords, getGpsTrackingRecord, updateGpsTrackingStatus } from "./gps-tracking"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

// Interface for company-specific GPS tracking filters
export interface CompanyGpsTrackingFilters extends GPSTrackingFilters {
  teamId?: string
}

// Get GPS tracking records for a specific company
export async function getCompanyGpsTrackingRecords(
  companyId: string,
  filters?: CompanyGpsTrackingFilters,
): Promise<GPSTracking[]> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/companies/${companyId}/gps-tracking`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // if (!response.ok) throw new Error("Failed to fetch company GPS tracking records")
    // const data = await response.json()
    // return data

    // For development, use the existing function with company filter
    const allFilters: GPSTrackingFilters = {
      ...filters,
      companyId,
    }
    return getGpsTrackingRecords(allFilters)
  } catch (error) {
    console.error(`Error fetching GPS tracking records for company ${companyId}:`, error)
    throw error
  }
}

// Get GPS tracking records for a specific team in a company
export async function getCompanyTeamGpsTrackingRecords(companyId: string, teamId: string): Promise<GPSTracking[]> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/companies/${companyId}/teams/${teamId}/gps-tracking`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // if (!response.ok) throw new Error("Failed to fetch team GPS tracking records")
    // const data = await response.json()
    // return data

    // For development, use the existing function with company and team filter
    // Note: This is a mock implementation. In a real app, you would need to map team IDs to professionals
    const filters: CompanyGpsTrackingFilters = {
      companyId,
      teamId,
    }
    return getCompanyGpsTrackingRecords(companyId, filters)
  } catch (error) {
    console.error(`Error fetching GPS tracking records for team ${teamId} in company ${companyId}:`, error)
    throw error
  }
}

// Get GPS tracking records for a specific professional in a company
export async function getCompanyProfessionalGpsTrackingRecords(
  companyId: string,
  professionalId: string,
): Promise<GPSTracking[]> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(
    //   `${API_URL}/api/companies/${companyId}/professionals/${professionalId}/gps-tracking`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // )
    // if (!response.ok) throw new Error("Failed to fetch professional GPS tracking records")
    // const data = await response.json()
    // return data

    // For development, use the existing function with company and professional filter
    const filters: GPSTrackingFilters = {
      companyId,
      professionalId,
    }
    return getCompanyGpsTrackingRecords(companyId, filters)
  } catch (error) {
    console.error(
      `Error fetching GPS tracking records for professional ${professionalId} in company ${companyId}:`,
      error,
    )
    throw error
  }
}

// Get a specific GPS tracking record for a company
export async function getCompanyGpsTrackingRecord(companyId: string, id: string): Promise<GPSTracking> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/companies/${companyId}/gps-tracking/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // if (!response.ok) throw new Error("Failed to fetch company GPS tracking record")
    // const data = await response.json()
    // return data

    // For development, use the existing function
    const record = await getGpsTrackingRecord(id)

    // Verify that the record belongs to the company
    if (record.companyId !== companyId) {
      throw new Error("GPS tracking record does not belong to this company")
    }

    return record
  } catch (error) {
    console.error(`Error fetching GPS tracking record ${id} for company ${companyId}:`, error)
    throw error
  }
}

// Get active GPS tracking records for a company
export async function getCompanyActiveGpsTracking(companyId: string): Promise<GPSTracking[]> {
  try {
    const filters: GPSTrackingFilters = {
      companyId,
      status: "active",
    }
    return getCompanyGpsTrackingRecords(companyId, filters)
  } catch (error) {
    console.error(`Error fetching active GPS tracking records for company ${companyId}:`, error)
    throw error
  }
}

// Get inactive GPS tracking records for a company
export async function getCompanyInactiveGpsTracking(companyId: string): Promise<GPSTracking[]> {
  try {
    const filters: GPSTrackingFilters = {
      companyId,
      status: "inactive",
    }
    return getCompanyGpsTrackingRecords(companyId, filters)
  } catch (error) {
    console.error(`Error fetching inactive GPS tracking records for company ${companyId}:`, error)
    throw error
  }
}

// Update GPS tracking status for a company's professional
export async function updateCompanyGpsTrackingStatus(
  companyId: string,
  id: string,
  status: "active" | "inactive",
): Promise<GPSTracking> {
  try {
    // In a real implementation, this would be an API call
    // const response = await fetch(`${API_URL}/api/companies/${companyId}/gps-tracking/${id}/status`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ status }),
    // })
    // if (!response.ok) throw new Error("Failed to update GPS tracking status")
    // const data = await response.json()
    // return data

    // First, verify that the record belongs to the company
    const record = await getCompanyGpsTrackingRecord(companyId, id)

    // Then update the status
    return updateGpsTrackingStatus(id, status)
  } catch (error) {
    console.error(`Error updating GPS tracking status for ${id} in company ${companyId}:`, error)
    throw error
  }
}

// Get GPS tracking records by status for a company
export async function getCompanyGpsTrackingByStatus(
  companyId: string,
  status: "active" | "inactive" | "all",
): Promise<GPSTracking[]> {
  try {
    const filters: GPSTrackingFilters = {
      companyId,
      status: status === "all" ? undefined : status,
    }
    return getCompanyGpsTrackingRecords(companyId, filters)
  } catch (error) {
    console.error(`Error fetching GPS tracking records with status ${status} for company ${companyId}:`, error)
    throw error
  }
}

// Search GPS tracking records for a company
export async function searchCompanyGpsTracking(companyId: string, query: string): Promise<GPSTracking[]> {
  try {
    const filters: GPSTrackingFilters = {
      companyId,
      searchQuery: query,
    }
    return getCompanyGpsTrackingRecords(companyId, filters)
  } catch (error) {
    console.error(`Error searching GPS tracking records for company ${companyId}:`, error)
    throw error
  }
}
