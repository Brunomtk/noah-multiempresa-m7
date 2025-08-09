import { fetchApi } from "./utils"
import type {
  InternalFeedback,
  InternalFeedbackCreateRequest,
  InternalFeedbackUpdateRequest,
  InternalFeedbackFilters,
  InternalFeedbackPagedResponse,
} from "@/types/internal-feedback"

export const internalFeedbackApi = {
  // Get paginated internal feedback
  async getRecords(
    filters: InternalFeedbackFilters = {},
  ): Promise<{ data?: InternalFeedbackPagedResponse; error?: string }> {
    try {
      const params = new URLSearchParams()
      if (filters.status && filters.status !== "all") params.append("Status", filters.status.toString())
      if (filters.priority && filters.priority !== "all") params.append("Priority", filters.priority.toString())
      if (filters.category && filters.category !== "all") params.append("Category", filters.category)
      if (filters.professionalId) params.append("ProfessionalId", filters.professionalId.toString())
      if (filters.teamId) params.append("TeamId", filters.teamId.toString())
      if (filters.searchQuery) params.append("Search", filters.searchQuery)
      if (filters.pageNumber) params.append("PageNumber", filters.pageNumber.toString())
      if (filters.pageSize) params.append("PageSize", filters.pageSize.toString())

      const query = params.toString()
      const url = query ? `/InternalFeedback/paged?${query}` : "/InternalFeedback/paged"
      const response = await fetchApi(url)
      return { data: response }
    } catch (error) {
      console.error("Error fetching internal feedback:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch internal feedback" }
    }
  },

  // Get a feedback by ID
  async getById(id: number): Promise<{ data?: InternalFeedback; error?: string }> {
    try {
      const response = await fetchApi(`/InternalFeedback/${id}`)
      return { data: response }
    } catch (error) {
      console.error("Error fetching internal feedback:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch internal feedback" }
    }
  },

  // Create a new feedback
  async create(data: InternalFeedbackCreateRequest): Promise<{ data?: InternalFeedback; error?: string }> {
    try {
      const response = await fetchApi("/InternalFeedback/create", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return { data: response }
    } catch (error) {
      console.error("Error creating internal feedback:", error)
      return { error: error instanceof Error ? error.message : "Failed to create internal feedback" }
    }
  },

  // Update a feedback
  async update(id: number, data: InternalFeedbackUpdateRequest): Promise<{ data?: InternalFeedback; error?: string }> {
    try {
      const response = await fetchApi(`/InternalFeedback/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      return { data: response }
    } catch (error) {
      console.error("Error updating internal feedback:", error)
      return { error: error instanceof Error ? error.message : "Failed to update internal feedback" }
    }
  },

  // Delete a feedback
  async delete(id: number): Promise<{ success?: boolean; error?: string }> {
    try {
      await fetchApi(`/InternalFeedback/${id}`, {
        method: "DELETE",
      })
      return { success: true }
    } catch (error) {
      console.error("Error deleting internal feedback:", error)
      return { error: error instanceof Error ? error.message : "Failed to delete internal feedback" }
    }
  },

  // Add comment to feedback
  async addComment(id: number, comment: string): Promise<{ data?: InternalFeedback; error?: string }> {
    try {
      const response = await fetchApi(`/InternalFeedback/${id}/comment`, {
        method: "POST",
        body: JSON.stringify(comment),
      })
      return { data: response }
    } catch (error) {
      console.error("Error adding comment:", error)
      return { error: error instanceof Error ? error.message : "Failed to add comment" }
    }
  },
}

// Get internal feedback (alias for getRecords)
export async function getInternalFeedback(
  filters: InternalFeedbackFilters = {},
): Promise<{ data?: InternalFeedbackPagedResponse; error?: string }> {
  return internalFeedbackApi.getRecords(filters)
}

// Add comment to internal feedback (alias for addComment)
export async function addCommentToInternalFeedback(
  id: number,
  comment: string,
): Promise<{ data?: InternalFeedback; error?: string }> {
  return internalFeedbackApi.addComment(id, comment)
}

// Get internal feedback by professional
export async function getInternalFeedbackByProfessional(
  professionalId: number,
  filters: Omit<InternalFeedbackFilters, "professionalId"> = {},
): Promise<{ data?: InternalFeedbackPagedResponse; error?: string }> {
  return internalFeedbackApi.getRecords({ ...filters, professionalId })
}

// Get internal feedback by team
export async function getInternalFeedbackByTeam(
  teamId: number,
  filters: Omit<InternalFeedbackFilters, "teamId"> = {},
): Promise<{ data?: InternalFeedbackPagedResponse; error?: string }> {
  return internalFeedbackApi.getRecords({ ...filters, teamId })
}

// Get internal feedback by category
export async function getInternalFeedbackByCategory(
  category: string,
  filters: Omit<InternalFeedbackFilters, "category"> = {},
): Promise<{ data?: InternalFeedbackPagedResponse; error?: string }> {
  return internalFeedbackApi.getRecords({ ...filters, category })
}

// Get internal feedback by status
export async function getInternalFeedbackByStatus(
  status: string,
  filters: Omit<InternalFeedbackFilters, "status"> = {},
): Promise<{ data?: InternalFeedbackPagedResponse; error?: string }> {
  return internalFeedbackApi.getRecords({ ...filters, status })
}

// Get internal feedback by priority
export async function getInternalFeedbackByPriority(
  priority: string,
  filters: Omit<InternalFeedbackFilters, "priority"> = {},
): Promise<{ data?: InternalFeedbackPagedResponse; error?: string }> {
  return internalFeedbackApi.getRecords({ ...filters, priority })
}

// Legacy exports for backward compatibility
export const getInternalFeedbackRecords = internalFeedbackApi.getRecords
export const getInternalFeedbackById = internalFeedbackApi.getById
export const createInternalFeedback = internalFeedbackApi.create
export const updateInternalFeedback = internalFeedbackApi.update
export const deleteInternalFeedback = internalFeedbackApi.delete
export const addInternalFeedbackComment = internalFeedbackApi.addComment
