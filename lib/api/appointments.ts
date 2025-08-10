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

      if (filters.page) params.append("page", filters.page.toString())
      if (filters.pageSize) params.append("pageSize", filters.pageSize.toString())
      if (filters.status !== undefined) params.append("status", filters.status.toString())
      if (filters.search) params.append("search", filters.search)
      if (filters.companyId) params.append("companyId", filters.companyId.toString())
      if (filters.customerId) params.append("customerId", filters.customerId.toString())
      if (filters.teamId) params.append("teamId", filters.teamId.toString())
      if (filters.professionalId) params.append("professionalId", filters.professionalId.toString())
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)

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
      return { data }
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

      // Verificar se a resposta é JSON ou texto
      const contentType = response.headers.get("content-type")
      let responseData

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        // Se não for JSON, tratar como texto (mensagem de sucesso)
        const textResponse = await response.text()
        console.log("Appointment created successfully:", textResponse)

        // Retornar um objeto simulado já que a API retorna apenas uma mensagem
        responseData = {
          id: Date.now(), // ID temporário
          ...appointmentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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

      // Verificar se a resposta é JSON ou texto
      const contentType = response.headers.get("content-type")
      let responseData

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        // Se não for JSON, tratar como texto (mensagem de sucesso)
        const textResponse = await response.text()
        console.log("Appointment updated successfully:", textResponse)

        // Retornar um objeto simulado já que a API retorna apenas uma mensagem
        responseData = {
          id,
          ...appointmentData,
          updatedAt: new Date().toISOString(),
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

// Funções de compatibilidade para o contexto existente
export const getAppointments = appointmentsApi.getAppointments
export const getAppointmentById = appointmentsApi.getAppointmentById
export const createAppointment = appointmentsApi.createAppointment
export const updateAppointment = appointmentsApi.updateAppointment
export const deleteAppointment = appointmentsApi.deleteAppointment
