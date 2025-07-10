"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { InternalFeedback } from "@/types/internal-feedback"
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

interface ProfessionalFeedbackContextType {
  feedbacks: InternalFeedback[]
  selectedFeedback: InternalFeedback | null
  stats: ProfessionalFeedbackStats | null
  loading: boolean
  error: string | null

  // Actions
  loadFeedbacks: (professionalId: string, filters?: ProfessionalFeedbackFilters) => Promise<void>
  loadFeedback: (professionalId: string, feedbackId: string) => Promise<void>
  respondToFeedback: (professionalId: string, feedbackId: string, response: string) => Promise<boolean>
  markAsRead: (professionalId: string, feedbackId: string) => Promise<boolean>
  markAllAsRead: (professionalId: string) => Promise<boolean>
  loadStats: (professionalId: string, period?: "week" | "month" | "quarter" | "year") => Promise<void>
  setSelectedFeedback: (feedback: InternalFeedback | null) => void
  clearError: () => void
}

const ProfessionalFeedbackContext = createContext<ProfessionalFeedbackContextType | undefined>(undefined)

export function ProfessionalFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<InternalFeedback[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<InternalFeedback | null>(null)
  const [stats, setStats] = useState<ProfessionalFeedbackStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFeedbacks = useCallback(async (professionalId: string, filters?: ProfessionalFeedbackFilters) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getProfessionalFeedbacks(professionalId, filters)
      if (response.success) {
        setFeedbacks(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError("Erro ao carregar feedbacks")
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
        setSelectedFeedback(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError("Erro ao carregar feedback")
    } finally {
      setLoading(false)
    }
  }, [])

  const respondToFeedback = useCallback(
    async (professionalId: string, feedbackId: string, response: string): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const result = await respondToProfessionalFeedback(professionalId, feedbackId, response)
        if (result.success) {
          // Atualizar o feedback na lista
          setFeedbacks((prev) => prev.map((feedback) => (feedback.id === feedbackId ? result.data : feedback)))

          // Atualizar o feedback selecionado se for o mesmo
          if (selectedFeedback?.id === feedbackId) {
            setSelectedFeedback(result.data)
          }

          return true
        } else {
          setError(result.message)
          return false
        }
      } catch (err) {
        setError("Erro ao responder feedback")
        return false
      } finally {
        setLoading(false)
      }
    },
    [selectedFeedback],
  )

  const markAsRead = useCallback(
    async (professionalId: string, feedbackId: string): Promise<boolean> => {
      setError(null)

      try {
        const result = await markProfessionalFeedbackAsRead(professionalId, feedbackId)
        if (result.success) {
          // Atualizar o feedback na lista
          setFeedbacks((prev) => prev.map((feedback) => (feedback.id === feedbackId ? result.data : feedback)))

          // Atualizar o feedback selecionado se for o mesmo
          if (selectedFeedback?.id === feedbackId) {
            setSelectedFeedback(result.data)
          }

          return true
        } else {
          setError(result.message)
          return false
        }
      } catch (err) {
        setError("Erro ao marcar feedback como lido")
        return false
      }
    },
    [selectedFeedback],
  )

  const markAllAsRead = useCallback(
    async (professionalId: string): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const result = await markAllProfessionalFeedbacksAsRead(professionalId)
        if (result.success) {
          // Recarregar feedbacks para refletir as mudanças
          await loadFeedbacks(professionalId)
          return true
        } else {
          setError(result.message)
          return false
        }
      } catch (err) {
        setError("Erro ao marcar todos os feedbacks como lidos")
        return false
      } finally {
        setLoading(false)
      }
    },
    [loadFeedbacks],
  )

  const loadStats = useCallback(async (professionalId: string, period?: "week" | "month" | "quarter" | "year") => {
    setError(null)

    try {
      const response = await getProfessionalFeedbackStats(professionalId, period)
      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError("Erro ao carregar estatísticas")
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: ProfessionalFeedbackContextType = {
    feedbacks,
    selectedFeedback,
    stats,
    loading,
    error,
    loadFeedbacks,
    loadFeedback,
    respondToFeedback,
    markAsRead,
    markAllAsRead,
    loadStats,
    setSelectedFeedback,
    clearError,
  }

  return <ProfessionalFeedbackContext.Provider value={value}>{children}</ProfessionalFeedbackContext.Provider>
}

export function useProfessionalFeedbackContext() {
  const context = useContext(ProfessionalFeedbackContext)
  if (context === undefined) {
    throw new Error("useProfessionalFeedbackContext must be used within a ProfessionalFeedbackProvider")
  }
  return context
}
