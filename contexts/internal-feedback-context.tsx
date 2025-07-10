"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
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
  getInternalFeedbackByProfessional,
  getInternalFeedbackByTeam,
  getInternalFeedbackByCategory,
  getInternalFeedbackByStatus,
  getInternalFeedbackByPriority,
} from "@/lib/api/internal-feedback"
import { useToast } from "@/hooks/use-toast"

interface InternalFeedbackContextType {
  feedbacks: InternalFeedback[]
  isLoading: boolean
  error: Error | null
  filters: InternalFeedbackFilters
  setFilters: (filters: InternalFeedbackFilters) => void
  resetFilters: () => void
  fetchFeedbacks: () => Promise<void>
  fetchFeedbackById: (id: string) => Promise<InternalFeedback | null>
  addFeedback: (data: InternalFeedbackFormData) => Promise<InternalFeedback>
  updateFeedback: (id: string, data: Partial<InternalFeedbackFormData>) => Promise<InternalFeedback>
  deleteFeedback: (id: string) => Promise<void>
  addComment: (
    feedbackId: string,
    comment: Omit<InternalFeedbackComment, "id" | "date">,
  ) => Promise<InternalFeedbackComment>
  fetchFeedbacksByProfessional: (professionalId: string) => Promise<InternalFeedback[]>
  fetchFeedbacksByTeam: (teamId: string) => Promise<InternalFeedback[]>
  fetchFeedbacksByCategory: (category: string) => Promise<InternalFeedback[]>
  fetchFeedbacksByStatus: (status: string) => Promise<InternalFeedback[]>
  fetchFeedbacksByPriority: (priority: string) => Promise<InternalFeedback[]>
}

const InternalFeedbackContext = createContext<InternalFeedbackContextType | undefined>(undefined)

export function InternalFeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<InternalFeedback[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<InternalFeedbackFilters>({
    status: "all",
  })
  const { toast } = useToast()

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getInternalFeedback(filters)
      setFeedbacks(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch internal feedback"))
      toast({
        title: "Error",
        description: "Failed to fetch internal feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, toast])

  const fetchFeedbackById = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const feedback = await getInternalFeedbackById(id)
        return feedback
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch internal feedback with ID ${id}`))
        toast({
          title: "Error",
          description: `Failed to fetch internal feedback details. Please try again.`,
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const addFeedback = useCallback(
    async (data: InternalFeedbackFormData) => {
      setIsLoading(true)
      setError(null)
      try {
        const newFeedback = await createInternalFeedback(data)
        setFeedbacks((prev) => [newFeedback, ...prev])
        toast({
          title: "Success",
          description: "Internal feedback has been added successfully.",
        })
        return newFeedback
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to add internal feedback"))
        toast({
          title: "Error",
          description: "Failed to add internal feedback. Please try again.",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const updateFeedback = useCallback(
    async (id: string, data: Partial<InternalFeedbackFormData>) => {
      setIsLoading(true)
      setError(null)
      try {
        const updatedFeedback = await updateInternalFeedback(id, data)
        setFeedbacks((prev) => prev.map((feedback) => (feedback.id === id ? updatedFeedback : feedback)))
        toast({
          title: "Success",
          description: "Internal feedback has been updated successfully.",
        })
        return updatedFeedback
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to update internal feedback with ID ${id}`))
        toast({
          title: "Error",
          description: "Failed to update internal feedback. Please try again.",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const deleteFeedback = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        await deleteInternalFeedback(id)
        setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id))
        toast({
          title: "Success",
          description: "Internal feedback has been deleted successfully.",
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to delete internal feedback with ID ${id}`))
        toast({
          title: "Error",
          description: "Failed to delete internal feedback. Please try again.",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const addComment = useCallback(
    async (feedbackId: string, comment: Omit<InternalFeedbackComment, "id" | "date">) => {
      setIsLoading(true)
      setError(null)
      try {
        const newComment = await addCommentToInternalFeedback(feedbackId, comment)
        setFeedbacks((prev) =>
          prev.map((feedback) => {
            if (feedback.id === feedbackId) {
              return {
                ...feedback,
                comments: [...feedback.comments, newComment],
                updatedAt: new Date().toISOString(),
              }
            }
            return feedback
          }),
        )
        toast({
          title: "Success",
          description: "Comment has been added successfully.",
        })
        return newComment
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error(`Failed to add comment to internal feedback with ID ${feedbackId}`),
        )
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const fetchFeedbacksByProfessional = useCallback(
    async (professionalId: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getInternalFeedbackByProfessional(professionalId)
        return data
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(`Failed to fetch internal feedback for professional ${professionalId}`),
        )
        toast({
          title: "Error",
          description: "Failed to fetch internal feedback by professional. Please try again.",
          variant: "destructive",
        })
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const fetchFeedbacksByTeam = useCallback(
    async (teamId: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getInternalFeedbackByTeam(teamId)
        return data
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch internal feedback for team ${teamId}`))
        toast({
          title: "Error",
          description: "Failed to fetch internal feedback by team. Please try again.",
          variant: "destructive",
        })
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const fetchFeedbacksByCategory = useCallback(
    async (category: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getInternalFeedbackByCategory(category)
        return data
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch internal feedback for category ${category}`))
        toast({
          title: "Error",
          description: "Failed to fetch internal feedback by category. Please try again.",
          variant: "destructive",
        })
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const fetchFeedbacksByStatus = useCallback(
    async (status: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getInternalFeedbackByStatus(status)
        return data
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch internal feedback for status ${status}`))
        toast({
          title: "Error",
          description: "Failed to fetch internal feedback by status. Please try again.",
          variant: "destructive",
        })
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const fetchFeedbacksByPriority = useCallback(
    async (priority: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getInternalFeedbackByPriority(priority)
        return data
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch internal feedback for priority ${priority}`))
        toast({
          title: "Error",
          description: "Failed to fetch internal feedback by priority. Please try again.",
          variant: "destructive",
        })
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const resetFilters = useCallback(() => {
    setFilters({ status: "all" })
  }, [])

  useEffect(() => {
    fetchFeedbacks()
  }, [fetchFeedbacks])

  return (
    <InternalFeedbackContext.Provider
      value={{
        feedbacks,
        isLoading,
        error,
        filters,
        setFilters,
        resetFilters,
        fetchFeedbacks,
        fetchFeedbackById,
        addFeedback,
        updateFeedback,
        deleteFeedback,
        addComment,
        fetchFeedbacksByProfessional,
        fetchFeedbacksByTeam,
        fetchFeedbacksByCategory,
        fetchFeedbacksByStatus,
        fetchFeedbacksByPriority,
      }}
    >
      {children}
    </InternalFeedbackContext.Provider>
  )
}

export function useInternalFeedbackContext() {
  const context = useContext(InternalFeedbackContext)
  if (context === undefined) {
    throw new Error("useInternalFeedbackContext must be used within an InternalFeedbackProvider")
  }
  return context
}
