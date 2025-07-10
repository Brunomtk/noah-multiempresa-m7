"use client"

import { useCancellationsContext } from "@/contexts/cancellations-context"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function useCancellations() {
  const context = useCancellationsContext()

  // Helper function to format dates
  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  // Helper function to get refund status color
  const getRefundStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      case "processed":
        return "text-green-600 bg-green-50"
      case "rejected":
        return "text-red-600 bg-red-50"
      case "not_applicable":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
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

  return {
    ...context,
    formatDate,
    getRefundStatusColor,
    getRefundStatusLabel,
    getRoleLabel,
    updateFilters,
  }
}
