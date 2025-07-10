// Internal Feedback Types
export type InternalFeedbackStatus = "pending" | "in_progress" | "resolved"
export type InternalFeedbackPriority = "low" | "medium" | "high"

export interface InternalFeedbackComment {
  id: string
  authorId: string
  author: string
  date: string
  text: string
}

export interface InternalFeedback {
  id: string
  title: string
  professionalId: string
  professional: string
  teamId: string
  team: string
  category: string
  status: InternalFeedbackStatus
  date: string
  description: string
  priority: InternalFeedbackPriority
  assignedToId: string
  assignedTo: string
  comments: InternalFeedbackComment[]
  createdAt: string
  updatedAt: string
}

export interface InternalFeedbackFormData {
  title: string
  professionalId: string
  professional?: string
  teamId: string
  team?: string
  category: string
  status?: InternalFeedbackStatus
  description: string
  priority?: InternalFeedbackPriority
  assignedToId: string
  assignedTo?: string
}

export interface InternalFeedbackFilters {
  status?: InternalFeedbackStatus | "all"
  priority?: InternalFeedbackPriority
  category?: string
  professionalId?: string
  teamId?: string
  search?: string
}
