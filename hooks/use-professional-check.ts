"use client"

import { useState, useEffect } from "react"
import type { CheckRecord } from "@/types/check-record"
import {
  getCurrentCheckStatus,
  performCheckInWithPhoto,
  performCheckOutWithPhoto,
  getProfessionalCheckHistory,
  getCheckPhotos,
  verifyLocation,
  type CurrentCheckStatus,
  type CheckLocation,
  type CheckPhoto,
} from "@/lib/api/professional-check"
import { useToast } from "@/hooks/use-toast"

export const useProfessionalCheck = (professionalId: string) => {
  const [currentStatus, setCurrentStatus] = useState<CurrentCheckStatus | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [checkHistory, setCheckHistory] = useState<CheckRecord[]>([])
  const [checkPhotos, setCheckPhotos] = useState<CheckPhoto[]>([])
  const [locationStatus, setLocationStatus] = useState<{
    isNearby: boolean
    distance: number | null
    accuracy: number | null
    lastVerified: Date | null
  }>({
    isNearby: false,
    distance: null,
    accuracy: null,
    lastVerified: null,
  })
  const { toast } = useToast()

  // Carregar status atual ao inicializar
  useEffect(() => {
    refreshCurrentStatus()
  }, [professionalId])

  const refreshCurrentStatus = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const status = await getCurrentCheckStatus(professionalId)
      setCurrentStatus(status)
      return status
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch current check status"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const performCheckIn = async (data: {
    photoBase64: string
    notes?: string
    location: CheckLocation
  }): Promise<CheckRecord | null> => {
    if (!currentStatus?.appointmentId) {
      toast({
        title: "Erro",
        description: "Nenhum agendamento disponível para check-in",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)
    setError(null)
    try {
      const checkRecord = await performCheckInWithPhoto(professionalId, currentStatus.appointmentId, data)

      // Atualizar o status atual
      setCurrentStatus((prev) => {
        if (!prev) return null
        return {
          ...prev,
          checkRecordId: checkRecord.id,
          status: "checked_in",
          checkInTime: checkRecord.checkInTime || undefined,
          checkInPhoto: data.photoBase64,
          checkInNotes: data.notes,
        }
      })

      toast({
        title: "Check-in realizado",
        description: "Check-in registrado com sucesso",
      })

      return checkRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha ao realizar check-in"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const performCheckOut = async (data: {
    photoBase64: string
    notes?: string
    location: CheckLocation
  }): Promise<CheckRecord | null> => {
    if (!currentStatus?.checkRecordId) {
      toast({
        title: "Erro",
        description: "Nenhum check-in encontrado para realizar check-out",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)
    setError(null)
    try {
      const checkRecord = await performCheckOutWithPhoto(currentStatus.checkRecordId, data)

      // Atualizar o status atual
      setCurrentStatus((prev) => {
        if (!prev) return null
        return {
          ...prev,
          status: "checked_out",
          checkOutTime: checkRecord.checkOutTime || undefined,
          checkOutPhoto: data.photoBase64,
          checkOutNotes: data.notes,
        }
      })

      toast({
        title: "Check-out realizado",
        description: "Check-out registrado com sucesso",
      })

      return checkRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha ao realizar check-out"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const loadCheckHistory = async (filters?: {
    startDate?: string
    endDate?: string
    status?: "checked_in" | "checked_out"
    limit?: number
    offset?: number
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const history = await getProfessionalCheckHistory(professionalId, filters)
      setCheckHistory(history)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha ao carregar histórico de check"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCheckPhotos = async (checkRecordId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const photos = await getCheckPhotos(checkRecordId)
      setCheckPhotos(photos)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha ao carregar fotos"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCurrentLocation = async () => {
    if (!currentStatus?.appointmentId) {
      toast({
        title: "Erro",
        description: "Nenhum agendamento disponível para verificar localização",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      // Obter localização atual
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }

      // Verificar proximidade
      const locationCheck = await verifyLocation(currentStatus.appointmentId, currentLocation)

      setLocationStatus({
        isNearby: locationCheck.isNearby,
        distance: locationCheck.distance,
        accuracy: locationCheck.accuracy,
        lastVerified: new Date(),
      })

      return locationCheck
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha ao verificar localização"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Formatar hora para exibição
  const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calcular duração entre check-in e check-out
  const calculateDuration = (
    checkInTime: string | null | undefined,
    checkOutTime: string | null | undefined,
  ): string => {
    if (!checkInTime || !checkOutTime) return "-"

    const start = new Date(checkInTime)
    const end = new Date(checkOutTime)
    const durationMs = end.getTime() - start.getTime()

    // Converter para horas e minutos
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}min`
  }

  // Verificar se o profissional está atrasado
  const isLate = (scheduledTime: string): boolean => {
    if (!scheduledTime) return false

    // Extrair a hora de início do formato "14:30 - 16:30"
    const startTimeStr = scheduledTime.split(" - ")[0]
    const [hours, minutes] = startTimeStr.split(":").map(Number)

    const scheduledDate = new Date()
    scheduledDate.setHours(hours, minutes, 0, 0)

    const now = new Date()

    // Considerar atrasado se já passou 15 minutos da hora agendada
    const lateThreshold = new Date(scheduledDate.getTime() + 15 * 60 * 1000)

    return now > lateThreshold
  }

  // Verificar se o serviço está demorando muito
  const isServiceTakingTooLong = (checkInTime: string | null | undefined, expectedDuration = 120): boolean => {
    if (!checkInTime) return false

    const checkIn = new Date(checkInTime)
    const now = new Date()

    // Converter para minutos
    const durationMinutes = (now.getTime() - checkIn.getTime()) / (1000 * 60)

    return durationMinutes > expectedDuration
  }

  return {
    currentStatus,
    isLoading,
    error,
    checkHistory,
    checkPhotos,
    locationStatus,
    refreshCurrentStatus,
    performCheckIn,
    performCheckOut,
    loadCheckHistory,
    loadCheckPhotos,
    verifyCurrentLocation,
    formatTime,
    calculateDuration,
    isLate,
    isServiceTakingTooLong,
  }
}
