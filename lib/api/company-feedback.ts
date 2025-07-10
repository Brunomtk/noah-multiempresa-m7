import type {
  InternalFeedback,
  InternalFeedbackFormData,
  InternalFeedbackFilters,
  InternalFeedbackComment,
} from "@/types/internal-feedback"
import {
  getInternalFeedback,
  getInternalFeedbackById,
  createInternalFeedback,
  updateInternalFeedback,
  deleteInternalFeedback,
  addCommentToInternalFeedback,
} from "./internal-feedback"

// Company-specific feedback API functions that ensure company isolation
export async function getCompanyFeedback(
  companyId: string,
  filters?: InternalFeedbackFilters,
): Promise<InternalFeedback[]> {
  try {
    // Get all feedback and filter by company
    const allFeedback = await getInternalFeedback(filters)

    // In a real app, this filtering would be done on the backend
    // For now, we'll filter client-side to simulate company isolation
    return allFeedback.filter((feedback) => {
      // Assuming feedback has a companyId field or we can derive it from the professional/team
      // This is a simplified example - in production, this would be handled by the API
      return true // For now, return all feedback as mock data doesn't have companyId
    })
  } catch (error) {
    console.error("Error fetching company feedback:", error)
    throw error
  }
}

export async function getCompanyFeedbackById(companyId: string, feedbackId: string): Promise<InternalFeedback | null> {
  try {
    const feedback = await getInternalFeedbackById(feedbackId)

    // In a real app, verify that this feedback belongs to the company
    // For now, we'll return it as-is
    return feedback
  } catch (error) {
    console.error(`Error fetching company feedback with ID ${feedbackId}:`, error)
    throw error
  }
}

export async function createCompanyFeedback(
  companyId: string,
  data: InternalFeedbackFormData,
): Promise<InternalFeedback> {
  try {
    // In a real app, we would add the companyId to the data
    const feedbackData = {
      ...data,
      // companyId would be added here
    }

    return await createInternalFeedback(feedbackData)
  } catch (error) {
    console.error("Error creating company feedback:", error)
    throw error
  }
}

export async function updateCompanyFeedback(
  companyId: string,
  feedbackId: string,
  data: Partial<InternalFeedbackFormData>,
): Promise<InternalFeedback> {
  try {
    // In a real app, verify that this feedback belongs to the company before updating
    return await updateInternalFeedback(feedbackId, data)
  } catch (error) {
    console.error(`Error updating company feedback with ID ${feedbackId}:`, error)
    throw error
  }
}

export async function deleteCompanyFeedback(companyId: string, feedbackId: string): Promise<void> {
  try {
    // In a real app, verify that this feedback belongs to the company before deleting
    await deleteInternalFeedback(feedbackId)
  } catch (error) {
    console.error(`Error deleting company feedback with ID ${feedbackId}:`, error)
    throw error
  }
}

export async function addCommentToCompanyFeedback(
  companyId: string,
  feedbackId: string,
  comment: Omit<InternalFeedbackComment, "id" | "date">,
): Promise<InternalFeedbackComment> {
  try {
    // In a real app, verify that this feedback belongs to the company before adding comment
    return await addCommentToInternalFeedback(feedbackId, comment)
  } catch (error) {
    console.error(`Error adding comment to company feedback with ID ${feedbackId}:`, error)
    throw error
  }
}

// Company-specific statistics
export async function getCompanyFeedbackStats(companyId: string): Promise<{
  total: number
  pending: number
  resolved: number
  inProgress: number
  byType: Record<string, number>
  byPriority: Record<string, number>
}> {
  try {
    const feedback = await getCompanyFeedback(companyId)

    const stats = {
      total: feedback.length,
      pending: feedback.filter((f) => f.status === "pending").length,
      resolved: feedback.filter((f) => f.status === "resolved").length,
      inProgress: feedback.filter((f) => f.status === "in_progress").length,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    }

    // Count by type
    feedback.forEach((f) => {
      stats.byType[f.category] = (stats.byType[f.category] || 0) + 1
      stats.byPriority[f.priority] = (stats.byPriority[f.priority] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error("Error fetching company feedback statistics:", error)
    throw error
  }
}

// Get feedback by professional (filtered by company)
export async function getCompanyFeedbackByProfessional(
  companyId: string,
  professionalId: string,
): Promise<InternalFeedback[]> {
  try {
    const feedback = await getCompanyFeedback(companyId)
    return feedback.filter((f) => f.professionalId === professionalId)
  } catch (error) {
    console.error(`Error fetching company feedback for professional ${professionalId}:`, error)
    throw error
  }
}

// Get feedback by team (filtered by company)
export async function getCompanyFeedbackByTeam(companyId: string, teamId: string): Promise<InternalFeedback[]> {
  try {
    const feedback = await getCompanyFeedback(companyId)
    return feedback.filter((f) => f.teamId === teamId)
  } catch (error) {
    console.error(`Error fetching company feedback for team ${teamId}:`, error)
    throw error
  }
}

// Resolve feedback
export async function resolveCompanyFeedback(
  companyId: string,
  feedbackId: string,
  resolution: string,
): Promise<InternalFeedback> {
  try {
    return await updateCompanyFeedback(companyId, feedbackId, {
      status: "resolved",
      // In a real app, we would also store the resolution details
    })
  } catch (error) {
    console.error(`Error resolving company feedback with ID ${feedbackId}:`, error)
    throw error
  }
}

// Export feedback data
export async function exportCompanyFeedback(
  companyId: string,
  format: "csv" | "excel" | "pdf",
  filters?: InternalFeedbackFilters,
): Promise<Blob> {
  try {
    const feedback = await getCompanyFeedback(companyId, filters)

    // In a real app, this would call an API endpoint that generates the file
    // For now, we'll create a simple CSV
    if (format === "csv") {
      const headers = ["ID", "Title", "Professional", "Team", "Category", "Status", "Priority", "Date"]
      const rows = feedback.map((f) => [
        f.id,
        f.title,
        f.professional,
        f.team,
        f.category,
        f.status,
        f.priority,
        f.date,
      ])

      const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
      return new Blob([csv], { type: "text/csv" })
    }

    throw new Error(`Export format ${format} not implemented`)
  } catch (error) {
    console.error("Error exporting company feedback:", error)
    throw error
  }
}
