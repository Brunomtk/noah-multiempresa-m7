import type { Team, PaginatedResponse, ApiResponse, Professional } from "@/types"
import { delay } from "./utils"

// Mock data
const mockTeams: Team[] = [
  {
    id: "1",
    name: "Team Alpha",
    leaderId: "101",
    region: "North Zone",
    description: "Specialized in residential cleaning",
    status: "active",
    companyId: "1",
    rating: 4.8,
    completedServices: 342,
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-05-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Team Beta",
    leaderId: "102",
    region: "South Zone",
    description: "Specialized in commercial cleaning",
    status: "active",
    companyId: "1",
    rating: 4.7,
    completedServices: 287,
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-05-18T11:45:00Z",
  },
  {
    id: "3",
    name: "Team Gamma",
    leaderId: "103",
    region: "East Zone",
    description: "Specialized in post-construction cleaning",
    status: "active",
    companyId: "2",
    rating: 4.9,
    completedServices: 198,
    createdAt: "2023-03-05T14:20:00Z",
    updatedAt: "2023-05-15T16:30:00Z",
  },
  {
    id: "4",
    name: "Team Delta",
    leaderId: "104",
    region: "West Zone",
    description: "Specialized in industrial cleaning",
    status: "inactive",
    companyId: "2",
    rating: 4.6,
    completedServices: 156,
    createdAt: "2023-03-20T11:10:00Z",
    updatedAt: "2023-05-10T09:45:00Z",
  },
  {
    id: "5",
    name: "Team Omega",
    leaderId: "105",
    region: "Central Zone",
    description: "Specialized in deep cleaning services",
    status: "active",
    companyId: "3",
    rating: 4.9,
    completedServices: 412,
    createdAt: "2023-01-05T08:30:00Z",
    updatedAt: "2023-05-22T15:20:00Z",
  },
]

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
  // Add more team members for other teams...
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
  // Add more upcoming services for other teams...
}

// API functions
export async function getTeams(
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
): Promise<ApiResponse<PaginatedResponse<Team>>> {
  await delay(800) // Simulate network delay

  // Filter teams based on status and search
  let filteredTeams = [...mockTeams]

  if (status && status !== "all") {
    filteredTeams = filteredTeams.filter((team) => team.status === status)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredTeams = filteredTeams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchLower) ||
        team.region?.toLowerCase().includes(searchLower) ||
        // We would need to join with professionals to search by leader name in a real API
        mockTeamMembers[team.id]?.some(
          (member) => member.id === team.leaderId && member.name.toLowerCase().includes(searchLower),
        ),
    )
  }

  // Calculate pagination
  const totalItems = filteredTeams.length
  const totalPages = Math.ceil(totalItems / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedTeams = filteredTeams.slice(startIndex, endIndex)

  // Add leader names to teams
  const teamsWithLeaderNames = paginatedTeams.map((team) => {
    const leader = mockTeamMembers[team.id]?.find((member) => member.id === team.leaderId)
    return {
      ...team,
      leaderName: leader?.name || "Unknown",
    }
  })

  return {
    status: 200,
    data: {
      data: teamsWithLeaderNames,
      meta: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    },
  }
}

export async function getTeamById(id: string): Promise<ApiResponse<Team>> {
  await delay(500) // Simulate network delay

  const team = mockTeams.find((team) => team.id === id)

  if (!team) {
    return {
      status: 404,
      error: "Team not found",
    }
  }

  const leader = mockTeamMembers[team.id]?.find((member) => member.id === team.leaderId)

  return {
    status: 200,
    data: {
      ...team,
      leaderName: leader?.name || "Unknown",
    },
  }
}

export async function createTeam(teamData: Partial<Team>): Promise<ApiResponse<Team>> {
  await delay(1000) // Simulate network delay

  // Validate required fields
  if (!teamData.name || !teamData.leaderId || !teamData.region || !teamData.companyId) {
    return {
      status: 400,
      error: "Missing required fields",
    }
  }

  // Create new team
  const newTeam: Team = {
    id: `${mockTeams.length + 1}`,
    name: teamData.name,
    leaderId: teamData.leaderId,
    region: teamData.region,
    description: teamData.description || "",
    status: teamData.status || "active",
    companyId: teamData.companyId,
    rating: 0,
    completedServices: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real API, we would save this to the database
  mockTeams.push(newTeam)

  return {
    status: 201,
    data: newTeam,
    message: "Team created successfully",
  }
}

export async function updateTeam(id: string, teamData: Partial<Team>): Promise<ApiResponse<Team>> {
  await delay(1000) // Simulate network delay

  const teamIndex = mockTeams.findIndex((team) => team.id === id)

  if (teamIndex === -1) {
    return {
      status: 404,
      error: "Team not found",
    }
  }

  // Update team
  const updatedTeam = {
    ...mockTeams[teamIndex],
    ...teamData,
    updatedAt: new Date().toISOString(),
  }

  // In a real API, we would update this in the database
  mockTeams[teamIndex] = updatedTeam

  return {
    status: 200,
    data: updatedTeam,
    message: "Team updated successfully",
  }
}

export async function deleteTeam(id: string): Promise<ApiResponse<null>> {
  await delay(1000) // Simulate network delay

  const teamIndex = mockTeams.findIndex((team) => team.id === id)

  if (teamIndex === -1) {
    return {
      status: 404,
      error: "Team not found",
    }
  }

  // In a real API, we would delete this from the database
  mockTeams.splice(teamIndex, 1)

  return {
    status: 200,
    data: null,
    message: "Team deleted successfully",
  }
}

export async function getTeamMembers(teamId: string): Promise<ApiResponse<Professional[]>> {
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
}

export async function getTeamPerformance(teamId: string): Promise<
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
}

export async function getTeamUpcomingServices(teamId: string): Promise<
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
}

// Get available professionals for team assignment
export async function getAvailableProfessionals(companyId: string): Promise<ApiResponse<Professional[]>> {
  await delay(500) // Simulate network delay

  // In a real API, we would query professionals without a team or with specific criteria
  const availableProfessionals = Object.values(mockTeamMembers)
    .flat()
    .filter((professional) => professional.companyId === companyId)

  return {
    status: 200,
    data: availableProfessionals,
  }
}
