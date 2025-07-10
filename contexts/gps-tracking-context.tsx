"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import type { GPSTracking, GPSTrackingFormData, GPSTrackingFilters } from "@/types/gps-tracking"
import {
  getGpsTrackingRecords,
  getGpsTrackingRecord,
  createGpsTrackingRecord,
  updateGpsTrackingRecord,
  deleteGpsTrackingRecord,
  getGpsTrackingByCompany,
  getGpsTrackingByProfessional,
  getActiveGpsTracking,
  getInactiveGpsTracking,
  updateGpsTrackingStatus,
  updateGpsTrackingLocation,
} from "@/lib/api/gps-tracking"

interface GpsTrackingContextType {
  gpsRecords: GPSTracking[]
  selectedGpsRecord: GPSTracking | null
  isLoading: boolean
  error: string | null
  filters: GPSTrackingFilters
  fetchGpsRecords: (filters?: GPSTrackingFilters) => Promise<void>
  fetchGpsRecord: (id: string) => Promise<void>
  addGpsRecord: (data: GPSTrackingFormData) => Promise<GPSTracking>
  updateGpsRecord: (id: string, data: Partial<GPSTrackingFormData>) => Promise<GPSTracking>
  removeGpsRecord: (id: string) => Promise<void>
  fetchGpsRecordsByCompany: (companyId: string) => Promise<void>
  fetchGpsRecordsByProfessional: (professionalId: string) => Promise<void>
  fetchActiveGpsRecords: () => Promise<void>
  fetchInactiveGpsRecords: () => Promise<void>
  updateGpsStatus: (id: string, status: "active" | "inactive") => Promise<GPSTracking>
  updateGpsLocation: (
    id: string,
    location: {
      latitude: number
      longitude: number
      address: string
      accuracy: number
    },
  ) => Promise<GPSTracking>
  setFilters: (filters: GPSTrackingFilters) => void
  resetFilters: () => void
}

const GpsTrackingContext = createContext<GpsTrackingContextType | undefined>(undefined)

export function GpsTrackingProvider({ children }: { children: ReactNode }) {
  const [gpsRecords, setGpsRecords] = useState<GPSTracking[]>([])
  const [selectedGpsRecord, setSelectedGpsRecord] = useState<GPSTracking | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<GPSTrackingFilters>({
    status: "all",
    searchQuery: "",
  })
  const { toast } = useToast()

  const fetchGpsRecords = async (customFilters?: GPSTrackingFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const filtersToUse = customFilters || filters
      const data = await getGpsTrackingRecords(filtersToUse)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch GPS tracking records"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGpsRecord = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getGpsTrackingRecord(id)
      setSelectedGpsRecord(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch GPS tracking record ${id}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addGpsRecord = async (data: GPSTrackingFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      // Transform form data to API format
      const apiData: Omit<GPSTracking, "id" | "createdAt" | "updatedAt"> = {
        professionalId: data.professionalId,
        professionalName: data.professionalName,
        companyId: data.companyId,
        companyName: data.companyName,
        vehicle: data.vehicle,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          accuracy: data.accuracy,
        },
        speed: data.speed,
        status: data.status,
        battery: data.battery,
        notes: data.notes,
        timestamp: new Date().toISOString(),
      }

      const newRecord = await createGpsTrackingRecord(apiData)
      setGpsRecords((prev) => [newRecord, ...prev])
      toast({
        title: "Success",
        description: "GPS tracking record created successfully",
      })
      return newRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create GPS tracking record"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateGpsRecord = async (id: string, data: Partial<GPSTrackingFormData>) => {
    setIsLoading(true)
    setError(null)
    try {
      // Transform form data to API format
      const apiData: Partial<Omit<GPSTracking, "id" | "createdAt" | "updatedAt">> = {}

      if (data.professionalId) apiData.professionalId = data.professionalId
      if (data.professionalName) apiData.professionalName = data.professionalName
      if (data.companyId) apiData.companyId = data.companyId
      if (data.companyName) apiData.companyName = data.companyName
      if (data.vehicle) apiData.vehicle = data.vehicle
      if (data.status) apiData.status = data.status
      if (data.battery !== undefined) apiData.battery = data.battery
      if (data.notes !== undefined) apiData.notes = data.notes

      // Update location if any location field is provided
      if (
        data.latitude !== undefined ||
        data.longitude !== undefined ||
        data.address !== undefined ||
        data.accuracy !== undefined
      ) {
        const currentRecord = await getGpsTrackingRecord(id)
        apiData.location = {
          latitude: data.latitude !== undefined ? data.latitude : currentRecord.location.latitude,
          longitude: data.longitude !== undefined ? data.longitude : currentRecord.location.longitude,
          address: data.address !== undefined ? data.address : currentRecord.location.address,
          accuracy: data.accuracy !== undefined ? data.accuracy : currentRecord.location.accuracy,
        }
      }

      // Update speed if provided
      if (data.speed !== undefined) apiData.speed = data.speed

      // Update timestamp to now
      apiData.timestamp = new Date().toISOString()

      const updatedRecord = await updateGpsTrackingRecord(id, apiData)

      // Update records list
      setGpsRecords((prev) => prev.map((record) => (record.id === id ? updatedRecord : record)))

      // Update selected record if it's the one being edited
      if (selectedGpsRecord && selectedGpsRecord.id === id) {
        setSelectedGpsRecord(updatedRecord)
      }

      toast({
        title: "Success",
        description: "GPS tracking record updated successfully",
      })

      return updatedRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update GPS tracking record ${id}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const removeGpsRecord = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteGpsTrackingRecord(id)
      setGpsRecords((prev) => prev.filter((record) => record.id !== id))

      // Clear selected record if it's the one being deleted
      if (selectedGpsRecord && selectedGpsRecord.id === id) {
        setSelectedGpsRecord(null)
      }

      toast({
        title: "Success",
        description: "GPS tracking record deleted successfully",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to delete GPS tracking record ${id}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGpsRecordsByCompany = async (companyId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getGpsTrackingByCompany(companyId)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to fetch GPS tracking records for company ${companyId}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGpsRecordsByProfessional = async (professionalId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getGpsTrackingByProfessional(professionalId)
      setGpsRecords(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to fetch GPS tracking records for professional ${professionalId}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActiveGpsRecords = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getActiveGpsTracking()
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch active GPS tracking records"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInactiveGpsRecords = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getInactiveGpsTracking()
      setGpsRecords(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch inactive GPS tracking records"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateGpsStatus = async (id: string, status: "active" | "inactive") => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedRecord = await updateGpsTrackingStatus(id, status)

      // Update records list
      setGpsRecords((prev) => prev.map((record) => (record.id === id ? updatedRecord : record)))

      // Update selected record if it's the one being edited
      if (selectedGpsRecord && selectedGpsRecord.id === id) {
        setSelectedGpsRecord(updatedRecord)
      }

      toast({
        title: "Success",
        description: `GPS tracking status updated to ${status}`,
      })

      return updatedRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update GPS tracking status for ${id}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateGpsLocation = async (
    id: string,
    location: {
      latitude: number
      longitude: number
      address: string
      accuracy: number
    },
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedRecord = await updateGpsTrackingLocation(id, location)

      // Update records list
      setGpsRecords((prev) => prev.map((record) => (record.id === id ? updatedRecord : record)))

      // Update selected record if it's the one being edited
      if (selectedGpsRecord && selectedGpsRecord.id === id) {
        setSelectedGpsRecord(updatedRecord)
      }

      toast({
        title: "Success",
        description: "GPS tracking location updated successfully",
      })

      return updatedRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update GPS tracking location for ${id}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      status: "all",
      searchQuery: "",
    })
  }

  // Initial data fetch
  useEffect(() => {
    fetchGpsRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    gpsRecords,
    selectedGpsRecord,
    isLoading,
    error,
    filters,
    fetchGpsRecords,
    fetchGpsRecord,
    addGpsRecord,
    updateGpsRecord,
    removeGpsRecord,
    fetchGpsRecordsByCompany,
    fetchGpsRecordsByProfessional,
    fetchActiveGpsRecords,
    fetchInactiveGpsRecords,
    updateGpsStatus,
    updateGpsLocation,
    setFilters,
    resetFilters,
  }

  return <GpsTrackingContext.Provider value={value}>{children}</GpsTrackingContext.Provider>
}

export function useGpsTracking() {
  const context = useContext(GpsTrackingContext)
  if (context === undefined) {
    throw new Error("useGpsTracking must be used within a GpsTrackingProvider")
  }
  return context
}
