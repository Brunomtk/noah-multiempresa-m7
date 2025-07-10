import type { CheckRecord } from "@/types/check-record"

// Mock data for development
const mockCheckRecords: CheckRecord[] = [
  {
    id: "cr1",
    professionalId: "prof1",
    professionalName: "John Doe",
    companyId: "comp1",
    customerId: "cust1",
    customerName: "ABC Corporation",
    appointmentId: "app1",
    address: "123 Main St, Suite 100, New York, NY 10001",
    teamId: "team1",
    teamName: "Team Alpha",
    checkInTime: "2024-01-26T08:55:00Z",
    checkOutTime: "2024-01-26T17:05:00Z",
    status: "checked_out",
    serviceType: "regular",
    notes: "All tasks completed successfully",
    createdAt: "2024-01-26T08:00:00Z",
    updatedAt: "2024-01-26T17:05:00Z",
  },
  {
    id: "cr2",
    professionalId: "prof2",
    professionalName: "Jane Smith",
    companyId: "comp1",
    customerId: "cust2",
    customerName: "XYZ Industries",
    appointmentId: "app2",
    address: "456 Industrial Ave, Warehouse B, Chicago, IL 60607",
    teamId: "team2",
    teamName: "Team Beta",
    checkInTime: "2024-01-26T10:15:00Z",
    checkOutTime: null,
    status: "checked_in",
    serviceType: "deep",
    notes: "In progress, estimated completion at 6:00 PM",
    createdAt: "2024-01-26T10:00:00Z",
    updatedAt: "2024-01-26T10:15:00Z",
  },
  {
    id: "cr3",
    professionalId: "prof3",
    professionalName: "Mike Johnson",
    companyId: "comp1",
    customerId: "cust3",
    customerName: "Tech Solutions Inc",
    appointmentId: "app3",
    address: "789 Business Blvd, Branch Office, San Francisco, CA 94105",
    teamId: "team1",
    teamName: "Team Alpha",
    checkInTime: null,
    checkOutTime: null,
    status: "pending",
    serviceType: "specialized",
    notes: "",
    createdAt: "2024-01-26T11:00:00Z",
    updatedAt: "2024-01-26T11:00:00Z",
  },
]

// Type for filtering check records
export interface CheckRecordFilters {
  professionalId?: string
  companyId?: string
  customerId?: string
  teamId?: string
  appointmentId?: string
  status?: "pending" | "checked_in" | "checked_out"
  serviceType?: string
  startDate?: string
  endDate?: string
  search?: string
}

// Get all check records with optional filtering
export const getCheckRecords = async (filters?: CheckRecordFilters): Promise<CheckRecord[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Apply filters if provided
  if (filters) {
    return mockCheckRecords.filter((record) => {
      let match = true

      if (filters.professionalId && record.professionalId !== filters.professionalId) match = false
      if (filters.companyId && record.companyId !== filters.companyId) match = false
      if (filters.customerId && record.customerId !== filters.customerId) match = false
      if (filters.teamId && record.teamId !== filters.teamId) match = false
      if (filters.appointmentId && record.appointmentId !== filters.appointmentId) match = false
      if (filters.status && record.status !== filters.status) match = false
      if (filters.serviceType && record.serviceType !== filters.serviceType) match = false

      // Date range filtering
      if (filters.startDate) {
        const startDate = new Date(filters.startDate)
        const recordDate = new Date(record.createdAt)
        if (recordDate < startDate) match = false
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        const recordDate = new Date(record.createdAt)
        if (recordDate > endDate) match = false
      }

      // Search term filtering
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableFields = [
          record.professionalName,
          record.customerName,
          record.teamName,
          record.address,
          record.serviceType,
          record.notes,
        ].filter(Boolean) as string[]

        if (!searchableFields.some((field) => field.toLowerCase().includes(searchTerm))) match = false
      }

      return match
    })
  }

  return mockCheckRecords
}

// Get a single check record by ID
export const getCheckRecordById = async (id: string): Promise<CheckRecord> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const record = mockCheckRecords.find((r) => r.id === id)
  if (!record) {
    throw new Error(`Check record with ID ${id} not found`)
  }
  return record
}

// Create a new check record
export const createCheckRecord = async (
  data: Omit<CheckRecord, "id" | "createdAt" | "updatedAt">,
): Promise<CheckRecord> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const now = new Date().toISOString()
  const newRecord: CheckRecord = {
    id: `cr${mockCheckRecords.length + 1}`,
    ...data,
    createdAt: now,
    updatedAt: now,
  }

  mockCheckRecords.push(newRecord)
  return newRecord
}

// Update an existing check record
export const updateCheckRecord = async (id: string, data: Partial<CheckRecord>): Promise<CheckRecord> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const index = mockCheckRecords.findIndex((r) => r.id === id)
  if (index === -1) {
    throw new Error(`Check record with ID ${id} not found`)
  }

  const updatedRecord = {
    ...mockCheckRecords[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  mockCheckRecords[index] = updatedRecord
  return updatedRecord
}

// Delete a check record
export const deleteCheckRecord = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = mockCheckRecords.findIndex((r) => r.id === id)
  if (index === -1) {
    throw new Error(`Check record with ID ${id} not found`)
  }

  mockCheckRecords.splice(index, 1)
}

// Perform check-in
export const performCheckIn = async (
  data: Omit<CheckRecord, "id" | "createdAt" | "updatedAt" | "checkOutTime" | "status">,
): Promise<CheckRecord> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const now = new Date().toISOString()
  const newRecord: CheckRecord = {
    id: `cr${mockCheckRecords.length + 1}`,
    ...data,
    checkInTime: now,
    checkOutTime: null,
    status: "checked_in",
    createdAt: now,
    updatedAt: now,
  }

  mockCheckRecords.push(newRecord)
  return newRecord
}

// Perform check-out
export const performCheckOut = async (id: string): Promise<CheckRecord> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const index = mockCheckRecords.findIndex((r) => r.id === id)
  if (index === -1) {
    throw new Error(`Check record with ID ${id} not found`)
  }

  if (mockCheckRecords[index].status !== "checked_in") {
    throw new Error("Cannot check out a record that is not checked in")
  }

  const now = new Date().toISOString()
  const updatedRecord = {
    ...mockCheckRecords[index],
    checkOutTime: now,
    status: "checked_out" as const,
    updatedAt: now,
  }

  mockCheckRecords[index] = updatedRecord
  return updatedRecord
}
