import type {
  InternalFeedback,
  InternalFeedbackFormData,
  InternalFeedbackFilters,
  InternalFeedbackComment,
} from "@/types/internal-feedback"

// Mock data for development
const mockInternalFeedback: InternalFeedback[] = [
  {
    id: "FB001",
    title: "Equipment issues during service",
    professionalId: "prof-001",
    professional: "John Doe",
    teamId: "team-001",
    team: "Cleaning Team A",
    category: "Equipment",
    status: "pending",
    date: "2023-05-15",
    description: "The vacuum cleaner stopped working during the service. Need a replacement ASAP.",
    priority: "high",
    assignedToId: "user-001",
    assignedTo: "Operations Manager",
    comments: [
      {
        id: "comment-001",
        authorId: "user-001",
        author: "Operations Manager",
        date: "2023-05-16",
        text: "Replacement equipment has been ordered. Will be delivered tomorrow.",
      },
    ],
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-16T14:20:00Z",
  },
  {
    id: "FB002",
    title: "Schedule conflict with another appointment",
    professionalId: "prof-002",
    professional: "Jane Smith",
    teamId: "team-002",
    team: "Maintenance Team B",
    category: "Scheduling",
    status: "resolved",
    date: "2023-05-14",
    description: "Two appointments were scheduled at the same time. Need better coordination.",
    priority: "medium",
    assignedToId: "user-002",
    assignedTo: "Scheduling Manager",
    comments: [
      {
        id: "comment-002",
        authorId: "user-002",
        author: "Scheduling Manager",
        date: "2023-05-14",
        text: "Issue resolved. Implemented new check to prevent overlapping appointments.",
      },
    ],
    createdAt: "2023-05-14T09:15:00Z",
    updatedAt: "2023-05-14T16:45:00Z",
  },
  {
    id: "FB003",
    title: "Customer provided wrong address",
    professionalId: "prof-003",
    professional: "Mike Johnson",
    teamId: "team-003",
    team: "Plumbing Team C",
    category: "Customer Info",
    status: "in_progress",
    date: "2023-05-16",
    description: "Customer gave incorrect address. Wasted 30 minutes finding the correct location.",
    priority: "low",
    assignedToId: "user-003",
    assignedTo: "Customer Service",
    comments: [
      {
        id: "comment-003",
        authorId: "user-003",
        author: "Customer Service",
        date: "2023-05-16",
        text: "Contacting customer to verify all address information in our system.",
      },
    ],
    createdAt: "2023-05-16T11:20:00Z",
    updatedAt: "2023-05-16T13:10:00Z",
  },
  {
    id: "FB004",
    title: "Need additional training on new software",
    professionalId: "prof-004",
    professional: "Sarah Williams",
    teamId: "team-004",
    team: "Electrical Team A",
    category: "Training",
    status: "pending",
    date: "2023-05-13",
    description: "The new invoicing software is difficult to use in the field. Need more training.",
    priority: "medium",
    assignedToId: "user-004",
    assignedTo: "Training Coordinator",
    comments: [],
    createdAt: "2023-05-13T14:30:00Z",
    updatedAt: "2023-05-13T14:30:00Z",
  },
  {
    id: "FB005",
    title: "Safety concern at customer site",
    professionalId: "prof-005",
    professional: "Robert Brown",
    teamId: "team-005",
    team: "Construction Team D",
    category: "Safety",
    status: "in_progress",
    date: "2023-05-17",
    description: "Unsafe conditions observed at the worksite. Need safety assessment before continuing work.",
    priority: "high",
    assignedToId: "user-005",
    assignedTo: "Safety Officer",
    comments: [
      {
        id: "comment-004",
        authorId: "user-005",
        author: "Safety Officer",
        date: "2023-05-17",
        text: "Scheduling inspection for tomorrow morning. Work paused until then.",
      },
    ],
    createdAt: "2023-05-17T08:45:00Z",
    updatedAt: "2023-05-17T10:20:00Z",
  },
]

// API functions
export async function getInternalFeedback(filters?: InternalFeedbackFilters): Promise<InternalFeedback[]> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}?${new URLSearchParams(filters)}`)
    // if (!response.ok) throw new Error('Failed to fetch internal feedback')
    // return await response.json()

    // For development, filter the mock data based on the provided filters
    let filteredFeedback = [...mockInternalFeedback]

    if (filters) {
      if (filters.status && filters.status !== "all") {
        filteredFeedback = filteredFeedback.filter((feedback) => feedback.status === filters.status)
      }

      if (filters.priority) {
        filteredFeedback = filteredFeedback.filter((feedback) => feedback.priority === filters.priority)
      }

      if (filters.category) {
        filteredFeedback = filteredFeedback.filter((feedback) => feedback.category === filters.category)
      }

      if (filters.professionalId) {
        filteredFeedback = filteredFeedback.filter((feedback) => feedback.professionalId === filters.professionalId)
      }

      if (filters.teamId) {
        filteredFeedback = filteredFeedback.filter((feedback) => feedback.teamId === filters.teamId)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredFeedback = filteredFeedback.filter(
          (feedback) =>
            feedback.title.toLowerCase().includes(searchLower) ||
            feedback.description.toLowerCase().includes(searchLower) ||
            feedback.professional.toLowerCase().includes(searchLower) ||
            feedback.team.toLowerCase().includes(searchLower),
        )
      }
    }

    return filteredFeedback
  } catch (error) {
    console.error("Error fetching internal feedback:", error)
    throw error
  }
}

export async function getInternalFeedbackById(id: string): Promise<InternalFeedback | null> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/${id}`)
    // if (!response.ok) throw new Error('Failed to fetch internal feedback')
    // return await response.json()

    // For development, find the feedback in the mock data
    const feedback = mockInternalFeedback.find((f) => f.id === id)
    return feedback || null
  } catch (error) {
    console.error(`Error fetching internal feedback with ID ${id}:`, error)
    throw error
  }
}

export async function createInternalFeedback(data: InternalFeedbackFormData): Promise<InternalFeedback> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(API_ENDPOINTS.INTERNAL_FEEDBACK, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // if (!response.ok) throw new Error('Failed to create internal feedback')
    // return await response.json()

    // For development, create a new feedback with mock data
    const newFeedback: InternalFeedback = {
      id: `FB${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      title: data.title,
      professionalId: data.professionalId,
      professional: data.professional || "Unknown Professional",
      teamId: data.teamId,
      team: data.team || "Unknown Team",
      category: data.category,
      status: data.status || "pending",
      date: new Date().toISOString().split("T")[0],
      description: data.description,
      priority: data.priority || "medium",
      assignedToId: data.assignedToId,
      assignedTo: data.assignedTo || "Unassigned",
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, the new feedback would be returned from the API
    return newFeedback
  } catch (error) {
    console.error("Error creating internal feedback:", error)
    throw error
  }
}

export async function updateInternalFeedback(
  id: string,
  data: Partial<InternalFeedbackFormData>,
): Promise<InternalFeedback> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // if (!response.ok) throw new Error('Failed to update internal feedback')
    // return await response.json()

    // For development, find and update the feedback in the mock data
    const feedback = mockInternalFeedback.find((f) => f.id === id)
    if (!feedback) {
      throw new Error(`Internal feedback with ID ${id} not found`)
    }

    // Update the feedback with the new data
    const updatedFeedback: InternalFeedback = {
      ...feedback,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    // In a real app, the updated feedback would be returned from the API
    return updatedFeedback
  } catch (error) {
    console.error(`Error updating internal feedback with ID ${id}:`, error)
    throw error
  }
}

export async function deleteInternalFeedback(id: string): Promise<void> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/${id}`, {
    //   method: 'DELETE'
    // })
    // if (!response.ok) throw new Error('Failed to delete internal feedback')
    // return

    // For development, we would filter out the deleted feedback from the mock data
    // This is just a placeholder since we're not actually modifying the mock data
    console.log(`Deleted internal feedback with ID ${id}`)
  } catch (error) {
    console.error(`Error deleting internal feedback with ID ${id}:`, error)
    throw error
  }
}

export async function addCommentToInternalFeedback(
  feedbackId: string,
  comment: Omit<InternalFeedbackComment, "id" | "date">,
): Promise<InternalFeedbackComment> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/${feedbackId}/comments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(comment)
    // })
    // if (!response.ok) throw new Error('Failed to add comment to internal feedback')
    // return await response.json()

    // For development, create a new comment with mock data
    const newComment: InternalFeedbackComment = {
      id: `comment-${Math.floor(Math.random() * 1000)}`,
      authorId: comment.authorId,
      author: comment.author,
      text: comment.text,
      date: new Date().toISOString().split("T")[0],
    }

    // In a real app, the new comment would be returned from the API
    return newComment
  } catch (error) {
    console.error(`Error adding comment to internal feedback with ID ${feedbackId}:`, error)
    throw error
  }
}

export async function getInternalFeedbackByProfessional(professionalId: string): Promise<InternalFeedback[]> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/professional/${professionalId}`)
    // if (!response.ok) throw new Error('Failed to fetch internal feedback by professional')
    // return await response.json()

    // For development, filter the mock data by professional ID
    return mockInternalFeedback.filter((feedback) => feedback.professionalId === professionalId)
  } catch (error) {
    console.error(`Error fetching internal feedback for professional ${professionalId}:`, error)
    throw error
  }
}

export async function getInternalFeedbackByTeam(teamId: string): Promise<InternalFeedback[]> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/team/${teamId}`)
    // if (!response.ok) throw new Error('Failed to fetch internal feedback by team')
    // return await response.json()

    // For development, filter the mock data by team ID
    return mockInternalFeedback.filter((feedback) => feedback.teamId === teamId)
  } catch (error) {
    console.error(`Error fetching internal feedback for team ${teamId}:`, error)
    throw error
  }
}

export async function getInternalFeedbackByCategory(category: string): Promise<InternalFeedback[]> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/category/${category}`)
    // if (!response.ok) throw new Error('Failed to fetch internal feedback by category')
    // return await response.json()

    // For development, filter the mock data by category
    return mockInternalFeedback.filter((feedback) => feedback.category === category)
  } catch (error) {
    console.error(`Error fetching internal feedback for category ${category}:`, error)
    throw error
  }
}

export async function getInternalFeedbackByStatus(status: string): Promise<InternalFeedback[]> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/status/${status}`)
    // if (!response.ok) throw new Error('Failed to fetch internal feedback by status')
    // return await response.json()

    // For development, filter the mock data by status
    return mockInternalFeedback.filter((feedback) => feedback.status === status)
  } catch (error) {
    console.error(`Error fetching internal feedback for status ${status}:`, error)
    throw error
  }
}

export async function getInternalFeedbackByPriority(priority: string): Promise<InternalFeedback[]> {
  try {
    // In a real app, this would be a fetch call to the API
    // const response = await fetch(`${API_ENDPOINTS.INTERNAL_FEEDBACK}/priority/${priority}`)
    // if (!response.ok) throw new Error('Failed to fetch internal feedback by priority')
    // return await response.json()

    // For development, filter the mock data by priority
    return mockInternalFeedback.filter((feedback) => feedback.priority === priority)
  } catch (error) {
    console.error(`Error fetching internal feedback for priority ${priority}:`, error)
    throw error
  }
}
