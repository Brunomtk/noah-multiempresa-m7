"use client"

import { useState, useCallback } from "react"
import {
  type MaterialStock,
  type MaterialConsumption,
  type MaterialRequest,
  type MaterialFilters,
  type ConsumptionFilters,
  type RequestFilters,
  getProfessionalMaterials,
  registerMaterialConsumption,
  getMaterialConsumptionHistory,
  requestMaterialRestock,
  getMaterialRequests,
  cancelMaterialRequest,
  getMaterialConsumptionStats,
} from "@/lib/api/professional-materials"
import type { PaginatedResponse } from "@/types/api"

interface UseProfessionalMaterialsReturn {
  materials: MaterialStock[]
  consumptionHistory: MaterialConsumption[]
  requests: MaterialRequest[]
  stats: {
    totalConsumption: number
    mostUsedMaterials: Array<{
      material: any
      quantity: number
      percentage: number
    }>
    consumptionByCategory: Array<{
      category: string
      quantity: number
      percentage: number
    }>
    consumptionTrend: Array<{
      date: Date
      quantity: number
    }>
    lowStockAlerts: number
    pendingRequests: number
  } | null
  pagination: {
    materials: { page: number; totalPages: number; total: number }
    consumptionHistory: { page: number; totalPages: number; total: number }
    requests: { page: number; totalPages: number; total: number }
  }
  loading: {
    materials: boolean
    consumptionHistory: boolean
    requests: boolean
    stats: boolean
    action: boolean
  }
  error: string | null
  fetchMaterials: (professionalId: string, filters?: MaterialFilters) => Promise<PaginatedResponse<MaterialStock>>
  fetchConsumptionHistory: (
    professionalId: string,
    filters?: ConsumptionFilters,
  ) => Promise<PaginatedResponse<MaterialConsumption>>
  fetchRequests: (professionalId: string, filters?: RequestFilters) => Promise<PaginatedResponse<MaterialRequest>>
  fetchStats: (professionalId: string, period?: "week" | "month" | "quarter" | "year") => Promise<void>
  registerConsumption: (
    professionalId: string,
    consumption: Omit<MaterialConsumption, "id" | "material" | "createdAt" | "updatedAt">,
  ) => Promise<MaterialConsumption>
  createRequest: (
    professionalId: string,
    request: Omit<MaterialRequest, "id" | "material" | "status" | "createdAt" | "updatedAt" | "requestedAt">,
  ) => Promise<MaterialRequest>
  cancelRequest: (professionalId: string, requestId: string) => Promise<MaterialRequest>
  setError: (error: string | null) => void
}

export function useProfessionalMaterials(): UseProfessionalMaterialsReturn {
  const [materials, setMaterials] = useState<MaterialStock[]>([])
  const [consumptionHistory, setConsumptionHistory] = useState<MaterialConsumption[]>([])
  const [requests, setRequests] = useState<MaterialRequest[]>([])
  const [stats, setStats] = useState<UseProfessionalMaterialsReturn["stats"]>(null)
  const [pagination, setPagination] = useState({
    materials: { page: 1, totalPages: 1, total: 0 },
    consumptionHistory: { page: 1, totalPages: 1, total: 0 },
    requests: { page: 1, totalPages: 1, total: 0 },
  })
  const [loading, setLoading] = useState({
    materials: false,
    consumptionHistory: false,
    requests: false,
    stats: false,
    action: false,
  })
  const [error, setError] = useState<string | null>(null)

  const fetchMaterials = useCallback(async (professionalId: string, filters: MaterialFilters = {}) => {
    try {
      setLoading((prev) => ({ ...prev, materials: true }))
      setError(null)
      const response = await getProfessionalMaterials(professionalId, filters)
      setMaterials(response.data)
      setPagination((prev) => ({
        ...prev,
        materials: {
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        },
      }))
      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar materiais"
      setError(errorMessage)
      throw error
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }))
    }
  }, [])

  const fetchConsumptionHistory = useCallback(async (professionalId: string, filters: ConsumptionFilters = {}) => {
    try {
      setLoading((prev) => ({ ...prev, consumptionHistory: true }))
      setError(null)
      const response = await getMaterialConsumptionHistory(professionalId, filters)
      setConsumptionHistory(response.data)
      setPagination((prev) => ({
        ...prev,
        consumptionHistory: {
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        },
      }))
      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar histórico de consumo"
      setError(errorMessage)
      throw error
    } finally {
      setLoading((prev) => ({ ...prev, consumptionHistory: false }))
    }
  }, [])

  const fetchRequests = useCallback(async (professionalId: string, filters: RequestFilters = {}) => {
    try {
      setLoading((prev) => ({ ...prev, requests: true }))
      setError(null)
      const response = await getMaterialRequests(professionalId, filters)
      setRequests(response.data)
      setPagination((prev) => ({
        ...prev,
        requests: {
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        },
      }))
      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar solicitações"
      setError(errorMessage)
      throw error
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }))
    }
  }, [])

  const fetchStats = useCallback(
    async (professionalId: string, period: "week" | "month" | "quarter" | "year" = "month") => {
      try {
        setLoading((prev) => ({ ...prev, stats: true }))
        setError(null)
        const response = await getMaterialConsumptionStats(professionalId, period)
        setStats(response.data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao buscar estatísticas"
        setError(errorMessage)
        throw error
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }))
      }
    },
    [],
  )

  const registerConsumption = useCallback(
    async (
      professionalId: string,
      consumption: Omit<MaterialConsumption, "id" | "material" | "createdAt" | "updatedAt">,
    ) => {
      try {
        setLoading((prev) => ({ ...prev, action: true }))
        setError(null)
        const response = await registerMaterialConsumption(professionalId, consumption)
        setConsumptionHistory((prev) => [response.data, ...prev])

        // Atualizar estoque do material
        setMaterials((prev) =>
          prev.map((material) =>
            material.materialId === consumption.materialId
              ? { ...material, currentStock: material.currentStock - consumption.quantity }
              : material,
          ),
        )

        return response.data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao registrar consumo"
        setError(errorMessage)
        throw error
      } finally {
        setLoading((prev) => ({ ...prev, action: false }))
      }
    },
    [],
  )

  const createRequest = useCallback(
    async (
      professionalId: string,
      request: Omit<MaterialRequest, "id" | "material" | "status" | "createdAt" | "updatedAt" | "requestedAt">,
    ) => {
      try {
        setLoading((prev) => ({ ...prev, action: true }))
        setError(null)
        const response = await requestMaterialRestock(professionalId, request)
        setRequests((prev) => [response.data, ...prev])
        return response.data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao criar solicitação"
        setError(errorMessage)
        throw error
      } finally {
        setLoading((prev) => ({ ...prev, action: false }))
      }
    },
    [],
  )

  const cancelRequest = useCallback(async (professionalId: string, requestId: string) => {
    try {
      setLoading((prev) => ({ ...prev, action: true }))
      setError(null)
      const response = await cancelMaterialRequest(professionalId, requestId)
      setRequests((prev) => prev.map((request) => (request.id === requestId ? response.data : request)))
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao cancelar solicitação"
      setError(errorMessage)
      throw error
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }, [])

  return {
    materials,
    consumptionHistory,
    requests,
    stats,
    pagination,
    loading,
    error,
    fetchMaterials,
    fetchConsumptionHistory,
    fetchRequests,
    fetchStats,
    registerConsumption,
    createRequest,
    cancelRequest,
    setError,
  }
}
