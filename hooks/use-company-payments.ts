import { useCompanyPaymentsContext } from "@/contexts/company-payments-context"
import type { Payment } from "@/types/payment"
import { format } from "date-fns"

export const useCompanyPayments = () => {
  const context = useCompanyPaymentsContext()

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "PPP")
  }

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Get status color for UI
  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "border-green-500 text-green-500"
      case "pending":
        return "border-amber-500 text-amber-500"
      case "overdue":
        return "border-red-500 text-red-500"
      case "cancelled":
        return "border-gray-500 text-gray-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  // Get status badge color for UI
  const getStatusBadgeColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "overdue":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "cancelled":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  // Get status label for display
  const getStatusLabel = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "Completed"
      case "pending":
        return "Pending"
      case "overdue":
        return "Overdue"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  // Get payment method label for display
  const getMethodLabel = (method?: Payment["method"]) => {
    if (!method) return "N/A"

    switch (method) {
      case "credit_card":
        return "Credit Card"
      case "debit_card":
        return "Debit Card"
      case "bank_transfer":
        return "Bank Transfer"
      case "pix":
        return "PIX"
      default:
        return method
    }
  }

  // Check if a payment is overdue
  const isOverdue = (payment: Payment) => {
    if (payment.status === "paid" || payment.status === "cancelled") return false

    const dueDate = new Date(payment.dueDate)
    const today = new Date()

    return dueDate < today
  }

  // Update filters and fetch payments
  const updateFilters = (newFilters: Partial<Omit<typeof context.filters, "companyId">>) => {
    const updatedFilters = { ...newFilters }
    context.setFilters(updatedFilters)
    context.fetchPayments(updatedFilters)
  }

  // Get payment statistics
  const getStatistics = () => {
    return (
      context.statistics || {
        totalAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        completedAmount: 0,
        pendingCount: 0,
        overdueCount: 0,
        completedCount: 0,
      }
    )
  }

  return {
    ...context,
    formatDate,
    formatCurrency,
    getStatusColor,
    getStatusBadgeColor,
    getStatusLabel,
    getMethodLabel,
    isOverdue,
    updateFilters,
    getStatistics,
  }
}
