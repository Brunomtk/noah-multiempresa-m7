import { fetchApi } from "./utils"
import type { InternalFeedback, InternalFeedbackFormData } from "@/types/internal-feedback"

const API_BASE = "/InternalFeedback"

// Mock data for development
const mockInternalFeedback: InternalFeedback[] = [
  {
    id: "1",
    title: "Feedback sobre limpeza",
    description: "Feedback detalhado sobre o serviço de limpeza realizado",
    category: "service",
    priority: "high",
    status: "open",
    professionalId: "1",
    professionalName: "João Silva",
    teamId: "1",
    teamName: "Equipe Alpha",
    companyId: "1",
    companyName: "Empresa ABC",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  },
]

// Get all internal feedback
export async function getInternalFeedbacks(): Promise<InternalFeedback[]> {
  return fetchApi<InternalFeedback[]>(API_BASE)
}

// Get internal feedback by ID
export async function getInternalFeedback(id: number): Promise<InternalFeedback> {
  return fetchApi<InternalFeedback>(`${API_BASE}/${id}`)
}

// Create new internal feedback
export async function createInternalFeedback(data: InternalFeedbackFormData): Promise<InternalFeedback> {
  return fetchApi<InternalFeedback>(API_BASE, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Update internal feedback
export async function updateInternalFeedback(id: number, data: Partial<InternalFeedback>): Promise<InternalFeedback> {
  return fetchApi<InternalFeedback>(`${API_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// Delete internal feedback
export async function deleteInternalFeedback(id: number): Promise<void> {
  return fetchApi<void>(`${API_BASE}/${id}`, {
    method: "DELETE",
  })
}

// Add comment to internal feedback
export async function addCommentToInternalFeedback(id: number, comment: string): Promise<InternalFeedback> {
  return fetchApi<InternalFeedback>(`${API_BASE}/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  })
}

// Get internal feedback by professional
export async function getInternalFeedbackByProfessional(professionalId: number): Promise<InternalFeedback[]> {
  return fetchApi<InternalFeedback[]>(`${API_BASE}/professional/${professionalId}`)
}

// Get internal feedback by team
export async function getInternalFeedbackByTeam(teamId: number): Promise<InternalFeedback[]> {
  return fetchApi<InternalFeedback[]>(`${API_BASE}/team/${teamId}`)
}

// Get internal feedback by category
export async function getInternalFeedbackByCategory(category: string): Promise<InternalFeedback[]> {
  return fetchApi<InternalFeedback[]>(`${API_BASE}/category/${category}`)
}

// Get internal feedback by status
export async function getInternalFeedbackByStatus(status: string): Promise<InternalFeedback[]> {
  return fetchApi<InternalFeedback[]>(`${API_BASE}/status/${status}`)
}

// Get internal feedback by priority
export async function getInternalFeedbackByPriority(priority: string): Promise<InternalFeedback[]> {
  return fetchApi<InternalFeedback[]>(`${API_BASE}/priority/${priority}`)
}
