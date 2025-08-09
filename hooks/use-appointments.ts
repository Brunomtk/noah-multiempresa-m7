"use client"

import { useState, useCallback } from "react"
import { appointmentsApi } from "@/lib/api/appointments"
import type { Appointment, CreateAppointmentData, UpdateAppointmentData, AppointmentFilters } from "@/types/appointment"
import { useToast } from "@/hooks/use-toast"

interface UseAppointmentsReturn {
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  pagination: {
    currentPage: number
    pageCount: number
    pageSize: number
    totalItems: number
    firstRowOnPage: number
    lastRowOnPage: number
  }
  fetchAppointments: (filters?: AppointmentFilters) => Promise<void>
  getAppointmentById: (id: number) => Promise<Appointment | null>
  addAppointment: (data: CreateAppointmentData) => Promise<boolean>
  updateAppointment: (id: number, data: UpdateAppointmentData) => Promise<boolean>
  removeAppointment: (id: number) => Promise<boolean>
}

export function useAppointments(): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageCount: 1,
    pageSize: 10,
    totalItems: 0,
    firstRowOnPage: 1,
    lastRowOnPage: 0,
  })
  const { toast } = useToast()

  const fetchAppointments = useCallback(
    async (filters: AppointmentFilters = {}) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await appointmentsApi.getAppointments(filters)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return
        }

        if (response.data) {
          setAppointments(response.data.results || [])
          setPagination({
            currentPage: response.data.currentPage || 1,
            pageCount: response.data.pageCount || 1,
            pageSize: response.data.pageSize || 10,
            totalItems: response.data.totalItems || 0,
            firstRowOnPage: response.data.firstRowOnPage || 1,
            lastRowOnPage: response.data.lastRowOnPage || 0,
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch appointments"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const getAppointmentById = useCallback(
    async (id: number): Promise<Appointment | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await appointmentsApi.getAppointmentById(id)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return null
        }

        return response.data || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch appointment"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const addAppointment = useCallback(
    async (data: CreateAppointmentData): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await appointmentsApi.createAppointment(data)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return false
        }

        toast({
          title: "Success",
          description: "Appointment created successfully",
        })

        // Refresh appointments list
        await fetchAppointments()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create appointment"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [fetchAppointments, toast],
  )

  const updateAppointment = useCallback(
    async (id: number, data: UpdateAppointmentData): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await appointmentsApi.updateAppointment(id, data)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return false
        }

        toast({
          title: "Success",
          description: "Appointment updated successfully",
        })

        // Refresh appointments list
        await fetchAppointments()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update appointment"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [fetchAppointments, toast],
  )

  const removeAppointment = useCallback(
    async (id: number): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await appointmentsApi.deleteAppointment(id)

        if (response.error) {
          setError(response.error)
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          })
          return false
        }

        toast({
          title: "Success",
          description: "Appointment deleted successfully",
        })

        // Refresh appointments list
        await fetchAppointments()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete appointment"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [fetchAppointments, toast],
  )

  return {
    appointments,
    isLoading,
    error,
    pagination,
    fetchAppointments,
    getAppointmentById,
    addAppointment,
    updateAppointment,
    removeAppointment,
  }
}
