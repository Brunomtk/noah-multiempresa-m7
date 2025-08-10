import type { ApiResponse, CheckRecord } from "@/types"
import { fetchApi } from "./utils"

export interface CheckRecordFilters {
  professionalId?: string
  customerId?: string
  companyId?: string
  teamId?: string
  status?: number
  startDate?: string
  endDate?: string
  pageNumber?: number
  pageSize?: number
}

export interface CheckInData {
  professionalId: string
  customerId: string
  companyId: string
  teamId?: string
  appointmentId?: string
  address: string
  serviceType: string
  notes?: string
  checkInPhoto?: string
  location?: {
    latitude: number
    longitude: number
  }
}

export interface CheckOutData {
  checkRecordId: string
  checkOutPhoto?: string
  notes?: string
  materialsUsed?: Array<{
    materialId: string
    quantity: number
  }>
  location?: {
    latitude: number
    longitude: number
  }
}

// Get check records with filters
export async function getCheckRecords(filters: CheckRecordFilters = {}): Promise<ApiResponse<CheckRecord[]>> {
  try {
    const params = new URLSearchParams()

    if (filters.professionalId) params.append("professionalId", filters.professionalId)
    if (filters.customerId) params.append("customerId", filters.customerId)
    if (filters.companyId) params.append("companyId", filters.companyId)
    if (filters.teamId) params.append("teamId", filters.teamId)
    if (filters.status !== undefined) params.append("status", filters.status.toString())
    if (filters.startDate) params.append("startDate", filters.startDate)
    if (filters.endDate) params.append("endDate", filters.endDate)
    if (filters.pageNumber) params.append("PageNumber", filters.pageNumber.toString())
    if (filters.pageSize) params.append("PageSize", filters.pageSize.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/CheckRecord?${queryString}` : "/CheckRecord"

    const response = await fetchApi<{
      results?: CheckRecord[]
      result?: CheckRecord[]
      data?: CheckRecord[]
      totalItems?: number
      totalCount?: number
      pageCount?: number
      totalPages?: number
      currentPage?: number
      pageSize?: number
    }>(endpoint)

    return {
      status: 200,
      data: response.results || response.result || response.data || [],
      meta: {
        totalItems: response.totalItems || response.totalCount || 0,
        totalPages: response.pageCount || response.totalPages || 1,
        currentPage: response.currentPage || filters.pageNumber || 1,
        pageSize: response.pageSize || filters.pageSize || 10,
      },
    }
  } catch (error) {
    console.error("Error fetching check records:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch check records",
      data: [],
    }
  }
}

// Get single check record by ID
export async function getCheckRecord(id: string): Promise<ApiResponse<CheckRecord>> {
  try {
    const response = await fetchApi<CheckRecord>(`/CheckRecord/${id}`)
    return {
      status: 200,
      data: response,
    }
  } catch (error) {
    console.error("Error fetching check record:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch check record",
    }
  }
}

// Perform check-in
export async function performCheckIn(data: CheckInData): Promise<ApiResponse<CheckRecord>> {
  try {
    const response = await fetchApi<CheckRecord>("/CheckRecord/checkin", {
      method: "POST",
      body: JSON.stringify({
        professionalId: data.professionalId,
        customerId: data.customerId,
        companyId: data.companyId,
        teamId: data.teamId,
        appointmentId: data.appointmentId,
        address: data.address,
        serviceType: data.serviceType,
        notes: data.notes,
        checkInPhoto: data.checkInPhoto,
        checkInTime: new Date().toISOString(),
        status: 1, // Checked in
        location: data.location,
      }),
    })

    return {
      status: 200,
      data: response,
    }
  } catch (error) {
    console.error("Error performing check-in:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to perform check-in",
    }
  }
}

// Perform check-out
export async function performCheckOut(data: CheckOutData): Promise<ApiResponse<CheckRecord>> {
  try {
    const response = await fetchApi<CheckRecord>(`/CheckRecord/${data.checkRecordId}/checkout`, {
      method: "PUT",
      body: JSON.stringify({
        checkOutPhoto: data.checkOutPhoto,
        notes: data.notes,
        materialsUsed: data.materialsUsed,
        checkOutTime: new Date().toISOString(),
        status: 2, // Completed
        location: data.location,
      }),
    })

    return {
      status: 200,
      data: response,
    }
  } catch (error) {
    console.error("Error performing check-out:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to perform check-out",
    }
  }
}

// Update check record
export async function updateCheckRecord(id: string, data: Partial<CheckRecord>): Promise<ApiResponse<CheckRecord>> {
  try {
    const response = await fetchApi<CheckRecord>(`/CheckRecord/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    return {
      status: 200,
      data: response,
    }
  } catch (error) {
    console.error("Error updating check record:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to update check record",
    }
  }
}

// Delete check record
export async function deleteCheckRecord(id: string): Promise<ApiResponse<boolean>> {
  try {
    await fetchApi(`/CheckRecord/${id}`, {
      method: "DELETE",
    })

    return {
      status: 200,
      data: true,
    }
  } catch (error) {
    console.error("Error deleting check record:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to delete check record",
    }
  }
}

// Helper functions for getting related data
export async function getProfessionals(companyId?: string): Promise<ApiResponse<any[]>> {
  try {
    const endpoint = companyId ? `/Professional?companyId=${companyId}` : "/Professional"
    const response = await fetchApi<{
      results?: any[]
      result?: any[]
      data?: any[]
    }>(endpoint)

    return {
      status: 200,
      data: response.results || response.result || response.data || [],
    }
  } catch (error) {
    console.error("Error fetching professionals:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch professionals",
      data: [],
    }
  }
}

export async function getCompanies(): Promise<ApiResponse<any[]>> {
  try {
    const response = await fetchApi<{
      results?: any[]
      result?: any[]
      data?: any[]
    }>("/Companies")

    return {
      status: 200,
      data: response.results || response.result || response.data || [],
    }
  } catch (error) {
    console.error("Error fetching companies:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch companies",
      data: [],
    }
  }
}

export async function getCustomers(companyId?: string): Promise<ApiResponse<any[]>> {
  try {
    const endpoint = companyId ? `/Customer?companyId=${companyId}` : "/Customer"
    const response = await fetchApi<{
      results?: any[]
      result?: any[]
      data?: any[]
    }>(endpoint)

    return {
      status: 200,
      data: response.results || response.result || response.data || [],
    }
  } catch (error) {
    console.error("Error fetching customers:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch customers",
      data: [],
    }
  }
}

export async function getTeams(companyId?: string): Promise<ApiResponse<any[]>> {
  try {
    const endpoint = companyId ? `/Team?companyId=${companyId}` : "/Team"
    const response = await fetchApi<{
      results?: any[]
      result?: any[]
      data?: any[]
    }>(endpoint)

    return {
      status: 200,
      data: response.results || response.result || response.data || [],
    }
  } catch (error) {
    console.error("Error fetching teams:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch teams",
      data: [],
    }
  }
}

export async function getAppointments(
  filters: {
    companyId?: string
    professionalId?: string
    customerId?: string
    startDate?: string
    endDate?: string
  } = {},
): Promise<ApiResponse<any[]>> {
  try {
    const params = new URLSearchParams()

    if (filters.companyId) params.append("companyId", filters.companyId)
    if (filters.professionalId) params.append("professionalId", filters.professionalId)
    if (filters.customerId) params.append("customerId", filters.customerId)
    if (filters.startDate) params.append("startDate", filters.startDate)
    if (filters.endDate) params.append("endDate", filters.endDate)

    const queryString = params.toString()
    const endpoint = queryString ? `/Appointment?${queryString}` : "/Appointment"

    const response = await fetchApi<{
      results?: any[]
      result?: any[]
      data?: any[]
    }>(endpoint)

    return {
      status: 200,
      data: response.results || response.result || response.data || [],
    }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch appointments",
      data: [],
    }
  }
}
