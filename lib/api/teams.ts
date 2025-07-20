import type { Team, ApiResponse, Professional, CreateTeamRequest, UpdateTeamRequest, TeamsResponse } from "@/types"
import { delay } from "./utils"
import { fetchApi } from "./utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44394/api"

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("noah_token")
  }
  return null
}

// Helper function to create headers
function createHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    accept: "*/*",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Mock team members
const mockTeamMembers: Record<string, Professional[]> = {
  "1": [
    {
      id: "101",
      name: "Maria Silva",
      cpf: "123.456.789-00",
      email: "maria.silva@example.com",
      phone: "(11) 98765-4321",
      status: "active",
      teamId: "1",
      companyId: "1",
      rating: 4.8,
      completedServices: 120,
      createdAt: "2022-10-15T10:00:00Z",
      updatedAt: "2023-05-20T14:30:00Z",
    },
    {
      id: "106",
      name: "João Oliveira",
      cpf: "987.654.321-00",
      email: "joao.oliveira@example.com",
      phone: "(11) 91234-5678",
      status: "active",
      teamId: "1",
      companyId: "1",
      rating: 4.7,
      completedServices: 98,
      createdAt: "2022-11-10T09:15:00Z",
      updatedAt: "2023-05-18T11:45:00Z",
    },
    {
      id: "107",
      name: "Ana Santos",
      cpf: "456.789.123-00",
      email: "ana.santos@example.com",
      phone: "(11) 92345-6789",
      status: "active",
      teamId: "1",
      companyId: "1",
      rating: 4.9,
      completedServices: 105,
      createdAt: "2022-12-05T14:20:00Z",
      updatedAt: "2023-05-15T16:30:00Z",
    },
  ],
  "2": [
    {
      id: "102",
      name: "João Santos",
      cpf: "234.567.890-00",
      email: "joao.santos@example.com",
      phone: "(11) 98765-1234",
      status: "active",
      teamId: "2",
      companyId: "1",
      rating: 4.7,
      completedServices: 95,
      createdAt: "2022-11-20T11:10:00Z",
      updatedAt: "2023-05-10T09:45:00Z",
    },
    {
      id: "108",
      name: "Carlos Pereira",
      cpf: "567.890.123-00",
      email: "carlos.pereira@example.com",
      phone: "(11) 93456-7890",
      status: "active",
      teamId: "2",
      companyId: "1",
      rating: 4.5,
      completedServices: 87,
      createdAt: "2023-01-05T08:30:00Z",
      updatedAt: "2023-05-22T15:20:00Z",
    },
  ],
}

// Mock performance data
const mockPerformanceData: Record<
  string,
  {
    onTimeCompletion: number
    customerSatisfaction: number
    qualityScore: number
    efficiency: number
  }
> = {
  "1": {
    onTimeCompletion: 96,
    customerSatisfaction: 94,
    qualityScore: 92,
    efficiency: 89,
  },
  "2": {
    onTimeCompletion: 94,
    customerSatisfaction: 92,
    qualityScore: 90,
    efficiency: 87,
  },
  "3": {
    onTimeCompletion: 98,
    customerSatisfaction: 96,
    qualityScore: 95,
    efficiency: 92,
  },
  "4": {
    onTimeCompletion: 92,
    customerSatisfaction: 90,
    qualityScore: 88,
    efficiency: 85,
  },
  "5": {
    onTimeCompletion: 97,
    customerSatisfaction: 95,
    qualityScore: 94,
    efficiency: 91,
  },
}

// Mock upcoming services
const mockUpcomingServices: Record<
  string,
  Array<{
    id: string
    date: string
    time: string
    customer: string
    address: string
    type: string
  }>
> = {
  "1": [
    {
      id: "1001",
      date: "2023-06-10",
      time: "09:00 AM",
      customer: "Tech Solutions Ltd",
      address: "123 Main St",
      type: "Commercial Cleaning",
    },
    {
      id: "1002",
      date: "2023-06-11",
      time: "02:00 PM",
      customer: "ABC Consulting",
      address: "456 Oak Ave",
      type: "Deep Cleaning",
    },
    {
      id: "1003",
      date: "2023-06-12",
      time: "10:30 AM",
      customer: "XYZ Commerce",
      address: "789 Pine St",
      type: "Regular Cleaning",
    },
  ],
  "2": [
    {
      id: "1004",
      date: "2023-06-10",
      time: "11:00 AM",
      customer: "Global Enterprises",
      address: "321 Elm St",
      type: "Commercial Cleaning",
    },
    {
      id: "1005",
      date: "2023-06-12",
      time: "09:30 AM",
      customer: "City Services",
      address: "654 Maple Ave",
      type: "Regular Cleaning",
    },
  ],
}

// API functions
export const teamsApi = {
  // Get all teams with pagination
  getAll: async (page = 1, pageSize = 10, status = "all"): Promise<TeamsResponse> => {
    const response = await fetchApi(`/Team?page=${page}&pageSize=${pageSize}&status=${status}`)
    return response
  },

  // Get team by ID
  getById: async (id: number): Promise<Team> => {
    const response = await fetchApi(`/Team/${id}`)
    return response
  },

  // Create new team
  create: async (data: CreateTeamRequest): Promise<Team> => {
    const response = await fetchApi("/Team", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response
  },

  // Update team
  update: async (id: number, data: UpdateTeamRequest): Promise<void> => {
    await fetchApi(`/Team/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Delete team
  delete: async (id: number): Promise<void> => {
    await fetchApi(`/Team/${id}`, {
      method: "DELETE",
    })
  },

  // Get team members
  async getTeamMembers(teamId: string): Promise<ApiResponse<Professional[]>> {
    await delay(500) // Simulate network delay

    const members = mockTeamMembers[teamId]

    if (!members) {
      return {
        status: 404,
        error: "Team not found or has no members",
      }
    }

    return {
      status: 200,
      data: members,
    }
  },

  // Get team performance
  async getTeamPerformance(teamId: string): Promise<
    ApiResponse<{
      onTimeCompletion: number
      customerSatisfaction: number
      qualityScore: number
      efficiency: number
    }>
  > {
    await delay(500) // Simulate network delay

    const performance = mockPerformanceData[teamId]

    if (!performance) {
      return {
        status: 404,
        error: "Team performance data not found",
      }
    }

    return {
      status: 200,
      data: performance,
    }
  },

  // Get team upcoming services
  async getTeamUpcomingServices(teamId: string): Promise<
    ApiResponse<
      Array<{
        id: string
        date: string
        time: string
        customer: string
        address: string
        type: string
      }>
    >
  > {
    await delay(500) // Simulate network delay

    const services = mockUpcomingServices[teamId]

    if (!services) {
      return {
        status: 404,
        error: "Team upcoming services not found",
      }
    }

    return {
      status: 200,
      data: services,
    }
  },

  // Get available professionals for team assignment
  async getAvailableProfessionals(companyId: string): Promise<ApiResponse<Professional[]>> {
    await delay(500) // Simulate network delay

    // In a real API, we would query professionals without a team or with specific criteria
    const availableProfessionals = Object.values(mockTeamMembers)
      .flat()
      .filter((professional) => professional.companyId === companyId)

    return {
      status: 200,
      data: availableProfessionals,
    }
  },
}
