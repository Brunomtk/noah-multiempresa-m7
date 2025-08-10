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

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${getApiUrl()}${endpoint}`
  console.log(`Making dashboard API call to: ${url}`)

  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    // Get companies
    const companiesData = await apiCall("/Companies")
    const companies = Array.isArray(companiesData) ? companiesData : []

    // Get customers
    const customersData = await apiCall("/Customer")
    const customers = customersData.results || []

    // Get appointments
    const appointmentsData = await apiCall("/Appointment")
    const appointments = Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.results || []

    // Get check records with proper parameters
    const checkRecordsData = await apiCall("/CheckRecord?PageNumber=1&PageSize=100")
    const checkRecords = checkRecordsData.results || []

    // Get payments (mock data for now)
    const payments = []

    return {
      companies: {
        total: companies.length,
        active: companies.filter((c: any) => c.status === 1).length,
        loading: false,
      },
      customers: {
        total: customers.length,
        active: customers.filter((c: any) => c.status === 1).length,
        loading: false,
      },
      appointments: {
        total: appointments.length,
        scheduled: appointments.filter((a: any) => a.status === 0).length,
        completed: appointments.filter((a: any) => a.status === 2).length,
        cancelled: appointments.filter((a: any) => a.status === 3).length,
        loading: false,
      },
      checkRecords: {
        total: checkRecords.length,
        checkedIn: checkRecords.filter((r: any) => r.status === "checked_in").length,
        checkedOut: checkRecords.filter((r: any) => r.status === "checked_out").length,
        loading: false,
      },
      payments: {
        total: payments.length,
        paid: 0,
        pending: 0,
        overdue: 0,
        totalAmount: 0,
        loading: false,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)

    // Return default stats on error
    return {
      companies: { total: 0, active: 0, loading: false },
      customers: { total: 0, active: 0, loading: false },
      appointments: { total: 0, scheduled: 0, completed: 0, cancelled: 0, loading: false },
      checkRecords: { total: 0, checkedIn: 0, checkedOut: 0, loading: false },
      payments: { total: 0, paid: 0, pending: 0, overdue: 0, totalAmount: 0, loading: false },
    }
  }
}
