import type { InternalFeedback, InternalFeedbackFilters, CreateInternalFeedbackData } from "@/types/internal-feedback"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export async function getInternalFeedbacks(filters?: InternalFeedbackFilters) {
  try {
    const queryParams = new URLSearchParams()

    if (filters?.search) queryParams.append("search", filters.search)
    if (filters?.status) queryParams.append("status", filters.status)
    if (filters?.priority) queryParams.append("priority", filters.priority)
    if (filters?.category) queryParams.append("category", filters.category)
    if (filters?.professionalId) queryParams.append("professionalId", filters.professionalId)
    if (filters?.teamId) queryParams.append("teamId", filters.teamId)
    if (filters?.page) queryParams.append("page", filters.page.toString())
    if (filters?.limit) queryParams.append("limit", filters.limit.toString())

    const response = await fetch(`${API_BASE_URL}/internal-feedback?${queryParams}`)

    if (!response.ok) {
      throw new Error("Failed to fetch internal feedback")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching internal feedback:", error)
    // Return mock data for development
    return {
      feedbacks: [],
      totalCount: 0,
      totalPages: 0,
      stats: {
        totalFeedbacks: 0,
        pendingFeedbacks: 0,
        resolvedFeedbacks: 0,
        highPriorityFeedbacks: 0,
      },
    }
  }
}

export async function getInternalFeedback(id: string): Promise<InternalFeedback | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/internal-feedback/${id}`)

    if (!response.ok) {
      throw new Error("Failed to fetch internal feedback")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching internal feedback:", error)
    return null
  }
}

export async function createInternalFeedback(data: CreateInternalFeedbackData): Promise<InternalFeedback> {
  try {
    const response = await fetch(`${API_BASE_URL}/internal-feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create internal feedback")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating internal feedback:", error)
    throw error
  }
}

export async function updateInternalFeedback(id: string, data: Partial<InternalFeedback>): Promise<InternalFeedback> {
  try {
    const response = await fetch(`${API_BASE_URL}/internal-feedback/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update internal feedback")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating internal feedback:", error)
    throw error
  }
}

export async function deleteInternalFeedback(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/internal-feedback/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete internal feedback")
    }
  } catch (error) {
    console.error("Error deleting internal feedback:", error)
    throw error
  }
}

export async function addCommentToInternalFeedback(id: string, comment: string): Promise<InternalFeedback> {
  try {
    const response = await fetch(`${API_BASE_URL}/internal-feedback/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    })

    if (!response.ok) {
      throw new Error("Failed to add comment")
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding comment:", error)
    throw error
  }
}

export async function getInternalFeedbackByProfessional(professionalId: string, filters?: InternalFeedbackFilters) {
  return getInternalFeedbacks({ ...filters, professionalId })
}

export async function getInternalFeedbackByTeam(teamId: string, filters?: InternalFeedbackFilters) {
  return getInternalFeedbacks({ ...filters, teamId })
}

export async function getInternalFeedbackByCategory(category: string, filters?: InternalFeedbackFilters) {
  return getInternalFeedbacks({ ...filters, category })
}

export async function getInternalFeedbackByStatus(status: string, filters?: InternalFeedbackFilters) {
  return getInternalFeedbacks({ ...filters, status })
}

export async function getInternalFeedbackByPriority(priority: string, filters?: InternalFeedbackFilters) {
  return getInternalFeedbacks({ ...filters, priority })
}
