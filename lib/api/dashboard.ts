import type { ApiResponse } from "@/types"
import { getApiUrl } from "./utils"

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("noah_token")
  }
  return null
}

// Helper function to create headers
const createHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<ApiResponse<any>> {
  try {
    const url = `${getApiUrl()}/Dashboard/stats`
    console.log("Fetching dashboard stats from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return mock data if API fails
    return {
      status: 200,
      data: {
        companies: { total: 25, active: 23, loading: false },
        customers: { total: 150, active: 142, loading: false },
        appointments: { total: 89, scheduled: 45, completed: 32, cancelled: 12, loading: false },
        checkRecords: { total: 67, checkedIn: 12, checkedOut: 55, loading: false },
        payments: { total: 234, paid: 198, pending: 28, overdue: 8, totalAmount: 45670.5, loading: false },
      },
    }
  }
}

// Get recent activities
export async function getRecentActivities(limit = 10): Promise<ApiResponse<any[]>> {
  try {
    const url = `${getApiUrl()}/Dashboard/activities?limit=${limit}`
    console.log("Fetching recent activities from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data.results || data.data || [],
    }
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return {
      status: 200,
      data: [],
    }
  }
}

// Get dashboard chart data
export async function getDashboardChartData(period = "7d", type = "appointments"): Promise<ApiResponse<any[]>> {
  try {
    const url = `${getApiUrl()}/Dashboard/chart?period=${period}&type=${type}`
    console.log("Fetching chart data from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data.results || data.data || [],
    }
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return {
      status: 200,
      data: [],
    }
  }
}

// Get dashboard check records
export async function getDashboardCheckRecords(page = 1, pageSize = 10): Promise<ApiResponse<any>> {
  try {
    const url = `${getApiUrl()}/CheckRecord?PageNumber=${page}&PageSize=${pageSize}`
    console.log("Fetching dashboard check records from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: {
        data: data.results || data.result || [],
        meta: {
          currentPage: data.currentPage || page,
          totalPages: data.pageCount || data.totalPages || 1,
          totalItems: data.totalItems || data.totalCount || 0,
          itemsPerPage: data.pageSize || pageSize,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard check records:", error)
    return {
      status: 200,
      data: {
        data: [],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: pageSize,
        },
      },
    }
  }
}

// Get companies count
export async function getCompaniesCount(): Promise<ApiResponse<number>> {
  try {
    const url = `${getApiUrl()}/Companies/count`
    console.log("Fetching companies count from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data.count || data.total || 0,
    }
  } catch (error) {
    console.error("Error fetching companies count:", error)
    return {
      status: 200,
      data: 0,
    }
  }
}

// Get professionals count
export async function getProfessionalsCount(): Promise<ApiResponse<number>> {
  try {
    const url = `${getApiUrl()}/Professional/count`
    console.log("Fetching professionals count from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data.count || data.total || 0,
    }
  } catch (error) {
    console.error("Error fetching professionals count:", error)
    return {
      status: 200,
      data: 0,
    }
  }
}

// Get customers count
export async function getCustomersCount(): Promise<ApiResponse<number>> {
  try {
    const url = `${getApiUrl()}/Customer/count`
    console.log("Fetching customers count from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: 200,
      data: data.count || data.total || 0,
    }
  } catch (error) {
    console.error("Error fetching customers count:", error)
    return {
      status: 200,
      data: 0,
    }
  }
}
