"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Payment, PaymentFormData, PaymentFilters } from "@/types/payment"
import {
  getCompanyPayments,
  getCompanyPaymentById,
  createCompanyPayment,
  updateCompanyPayment,
  updateCompanyPaymentStatus,
  getCompanyPaymentsByStatus,
  getCompanyPaymentsByDateRange,
  getCompanyPaymentsByPlan,
  getCompanyPaymentStatistics,
} from "@/lib/api/company-payments"
import { toast } from "@/components/ui/use-toast"

interface CompanyPaymentsContextType {
  payments: Payment[]
  isLoading: boolean
  error: Error | null
  filters: PaymentFilters & { companyId: string }
  selectedPayment: Payment | null
  statistics: {
    totalAmount: number
    pendingAmount: number
    overdueAmount: number
    completedAmount: number
    pendingCount: number
    overdueCount: number
    completedCount: number
  } | null

  // CRUD operations
  fetchPayments: (filters?: Omit<PaymentFilters, "companyId">) => Promise<void>
  fetchPaymentById: (id: string) => Promise<Payment | null>
  addPayment: (paymentData: Omit<PaymentFormData, "companyId">) => Promise<Payment>
  editPayment: (id: string, paymentData: Partial<Payment>) => Promise<Payment>

  // Status operations
  markAsPaid: (id: string, paymentDate?: string) => Promise<Payment>
  markAsOverdue: (id: string) => Promise<Payment>
  markAsCancelled: (id: string) => Promise<Payment>

  // Filter operations
  setFilters: (newFilters: Omit<PaymentFilters, "companyId">) => void
  resetFilters: () => void

  // Selection operations
  selectPayment: (payment: Payment | null) => void

  // Specialized fetching
  fetchPaymentsByStatus: (status: "pending" | "paid" | "overdue" | "cancelled") => Promise<void>
  fetchPaymentsByDateRange: (startDate: string, endDate: string) => Promise<void>
  fetchPaymentsByPlan: (planId: string) => Promise<void>

  // Statistics
  fetchPaymentStatistics: () => Promise<void>
}

const CompanyPaymentsContext = createContext<CompanyPaymentsContextType | undefined>(undefined)

export const CompanyPaymentsProvider: React.FC<{ children: ReactNode; companyId: string }> = ({
  children,
  companyId,
}) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<PaymentFilters & { companyId: string }>({ companyId })
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [statistics, setStatistics] = useState<{
    totalAmount: number
    pendingAmount: number
    overdueAmount: number
    completedAmount: number
    pendingCount: number
    overdueCount: number
    completedCount: number
  } | null>(null)

  // Fetch payments with optional filters
  const fetchPayments = async (newFilters?: Omit<PaymentFilters, "companyId">) => {
    setIsLoading(true)
    setError(null)

    try {
      const filtersToUse = newFilters ? { ...newFilters, companyId } : filters
      const data = await getCompanyPayments(companyId, filtersToUse)
      setPayments(data)

      if (newFilters) {
        setFilters({ ...newFilters, companyId })
      }
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to fetch payments: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch a single payment by ID
  const fetchPaymentById = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const payment = await getCompanyPaymentById(companyId, id)
      return payment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to fetch payment: ${(err as Error).message}`,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new payment
  const addPayment = async (paymentData: Omit<PaymentFormData, "companyId">) => {
    setIsLoading(true)
    setError(null)

    try {
      const newPayment = await createCompanyPayment(companyId, paymentData)
      setPayments((prev) => [newPayment, ...prev])
      toast({
        title: "Success",
        description: "Payment created successfully",
      })
      return newPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to create payment: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Edit an existing payment
  const editPayment = async (id: string, paymentData: Partial<Payment>) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedPayment = await updateCompanyPayment(companyId, id, paymentData)
      setPayments((prev) => prev.map((payment) => (payment.id === id ? updatedPayment : payment)))

      if (selectedPayment?.id === id) {
        setSelectedPayment(updatedPayment)
      }

      toast({
        title: "Success",
        description: "Payment updated successfully",
      })

      return updatedPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to update payment: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mark a payment as paid
  const markAsPaid = async (id: string, paymentDate?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedPayment = await updateCompanyPaymentStatus(companyId, id, "paid", paymentDate)
      setPayments((prev) => prev.map((payment) => (payment.id === id ? updatedPayment : payment)))

      if (selectedPayment?.id === id) {
        setSelectedPayment(updatedPayment)
      }

      toast({
        title: "Success",
        description: "Payment marked as paid",
      })

      return updatedPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to update payment status: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mark a payment as overdue
  const markAsOverdue = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedPayment = await updateCompanyPaymentStatus(companyId, id, "overdue")
      setPayments((prev) => prev.map((payment) => (payment.id === id ? updatedPayment : payment)))

      if (selectedPayment?.id === id) {
        setSelectedPayment(updatedPayment)
      }

      toast({
        title: "Success",
        description: "Payment marked as overdue",
      })

      return updatedPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to update payment status: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mark a payment as cancelled
  const markAsCancelled = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedPayment = await updateCompanyPaymentStatus(companyId, id, "cancelled")
      setPayments((prev) => prev.map((payment) => (payment.id === id ? updatedPayment : payment)))

      if (selectedPayment?.id === id) {
        setSelectedPayment(updatedPayment)
      }

      toast({
        title: "Success",
        description: "Payment marked as cancelled",
      })

      return updatedPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to update payment status: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({ companyId })
    fetchPayments({})
  }

  // Select a payment
  const selectPayment = (payment: Payment | null) => {
    setSelectedPayment(payment)
  }

  // Fetch payments by status
  const fetchPaymentsByStatus = async (status: "pending" | "paid" | "overdue" | "cancelled") => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getCompanyPaymentsByStatus(companyId, status)
      setPayments(data)
      setFilters((prev) => ({ ...prev, status }))
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to fetch payments by status: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch payments by date range
  const fetchPaymentsByDateRange = async (startDate: string, endDate: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getCompanyPaymentsByDateRange(companyId, startDate, endDate)
      setPayments(data)
      setFilters((prev) => ({ ...prev, startDate, endDate }))
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to fetch payments by date range: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch payments by plan
  const fetchPaymentsByPlan = async (planId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getCompanyPaymentsByPlan(companyId, planId)
      setPayments(data)
      setFilters((prev) => ({ ...prev, planId }))
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to fetch payments by plan: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch payment statistics
  const fetchPaymentStatistics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const stats = await getCompanyPaymentStatistics(companyId)
      setStatistics(stats)
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to fetch payment statistics: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    fetchPayments()
    fetchPaymentStatistics()
  }, [companyId])

  const value = {
    payments,
    isLoading,
    error,
    filters,
    selectedPayment,
    statistics,
    fetchPayments,
    fetchPaymentById,
    addPayment,
    editPayment,
    markAsPaid,
    markAsOverdue,
    markAsCancelled,
    setFilters,
    resetFilters,
    selectPayment,
    fetchPaymentsByStatus,
    fetchPaymentsByDateRange,
    fetchPaymentsByPlan,
    fetchPaymentStatistics,
  }

  return <CompanyPaymentsContext.Provider value={value}>{children}</CompanyPaymentsContext.Provider>
}

export const useCompanyPaymentsContext = () => {
  const context = useContext(CompanyPaymentsContext)
  if (context === undefined) {
    throw new Error("useCompanyPaymentsContext must be used within a CompanyPaymentsProvider")
  }
  return context
}
