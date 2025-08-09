import type { Team, ApiResponse, CreateTeamRequest, UpdateTeamRequest, TeamsResponse } from "@/types"
import { fetchApi } from "./utils"

// Get all teams with pagination and filters
export async function getTeams(
  page = 1,
  pageSize = 10,
  status = "all",
  search = "",
): Promise<ApiResponse<TeamsResponse>> {
  try {
    let url = `/Team?page=${page}&pageSize=${pageSize}`

    if (status !== "all") {
      url += `&status=${status}`
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }

    const response = await fetchApi(url)

    return {
      status: 200,
      data: {
        data: response.results || [],
        meta: {
          currentPage: response.currentPage || 1,
          totalPages: response.pageCount || 1,
          totalItems: response.totalItems || 0,
          itemsPerPage: response.pageSize || pageSize,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching teams:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch teams",
    }
  }
}

// Get team by ID
export async function getTeamById(id: string): Promise<ApiResponse<Team>> {
  try {
    const response = await fetchApi(`/Team/${id}`)

    return {
      status: 200,
      data: response,
    }
  } catch (error) {
    console.error("Error fetching team:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch team",
    }
  }
}

// Create new team
export async function createTeam(data: CreateTeamRequest): Promise<ApiResponse<Team>> {
  try {
    const response = await fetchApi("/Team", {
      method: "POST",
      body: JSON.stringify(data),
    })

    return {
      status: 201,
      data: response,
      message: "Team created successfully",
    }
  } catch (error) {
    console.error("Error creating team:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to create team",
    }
  }
}

// Update team
export async function updateTeam(id: string, data: UpdateTeamRequest): Promise<ApiResponse<Team>> {
  try {
    await fetchApi(`/Team/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    // Get updated team data
    const updatedTeam = await getTeamById(id)

    return {
      status: 200,
      data: updatedTeam.data,
      message: "Team updated successfully",
    }
  } catch (error) {
    console.error("Error updating team:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to update team",
    }
  }
}

// Delete team
export async function deleteTeam(id: string): Promise<ApiResponse<void>> {
  try {
    await fetchApi(`/Team/${id}`, {
      method: "DELETE",
    })

    return {
      status: 200,
      message: "Team deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting team:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to delete team",
    }
  }
}

// Get team members (mock for now since endpoint not provided)
export async function getTeamMembers(teamId: string): Promise<ApiResponse<any[]>> {
  try {
    // This would be the actual API call when endpoint is available
    // const response = await fetchApi(`/Team/${teamId}/members`)

    // Mock data for now
    return {
      status: 200,
      data: [],
    }
  } catch (error) {
    console.error("Error fetching team members:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch team members",
    }
  }
}

// Get team performance (mock for now since endpoint not provided)
export async function getTeamPerformance(teamId: string): Promise<
  ApiResponse<{
    onTimeCompletion: number
    customerSatisfaction: number
    qualityScore: number
    efficiency: number
  }>
> {
  try {
    // This would be the actual API call when endpoint is available
    // const response = await fetchApi(`/Team/${teamId}/performance`)

    // Mock data for now
    return {
      status: 200,
      data: {
        onTimeCompletion: 95,
        customerSatisfaction: 92,
        qualityScore: 90,
        efficiency: 88,
      },
    }
  } catch (error) {
    console.error("Error fetching team performance:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch team performance",
    }
  }
}

// Get team upcoming services (mock for now since endpoint not provided)
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
  try {
    // This would be the actual API call when endpoint is available
    // const response = await fetchApi(`/Team/${teamId}/services/upcoming`)

    // Mock data for now
    return {
      status: 200,
      data: [],
    }
  } catch (error) {
    console.error("Error fetching team upcoming services:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch team upcoming services",
    }
  }
}

// Get available professionals (mock for now since endpoint not provided)
export async function getAvailableProfessionals(companyId: string): Promise<ApiResponse<any[]>> {
  try {
    // This would be the actual API call when endpoint is available
    // const response = await fetchApi(`/Company/${companyId}/professionals/available`)

    // Mock data for now
    return {
      status: 200,
      data: [],
    }
  } catch (error) {
    console.error("Error fetching available professionals:", error)
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Failed to fetch available professionals",
    }
  }
}
