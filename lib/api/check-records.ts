import { apiRequest } from "./utils"
import type { CheckRecord } from "@/types/check-record"

// Helper to get user ID from token
function getUserIdFromToken(): string {
  try {
    const token = localStorage.getItem("noah_token")
    if (!token) return "1"

    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.UserId || payload.userId || "1"
  } catch {
    return "1"
  }
}

// Helper to get company ID from token
function getCompanyIdFromToken(): string {
  try {
    const token = localStorage.getItem("noah_token")
    if (!token) return "1"

    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.CompanyId || payload.companyId || "1"
  } catch {
    return "1"
  }
}

// Get all check records
export async function getCheckRecords(): Promise<CheckRecord[]> {
  try {
    const companyId = getCompanyIdFromToken()
    const response = await apiRequest<CheckRecord[]>(`/CheckRecords?CompanyId=${companyId}`)
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error("Error fetching check records:", error)
    return []
  }
}

// Get check records by professional ID
export async function getCheckRecordsByProfessional(professionalId: number): Promise<CheckRecord[]> {
  try {
    const response = await apiRequest<CheckRecord[]>(`/CheckRecords/professional/${professionalId}`)
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error("Error fetching professional check records:", error)
    return []
  }
}

// Get check record by ID
export async function getCheckRecordById(id: number): Promise<CheckRecord | null> {
  try {
    const response = await apiRequest<CheckRecord>(`/CheckRecords/${id}`)
    return response || null
  } catch (error) {
    console.error("Error fetching check record:", error)
    return null
  }
}

// Create check-in record
export async function createCheckIn(data: {
  professionalId: number
  appointmentId?: number
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  photo?: string
  notes?: string
}): Promise<CheckRecord | null> {
  try {
    const companyId = getCompanyIdFromToken()
    const checkInData = {
      professionalId: data.professionalId,
      appointmentId: data.appointmentId,
      companyId: Number.parseInt(companyId),
      checkInTime: new Date().toISOString(),
      checkInLocation: data.location,
      checkInPhoto: data.photo,
      notes: data.notes,
      status: 1, // Checked In
    }

    const response = await apiRequest<CheckRecord>("/CheckRecords/check-in", {
      method: "POST",
      body: JSON.stringify(checkInData),
    })

    return response || null
  } catch (error) {
    console.error("Error creating check-in:", error)
    return null
  }
}

// Create check-out record
export async function createCheckOut(data: {
  checkRecordId: number
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  photo?: string
  notes?: string
  workSummary?: string
}): Promise<CheckRecord | null> {
  try {
    const checkOutData = {
      checkOutTime: new Date().toISOString(),
      checkOutLocation: data.location,
      checkOutPhoto: data.photo,
      notes: data.notes,
      workSummary: data.workSummary,
      status: 2, // Checked Out
    }

    const response = await apiRequest<CheckRecord>(`/CheckRecords/${data.checkRecordId}/check-out`, {
      method: "PUT",
      body: JSON.stringify(checkOutData),
    })

    return response || null
  } catch (error) {
    console.error("Error creating check-out:", error)
    return null
  }
}

// Update check record
export async function updateCheckRecord(id: number, data: Partial<CheckRecord>): Promise<CheckRecord | null> {
  try {
    const response = await apiRequest<CheckRecord>(`/CheckRecords/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    return response || null
  } catch (error) {
    console.error("Error updating check record:", error)
    return null
  }
}

// Delete check record
export async function deleteCheckRecord(id: number): Promise<boolean> {
  try {
    await apiRequest(`/CheckRecords/${id}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    console.error("Error deleting check record:", error)
    return false
  }
}

// Get active check-in for professional
export async function getActiveCheckIn(professionalId: number): Promise<CheckRecord | null> {
  try {
    const response = await apiRequest<CheckRecord>(`/CheckRecords/active/${professionalId}`)
    return response || null
  } catch (error) {
    console.error("Error fetching active check-in:", error)
    return null
  }
}

// Get check records by date range
export async function getCheckRecordsByDateRange(
  startDate: string,
  endDate: string,
  professionalId?: number,
): Promise<CheckRecord[]> {
  try {
    let endpoint = `/CheckRecords/date-range?startDate=${startDate}&endDate=${endDate}`
    if (professionalId) {
      endpoint += `&professionalId=${professionalId}`
    }

    const response = await apiRequest<CheckRecord[]>(endpoint)
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error("Error fetching check records by date range:", error)
    return []
  }
}

// Get check records statistics
export async function getCheckRecordsStats(professionalId?: number): Promise<{
  totalRecords: number
  totalHours: number
  averageHoursPerDay: number
  completedAppointments: number
  pendingCheckOuts: number
}> {
  try {
    let endpoint = "/CheckRecords/stats"
    if (professionalId) {
      endpoint += `?professionalId=${professionalId}`
    }

    const response = await apiRequest<any>(endpoint)
    return (
      response || {
        totalRecords: 0,
        totalHours: 0,
        averageHoursPerDay: 0,
        completedAppointments: 0,
        pendingCheckOuts: 0,
      }
    )
  } catch (error) {
    console.error("Error fetching check records stats:", error)
    return {
      totalRecords: 0,
      totalHours: 0,
      averageHoursPerDay: 0,
      completedAppointments: 0,
      pendingCheckOuts: 0,
    }
  }
}
