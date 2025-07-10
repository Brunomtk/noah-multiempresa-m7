import type { Recurrence } from "@/types/recurrence"
import { apiDelay } from "./utils"

// Get all recurrences
export async function getRecurrences(): Promise<Recurrence[]> {
  try {
    // Simulate API call
    await apiDelay(800)

    // In a real implementation, this would be:
    // return await fetchApi<Recurrence[]>('/recurrences', {
    //   headers: getAuthHeader(),
    // });

    // For now, return mock data
    return mockRecurrences
  } catch (error) {
    console.error("Failed to fetch recurrences:", error)
    throw error
  }
}

// Get recurrence by ID
export async function getRecurrenceById(id: string): Promise<Recurrence> {
  try {
    await apiDelay(500)

    // In a real implementation:
    // return await fetchApi<Recurrence>(`/recurrences/${id}`, {
    //   headers: getAuthHeader(),
    // });

    const recurrence = mockRecurrences.find((r) => r.id === id)
    if (!recurrence) {
      throw new Error(`Recurrence with ID ${id} not found`)
    }

    return recurrence
  } catch (error) {
    console.error(`Failed to fetch recurrence with ID ${id}:`, error)
    throw error
  }
}

// Create a new recurrence
export async function createRecurrence(data: Omit<Recurrence, "id" | "createdAt" | "updatedAt">): Promise<Recurrence> {
  try {
    await apiDelay(1000)

    // In a real implementation:
    // return await fetchApi<Recurrence>('/recurrences', {
    //   method: 'POST',
    //   headers: {
    //     ...getAuthHeader(),
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });

    const newRecurrence: Recurrence = {
      id: `rec_${Math.random().toString(36).substring(2, 11)}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, this would be handled by the backend
    mockRecurrences.push(newRecurrence)

    return newRecurrence
  } catch (error) {
    console.error("Failed to create recurrence:", error)
    throw error
  }
}

// Update an existing recurrence
export async function updateRecurrence(id: string, data: Partial<Recurrence>): Promise<Recurrence> {
  try {
    await apiDelay(1000)

    // In a real implementation:
    // return await fetchApi<Recurrence>(`/recurrences/${id}`, {
    //   method: 'PUT',
    //   headers: {
    //     ...getAuthHeader(),
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });

    const index = mockRecurrences.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error(`Recurrence with ID ${id} not found`)
    }

    const updatedRecurrence = {
      ...mockRecurrences[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    mockRecurrences[index] = updatedRecurrence

    return updatedRecurrence
  } catch (error) {
    console.error(`Failed to update recurrence with ID ${id}:`, error)
    throw error
  }
}

// Delete a recurrence
export async function deleteRecurrence(id: string): Promise<void> {
  try {
    await apiDelay(800)

    // In a real implementation:
    // await fetchApi(`/recurrences/${id}`, {
    //   method: 'DELETE',
    //   headers: getAuthHeader(),
    // });

    const index = mockRecurrences.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error(`Recurrence with ID ${id} not found`)
    }

    mockRecurrences.splice(index, 1)
  } catch (error) {
    console.error(`Failed to delete recurrence with ID ${id}:`, error)
    throw error
  }
}

// Get recurrences by company ID
export async function getRecurrencesByCompany(companyId: string): Promise<Recurrence[]> {
  try {
    await apiDelay(800)

    // In a real implementation:
    // return await fetchApi<Recurrence[]>(`/companies/${companyId}/recurrences`, {
    //   headers: getAuthHeader(),
    // });

    return mockRecurrences.filter((r) => r.companyId === companyId)
  } catch (error) {
    console.error(`Failed to fetch recurrences for company ${companyId}:`, error)
    throw error
  }
}

// Get recurrences by customer ID
export async function getRecurrencesByCustomer(customerId: string): Promise<Recurrence[]> {
  try {
    await apiDelay(800)

    // In a real implementation:
    // return await fetchApi<Recurrence[]>(`/customers/${customerId}/recurrences`, {
    //   headers: getAuthHeader(),
    // });

    return mockRecurrences.filter((r) => r.customerId === customerId)
  } catch (error) {
    console.error(`Failed to fetch recurrences for customer ${customerId}:`, error)
    throw error
  }
}

// Get recurrences by team ID
export async function getRecurrencesByTeam(teamId: string): Promise<Recurrence[]> {
  try {
    await apiDelay(800)

    // In a real implementation:
    // return await fetchApi<Recurrence[]>(`/teams/${teamId}/recurrences`, {
    //   headers: getAuthHeader(),
    // });

    return mockRecurrences.filter((r) => r.teamId === teamId)
  } catch (error) {
    console.error(`Failed to fetch recurrences for team ${teamId}:`, error)
    throw error
  }
}

// Filter recurrences by status
export async function getRecurrencesByStatus(status: string): Promise<Recurrence[]> {
  try {
    await apiDelay(500)

    // In a real implementation:
    // return await fetchApi<Recurrence[]>(`/recurrences?status=${status}`, {
    //   headers: getAuthHeader(),
    // });

    return mockRecurrences.filter((r) => r.status === status)
  } catch (error) {
    console.error(`Failed to fetch recurrences with status ${status}:`, error)
    throw error
  }
}

// Filter recurrences by type
export async function getRecurrencesByType(type: string): Promise<Recurrence[]> {
  try {
    await apiDelay(500)

    // In a real implementation:
    // return await fetchApi<Recurrence[]>(`/recurrences?type=${type}`, {
    //   headers: getAuthHeader(),
    // });

    return mockRecurrences.filter((r) => r.type === type)
  } catch (error) {
    console.error(`Failed to fetch recurrences with type ${type}:`, error)
    throw error
  }
}

// Search recurrences by title or customer name
export async function searchRecurrences(query: string): Promise<Recurrence[]> {
  try {
    await apiDelay(500)

    // In a real implementation:
    // return await fetchApi<Recurrence[]>(`/recurrences/search?q=${encodeURIComponent(query)}`, {
    //   headers: getAuthHeader(),
    // });

    const lowercaseQuery = query.toLowerCase()
    return mockRecurrences.filter(
      (r) =>
        r.title.toLowerCase().includes(lowercaseQuery) ||
        (r.customerName && r.customerName.toLowerCase().includes(lowercaseQuery)),
    )
  } catch (error) {
    console.error(`Failed to search recurrences with query "${query}":`, error)
    throw error
  }
}

// Mock data for recurrences
const mockRecurrences: Recurrence[] = [
  {
    id: "rec_1",
    title: "Weekly Office Cleaning",
    customerId: "cust_1",
    customerName: "Tech Solutions Ltd",
    address: "123 Main St, Suite 500",
    teamId: "team_1",
    teamName: "Team Alpha",
    companyId: "comp_1",
    frequency: "weekly",
    day: 1, // Monday
    time: "09:00",
    duration: 120,
    status: "active",
    type: "regular",
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    notes: "Focus on kitchen and meeting rooms",
    lastExecution: "2025-05-20",
    nextExecution: "2025-05-27",
    createdAt: "2025-01-10T12:00:00Z",
    updatedAt: "2025-05-20T15:30:00Z",
  },
  {
    id: "rec_2",
    title: "Bi-weekly Deep Cleaning",
    customerId: "cust_2",
    customerName: "ABC Consulting",
    address: "456 Oak Ave, Floor 3",
    teamId: "team_2",
    teamName: "Team Beta",
    companyId: "comp_1",
    frequency: "biweekly",
    day: 3, // Wednesday
    time: "14:00",
    duration: 240,
    status: "active",
    type: "deep",
    startDate: "2025-02-05",
    endDate: "2025-12-31",
    notes: "Include carpet cleaning",
    lastExecution: "2025-05-15",
    nextExecution: "2025-05-29",
    createdAt: "2025-02-01T09:15:00Z",
    updatedAt: "2025-05-15T17:45:00Z",
  },
  {
    id: "rec_3",
    title: "Monthly Window Cleaning",
    customerId: "cust_3",
    customerName: "XYZ Commerce",
    address: "789 Pine St",
    teamId: "team_3",
    teamName: "Team Gamma",
    companyId: "comp_2",
    frequency: "monthly",
    day: 5, // First Friday
    time: "10:00",
    duration: 180,
    status: "active",
    type: "specialized",
    startDate: "2025-01-03",
    endDate: "2025-12-31",
    notes: "External windows on floors 1-3",
    lastExecution: "2025-05-03",
    nextExecution: "2025-06-07",
    createdAt: "2024-12-20T14:30:00Z",
    updatedAt: "2025-05-03T13:20:00Z",
  },
  {
    id: "rec_4",
    title: "Daily Morning Cleaning",
    customerId: "cust_4",
    customerName: "Delta Industries",
    address: "101 Maple Dr, Building B",
    teamId: "team_1",
    teamName: "Team Alpha",
    companyId: "comp_2",
    frequency: "daily",
    day: 0, // Every weekday
    time: "06:00",
    duration: 90,
    status: "active",
    type: "regular",
    startDate: "2025-03-01",
    endDate: "2025-12-31",
    notes: "Before office hours",
    lastExecution: "2025-05-24",
    nextExecution: "2025-05-27",
    createdAt: "2025-02-15T11:45:00Z",
    updatedAt: "2025-05-24T07:30:00Z",
  },
  {
    id: "rec_5",
    title: "Quarterly Deep Cleaning",
    customerId: "cust_5",
    customerName: "Omega Services",
    address: "202 Elm St, Suite 100",
    teamId: "team_2",
    teamName: "Team Beta",
    companyId: "comp_3",
    frequency: "monthly",
    day: 1, // First Monday of quarter
    time: "08:00",
    duration: 480,
    status: "paused",
    type: "deep",
    startDate: "2025-01-06",
    endDate: "2025-12-31",
    notes: "Full day deep cleaning",
    lastExecution: "2025-04-07",
    nextExecution: "2025-07-07",
    createdAt: "2024-12-15T10:00:00Z",
    updatedAt: "2025-04-07T18:15:00Z",
  },
  {
    id: "rec_6",
    title: "Weekly Carpet Cleaning",
    customerId: "cust_6",
    customerName: "Global Tech",
    address: "303 Cedar Rd",
    teamId: "team_3",
    teamName: "Team Gamma",
    companyId: "comp_3",
    frequency: "weekly",
    day: 5, // Friday
    time: "16:00",
    duration: 120,
    status: "active",
    type: "specialized",
    startDate: "2025-02-07",
    endDate: "2025-12-31",
    notes: "Focus on high-traffic areas",
    lastExecution: "2025-05-23",
    nextExecution: "2025-05-30",
    createdAt: "2025-02-01T15:30:00Z",
    updatedAt: "2025-05-23T18:45:00Z",
  },
  {
    id: "rec_7",
    title: "Monthly HVAC Cleaning",
    customerId: "cust_7",
    customerName: "Innovate Inc",
    address: "404 Birch Blvd, Floor 5",
    teamId: "team_1",
    teamName: "Team Alpha",
    companyId: "comp_4",
    frequency: "monthly",
    day: 31, // Last day
    time: "09:00",
    duration: 360,
    status: "completed",
    type: "specialized",
    startDate: "2025-01-25",
    endDate: "2025-05-31",
    notes: "HVAC system maintenance and cleaning",
    lastExecution: "2025-05-25",
    nextExecution: null,
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-05-25T16:30:00Z",
  },
]
