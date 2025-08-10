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
      // If dashboard endpoint doesn't exist, return mock data
      console.log("Dashboard endpoint not available, returning mock data")
      return {
        status: 200,
        data: {
          totalCompanies: 0,
          totalProfessionals: 0,
          totalCustomers: 0,
          totalAppointments: 0,
          activeAppointments: 0,
          completedAppointments: 0,
          pendingPayments: 0,
          totalRevenue: 0,
        },
      }
    }

    const data = await response.json()
    console.log("Dashboard stats API response:", data)

    return {
      status: 200,
      data: data,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return mock data on error
    return {
      status: 200,
      data: {
        totalCompanies: 0,
        totalProfessionals: 0,
        totalCustomers: 0,
        totalAppointments: 0,
        activeAppointments: 0,
        completedAppointments: 0,
        pendingPayments: 0,
        totalRevenue: 0,
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
      // If activities endpoint doesn't exist, return empty array
      console.log("Activities endpoint not available, returning empty array")
      return {
        status: 200,
        data: [],
      }
    }

    const data = await response.json()
    console.log("Recent activities API response:", data)

    return {
      status: 200,
      data: data.results || data.result || data || [],
    }
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return {
      status: 200,
      data: [],
    }
  }
}

// Get chart data for dashboard
export async function getDashboardChartData(period = "7d", type = "appointments"): Promise<ApiResponse<any[]>> {
  try {
    const url = `${getApiUrl()}/Dashboard/chart?period=${period}&type=${type}`
    console.log("Fetching dashboard chart data from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      // If chart endpoint doesn't exist, return mock data
      console.log("Chart endpoint not available, returning mock data")
      return {
        status: 200,
        data: [],
      }
    }

    const data = await response.json()
    console.log("Dashboard chart data API response:", data)

    return {
      status: 200,
      data: data.results || data.result || data || [],
    }
  } catch (error) {
    console.error("Error fetching dashboard chart data:", error)
    return {
      status: 200,
      data: [],
    }
  }
}

// Get check records for dashboard (with proper parameter handling)
export async function getDashboardCheckRecords(page = 1, pageSize = 10): Promise<ApiResponse<any>> {
  try {
    // Ensure page is a number, not an object
    const pageNumber = typeof page === "object" ? 1 : page
    const pageSizeNumber = typeof pageSize === "object" ? 10 : pageSize

    const url = `${getApiUrl()}/CheckRecord?PageNumber=${pageNumber}&PageSize=${pageSizeNumber}`
    console.log("Fetching dashboard check records from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Dashboard check records API response:", data)

    return {
      status: 200,
      data: {
        data: data.results || data.result || [],
        meta: {
          currentPage: data.currentPage || pageNumber,
          totalPages: data.pageCount || data.totalPages || 1,
          totalItems: data.totalItems || data.totalCount || 0,
          itemsPerPage: data.pageSize || pageSizeNumber,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard check records:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch check records",
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
      // Try alternative endpoint
      const alternativeUrl = `${getApiUrl()}/Companies/paged?PageNumber=1&PageSize=1`
      const alternativeResponse = await fetch(alternativeUrl, {
        method: "GET",
        headers: createHeaders(),
      })

      if (alternativeResponse.ok) {
        const data = await alternativeResponse.json()
        return {
          status: 200,
          data: data.totalItems || data.totalCount || 0,
        }
      }

      return {
        status: 200,
        data: 0,
      }
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
      // Try alternative endpoint
      const alternativeUrl = `${getApiUrl()}/Professional?PageNumber=1&PageSize=1`
      const alternativeResponse = await fetch(alternativeUrl, {
        method: "GET",
        headers: createHeaders(),
      })

      if (alternativeResponse.ok) {
        const data = await alternativeResponse.json()
        return {
          status: 200,
          data: data.totalItems || data.totalCount || 0,
        }
      }

      return {
        status: 200,
        data: 0,
      }
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
      // Try alternative endpoint
      const alternativeUrl = `${getApiUrl()}/Customer?PageNumber=1&PageSize=1`
      const alternativeResponse = await fetch(alternativeUrl, {
        method: "GET",
        headers: createHeaders(),
      })

      if (alternativeResponse.ok) {
        const data = await alternativeResponse.json()
        return {
          status: 200,
          data: data.totalItems || data.totalCount || 0,
        }
      }

      return {
        status: 200,
        data: 0,
      }
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
