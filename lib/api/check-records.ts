import type { CheckRecord } from "@/types/check-record"
import { apiCall } from "./utils"

const API_BASE_URL = "https://localhost:44394"

// Type for filtering check records
export interface CheckRecordFilters {
  professionalId?: number
  companyId?: number
  customerId?: number
  teamId?: number
  appointmentId?: number
  status?: string | number
  serviceType?: string
  startDate?: string
  endDate?: string
  search?: string
  pageNumber?: number
  pageSize?: number
}

// Get all check records with optional filtering
export const getCheckRecords = async (filters?: CheckRecordFilters): Promise<CheckRecord[]> => {
  try {
    const params = new URLSearchParams()

    if (filters) {
      if (filters.professionalId) params.append("ProfessionalId", filters.professionalId.toString())
      if (filters.companyId) params.append("CompanyId", filters.companyId.toString())
      if (filters.customerId) params.append("CustomerId", filters.customerId.toString())
      if (filters.teamId) params.append("TeamId", filters.teamId.toString())
      if (filters.appointmentId) params.append("AppointmentId", filters.appointmentId.toString())
      if (filters.status !== undefined) params.append("Status", filters.status.toString())
      if (filters.serviceType) params.append("ServiceType", filters.serviceType)
      if (filters.startDate) params.append("StartDate", filters.startDate)
      if (filters.endDate) params.append("EndDate", filters.endDate)
      if (filters.search) params.append("Search", filters.search)
      if (filters.pageNumber) params.append("PageNumber", filters.pageNumber.toString())
      if (filters.pageSize) params.append("PageSize", filters.pageSize.toString())
    }

    // Set default pagination if not provided
    if (!params.has("PageNumber")) params.append("PageNumber", "1")
    if (!params.has("PageSize")) params.append("PageSize", "100")

    const queryString = params.toString()
    const url = `/api/CheckRecord${queryString ? `?${queryString}` : ""}`

    console.log("Fetching check records from:", url)
    const data = await apiCall(url)
    console.log("Check records response:", data)

    return data.results || []
  } catch (error) {
    console.error("Error fetching check records:", error)
    throw error
  }
}

// Get a single check record by ID
export const getCheckRecordById = async (id: string): Promise<CheckRecord> => {
  try {
    console.log("Fetching check record by ID:", id)
    const data = await apiCall(`/api/CheckRecord/${id}`)
    console.log("Check record response:", data)
    return data
  } catch (error) {
    console.error("Error fetching check record by ID:", error)
    throw error
  }
}

// Create a new check record
export const createCheckRecord = async (
  data: Omit<CheckRecord, "id" | "createdDate" | "updatedDate">,
): Promise<CheckRecord> => {
  try {
    console.log("Creating check record:", data)
    const response = await apiCall("/api/CheckRecord", {
      method: "POST",
      body: JSON.stringify({
        professionalId: data.professionalId,
        professionalName: data.professionalName,
        companyId: data.companyId,
        customerId: data.customerId,
        customerName: data.customerName,
        appointmentId: data.appointmentId,
        address: data.address,
        teamId: data.teamId,
        teamName: data.teamName,
        serviceType: data.serviceType,
        notes: data.notes,
      }),
    })
    console.log("Create check record response:", response)
    return response
  } catch (error) {
    console.error("Error creating check record:", error)
    throw error
  }
}

// Update an existing check record
export const updateCheckRecord = async (id: string, data: Partial<CheckRecord>): Promise<CheckRecord> => {
  try {
    console.log("Updating check record:", id, data)
    const response = await apiCall(`/api/CheckRecord/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        professionalId: data.professionalId,
        professionalName: data.professionalName,
        companyId: data.companyId,
        customerId: data.customerId,
        customerName: data.customerName,
        appointmentId: data.appointmentId,
        address: data.address,
        teamId: data.teamId,
        teamName: data.teamName,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        status: data.status,
        serviceType: data.serviceType,
        notes: data.notes,
      }),
    })
    console.log("Update check record response:", response)
    return response
  } catch (error) {
    console.error("Error updating check record:", error)
    throw error
  }
}

// Delete a check record
export const deleteCheckRecord = async (id: string): Promise<void> => {
  try {
    console.log("Deleting check record:", id)
    await apiCall(`/api/CheckRecord/${id}`, {
      method: "DELETE",
    })
    console.log("Check record deleted successfully")
  } catch (error) {
    console.error("Error deleting check record:", error)
    throw error
  }
}

// Perform check-in
export const performCheckIn = async (
  data: Omit<CheckRecord, "id" | "createdDate" | "updatedDate" | "checkOutTime" | "status" | "checkInTime">,
): Promise<CheckRecord> => {
  try {
    console.log("Performing check-in:", data)
    const response = await apiCall("/api/CheckRecord/check-in", {
      method: "POST",
      body: JSON.stringify({
        professionalId: data.professionalId,
        professionalName: data.professionalName,
        companyId: data.companyId,
        customerId: data.customerId,
        customerName: data.customerName,
        appointmentId: data.appointmentId,
        address: data.address,
        teamId: data.teamId,
        teamName: data.teamName,
        serviceType: data.serviceType,
        notes: data.notes,
      }),
    })
    console.log("Check-in response:", response)
    return response
  } catch (error) {
    console.error("Error performing check-in:", error)
    throw error
  }
}

// Perform check-out
export const performCheckOut = async (id: string): Promise<CheckRecord> => {
  try {
    console.log("Performing check-out for record:", id)
    const response = await apiCall(`/api/CheckRecord/check-out/${id}`, {
      method: "POST",
      body: "",
    })
    console.log("Check-out response:", response)
    return response
  } catch (error) {
    console.error("Error performing check-out:", error)
    throw error
  }
}

// Get professionals for dropdown
export const getProfessionals = async (companyId?: number): Promise<any[]> => {
  try {
    console.log("Fetching professionals...")

    const endpoints = [
      `/api/Professional?CompanyId=${companyId}&page=1&pageSize=100`,
      `/api/Professionals?CompanyId=${companyId}&page=1&pageSize=100`,
      "/api/Professional?page=1&pageSize=100",
      "/api/Professionals?page=1&pageSize=100",
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const data = await apiCall(endpoint)
        console.log("Professionals response:", data)

        if (data && (data.results || data.data || Array.isArray(data))) {
          const results = data.results || data.data || data
          console.log(`Successfully loaded ${results.length} professionals from ${endpoint}`)
          return results
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError)
        continue
      }
    }

    console.warn("All professional endpoints failed")
    return []
  } catch (error) {
    console.error("Error fetching professionals:", error)
    return []
  }
}

// Get companies for dropdown
export const getCompanies = async (): Promise<any[]> => {
  try {
    console.log("Fetching companies...")

    const endpoints = ["/api/Companies?page=1&pageSize=100", "/api/Company?page=1&pageSize=100"]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const data = await apiCall(endpoint)
        console.log("Companies response:", data)

        if (data && (data.results || data.data || Array.isArray(data))) {
          const results = data.results || data.data || data
          console.log(`Successfully loaded ${results.length} companies from ${endpoint}`)
          return results
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError)
        continue
      }
    }

    console.warn("All company endpoints failed")
    return []
  } catch (error) {
    console.error("Error fetching companies:", error)
    return []
  }
}

// Get customers for dropdown
export const getCustomers = async (companyId?: number): Promise<any[]> => {
  try {
    console.log("Fetching customers for company:", companyId)

    const endpoints = [
      `/api/Customers?CompanyId=${companyId}&page=1&pageSize=100`,
      `/api/Customer?CompanyId=${companyId}&page=1&pageSize=100`,
      "/api/Customers?page=1&pageSize=100",
      "/api/Customer?page=1&pageSize=100",
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const data = await apiCall(endpoint)
        console.log("Customers response:", data)

        if (data && (data.results || data.data || Array.isArray(data))) {
          const results = data.results || data.data || data
          console.log(`Successfully loaded ${results.length} customers from ${endpoint}`)
          return results
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError)
        continue
      }
    }

    console.warn("All customer endpoints failed")
    return []
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}

// Get teams for dropdown
export const getTeams = async (companyId?: number): Promise<any[]> => {
  try {
    console.log("Fetching teams for company:", companyId)

    const endpoints = [
      `/api/Teams?CompanyId=${companyId}&page=1&pageSize=100`,
      `/api/Team?CompanyId=${companyId}&page=1&pageSize=100`,
      "/api/Teams?page=1&pageSize=100",
      "/api/Team?page=1&pageSize=100",
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const data = await apiCall(endpoint)
        console.log("Teams response:", data)

        if (data && (data.results || data.data || Array.isArray(data))) {
          const results = data.results || data.data || data
          console.log(`Successfully loaded ${results.length} teams from ${endpoint}`)
          return results
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError)
        continue
      }
    }

    console.warn("All team endpoints failed")
    return []
  } catch (error) {
    console.error("Error fetching teams:", error)
    return []
  }
}

// Get appointments for dropdown
export const getAppointments = async (companyId?: number): Promise<any[]> => {
  try {
    console.log("Fetching appointments for company:", companyId)

    const endpoints = [
      `/api/Appointments?CompanyId=${companyId}&page=1&pageSize=100`,
      `/api/Appointment?CompanyId=${companyId}&page=1&pageSize=100`,
      "/api/Appointments?page=1&pageSize=100",
      "/api/Appointment?page=1&pageSize=100",
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const data = await apiCall(endpoint)
        console.log("Appointments response:", data)

        if (data && (data.results || data.data || Array.isArray(data))) {
          const results = data.results || data.data || data
          console.log(`Successfully loaded ${results.length} appointments from ${endpoint}`)
          return results
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError)
        continue
      }
    }

    console.warn("All appointment endpoints failed")
    return []
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}
