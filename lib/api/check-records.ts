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

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${getApiUrl()}${endpoint}`
  console.log(`Making API call to: ${url}`)

  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get check records with pagination and filters
export async function getCheckRecords(
  pageNumber = 1,
  pageSize = 100,
  status?: string,
  professionalId?: string,
  companyId?: string,
  startDate?: string,
  endDate?: string,
) {
  try {
    const params = new URLSearchParams({
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
    })

    if (status && status !== "all") {
      params.append("Status", status)
    }

    if (professionalId && professionalId !== "all") {
      params.append("ProfessionalId", professionalId)
    }

    if (companyId && companyId !== "all") {
      params.append("CompanyId", companyId)
    }

    if (startDate) {
      params.append("StartDate", startDate)
    }

    if (endDate) {
      params.append("EndDate", endDate)
    }

    const queryString = params.toString()
    const endpoint = `/api/CheckRecord?${queryString}`

    const data = await apiCall(endpoint)
    console.log("Check records response:", data)

    return {
      data: data.results || [],
      meta: {
        currentPage: data.currentPage || pageNumber,
        totalPages: data.pageCount || 1,
        totalItems: data.totalItems || 0,
        itemsPerPage: data.pageSize || pageSize,
      },
    }
  } catch (error) {
    console.error("Error fetching check records:", error)
    throw error
  }
}

// Get check record by ID
export async function getCheckRecordById(id: string) {
  try {
    const data = await apiCall(`/api/CheckRecord/${id}`)
    return data
  } catch (error) {
    console.error("Error fetching check record:", error)
    throw error
  }
}

// Create new check record
export async function createCheckRecord(checkRecordData: any) {
  try {
    const data = await apiCall("/api/CheckRecord", {
      method: "POST",
      body: JSON.stringify(checkRecordData),
    })
    return data
  } catch (error) {
    console.error("Error creating check record:", error)
    throw error
  }
}

// Update check record
export async function updateCheckRecord(id: string, checkRecordData: any) {
  try {
    const data = await apiCall(`/api/CheckRecord/${id}`, {
      method: "PUT",
      body: JSON.stringify(checkRecordData),
    })
    return data
  } catch (error) {
    console.error("Error updating check record:", error)
    throw error
  }
}

// Delete check record
export async function deleteCheckRecord(id: string) {
  try {
    await apiCall(`/api/CheckRecord/${id}`, {
      method: "DELETE",
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting check record:", error)
    throw error
  }
}

// Get professionals for dropdown
export async function getProfessionals() {
  try {
    const data = await apiCall("/api/Professional")
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching professionals:", error)
    return []
  }
}

// Get companies for dropdown
export async function getCompanies() {
  try {
    const data = await apiCall("/api/Companies")
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching companies:", error)
    return []
  }
}

// Get customers for dropdown
export async function getCustomers() {
  try {
    const data = await apiCall("/api/Customer")
    return data.results || []
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}

// Get teams for dropdown
export async function getTeams() {
  try {
    const data = await apiCall("/api/Team?page=1&pageSize=100&status=all")
    return data.results || []
  } catch (error) {
    console.error("Error fetching teams:", error)
    return []
  }
}

// Get appointments for dropdown
export async function getAppointments() {
  try {
    const data = await apiCall("/api/Appointment")
    return Array.isArray(data) ? data : data.results || []
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}
