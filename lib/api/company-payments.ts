import type { Payment } from "@/types/payment"
import { getPayments, getPaymentById, createPayment, updatePayment, updatePaymentStatus } from "@/lib/api/payments"

// Get all payments for a specific company with optional filters
export const getCompanyPayments = async (
  companyId: string,
  filters?: {
    status?: "pending" | "paid" | "overdue" | "cancelled"
    search?: string
    startDate?: string
    endDate?: string
    planId?: string
  },
): Promise<Payment[]> => {
  try {
    // Use the existing getPayments function but always include the companyId
    return await getPayments({ ...filters, companyId })
  } catch (error) {
    console.error("Error fetching company payments:", error)
    throw error
  }
}

// Get a single payment by ID (with company verification)
export const getCompanyPaymentById = async (companyId: string, id: string): Promise<Payment | null> => {
  try {
    const payment = await getPaymentById(id)

    // Security check: ensure the payment belongs to the company
    if (payment && payment.companyId === companyId) {
      return payment
    }

    return null
  } catch (error) {
    console.error(`Error fetching company payment with ID ${id}:`, error)
    throw error
  }
}

// Create a new payment for a company
export const createCompanyPayment = async (
  companyId: string,
  paymentData: Omit<Payment, "id" | "companyId" | "createdAt" | "updatedAt">,
): Promise<Payment> => {
  try {
    // Always set the companyId to ensure the payment is associated with the company
    return await createPayment({
      ...paymentData,
      companyId,
    })
  } catch (error) {
    console.error("Error creating company payment:", error)
    throw error
  }
}

// Update an existing payment (with company verification)
export const updateCompanyPayment = async (
  companyId: string,
  id: string,
  paymentData: Partial<Payment>,
): Promise<Payment> => {
  try {
    // First verify the payment belongs to the company
    const payment = await getPaymentById(id)

    if (!payment || payment.companyId !== companyId) {
      throw new Error("Payment not found or does not belong to this company")
    }

    return await updatePayment(id, paymentData)
  } catch (error) {
    console.error(`Error updating company payment with ID ${id}:`, error)
    throw error
  }
}

// Update payment status (with company verification)
export const updateCompanyPaymentStatus = async (
  companyId: string,
  id: string,
  status: "pending" | "paid" | "overdue" | "cancelled",
  paymentDate?: string,
): Promise<Payment> => {
  try {
    // First verify the payment belongs to the company
    const payment = await getPaymentById(id)

    if (!payment || payment.companyId !== companyId) {
      throw new Error("Payment not found or does not belong to this company")
    }

    return await updatePaymentStatus(id, status, paymentDate)
  } catch (error) {
    console.error(`Error updating status for company payment with ID ${id}:`, error)
    throw error
  }
}

// Get payments by status for a company
export const getCompanyPaymentsByStatus = async (
  companyId: string,
  status: "pending" | "paid" | "overdue" | "cancelled",
): Promise<Payment[]> => {
  return getCompanyPayments(companyId, { status })
}

// Get payments by date range for a company
export const getCompanyPaymentsByDateRange = async (
  companyId: string,
  startDate: string,
  endDate: string,
): Promise<Payment[]> => {
  return getCompanyPayments(companyId, { startDate, endDate })
}

// Get payments by plan for a company
export const getCompanyPaymentsByPlan = async (companyId: string, planId: string): Promise<Payment[]> => {
  return getCompanyPayments(companyId, { planId })
}

// Get payment statistics for a company
export const getCompanyPaymentStatistics = async (
  companyId: string,
): Promise<{
  totalAmount: number
  pendingAmount: number
  overdueAmount: number
  completedAmount: number
  pendingCount: number
  overdueCount: number
  completedCount: number
}> => {
  try {
    const payments = await getCompanyPayments(companyId)

    let totalAmount = 0
    let pendingAmount = 0
    let overdueAmount = 0
    let completedAmount = 0
    let pendingCount = 0
    let overdueCount = 0
    let completedCount = 0

    payments.forEach((payment) => {
      totalAmount += payment.amount

      if (payment.status === "pending") {
        pendingAmount += payment.amount
        pendingCount++
      } else if (payment.status === "overdue") {
        overdueAmount += payment.amount
        overdueCount++
      } else if (payment.status === "paid") {
        completedAmount += payment.amount
        completedCount++
      }
    })

    return {
      totalAmount,
      pendingAmount,
      overdueAmount,
      completedAmount,
      pendingCount,
      overdueCount,
      completedCount,
    }
  } catch (error) {
    console.error("Error calculating company payment statistics:", error)
    throw error
  }
}
