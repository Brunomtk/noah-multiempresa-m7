import { usePaymentsContext } from "@/contexts/payments-context"
import type { Payment, PaymentFilters } from "@/types/payment"
import { format } from "date-fns"

export const usePayments = () => {
  const context = usePaymentsContext()

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
        return "bg-green-100 text-green-800 border-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-300"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Get status label for display
  const getStatusLabel = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "Paid"
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
        return "Unknown"
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
  const updateFilters = (newFilters: Partial<PaymentFilters>) => {
    const updatedFilters = { ...context.filters, ...newFilters }
    context.setFilters(updatedFilters)
    context.fetchPayments(updatedFilters)
  }

  return {
    ...context,
    formatDate,
    formatCurrency,
    getStatusColor,
    getStatusLabel,
    getMethodLabel,
    isOverdue,
    updateFilters,
  }
}
