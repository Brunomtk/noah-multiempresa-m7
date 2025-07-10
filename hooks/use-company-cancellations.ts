"use client"

import { useCompanyCancellationsContext } from "@/contexts/company-cancellations-context"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useEffect } from "react"

export function useCompanyCancellations() {
  const context = useCompanyCancellationsContext()

  // Helper function to format dates
  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  // Helper function to format short date
  const formatShortDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR })
  }

  // Helper function to get refund status color
  const getRefundStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500"
      case "processed":
        return "bg-green-500/20 text-green-500"
      case "rejected":
        return "bg-red-500/20 text-red-500"
      case "not_applicable":
        return "bg-gray-500/20 text-gray-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  // Helper function to get refund status label
  const getRefundStatusLabel = (status?: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "processed":
        return "Processado"
      case "rejected":
        return "Rejeitado"
      case "not_applicable":
        return "Não Aplicável"
      default:
        return "Não Aplicável"
    }
  }

  // Helper function to get role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "company":
        return "Empresa"
      case "professional":
        return "Profissional"
      case "customer":
        return "Cliente"
      default:
        return role
    }
  }

  // Helper function to update filters
  const updateFilters = (newFilters: Partial<typeof context.filters>) => {
    context.setFilters({ ...context.filters, ...newFilters })
  }

  // Helper function to get cancellation reasons for select
  const getCancellationReasons = () => [
    { value: "client_request", label: "Solicitação do Cliente" },
    { value: "professional_unavailable", label: "Profissional Indisponível" },
    { value: "weather_conditions", label: "Condições Climáticas" },
    { value: "client_no_show", label: "Cliente Não Compareceu" },
    { value: "service_issue", label: "Problema com o Serviço" },
    { value: "payment_issue", label: "Problema de Pagamento" },
    { value: "other", label: "Outro" },
  ]

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Helper function to calculate refund percentage
  const calculateRefundPercentage = () => {
    if (!context.stats || context.stats.total === 0) return 0
    return ((context.stats.processed / context.stats.total) * 100).toFixed(1)
  }

  // Load initial data
  useEffect(() => {
    context.fetchCancellations()
    context.fetchStats()
  }, [context.filters])

  return {
    ...context,
    formatDate,
    formatShortDate,
    getRefundStatusColor,
    getRefundStatusLabel,
    getRoleLabel,
    updateFilters,
    getCancellationReasons,
    formatCurrency,
    calculateRefundPercentage,
  }
}
