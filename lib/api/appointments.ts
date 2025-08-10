import { getApiUrl } from "./utils"
import type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AppointmentResponse,
} from "@/types/appointment"

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("noah_token") || localStorage.getItem("token") || localStorage.getItem("authToken")
  }
  return null
}

// Helper function to create headers
const createHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    accept: "*/*",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const appointmentsApi = {
  // Get paginated appointments
  async getAppointments(filters: AppointmentFilters = {}): Promise<{ data?: AppointmentResponse; error?: string }> {
    try {
      const params = new URLSearchParams()

      if (filters.page) params.append("Page", filters.page.toString())
      if (filters.pageSize) params.append("PageSize", filters.pageSize.toString())
      if (filters.status !== undefined) params.append("Status", filters.status.toString())
      if (filters.type !== undefined) params.append("Type", filters.type.toString())
      if (filters.search) params.append("Search", filters.search)
      if (filters.companyId) params.append("CompanyId", filters.companyId.toString())
      if (filters.customerId) params.append("CustomerId", filters.customerId.toString())
      if (filters.teamId) params.append("TeamId", filters.teamId.toString())
      if (filters.professionalId) params.append("ProfessionalId", filters.professionalId.toString())
      if (filters.startDate) params.append("StartDate", filters.startDate)
      if (filters.endDate) params.append("EndDate", filters.endDate)

      const queryString = params.toString()
      const url = queryString ? `${getApiUrl()}/Appointment?${queryString}` : `${getApiUrl()}/Appointment`

      const response = await fetch(url, {
        method: "GET",
        headers: createHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Transform the response to match our expected format
      const transformedData = {
        results: data.results || [],
        currentPage: data.currentPage || 1,
        pageCount: data.pageCount || 1,
        pageSize: data.pageSize || 10,
        totalItems: data.totalItems || 0,
        firstRowOnPage: data.firstRowOnPage || 1,
        lastRowOnPage: data.lastRowOnPage || 0,
      }

      return { data: transformedData }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch appointments" }
    }
  },

  // Get appointment by ID
  async getAppointmentById(id: number): Promise<{ data?: Appointment; error?: string }> {
    try {
      const response = await fetch(`${getApiUrl()}/Appointment/${id}`, {
        method: "GET",
        headers: createHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error("Error fetching appointment:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch appointment" }
    }
  },

  // Create new appointment
  async createAppointment(appointmentData: CreateAppointmentData): Promise<{ data?: Appointment; error?: string }> {
    try {
      console.log("Creating appointment with data:", appointmentData)

      const response = await fetch(`${getApiUrl()}/Appointment`, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is JSON or text
      const contentType = response.headers.get("content-type")
      let responseData

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        // If not JSON, treat as text (success message)
        const textResponse = await response.text()
        console.log("Appointment created successfully:", textResponse)

        // Return a simulated object since API returns only a message
        responseData = {
          id: Date.now(), // Temporary ID
          ...appointmentData,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        }
      }

      return { data: responseData }
    } catch (error) {
      console.error("Error creating appointment:", error)
      return { error: error instanceof Error ? error.message : "Failed to create appointment" }
    }
  },

  // Update appointment
  async updateAppointment(
    id: number,
    appointmentData: UpdateAppointmentData,
  ): Promise<{ data?: Appointment; error?: string }> {
    try {
      const response = await fetch(`${getApiUrl()}/Appointment/${id}`, {
        method: "PUT",
        headers: createHeaders(),
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is JSON or text
      const contentType = response.headers.get("content-type")
      let responseData

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        // If not JSON, treat as text (success message)
        const textResponse = await response.text()
        console.log("Appointment updated successfully:", textResponse)

        // Return a simulated object since API returns only a message
        responseData = {
          id,
          ...appointmentData,
          updatedDate: new Date().toISOString(),
        }
      }

      return { data: responseData }
    } catch (error) {
      console.error("Error updating appointment:", error)
      return { error: error instanceof Error ? error.message : "Failed to update appointment" }
    }
  },

  // Delete appointment
  async deleteAppointment(id: number): Promise<{ success?: boolean; error?: string }> {
    try {
      const response = await fetch(`${getApiUrl()}/Appointment/${id}`, {
        method: "DELETE",
        headers: createHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting appointment:", error)
      return { error: error instanceof Error ? error.message : "Failed to delete appointment" }
    }
  },
}

// Get appointments by company ID
export async function getAppointmentsByCompany(
  companyId: number,
  filters: Omit<AppointmentFilters, "companyId"> = {},
): Promise<{ data?: AppointmentResponse; error?: string }> {
  return appointmentsApi.getAppointments({ ...filters, companyId })
}

// Compatibility functions for existing context
export const getAppointments = appointmentsApi.getAppointments
export const getAppointmentById = appointmentsApi.getAppointmentById
export const createAppointment = appointmentsApi.createAppointment
export const updateAppointment = appointmentsApi.updateAppointment
export const deleteAppointment = appointmentsApi.deleteAppointment
