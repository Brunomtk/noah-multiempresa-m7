"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Payment, PaymentFormData, PaymentFilters } from "@/types/payment"
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  updatePaymentStatus,
  getPaymentsByCompany,
  getPaymentsByStatus,
  getPaymentsByDateRange,
  getPaymentsByPlan,
} from "@/lib/api/payments"
import { toast } from "@/components/ui/use-toast"

interface PaymentsContextType {
  payments: Payment[]
  isLoading: boolean
  error: Error | null
  filters: PaymentFilters
  selectedPayment: Payment | null

  // CRUD operations
  fetchPayments: (filters?: PaymentFilters) => Promise<void>
  fetchPaymentById: (id: string) => Promise<Payment | null>
  addPayment: (paymentData: PaymentFormData) => Promise<Payment>
  editPayment: (id: string, paymentData: Partial<Payment>) => Promise<Payment>
  removePayment: (id: string) => Promise<void>

  // Status operations
  markAsPaid: (id: string, paymentDate?: string) => Promise<Payment>
  markAsOverdue: (id: string) => Promise<Payment>
  markAsCancelled: (id: string) => Promise<Payment>

  // Filter operations
  setFilters: (newFilters: PaymentFilters) => void
  resetFilters: () => void

  // Selection operations
  selectPayment: (payment: Payment | null) => void

  // Specialized fetching
  fetchPaymentsByCompany: (companyId: string) => Promise<void>
  fetchPaymentsByStatus: (status: "pending" | "paid" | "overdue" | "cancelled") => Promise<void>
  fetchPaymentsByDateRange: (startDate: string, endDate: string) => Promise<void>
  fetchPaymentsByPlan: (planId: string) => Promise<void>
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined)

export const PaymentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<PaymentFilters>({})
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  // Fetch payments with optional filters
  const fetchPayments = async (newFilters?: PaymentFilters) => {
    setIsLoading(true)
    setError(null)

    try {
      const filtersToUse = newFilters || filters
      const data = await getPayments(filtersToUse)
      setPayments(data)

      if (newFilters) {
        setFilters(newFilters)
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
      const payment = await getPaymentById(id)
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
  const addPayment = async (paymentData: PaymentFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const newPayment = await createPayment(paymentData)
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
      const updatedPayment = await updatePayment(id, paymentData)
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

  // Remove a payment
  const removePayment = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await deletePayment(id)
      setPayments((prev) => prev.filter((payment) => payment.id !== id))

      if (selectedPayment?.id === id) {
        setSelectedPayment(null)
      }

      toast({
        title: "Success",
        description: "Payment deleted successfully",
      })
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to delete payment: ${(err as Error).message}`,
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
      const updatedPayment = await updatePaymentStatus(id, "paid", paymentDate)
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
      const updatedPayment = await updatePaymentStatus(id, "overdue")
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
      const updatedPayment = await updatePaymentStatus(id, "cancelled")
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
    setFilters({})
    fetchPayments({})
  }

  // Select a payment
  const selectPayment = (payment: Payment | null) => {
    setSelectedPayment(payment)
  }

  // Fetch payments by company
  const fetchPaymentsByCompany = async (companyId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getPaymentsByCompany(companyId)
      setPayments(data)
      setFilters((prev) => ({ ...prev, companyId }))
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Error",
        description: `Failed to fetch company payments: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch payments by status
  const fetchPaymentsByStatus = async (status: "pending" | "paid" | "overdue" | "cancelled") => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getPaymentsByStatus(status)
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
      const data = await getPaymentsByDateRange(startDate, endDate)
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
      const data = await getPaymentsByPlan(planId)
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

  // Load initial data
  useEffect(() => {
    fetchPayments()
  }, [])

  const value = {
    payments,
    isLoading,
    error,
    filters,
    selectedPayment,
    fetchPayments,
    fetchPaymentById,
    addPayment,
    editPayment,
    removePayment,
    markAsPaid,
    markAsOverdue,
    markAsCancelled,
    setFilters,
    resetFilters,
    selectPayment,
    fetchPaymentsByCompany,
    fetchPaymentsByStatus,
    fetchPaymentsByDateRange,
    fetchPaymentsByPlan,
  }

  return <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>
}

export const usePaymentsContext = () => {
  const context = useContext(PaymentsContext)
  if (context === undefined) {
    throw new Error("usePaymentsContext must be used within a PaymentsProvider")
  }
  return context
}
