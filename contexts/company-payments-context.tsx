"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Payment, PaymentFormData, PaymentFilters } from "@/types/payment"
import { toast } from "@/hooks/use-toast"

interface CompanyPaymentsContextType {
  payments: Payment[]
  isLoading: boolean
  error: Error | null
  filters: PaymentFilters & { companyId: number }
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
  fetchPaymentById: (id: number) => Promise<Payment | null>
  addPayment: (paymentData: Omit<PaymentFormData, "companyId">) => Promise<Payment>
  editPayment: (id: number, paymentData: Partial<PaymentFormData>) => Promise<Payment>

  // Status operations
  markAsPaid: (id: number, paymentDate?: string) => Promise<Payment>
  markAsOverdue: (id: number) => Promise<Payment>
  markAsCancelled: (id: number) => Promise<Payment>

  // Filter operations
  setFilters: (newFilters: Omit<PaymentFilters, "companyId">) => void
  resetFilters: () => void

  // Selection operations
  selectPayment: (payment: Payment | null) => void

  // Specialized fetching
  fetchPaymentsByStatus: (status: 0 | 1 | 2 | 3) => Promise<void>
  fetchPaymentsByDateRange: (startDate: string, endDate: string) => Promise<void>
  fetchPaymentsByPlan: (planId: number) => Promise<void>

  // Statistics
  fetchPaymentStatistics: () => Promise<void>
}

const CompanyPaymentsContext = createContext<CompanyPaymentsContextType | undefined>(undefined)

// Mock data for payments
const mockPayments: Payment[] = [
  {
    id: 1,
    amount: 299.99,
    dueDate: "2025-02-15",
    paymentDate: "2025-02-10",
    status: 1, // Paid
    method: 0, // Credit Card
    reference: "REF-PAG-001",
    planId: 2,
    companyId: 1,
    createdDate: "2025-01-15T10:00:00Z",
    updatedDate: "2025-02-10T14:30:00Z",
  },
  {
    id: 2,
    amount: 299.99,
    dueDate: "2025-03-15",
    status: 0, // Pending
    method: 3, // PIX
    reference: "REF-PAG-002",
    planId: 2,
    companyId: 1,
    createdDate: "2025-02-15T10:00:00Z",
    updatedDate: "2025-02-15T10:00:00Z",
  },
  {
    id: 3,
    amount: 199.99,
    dueDate: "2025-01-15",
    status: 2, // Overdue
    method: 2, // Bank Transfer
    reference: "REF-PAG-003",
    planId: 1,
    companyId: 1,
    createdDate: "2024-12-15T10:00:00Z",
    updatedDate: "2024-12-15T10:00:00Z",
  },
]

export const CompanyPaymentsProvider: React.FC<{ children: ReactNode; companyId: number }> = ({
  children,
  companyId,
}) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<PaymentFilters & { companyId: number }>({ companyId })
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter mock data by companyId
      const companyPayments = mockPayments.filter((p) => p.companyId === companyId)
      setPayments(companyPayments)

      if (newFilters) {
        setFilters({ ...newFilters, companyId })
      }

      await fetchPaymentStatistics()
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao buscar pagamentos: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch a single payment by ID
  const fetchPaymentById = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const payment = mockPayments.find((p) => p.id === id && p.companyId === companyId)
      return payment || null
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao buscar pagamento: ${(err as Error).message}`,
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newPayment: Payment = {
        id: Date.now(), // Mock ID
        ...paymentData,
        companyId,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      }

      setPayments((prev) => [newPayment, ...prev])
      await fetchPaymentStatistics()

      toast({
        title: "Sucesso",
        description: "Pagamento criado com sucesso",
      })

      return newPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao criar pagamento: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Edit an existing payment
  const editPayment = async (id: number, paymentData: Partial<PaymentFormData>) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600))

      const updatedPayment = payments.find((p) => p.id === id)
      if (!updatedPayment) {
        throw new Error("Pagamento não encontrado")
      }

      const newPayment = { ...updatedPayment, ...paymentData, updatedDate: new Date().toISOString() }
      setPayments((prev) => prev.map((payment) => (payment.id === id ? newPayment : payment)))

      if (selectedPayment?.id === id) {
        setSelectedPayment(newPayment)
      }

      await fetchPaymentStatistics()

      toast({
        title: "Sucesso",
        description: "Pagamento atualizado com sucesso",
      })

      return newPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao atualizar pagamento: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mark a payment as paid
  const markAsPaid = async (id: number, paymentDate?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400))

      const updatedPayment = payments.find((p) => p.id === id)
      if (!updatedPayment) {
        throw new Error("Pagamento não encontrado")
      }

      const newPayment = {
        ...updatedPayment,
        status: 1 as const,
        paymentDate: paymentDate || new Date().toISOString().split("T")[0],
        updatedDate: new Date().toISOString(),
      }

      setPayments((prev) => prev.map((payment) => (payment.id === id ? newPayment : payment)))

      if (selectedPayment?.id === id) {
        setSelectedPayment(newPayment)
      }

      await fetchPaymentStatistics()

      toast({
        title: "Sucesso",
        description: "Pagamento marcado como pago",
      })

      return newPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao atualizar status do pagamento: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mark a payment as overdue
  const markAsOverdue = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400))

      const updatedPayment = payments.find((p) => p.id === id)
      if (!updatedPayment) {
        throw new Error("Pagamento não encontrado")
      }

      const newPayment = {
        ...updatedPayment,
        status: 2 as const,
        updatedDate: new Date().toISOString(),
      }

      setPayments((prev) => prev.map((payment) => (payment.id === id ? newPayment : payment)))

      if (selectedPayment?.id === id) {
        setSelectedPayment(newPayment)
      }

      await fetchPaymentStatistics()

      toast({
        title: "Sucesso",
        description: "Pagamento marcado como vencido",
      })

      return newPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao atualizar status do pagamento: ${(err as Error).message}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mark a payment as cancelled
  const markAsCancelled = async (id: number) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400))

      const updatedPayment = payments.find((p) => p.id === id)
      if (!updatedPayment) {
        throw new Error("Pagamento não encontrado")
      }

      const newPayment = {
        ...updatedPayment,
        status: 3 as const,
        updatedDate: new Date().toISOString(),
      }

      setPayments((prev) => prev.map((payment) => (payment.id === id ? newPayment : payment)))

      if (selectedPayment?.id === id) {
        setSelectedPayment(newPayment)
      }

      await fetchPaymentStatistics()

      toast({
        title: "Sucesso",
        description: "Pagamento cancelado",
      })

      return newPayment
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao cancelar pagamento: ${(err as Error).message}`,
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
  const fetchPaymentsByStatus = async (status: 0 | 1 | 2 | 3) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const filteredPayments = mockPayments.filter((p) => p.companyId === companyId && p.status === status)
      setPayments(filteredPayments)
      setFilters((prev) => ({ ...prev, status }))
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao buscar pagamentos por status: ${(err as Error).message}`,
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const filteredPayments = mockPayments.filter((p) => {
        if (p.companyId !== companyId) return false
        const paymentDate = new Date(p.dueDate)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return paymentDate >= start && paymentDate <= end
      })

      setPayments(filteredPayments)
      setFilters((prev) => ({ ...prev, startDate, endDate }))
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao buscar pagamentos por período: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch payments by plan
  const fetchPaymentsByPlan = async (planId: number) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const filteredPayments = mockPayments.filter((p) => p.companyId === companyId && p.planId === planId)
      setPayments(filteredPayments)
      setFilters((prev) => ({ ...prev, planId }))
    } catch (err) {
      setError(err as Error)
      toast({
        title: "Erro",
        description: `Falha ao buscar pagamentos por plano: ${(err as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch payment statistics
  const fetchPaymentStatistics = async () => {
    try {
      const companyPayments = payments.length > 0 ? payments : mockPayments.filter((p) => p.companyId === companyId)

      let totalAmount = 0
      let pendingAmount = 0
      let overdueAmount = 0
      let completedAmount = 0
      let pendingCount = 0
      let overdueCount = 0
      let completedCount = 0

      companyPayments.forEach((payment) => {
        totalAmount += payment.amount || 0

        if (payment.status === 0) {
          // Pending
          pendingAmount += payment.amount || 0
          pendingCount++
        } else if (payment.status === 2) {
          // Overdue
          overdueAmount += payment.amount || 0
          overdueCount++
        } else if (payment.status === 1) {
          // Paid
          completedAmount += payment.amount || 0
          completedCount++
        }
      })

      setStatistics({
        totalAmount,
        pendingAmount,
        overdueAmount,
        completedAmount,
        pendingCount,
        overdueCount,
        completedCount,
      })
    } catch (err) {
      console.error("Failed to fetch payment statistics:", err)
      setStatistics(null)
    }
  }

  // Load initial data
  useEffect(() => {
    fetchPayments()
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
