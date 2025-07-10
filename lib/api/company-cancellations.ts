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
    companyId: "comp-1",
    reason: "Profissional não disponível",
    cancelledById: "prof-1",
    cancelledByRole: "professional",
    cancelledAt: "2024-01-14T14:00:00Z",
    refundStatus: "processed",
    notes: "Reembolso processado automaticamente",
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-14T15:00:00Z",
  },
]

export const companyCancellationsApi = {
  // Get all cancellations for the company
  async getCancellations(companyId: string, filters?: CancellationFilters): Promise<Cancellation[]> {
    try {
      const response = await apiRequest<Cancellation[]>(`/api/companies/${companyId}/cancellations`, {
        method: "GET",
        params: filters,
      })
      return response
    } catch (error) {
      console.error("Error fetching company cancellations:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        let filtered = mockCancellations.filter((c) => c.companyId === companyId)

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

        if (filters?.startDate) {
          filtered = filtered.filter((c) => new Date(c.cancelledAt) >= new Date(filters.startDate!))
        }

        if (filters?.endDate) {
          filtered = filtered.filter((c) => new Date(c.cancelledAt) <= new Date(filters.endDate!))
        }

        return filtered
      }
      throw error
    }
  },

  // Get cancellation by ID for the company
  async getCancellationById(companyId: string, id: string): Promise<Cancellation> {
    try {
      const response = await apiRequest<Cancellation>(`/api/companies/${companyId}/cancellations/${id}`, {
        method: "GET",
      })
      return response
    } catch (error) {
      console.error("Error fetching company cancellation:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const cancellation = mockCancellations.find((c) => c.id === id && c.companyId === companyId)
        if (cancellation) return cancellation
      }
      throw error
    }
  },

  // Create new cancellation for the company
  async createCancellation(companyId: string, data: CancellationFormData): Promise<Cancellation> {
    try {
      const response = await apiRequest<Cancellation>(`/api/companies/${companyId}/cancellations`, {
        method: "POST",
        body: JSON.stringify({ ...data, companyId }),
      })
      return response
    } catch (error) {
      console.error("Error creating company cancellation:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const newCancellation: Cancellation = {
          id: `${mockCancellations.length + 1}`,
          ...data,
          companyId,
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

  // Update cancellation for the company
  async updateCancellation(companyId: string, id: string, data: Partial<CancellationFormData>): Promise<Cancellation> {
    try {
      const response = await apiRequest<Cancellation>(`/api/companies/${companyId}/cancellations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      return response
    } catch (error) {
      console.error("Error updating company cancellation:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const index = mockCancellations.findIndex((c) => c.id === id && c.companyId === companyId)
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

  // Process refund for the company
  async processRefund(
    companyId: string,
    id: string,
    status: "processed" | "rejected",
    notes?: string,
  ): Promise<Cancellation> {
    try {
      const response = await apiRequest<Cancellation>(`/api/companies/${companyId}/cancellations/${id}/refund`, {
        method: "POST",
        body: JSON.stringify({ status, notes }),
      })
      return response
    } catch (error) {
      console.error("Error processing company refund:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const index = mockCancellations.findIndex((c) => c.id === id && c.companyId === companyId)
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

  // Get cancellation statistics for the company
  async getCancellationStats(
    companyId: string,
    filters?: CancellationFilters,
  ): Promise<{
    total: number
    pending: number
    processed: number
    rejected: number
    totalRefunded: number
    averageRefundTime: number
    topReasons: Array<{ reason: string; count: number }>
  }> {
    try {
      const response = await apiRequest<{
        total: number
        pending: number
        processed: number
        rejected: number
        totalRefunded: number
        averageRefundTime: number
        topReasons: Array<{ reason: string; count: number }>
      }>(`/api/companies/${companyId}/cancellations/stats`, {
        method: "GET",
        params: filters,
      })
      return response
    } catch (error) {
      console.error("Error fetching company cancellation stats:", error)
      // Return mock data in development
      if (process.env.NODE_ENV === "development") {
        const companyCancellations = mockCancellations.filter((c) => c.companyId === companyId)
        return {
          total: companyCancellations.length,
          pending: companyCancellations.filter((c) => c.refundStatus === "pending").length,
          processed: companyCancellations.filter((c) => c.refundStatus === "processed").length,
          rejected: companyCancellations.filter((c) => c.refundStatus === "rejected").length,
          totalRefunded: 1250.0,
          averageRefundTime: 2.5,
          topReasons: [
            { reason: "Cliente não pode comparecer", count: 5 },
            { reason: "Profissional não disponível", count: 3 },
            { reason: "Condições climáticas", count: 2 },
          ],
        }
      }
      throw error
    }
  },

  // Export cancellations for the company
  async exportCancellations(
    companyId: string,
    format: "csv" | "excel" | "pdf",
    filters?: CancellationFilters,
  ): Promise<Blob> {
    try {
      const response = await apiRequest<Blob>(`/api/companies/${companyId}/cancellations/export`, {
        method: "POST",
        body: JSON.stringify({ format, filters }),
        responseType: "blob",
      })
      return response
    } catch (error) {
      console.error("Error exporting company cancellations:", error)
      throw error
    }
  },
}
