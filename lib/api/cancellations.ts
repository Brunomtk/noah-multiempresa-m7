import { apiRequest } from "./utils"
import type { Cancellation, CancellationFormData, CancellationFilters } from "@/types/cancellation"

// Mock data for development
const mockCancellations: Cancellation[] = [
  {
    id: "1",
    appointmentId: "apt-1",
    customerId: "cust-1",
    customerName: "João Silva",
    companyId: "comp-1",
    reason: "Cliente não pode comparecer",
    cancelledById: "user-1",
    cancelledByRole: "customer",
    cancelledAt: "2024-01-15T10:30:00Z",
    refundStatus: "pending",
    notes: "Cliente solicitou reagendamento",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    appointmentId: "apt-2",
    customerId: "cust-2",
    customerName: "Maria Santos",
    companyId: "comp-2",
    reason: "Profissional não disponível",
    cancelledById: "prof-1",
    cancelledByRole: "professional",
    cancelledAt: "2024-01-14T14:00:00Z",
    refundStatus: "processed",
    notes: "Reembolso processado automaticamente",
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-14T15:00:00Z",
  },
  {
    id: "3",
    appointmentId: "apt-3",
    customerId: "cust-3",
    customerName: "Pedro Oliveira",
    companyId: "comp-1",
    reason: "Condições climáticas adversas",
    cancelledById: "admin-1",
    cancelledByRole: "admin",
    cancelledAt: "2024-01-13T09:00:00Z",
    refundStatus: "not_applicable",
    notes: "Cancelamento por força maior",
    createdAt: "2024-01-13T09:00:00Z",
    updatedAt: "2024-01-13T09:00:00Z",
  },
]

export const cancellationsApi = {
  // Get all cancellations
  async getCancellations(filters?: CancellationFilters): Promise<Cancellation[]> {
    try {
      const response = await apiRequest<Cancellation[]>("/api/cancellations", {
        method: "GET",
        params: filters,
      })
      return response
    } catch (error) {
      console.error("Error fetching cancellations:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        let filtered = [...mockCancellations]

        if (filters?.refundStatus && filters.refundStatus !== "all") {
          filtered = filtered.filter((c) => c.refundStatus === filters.refundStatus)
        }

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase()
          filtered = filtered.filter(
            (c) =>
              c.customerName?.toLowerCase().includes(searchLower) ||
              c.reason.toLowerCase().includes(searchLower) ||
              c.notes?.toLowerCase().includes(searchLower),
          )
        }

        return filtered
      }
      throw error
    }
  },

  // Get cancellation by ID
  async getCancellationById(id: string): Promise<Cancellation> {
    try {
      const response = await apiRequest<Cancellation>(`/api/cancellations/${id}`, {
        method: "GET",
      })
      return response
    } catch (error) {
      console.error("Error fetching cancellation:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const cancellation = mockCancellations.find((c) => c.id === id)
        if (cancellation) return cancellation
      }
      throw error
    }
  },

  // Create new cancellation
  async createCancellation(data: CancellationFormData): Promise<Cancellation> {
    try {
      const response = await apiRequest<Cancellation>("/api/cancellations", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return response
    } catch (error) {
      console.error("Error creating cancellation:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const newCancellation: Cancellation = {
          id: `${mockCancellations.length + 1}`,
          ...data,
          customerName: "Novo Cliente",
          cancelledAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        mockCancellations.push(newCancellation)
        return newCancellation
      }
      throw error
    }
  },

  // Update cancellation
  async updateCancellation(id: string, data: Partial<CancellationFormData>): Promise<Cancellation> {
    try {
      const response = await apiRequest<Cancellation>(`/api/cancellations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      return response
    } catch (error) {
      console.error("Error updating cancellation:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const index = mockCancellations.findIndex((c) => c.id === id)
        if (index !== -1) {
          mockCancellations[index] = {
            ...mockCancellations[index],
            ...data,
            updatedAt: new Date().toISOString(),
          }
          return mockCancellations[index]
        }
      }
      throw error
    }
  },

  // Delete cancellation
  async deleteCancellation(id: string): Promise<void> {
    try {
      await apiRequest(`/api/cancellations/${id}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Error deleting cancellation:", error)
      // Handle mock data in development
      if (process.env.NODE_ENV === "development") {
        const index = mockCancellations.findIndex((c) => c.id === id)
        if (index !== -1) {
          mockCancellations.splice(index, 1)
          return
        }
      }
      throw error
    }
  },

  // Get cancellations by company
  async getCancellationsByCompany(companyId: string): Promise<Cancellation[]> {
    try {
      const response = await apiRequest<Cancellation[]>(`/api/cancellations/company/${companyId}`, {
        method: "GET",
      })
      return response
    } catch (error) {
      console.error("Error fetching cancellations by company:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        return mockCancellations.filter((c) => c.companyId === companyId)
      }
      throw error
    }
  },

  // Get cancellations by customer
  async getCancellationsByCustomer(customerId: string): Promise<Cancellation[]> {
    try {
      const response = await apiRequest<Cancellation[]>(`/api/cancellations/customer/${customerId}`, {
        method: "GET",
      })
      return response
    } catch (error) {
      console.error("Error fetching cancellations by customer:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        return mockCancellations.filter((c) => c.customerId === customerId)
      }
      throw error
    }
  },

  // Get cancellations by refund status
  async getCancellationsByRefundStatus(status: string): Promise<Cancellation[]> {
    try {
      const response = await apiRequest<Cancellation[]>(`/api/cancellations/refund-status/${status}`, {
        method: "GET",
      })
      return response
    } catch (error) {
      console.error("Error fetching cancellations by refund status:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        return mockCancellations.filter((c) => c.refundStatus === status)
      }
      throw error
    }
  },

  // Process refund
  async processRefund(id: string, status: "processed" | "rejected", notes?: string): Promise<Cancellation> {
    try {
      const response = await apiRequest<Cancellation>(`/api/cancellations/${id}/refund`, {
        method: "POST",
        body: JSON.stringify({ status, notes }),
      })
      return response
    } catch (error) {
      console.error("Error processing refund:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const index = mockCancellations.findIndex((c) => c.id === id)
        if (index !== -1) {
          mockCancellations[index] = {
            ...mockCancellations[index],
            refundStatus: status,
            notes: notes || mockCancellations[index].notes,
            updatedAt: new Date().toISOString(),
          }
          return mockCancellations[index]
        }
      }
      throw error
    }
  },
}
