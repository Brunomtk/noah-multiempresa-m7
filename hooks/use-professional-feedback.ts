"use client"

import { useState, useCallback } from "react"
import {
  getProfessionalFeedbacks,
  getProfessionalFeedback,
  respondToProfessionalFeedback,
  markProfessionalFeedbackAsRead,
  getProfessionalFeedbackStats,
  markAllProfessionalFeedbacksAsRead,
  type ProfessionalFeedbackFilters,
} from "@/lib/api/professional-feedback"

interface ProfessionalFeedbackStats {
  total: number
  positive: number
  negative: number
  neutral: number
  averageRating: number
  responseRate: number
  unreadCount: number
}

export function useProfessionalFeedback() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFeedbacks = useCallback(async (professionalId: string, filters?: ProfessionalFeedbackFilters) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getProfessionalFeedbacks(professionalId, filters)
      if (response.success) {
        return response.data
      } else {
        setError(response.message)
        return []
      }
    } catch (err) {
      setError("Erro ao carregar feedbacks")
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const loadFeedback = useCallback(async (professionalId: string, feedbackId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getProfessionalFeedback(professionalId, feedbackId)
      if (response.success) {
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError("Erro ao carregar feedback")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const respondToFeedback = useCallback(async (professionalId: string, feedbackId: string, response: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await respondToProfessionalFeedback(professionalId, feedbackId, response)
      if (result.success) {
        return result.data
      } else {
        setError(result.message)
        return null
      }
    } catch (err) {
      setError("Erro ao responder feedback")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (professionalId: string, feedbackId: string) => {
    setError(null)

    try {
      const result = await markProfessionalFeedbackAsRead(professionalId, feedbackId)
      if (result.success) {
        return result.data
      } else {
        setError(result.message)
        return null
      }
    } catch (err) {
      setError("Erro ao marcar feedback como lido")
      return null
    }
  }, [])

  const markAllAsRead = useCallback(async (professionalId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await markAllProfessionalFeedbacksAsRead(professionalId)
      if (result.success) {
        return result.data
      } else {
        setError(result.message)
        return null
      }
    } catch (err) {
      setError("Erro ao marcar todos os feedbacks como lidos")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStats = useCallback(async (professionalId: string, period?: "week" | "month" | "quarter" | "year") => {
    setError(null)

    try {
      const response = await getProfessionalFeedbackStats(professionalId, period)
      if (response.success) {
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError("Erro ao carregar estatísticas")
      return null
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    loadFeedbacks,
    loadFeedback,
    respondToFeedback,
    markAsRead,
    markAllAsRead,
    loadStats,
    clearError,
  }
}
