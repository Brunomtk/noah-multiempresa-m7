import type { ApiResponse } from "@/types/api"
import type { InternalFeedback } from "@/types/internal-feedback"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface ProfessionalFeedbackFilters {
  type?: "positive" | "negative" | "neutral"
  dateFrom?: string
  dateTo?: string
  clientId?: string
  status?: "read" | "unread"
  search?: string
}

export interface FeedbackResponse {
  content: string
  respondedAt: string
}

// Buscar feedbacks do profissional
export async function getProfessionalFeedbacks(
  professionalId: string,
  filters?: ProfessionalFeedbackFilters,
): Promise<ApiResponse<InternalFeedback[]>> {
  try {
    const params = new URLSearchParams()
    if (filters?.type) params.append("type", filters.type)
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom)
    if (filters?.dateTo) params.append("dateTo", filters.dateTo)
    if (filters?.clientId) params.append("clientId", filters.clientId)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.search) params.append("search", filters.search)

    const response = await fetch(`${API_URL}/api/professionals/${professionalId}/feedbacks?${params}`)

    if (!response.ok) {
      throw new Error("Erro ao buscar feedbacks")
    }

    const data = await response.json()

    // Converter strings de data para objetos Date
    const feedbacks = data.data.map((feedback: any) => ({
      ...feedback,
      createdAt: new Date(feedback.createdAt),
      updatedAt: new Date(feedback.updatedAt),
      respondedAt: feedback.respondedAt ? new Date(feedback.respondedAt) : undefined,
    }))

    return {
      success: true,
      data: feedbacks,
      message: "Feedbacks carregados com sucesso",
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Buscar feedback específico
export async function getProfessionalFeedback(
  professionalId: string,
  feedbackId: string,
): Promise<ApiResponse<InternalFeedback>> {
  try {
    const response = await fetch(`${API_URL}/api/professionals/${professionalId}/feedbacks/${feedbackId}`)

    if (!response.ok) {
      throw new Error("Erro ao buscar feedback")
    }

    const data = await response.json()

    // Converter strings de data para objetos Date
    const feedback = {
      ...data.data,
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
      respondedAt: data.data.respondedAt ? new Date(data.data.respondedAt) : undefined,
    }

    return {
      success: true,
      data: feedback,
      message: "Feedback carregado com sucesso",
    }
  } catch (error) {
    return {
      success: false,
      data: {} as InternalFeedback,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Responder a um feedback
export async function respondToProfessionalFeedback(
  professionalId: string,
  feedbackId: string,
  response: string,
): Promise<ApiResponse<InternalFeedback>> {
  try {
    const res = await fetch(`${API_URL}/api/professionals/${professionalId}/feedbacks/${feedbackId}/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response }),
    })

    if (!res.ok) {
      throw new Error("Erro ao responder feedback")
    }

    const data = await res.json()

    // Converter strings de data para objetos Date
    const feedback = {
      ...data.data,
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
      respondedAt: data.data.respondedAt ? new Date(data.data.respondedAt) : undefined,
    }

    return {
      success: true,
      data: feedback,
      message: "Resposta enviada com sucesso",
    }
  } catch (error) {
    return {
      success: false,
      data: {} as InternalFeedback,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Marcar feedback como lido
export async function markProfessionalFeedbackAsRead(
  professionalId: string,
  feedbackId: string,
): Promise<ApiResponse<InternalFeedback>> {
  try {
    const response = await fetch(`${API_URL}/api/professionals/${professionalId}/feedbacks/${feedbackId}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Erro ao marcar feedback como lido")
    }

    const data = await response.json()

    // Converter strings de data para objetos Date
    const feedback = {
      ...data.data,
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
      respondedAt: data.data.respondedAt ? new Date(data.data.respondedAt) : undefined,
    }

    return {
      success: true,
      data: feedback,
      message: "Feedback marcado como lido",
    }
  } catch (error) {
    return {
      success: false,
      data: {} as InternalFeedback,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Buscar estatísticas de feedback do profissional
export async function getProfessionalFeedbackStats(
  professionalId: string,
  period?: "week" | "month" | "quarter" | "year",
): Promise<
  ApiResponse<{
    total: number
    positive: number
    negative: number
    neutral: number
    averageRating: number
    responseRate: number
    unreadCount: number
  }>
> {
  try {
    const params = new URLSearchParams()
    if (period) params.append("period", period)

    const response = await fetch(`${API_URL}/api/professionals/${professionalId}/feedbacks/stats?${params}`)

    if (!response.ok) {
      throw new Error("Erro ao buscar estatísticas de feedback")
    }

    const data = await response.json()

    return {
      success: true,
      data: data.data,
      message: "Estatísticas carregadas com sucesso",
    }
  } catch (error) {
    return {
      success: false,
      data: {
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        averageRating: 0,
        responseRate: 0,
        unreadCount: 0,
      },
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Marcar todos os feedbacks como lidos
export async function markAllProfessionalFeedbacksAsRead(
  professionalId: string,
): Promise<ApiResponse<{ updatedCount: number }>> {
  try {
    const response = await fetch(`${API_URL}/api/professionals/${professionalId}/feedbacks/read-all`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Erro ao marcar todos os feedbacks como lidos")
    }

    const data = await response.json()

    return {
      success: true,
      data: data.data,
      message: "Todos os feedbacks foram marcados como lidos",
    }
  } catch (error) {
    return {
      success: false,
      data: { updatedCount: 0 },
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}
