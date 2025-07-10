import type { Payment } from "@/types/payment"

// Mock data for development
const mockPayments: Payment[] = Array.from({ length: 50 }).map((_, index) => ({
  id: `payment-${index + 1}`,
  companyId: `company-${Math.floor(Math.random() * 10) + 1}`,
  companyName: `Company ${Math.floor(Math.random() * 10) + 1}`,
  amount: Math.floor(Math.random() * 1000) + 100,
  dueDate: new Date(Date.now() + (Math.floor(Math.random() * 30) - 15) * 24 * 60 * 60 * 1000).toISOString(),
  paymentDate:
    Math.random() > 0.3
      ? new Date(Date.now() + (Math.floor(Math.random() * 10) - 15) * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
  status: ["pending", "paid", "overdue", "cancelled"][Math.floor(Math.random() * 4)] as
    | "pending"
    | "paid"
    | "overdue"
    | "cancelled",
  method:
    Math.random() > 0.2
      ? (["credit_card", "debit_card", "bank_transfer", "pix"][Math.floor(Math.random() * 4)] as
          | "credit_card"
          | "debit_card"
          | "bank_transfer"
          | "pix")
      : undefined,
  reference: `INV-${Math.floor(Math.random() * 10000)}`,
  planId: `plan-${Math.floor(Math.random() * 5) + 1}`,
  planName: ["Basic", "Standard", "Premium", "Enterprise", "Custom"][Math.floor(Math.random() * 5)],
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
}))

// Get all payments with optional filters
export const getPayments = async (filters?: {
  companyId?: string
  status?: "pending" | "paid" | "overdue" | "cancelled"
  search?: string
  startDate?: string
  endDate?: string
  planId?: string
}): Promise<Payment[]> => {
  try {
    // In a real app, this would be an API call
    // return await apiRequest<Payment[]>(`/api/payments`, { method: "GET", params: filters });

    // For development, filter the mock data
    let filteredPayments = [...mockPayments]

    if (filters?.companyId) {
      filteredPayments = filteredPayments.filter((payment) => payment.companyId === filters.companyId)
    }

    if (filters?.status) {
      filteredPayments = filteredPayments.filter((payment) => payment.status === filters.status)
    }

    if (filters?.planId) {
      filteredPayments = filteredPayments.filter((payment) => payment.planId === filters.planId)
    }

    if (filters?.startDate) {
      const startDate = new Date(filters.startDate)
      filteredPayments = filteredPayments.filter((payment) => new Date(payment.dueDate) >= startDate)
    }

    if (filters?.endDate) {
      const endDate = new Date(filters.endDate)
      filteredPayments = filteredPayments.filter((payment) => new Date(payment.dueDate) <= endDate)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredPayments = filteredPayments.filter(
        (payment) =>
          payment.companyName?.toLowerCase().includes(search) ||
          payment.reference.toLowerCase().includes(search) ||
          payment.planName?.toLowerCase().includes(search),
      )
    }

    return filteredPayments
  } catch (error) {
    console.error("Error fetching payments:", error)
    throw error
  }
}

// Get a single payment by ID
export const getPaymentById = async (id: string): Promise<Payment | null> => {
  try {
    // In a real app, this would be an API call
    // return await apiRequest<Payment>(`/api/payments/${id}`, { method: "GET" });

    // For development, find the payment in the mock data
    const payment = mockPayments.find((payment) => payment.id === id)
    return payment || null
  } catch (error) {
    console.error(`Error fetching payment with ID ${id}:`, error)
    throw error
  }
}

// Create a new payment
export const createPayment = async (paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> => {
  try {
    // In a real app, this would be an API call
    // return await apiRequest<Payment>(`/api/payments`, { method: "POST", data: paymentData });

    // For development, create a new payment and add it to the mock data
    const newPayment: Payment = {
      id: `payment-${mockPayments.length + 1}`,
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockPayments.push(newPayment)
    return newPayment
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}

// Update an existing payment
export const updatePayment = async (id: string, paymentData: Partial<Payment>): Promise<Payment> => {
  try {
    // In a real app, this would be an API call
    // return await apiRequest<Payment>(`/api/payments/${id}`, { method: "PUT", data: paymentData });

    // For development, update the payment in the mock data
    const paymentIndex = mockPayments.findIndex((payment) => payment.id === id)

    if (paymentIndex === -1) {
      throw new Error(`Payment with ID ${id} not found`)
    }

    const updatedPayment: Payment = {
      ...mockPayments[paymentIndex],
      ...paymentData,
      updatedAt: new Date().toISOString(),
    }

    mockPayments[paymentIndex] = updatedPayment
    return updatedPayment
  } catch (error) {
    console.error(`Error updating payment with ID ${id}:`, error)
    throw error
  }
}

// Delete a payment
export const deletePayment = async (id: string): Promise<void> => {
  try {
    // In a real app, this would be an API call
    // await apiRequest(`/api/payments/${id}`, { method: "DELETE" });

    // For development, remove the payment from the mock data
    const paymentIndex = mockPayments.findIndex((payment) => payment.id === id)

    if (paymentIndex === -1) {
      throw new Error(`Payment with ID ${id} not found`)
    }

    mockPayments.splice(paymentIndex, 1)
  } catch (error) {
    console.error(`Error deleting payment with ID ${id}:`, error)
    throw error
  }
}

// Update payment status
export const updatePaymentStatus = async (
  id: string,
  status: "pending" | "paid" | "overdue" | "cancelled",
  paymentDate?: string,
): Promise<Payment> => {
  try {
    // In a real app, this would be an API call
    // return await apiRequest<Payment>(`/api/payments/${id}/status`, {
    //   method: "PUT",
    //   data: { status, paymentDate }
    // });

    // For development, update the payment status in the mock data
    const paymentIndex = mockPayments.findIndex((payment) => payment.id === id)

    if (paymentIndex === -1) {
      throw new Error(`Payment with ID ${id} not found`)
    }

    const updatedPayment: Payment = {
      ...mockPayments[paymentIndex],
      status,
      paymentDate: status === "paid" ? paymentDate || new Date().toISOString() : mockPayments[paymentIndex].paymentDate,
      updatedAt: new Date().toISOString(),
    }

    mockPayments[paymentIndex] = updatedPayment
    return updatedPayment
  } catch (error) {
    console.error(`Error updating status for payment with ID ${id}:`, error)
    throw error
  }
}

// Get payments by company
export const getPaymentsByCompany = async (companyId: string): Promise<Payment[]> => {
  return getPayments({ companyId })
}

// Get payments by status
export const getPaymentsByStatus = async (status: "pending" | "paid" | "overdue" | "cancelled"): Promise<Payment[]> => {
  return getPayments({ status })
}

// Get payments by date range
export const getPaymentsByDateRange = async (startDate: string, endDate: string): Promise<Payment[]> => {
  return getPayments({ startDate, endDate })
}

// Get payments by plan
export const getPaymentsByPlan = async (planId: string): Promise<Payment[]> => {
  return getPayments({ planId })
}
