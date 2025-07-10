import type { ApiResponse } from "@/types/api"
import type { Payment } from "@/types/payment"
import { fetchWithAuth } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

// Mock data for development
const mockCurrentPlan = {
  id: "plan-003",
  name: "Premium",
  description: "For growing businesses with advanced needs",
  price: 299.99,
  billingCycle: "monthly",
  startDate: "2023-10-15",
  expiryDate: "2024-10-15",
  status: "active",
  autoRenew: true,
  features: [
    "Up to 50 users",
    "Advanced scheduling",
    "Daily reports",
    "Priority support",
    "Calendar integration",
    "Performance analytics",
    "API integration",
  ],
  usedUsers: 32,
  maxUsers: 50,
  usedStorage: 7.5,
  maxStorage: 20,
}

// Mock data for available plans
const mockAvailablePlans = [
  {
    id: "plan-001",
    name: "Basic",
    description: "For small businesses just getting started",
    price: 149.99,
    billingCycle: "monthly",
    features: ["Up to 5 users", "Basic scheduling", "Monthly reports", "Email support"],
    popular: false,
  },
  {
    id: "plan-002",
    name: "Standard",
    description: "For established businesses with growing needs",
    price: 199.99,
    billingCycle: "monthly",
    features: [
      "Up to 15 users",
      "Advanced scheduling",
      "Weekly reports",
      "Email and chat support",
      "Calendar integration",
    ],
    popular: false,
  },
  {
    id: "plan-003",
    name: "Premium",
    description: "For growing businesses with advanced needs",
    price: 299.99,
    billingCycle: "monthly",
    features: [
      "Up to 50 users",
      "Advanced scheduling",
      "Daily reports",
      "Priority support",
      "Calendar integration",
      "Performance analytics",
      "API integration",
    ],
    popular: true,
    current: true,
  },
  {
    id: "plan-004",
    name: "Enterprise",
    description: "For large organizations with complex requirements",
    price: 499.99,
    billingCycle: "monthly",
    features: [
      "Unlimited users",
      "All features",
      "Custom reports",
      "24/7 support",
      "Dedicated account manager",
      "Advanced API integration",
      "Custom training",
    ],
    popular: false,
  },
]

// Mock data for payment history
const mockPaymentHistory = [
  {
    id: "pay-001",
    date: "2023-10-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2023-001",
  },
  {
    id: "pay-002",
    date: "2023-11-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2023-002",
  },
  {
    id: "pay-003",
    date: "2023-12-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2023-003",
  },
  {
    id: "pay-004",
    date: "2024-01-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2024-001",
  },
  {
    id: "pay-005",
    date: "2024-02-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2024-002",
  },
  {
    id: "pay-006",
    date: "2024-03-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2024-003",
  },
]

// Get current company plan
export async function getCurrentCompanyPlan(): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        success: true,
        data: mockCurrentPlan,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/plan`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching current company plan:", error)
    return {
      success: false,
      error: "Failed to fetch current plan. Please try again.",
    }
  }
}

// Get all available plans
export async function getAvailablePlans(): Promise<ApiResponse<any[]>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        success: true,
        data: mockAvailablePlans,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/plans/available`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching available plans:", error)
    return {
      success: false,
      error: "Failed to fetch available plans. Please try again.",
    }
  }
}

// Get plan payment history
export async function getPlanPaymentHistory(): Promise<ApiResponse<Payment[]>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        success: true,
        data: mockPaymentHistory,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/plan/payments`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching plan payment history:", error)
    return {
      success: false,
      error: "Failed to fetch payment history. Please try again.",
    }
  }
}

// Upgrade or downgrade plan
export async function changePlan(planId: string, billingCycle: string): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const selectedPlan = mockAvailablePlans.find((plan) => plan.id === planId)

      if (!selectedPlan) {
        return {
          success: false,
          error: "Plan not found",
        }
      }

      // Simulate plan change
      const updatedPlan = {
        ...mockCurrentPlan,
        id: selectedPlan.id,
        name: selectedPlan.name,
        description: selectedPlan.description,
        price: selectedPlan.price,
        billingCycle,
        features: selectedPlan.features,
        startDate: new Date().toISOString(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      }

      return {
        success: true,
        data: updatedPlan,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/plan/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planId, billingCycle }),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error changing plan:", error)
    return {
      success: false,
      error: "Failed to change plan. Please try again.",
    }
  }
}

// Renew current plan
export async function renewPlan(
  renewalPeriod: string,
  autoRenew: boolean,
  paymentMethod: string,
): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      // Calculate new expiry date based on renewal period
      const currentExpiryDate = new Date(mockCurrentPlan.expiryDate)
      const newExpiryDate = new Date(currentExpiryDate)

      if (renewalPeriod === "1-month") {
        newExpiryDate.setMonth(newExpiryDate.getMonth() + 1)
      } else if (renewalPeriod === "6-months") {
        newExpiryDate.setMonth(newExpiryDate.getMonth() + 6)
      } else if (renewalPeriod === "1-year") {
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1)
      } else if (renewalPeriod === "2-years") {
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 2)
      }

      // Simulate plan renewal
      const updatedPlan = {
        ...mockCurrentPlan,
        expiryDate: newExpiryDate.toISOString(),
        autoRenew,
      }

      return {
        success: true,
        data: updatedPlan,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/plan/renew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ renewalPeriod, autoRenew, paymentMethod }),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error renewing plan:", error)
    return {
      success: false,
      error: "Failed to renew plan. Please try again.",
    }
  }
}

// Update auto-renewal setting
export async function updateAutoRenewal(autoRenew: boolean): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      // Simulate updating auto-renewal
      const updatedPlan = {
        ...mockCurrentPlan,
        autoRenew,
      }

      return {
        success: true,
        data: updatedPlan,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/plan/auto-renewal`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ autoRenew }),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error updating auto-renewal:", error)
    return {
      success: false,
      error: "Failed to update auto-renewal setting. Please try again.",
    }
  }
}

// Get plan usage statistics
export async function getPlanUsage(): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        success: true,
        data: {
          usedUsers: mockCurrentPlan.usedUsers,
          maxUsers: mockCurrentPlan.maxUsers,
          usedStorage: mockCurrentPlan.usedStorage,
          maxStorage: mockCurrentPlan.maxStorage,
          usedAppointments: 350,
          maxAppointments: 500,
          usedTeams: 3,
          maxTeams: 5,
        },
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/plan/usage`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching plan usage:", error)
    return {
      success: false,
      error: "Failed to fetch plan usage. Please try again.",
    }
  }
}

// Download invoice
export async function downloadInvoice(invoiceId: string): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        success: true,
        data: {
          downloadUrl: `https://example.com/invoices/${invoiceId}.pdf`,
        },
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/plan/invoices/${invoiceId}`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error downloading invoice:", error)
    return {
      success: false,
      error: "Failed to download invoice. Please try again.",
    }
  }
}

// Get billing information
export async function getBillingInfo(): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        success: true,
        data: {
          address: {
            street: "123 Business Street",
            city: "São Paulo",
            state: "SP",
            zipCode: "01234-567",
            country: "Brazil",
          },
          taxId: "12.345.678/0001-90",
          paymentMethod: {
            type: "credit_card",
            lastFour: "1234",
            expiryMonth: 12,
            expiryYear: 25,
          },
        },
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/billing`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching billing information:", error)
    return {
      success: false,
      error: "Failed to fetch billing information. Please try again.",
    }
  }
}

// Update billing information
export async function updateBillingInfo(billingData: any): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        success: true,
        data: {
          ...billingData,
        },
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/billing`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(billingData),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error updating billing information:", error)
    return {
      success: false,
      error: "Failed to update billing information. Please try again.",
    }
  }
}

// Update payment method
export async function updatePaymentMethod(paymentData: any): Promise<ApiResponse<any>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return {
        success: true,
        data: {
          paymentMethod: {
            ...paymentData,
            lastFour: paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : "1234",
          },
        },
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/company/payment-method`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error updating payment method:", error)
    return {
      success: false,
      error: "Failed to update payment method. Please try again.",
    }
  }
}
