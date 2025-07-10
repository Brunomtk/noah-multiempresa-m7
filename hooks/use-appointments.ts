"use client"

import { useState } from "react"
import type { Appointment } from "@/types/appointment"
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByCompany,
  getAppointmentsByTeam,
  getAppointmentsByProfessional,
  getAppointmentsByCustomer,
  getAppointmentsByDateRange,
} from "@/lib/api/appointments"
import { useToast } from "./use-toast"

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Format appointments to have Date objects instead of strings
  const formatAppointment = (appointment: Appointment): Appointment => {
    return {
      ...appointment,
      start: new Date(appointment.start),
      end: new Date(appointment.end),
    } as unknown as Appointment
  }

  const formatAppointments = (appointments: Appointment[]): Appointment[] => {
    return appointments.map(formatAppointment)
  }

  // Fetch all appointments
  const fetchAppointments = async (filters?: Record<string, any>) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAppointments(filters)
      const formattedData = formatAppointments(data)
      setAppointments(formattedData)
      return formattedData
    } catch (err) {
      const errorMessage = "Failed to fetch appointments"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch a single appointment by ID
  const fetchAppointmentById = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAppointmentById(id)
      const formattedData = formatAppointment(data)
      setAppointment(formattedData)
      return formattedData
    } catch (err) {
      const errorMessage = "Failed to fetch appointment details"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new appointment
  const addAppointment = async (data: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    setError(null)
    try {
      // Convert Date objects to ISO strings for the API
      const apiData = {
        ...data,
        start: data.start instanceof Date ? data.start.toISOString() : data.start,
        end: data.end instanceof Date ? data.end.toISOString() : data.end,
      }

      const newAppointment = await createAppointment(apiData)
      const formattedAppointment = formatAppointment(newAppointment)

      setAppointments((prev) => [...prev, formattedAppointment])
      toast({
        title: "Success",
        description: "Appointment created successfully",
      })

      return formattedAppointment
    } catch (err) {
      const errorMessage = "Failed to create appointment"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Update an existing appointment
  const updateExistingAppointment = async (
    id: string,
    data: Partial<Omit<Appointment, "id" | "createdAt" | "updatedAt">>,
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      // Convert Date objects to ISO strings for the API
      const apiData = {
        ...data,
        start: data.start instanceof Date ? data.start.toISOString() : data.start,
        end: data.end instanceof Date ? data.end.toISOString() : data.end,
      }

      const updatedAppointment = await updateAppointment(id, apiData)
      const formattedAppointment = formatAppointment(updatedAppointment)

      setAppointments((prev) => prev.map((appointment) => (appointment.id === id ? formattedAppointment : appointment)))

      if (appointment?.id === id) {
        setAppointment(formattedAppointment)
      }

      toast({
        title: "Success",
        description: "Appointment updated successfully",
      })

      return formattedAppointment
    } catch (err) {
      const errorMessage = "Failed to update appointment"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Delete an appointment
  const removeAppointment = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteAppointment(id)
      setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))

      if (appointment?.id === id) {
        setAppointment(null)
      }

      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      })

      return true
    } catch (err) {
      const errorMessage = "Failed to delete appointment"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch appointments by company
  const fetchAppointmentsByCompany = async (companyId: string, filters?: Record<string, any>) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAppointmentsByCompany(companyId, filters)
      const formattedData = formatAppointments(data)
      setAppointments(formattedData)
      return formattedData
    } catch (err) {
      const errorMessage = "Failed to fetch company appointments"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch appointments by team
  const fetchAppointmentsByTeam = async (teamId: string, filters?: Record<string, any>) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAppointmentsByTeam(teamId, filters)
      const formattedData = formatAppointments(data)
      setAppointments(formattedData)
      return formattedData
    } catch (err) {
      const errorMessage = "Failed to fetch team appointments"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch appointments by professional
  const fetchAppointmentsByProfessional = async (professionalId: string, filters?: Record<string, any>) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAppointmentsByProfessional(professionalId, filters)
      const formattedData = formatAppointments(data)
      setAppointments(formattedData)
      return formattedData
    } catch (err) {
      const errorMessage = "Failed to fetch professional appointments"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch appointments by customer
  const fetchAppointmentsByCustomer = async (customerId: string, filters?: Record<string, any>) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAppointmentsByCustomer(customerId, filters)
      const formattedData = formatAppointments(data)
      setAppointments(formattedData)
      return formattedData
    } catch (err) {
      const errorMessage = "Failed to fetch customer appointments"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch appointments by date range
  const fetchAppointmentsByDateRange = async (startDate: string, endDate: string, filters?: Record<string, any>) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAppointmentsByDateRange(startDate, endDate, filters)
      const formattedData = formatAppointments(data)
      setAppointments(formattedData)
      return formattedData
    } catch (err) {
      const errorMessage = "Failed to fetch appointments for date range"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    appointments,
    appointment,
    isLoading,
    error,
    fetchAppointments,
    fetchAppointmentById,
    addAppointment,
    updateAppointment: updateExistingAppointment,
    removeAppointment,
    fetchAppointmentsByCompany,
    fetchAppointmentsByTeam,
    fetchAppointmentsByProfessional,
    fetchAppointmentsByCustomer,
    fetchAppointmentsByDateRange,
  }
}
