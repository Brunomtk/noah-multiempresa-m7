import type { ApiResponse } from "@/types"
import { getApiUrl } from "./utils"

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("noah_token")
  }
  return null
}

// Helper function to create headers
const createHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Get all check records with pagination and filters
export async function getCheckRecords(
  page = 1,
  pageSize = 10,
  status = "all",
  search = "",
  dateFrom?: string,
  dateTo?: string,
): Promise<ApiResponse<any>> {
  try {
    let url = `${getApiUrl()}/CheckRecord?PageNumber=${page}&PageSize=${pageSize}`

    if (status !== "all") {
      url += `&status=${status}`
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }

    if (dateFrom) {
      url += `&dateFrom=${dateFrom}`
    }

    if (dateTo) {
      url += `&dateTo=${dateTo}`
    }

    console.log("Fetching check records from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Check records API response:", data)

    return {
      status: 200,
      data: {
        data: data.results || data.result || [],
        meta: {
          currentPage: data.currentPage || page,
          totalPages: data.pageCount || data.totalPages || 1,
          totalItems: data.totalItems || data.totalCount || 0,
          itemsPerPage: data.pageSize || pageSize,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching check records:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch check records",
    }
  }
}

// Get check record by ID
export async function getCheckRecordById(id: string): Promise<ApiResponse<any>> {
  try {
    const url = `${getApiUrl()}/CheckRecord/${id}`
    console.log("Fetching check record by ID from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data,
    }
  } catch (error) {
    console.error("Error fetching check record:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch check record",
    }
  }
}

// Create new check record
export async function createCheckRecord(data: any): Promise<ApiResponse<any>> {
  try {
    const url = `${getApiUrl()}/CheckRecord`
    console.log("Creating check record at URL:", url)

    const response = await fetch(url, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()

    return {
      status: 201,
      data: responseData,
      message: "Check record created successfully",
    }
  } catch (error) {
    console.error("Error creating check record:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to create check record",
    }
  }
}

// Update check record
export async function updateCheckRecord(id: string, data: any): Promise<ApiResponse<any>> {
  try {
    const url = `${getApiUrl()}/CheckRecord/${id}`
    console.log("Updating check record at URL:", url)

    const response = await fetch(url, {
      method: "PUT",
      headers: createHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get updated check record data
    const updatedRecord = await getCheckRecordById(id)

    return {
      status: 200,
      data: updatedRecord.data,
      message: "Check record updated successfully",
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
export async function deleteCheckRecord(id: string): Promise<ApiResponse<void>> {
  try {
    const url = `${getApiUrl()}/CheckRecord/${id}`
    console.log("Deleting check record at URL:", url)

    const response = await fetch(url, {
      method: "DELETE",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return {
      status: 200,
      message: "Check record deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting check record:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to delete check record",
    }
  }
}

// Get check-in records
export async function getCheckInRecords(page = 1, pageSize = 10, filters?: any): Promise<ApiResponse<any>> {
  try {
    let url = `${getApiUrl()}/CheckRecord/checkin?PageNumber=${page}&PageSize=${pageSize}`

    if (filters?.professionalId) {
      url += `&professionalId=${filters.professionalId}`
    }

    if (filters?.companyId) {
      url += `&companyId=${filters.companyId}`
    }

    if (filters?.dateFrom) {
      url += `&dateFrom=${filters.dateFrom}`
    }

    if (filters?.dateTo) {
      url += `&dateTo=${filters.dateTo}`
    }

    console.log("Fetching check-in records from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: {
        data: data.results || data.result || [],
        meta: {
          currentPage: data.currentPage || page,
          totalPages: data.pageCount || data.totalPages || 1,
          totalItems: data.totalItems || data.totalCount || 0,
          itemsPerPage: data.pageSize || pageSize,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching check-in records:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch check-in records",
    }
  }
}

// Get check-out records
export async function getCheckOutRecords(page = 1, pageSize = 10, filters?: any): Promise<ApiResponse<any>> {
  try {
    let url = `${getApiUrl()}/CheckRecord/checkout?PageNumber=${page}&PageSize=${pageSize}`

    if (filters?.professionalId) {
      url += `&professionalId=${filters.professionalId}`
    }

    if (filters?.companyId) {
      url += `&companyId=${filters.companyId}`
    }

    if (filters?.dateFrom) {
      url += `&dateFrom=${filters.dateFrom}`
    }

    if (filters?.dateTo) {
      url += `&dateTo=${filters.dateTo}`
    }

    console.log("Fetching check-out records from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: {
        data: data.results || data.result || [],
        meta: {
          currentPage: data.currentPage || page,
          totalPages: data.pageCount || data.totalPages || 1,
          totalItems: data.totalItems || data.totalCount || 0,
          itemsPerPage: data.pageSize || pageSize,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching check-out records:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch check-out records",
    }
  }
}

// Get companies for filters
export async function getCompaniesForFilters(): Promise<ApiResponse<any[]>> {
  try {
    const url = `${getApiUrl()}/Companies/paged?PageNumber=1&PageSize=100`
    console.log("Fetching companies for filters from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data.result || data.results || [],
    }
  } catch (error) {
    console.error("Error fetching companies for filters:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch companies",
    }
  }
}

// Get professionals for filters
export async function getProfessionalsForFilters(): Promise<ApiResponse<any[]>> {
  try {
    const url = `${getApiUrl()}/Professional?PageNumber=1&PageSize=100`
    console.log("Fetching professionals for filters from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data.result || data.results || [],
    }
  } catch (error) {
    console.error("Error fetching professionals for filters:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch professionals",
    }
  }
}
