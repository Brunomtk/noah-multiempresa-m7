import type { Appointment } from "@/types/appointment"
import { apiRequest } from "./utils"

// Get all appointments
export async function getAppointments(filters?: Record<string, any>): Promise<Appointment[]> {
  const queryParams = filters ? new URLSearchParams(filters as Record<string, string>).toString() : ""
  const url = `/appointments${queryParams ? `?${queryParams}` : ""}`
  return apiRequest<Appointment[]>({ url, method: "GET" })
}

// Get a single appointment by ID
export async function getAppointmentById(id: string): Promise<Appointment> {
  return apiRequest<Appointment>({ url: `/appointments/${id}`, method: "GET" })
}

// Create a new appointment
export async function createAppointment(
  data: Omit<Appointment, "id" | "createdAt" | "updatedAt">,
): Promise<Appointment> {
  return apiRequest<Appointment>({ url: "/appointments", method: "POST", data })
}

// Update an existing appointment
export async function updateAppointment(
  id: string,
  data: Partial<Omit<Appointment, "id" | "createdAt" | "updatedAt">>,
): Promise<Appointment> {
  return apiRequest<Appointment>({ url: `/appointments/${id}`, method: "PUT", data })
}

// Delete an appointment
export async function deleteAppointment(id: string): Promise<void> {
  return apiRequest<void>({ url: `/appointments/${id}`, method: "DELETE" })
}

// Get appointments by company ID
export async function getAppointmentsByCompany(
  companyId: string,
  filters?: Record<string, any>,
): Promise<Appointment[]> {
  const queryParams = new URLSearchParams((filters as Record<string, string>) || {})
  queryParams.append("companyId", companyId)
  return apiRequest<Appointment[]>({ url: `/appointments?${queryParams.toString()}`, method: "GET" })
}

// Get appointments by team ID
export async function getAppointmentsByTeam(teamId: string, filters?: Record<string, any>): Promise<Appointment[]> {
  const queryParams = new URLSearchParams((filters as Record<string, string>) || {})
  queryParams.append("teamId", teamId)
  return apiRequest<Appointment[]>({ url: `/appointments?${queryParams.toString()}`, method: "GET" })
}

// Get appointments by professional ID
export async function getAppointmentsByProfessional(
  professionalId: string,
  filters?: Record<string, any>,
): Promise<Appointment[]> {
  const queryParams = new URLSearchParams((filters as Record<string, string>) || {})
  queryParams.append("professionalId", professionalId)
  return apiRequest<Appointment[]>({ url: `/appointments?${queryParams.toString()}`, method: "GET" })
}

// Get appointments by customer ID
export async function getAppointmentsByCustomer(
  customerId: string,
  filters?: Record<string, any>,
): Promise<Appointment[]> {
  const queryParams = new URLSearchParams((filters as Record<string, string>) || {})
  queryParams.append("customerId", customerId)
  return apiRequest<Appointment[]>({ url: `/appointments?${queryParams.toString()}`, method: "GET" })
}

// Get appointments by date range
export async function getAppointmentsByDateRange(
  startDate: string,
  endDate: string,
  filters?: Record<string, any>,
): Promise<Appointment[]> {
  const queryParams = new URLSearchParams((filters as Record<string, string>) || {})
  queryParams.append("startDate", startDate)
  queryParams.append("endDate", endDate)
  return apiRequest<Appointment[]>({ url: `/appointments?${queryParams.toString()}`, method: "GET" })
}
