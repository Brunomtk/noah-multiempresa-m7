import type { Appointment } from "@/types/appointment"
import { apiRequest } from "./utils"

// Get all appointments for the logged in professional
export async function getProfessionalAppointments(filters?: Record<string, any>): Promise<Appointment[]> {
  const queryParams = filters ? new URLSearchParams(filters as Record<string, string>).toString() : ""
  const url = `/professional/appointments${queryParams ? `?${queryParams}` : ""}`
  return apiRequest<Appointment[]>({ url, method: "GET" })
}

// Get appointments for the professional by date range
export async function getProfessionalAppointmentsByDateRange(
  startDate: string,
  endDate: string,
  filters?: Record<string, any>,
): Promise<Appointment[]> {
  const queryParams = new URLSearchParams((filters as Record<string, string>) || {})
  queryParams.append("startDate", startDate)
  queryParams.append("endDate", endDate)
  return apiRequest<Appointment[]>({ url: `/professional/appointments?${queryParams.toString()}`, method: "GET" })
}

// Get a single appointment by ID for the professional
export async function getProfessionalAppointmentById(id: string): Promise<Appointment> {
  return apiRequest<Appointment>({ url: `/professional/appointments/${id}`, method: "GET" })
}

// Check in to an appointment
export async function checkInToAppointment(
  appointmentId: string,
  data: { location: { lat: number; lng: number }; notes?: string },
): Promise<Appointment> {
  return apiRequest<Appointment>({ url: `/professional/appointments/${appointmentId}/check-in`, method: "POST", data })
}

// Check out from an appointment
export async function checkOutFromAppointment(
  appointmentId: string,
  data: { location: { lat: number; lng: number }; notes?: string; completionDetails?: Record<string, any> },
): Promise<Appointment> {
  return apiRequest<Appointment>({ url: `/professional/appointments/${appointmentId}/check-out`, method: "POST", data })
}

// Request to reschedule an appointment
export async function requestRescheduleAppointment(
  appointmentId: string,
  data: { reason: string; suggestedDates: string[] },
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>({
    url: `/professional/appointments/${appointmentId}/reschedule-request`,
    method: "POST",
    data,
  })
}

// Cancel an appointment (with reason)
export async function cancelProfessionalAppointment(
  appointmentId: string,
  data: { reason: string },
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>({
    url: `/professional/appointments/${appointmentId}/cancel`,
    method: "POST",
    data,
  })
}

// Get professional's availability
export async function getProfessionalAvailability(
  startDate: string,
  endDate: string,
): Promise<{ date: string; slots: { start: string; end: string }[] }[]> {
  const queryParams = new URLSearchParams()
  queryParams.append("startDate", startDate)
  queryParams.append("endDate", endDate)
  return apiRequest<{ date: string; slots: { start: string; end: string }[] }[]>({
    url: `/professional/availability?${queryParams.toString()}`,
    method: "GET",
  })
}

// Update professional's availability
export async function updateProfessionalAvailability(
  data: { date: string; slots: { start: string; end: string }[] }[],
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>({
    url: "/professional/availability",
    method: "PUT",
    data,
  })
}

// Get professional's schedule summary
export async function getProfessionalScheduleSummary(
  month: number,
  year: number,
): Promise<{
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  clientsServed: number
  completionRate: number
}> {
  const queryParams = new URLSearchParams()
  queryParams.append("month", month.toString())
  queryParams.append("year", year.toString())
  return apiRequest<{
    totalAppointments: number
    completedAppointments: number
    cancelledAppointments: number
    clientsServed: number
    completionRate: number
  }>({
    url: `/professional/schedule/summary?${queryParams.toString()}`,
    method: "GET",
  })
}
