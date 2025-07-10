import type { Plan } from "@/types/plan"
import type { ApiResponse, PaginatedResponse } from "@/types/api"
import { fetchWithAuth } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

// Mock data for development
const mockPlans: Plan[] = [
  {
    id: "plan-1",
    name: "Basic",
    price: 29.99,
    features: [
      "Up to 5 professionals",
      "Up to 2 teams",
      "Up to 100 customers",
      "Up to 500 appointments per month",
      "Basic reporting",
      "Email support",
    ],
    limits: {
      professionals: 5,
      teams: 2,
      customers: 100,
      appointments: 500,
    },
    duration: 1, // 1 month
    status: "active",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "plan-2",
    name: "Professional",
    price: 59.99,
    features: [
      "Up to 15 professionals",
      "Up to 5 teams",
      "Up to 500 customers",
      "Up to 2000 appointments per month",
      "Advanced reporting",
      "Priority email support",
      "Phone support",
    ],
    limits: {
      professionals: 15,
      teams: 5,
      customers: 500,
      appointments: 2000,
    },
    duration: 1, // 1 month
    status: "active",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "plan-3",
    name: "Enterprise",
    price: 129.99,
    features: [
      "Unlimited professionals",
      "Unlimited teams",
      "Unlimited customers",
      "Unlimited appointments",
      "Custom reporting",
      "24/7 priority support",
      "Dedicated account manager",
      "Custom integrations",
    ],
    limits: {},
    duration: 1, // 1 month
    status: "active",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "plan-4",
    name: "Starter",
    price: 19.99,
    features: [
      "Up to 2 professionals",
      "Up to 1 team",
      "Up to 50 customers",
      "Up to 200 appointments per month",
      "Basic reporting",
    ],
    limits: {
      professionals: 2,
      teams: 1,
      customers: 50,
      appointments: 200,
    },
    duration: 1, // 1 month
    status: "inactive",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
]

// Get all plans with optional filtering
export async function getPlans(
  page = 1,
  limit = 10,
  status?: "active" | "inactive",
  search?: string,
): Promise<ApiResponse<PaginatedResponse<Plan>>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      let filteredPlans = [...mockPlans]

      // Apply status filter
      if (status) {
        filteredPlans = filteredPlans.filter((plan) => plan.status === status)
      }

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase()
        filteredPlans = filteredPlans.filter(
          (plan) =>
            plan.name.toLowerCase().includes(searchLower) ||
            plan.features.some((feature) => feature.toLowerCase().includes(searchLower)),
        )
      }

      // Calculate pagination
      const totalItems = filteredPlans.length
      const totalPages = Math.ceil(totalItems / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedPlans = filteredPlans.slice(startIndex, endIndex)

      return {
        success: true,
        data: {
          items: paginatedPlans,
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems,
            totalPages,
          },
        },
      }
    }

    // For production, use actual API
    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("limit", limit.toString())

    if (status) {
      queryParams.append("status", status)
    }

    if (search) {
      queryParams.append("search", search)
    }

    const response = await fetchWithAuth(`${API_URL}/plans?${queryParams.toString()}`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching plans:", error)
    return {
      success: false,
      error: "Failed to fetch plans. Please try again.",
    }
  }
}

// Get a specific plan by ID
export async function getPlan(id: string): Promise<ApiResponse<Plan>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const plan = mockPlans.find((p) => p.id === id)

      if (!plan) {
        return {
          success: false,
          error: "Plan not found",
        }
      }

      return {
        success: true,
        data: plan,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/plans/${id}`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching plan:", error)
    return {
      success: false,
      error: "Failed to fetch plan. Please try again.",
    }
  }
}

// Create a new plan
export async function createPlan(planData: Omit<Plan, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Plan>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const newPlan: Plan = {
        ...planData,
        id: `plan-${mockPlans.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockPlans.push(newPlan)

      return {
        success: true,
        data: newPlan,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error creating plan:", error)
    return {
      success: false,
      error: "Failed to create plan. Please try again.",
    }
  }
}

// Update an existing plan
export async function updatePlan(
  id: string,
  planData: Partial<Omit<Plan, "id" | "createdAt" | "updatedAt">>,
): Promise<ApiResponse<Plan>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const planIndex = mockPlans.findIndex((p) => p.id === id)

      if (planIndex === -1) {
        return {
          success: false,
          error: "Plan not found",
        }
      }

      const updatedPlan: Plan = {
        ...mockPlans[planIndex],
        ...planData,
        updatedAt: new Date().toISOString(),
      }

      mockPlans[planIndex] = updatedPlan

      return {
        success: true,
        data: updatedPlan,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/plans/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error updating plan:", error)
    return {
      success: false,
      error: "Failed to update plan. Please try again.",
    }
  }
}

// Delete a plan
export async function deletePlan(id: string): Promise<ApiResponse<null>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const planIndex = mockPlans.findIndex((p) => p.id === id)

      if (planIndex === -1) {
        return {
          success: false,
          error: "Plan not found",
        }
      }

      mockPlans.splice(planIndex, 1)

      return {
        success: true,
        data: null,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/plans/${id}`, {
      method: "DELETE",
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error deleting plan:", error)
    return {
      success: false,
      error: "Failed to delete plan. Please try again.",
    }
  }
}

// Update plan status (activate/deactivate)
export async function updatePlanStatus(id: string, status: "active" | "inactive"): Promise<ApiResponse<Plan>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      const planIndex = mockPlans.findIndex((p) => p.id === id)

      if (planIndex === -1) {
        return {
          success: false,
          error: "Plan not found",
        }
      }

      const updatedPlan: Plan = {
        ...mockPlans[planIndex],
        status,
        updatedAt: new Date().toISOString(),
      }

      mockPlans[planIndex] = updatedPlan

      return {
        success: true,
        data: updatedPlan,
      }
    }

    // For production, use actual API
    const response = await fetchWithAuth(`${API_URL}/plans/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error updating plan status:", error)
    return {
      success: false,
      error: "Failed to update plan status. Please try again.",
    }
  }
}

// Get companies subscribed to a specific plan
export async function getPlanSubscribers(
  planId: string,
  page = 1,
  limit = 10,
): Promise<ApiResponse<PaginatedResponse<any>>> {
  try {
    // For development, use mock data
    if (!process.env.NEXT_PUBLIC_API_URL) {
      // Mock company subscribers
      const mockSubscribers = [
        {
          id: "company-1",
          name: "Acme Corporation",
          email: "info@acme.com",
          subscriptionStart: new Date(2023, 1, 15).toISOString(),
          subscriptionEnd: new Date(2024, 1, 15).toISOString(),
          status: "active",
        },
        {
          id: "company-2",
          name: "TechSolutions Inc",
          email: "contact@techsolutions.com",
          subscriptionStart: new Date(2023, 2, 10).toISOString(),
          subscriptionEnd: new Date(2024, 2, 10).toISOString(),
          status: "active",
        },
        {
          id: "company-3",
          name: "Global Services Ltd",
          email: "info@globalservices.com",
          subscriptionStart: new Date(2023, 0, 5).toISOString(),
          subscriptionEnd: new Date(2024, 0, 5).toISOString(),
          status: "active",
        },
      ]

      // Calculate pagination
      const totalItems = mockSubscribers.length
      const totalPages = Math.ceil(totalItems / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedSubscribers = mockSubscribers.slice(startIndex, endIndex)

      return {
        success: true,
        data: {
          items: paginatedSubscribers,
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems,
            totalPages,
          },
        },
      }
    }

    // For production, use actual API
    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("limit", limit.toString())

    const response = await fetchWithAuth(`${API_URL}/plans/${planId}/subscribers?${queryParams.toString()}`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching plan subscribers:", error)
    return {
      success: false,
      error: "Failed to fetch plan subscribers. Please try again.",
    }
  }
}
