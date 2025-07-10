"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback } from "react"
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

interface ProfessionalMaterialsState {
  materials: MaterialStock[]
  consumptionHistory: MaterialConsumption[]
  requests: MaterialRequest[]
  selectedMaterial: MaterialStock | null
  selectedConsumption: MaterialConsumption | null
  selectedRequest: MaterialRequest | null
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
}

type ProfessionalMaterialsAction =
  | { type: "SET_LOADING"; payload: { key: keyof ProfessionalMaterialsState["loading"]; value: boolean } }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_MATERIALS"; payload: PaginatedResponse<MaterialStock> }
  | { type: "SET_CONSUMPTION_HISTORY"; payload: PaginatedResponse<MaterialConsumption> }
  | { type: "SET_REQUESTS"; payload: PaginatedResponse<MaterialRequest> }
  | { type: "SET_SELECTED_MATERIAL"; payload: MaterialStock | null }
  | { type: "SET_SELECTED_CONSUMPTION"; payload: MaterialConsumption | null }
  | { type: "SET_SELECTED_REQUEST"; payload: MaterialRequest | null }
  | { type: "SET_STATS"; payload: ProfessionalMaterialsState["stats"] }
  | { type: "ADD_CONSUMPTION"; payload: MaterialConsumption }
  | { type: "ADD_REQUEST"; payload: MaterialRequest }
  | { type: "UPDATE_REQUEST"; payload: MaterialRequest }
  | { type: "UPDATE_MATERIAL_STOCK"; payload: { materialId: string; newStock: number } }

const initialState: ProfessionalMaterialsState = {
  materials: [],
  consumptionHistory: [],
  requests: [],
  selectedMaterial: null,
  selectedConsumption: null,
  selectedRequest: null,
  stats: null,
  pagination: {
    materials: { page: 1, totalPages: 1, total: 0 },
    consumptionHistory: { page: 1, totalPages: 1, total: 0 },
    requests: { page: 1, totalPages: 1, total: 0 },
  },
  loading: {
    materials: false,
    consumptionHistory: false,
    requests: false,
    stats: false,
    action: false,
  },
  error: null,
}

function professionalMaterialsReducer(
  state: ProfessionalMaterialsState,
  action: ProfessionalMaterialsAction,
): ProfessionalMaterialsState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_MATERIALS":
      return {
        ...state,
        materials: action.payload.data,
        pagination: {
          ...state.pagination,
          materials: {
            page: action.payload.page,
            totalPages: action.payload.totalPages,
            total: action.payload.total,
          },
        },
      }
    case "SET_CONSUMPTION_HISTORY":
      return {
        ...state,
        consumptionHistory: action.payload.data,
        pagination: {
          ...state.pagination,
          consumptionHistory: {
            page: action.payload.page,
            totalPages: action.payload.totalPages,
            total: action.payload.total,
          },
        },
      }
    case "SET_REQUESTS":
      return {
        ...state,
        requests: action.payload.data,
        pagination: {
          ...state.pagination,
          requests: {
            page: action.payload.page,
            totalPages: action.payload.totalPages,
            total: action.payload.total,
          },
        },
      }
    case "SET_SELECTED_MATERIAL":
      return { ...state, selectedMaterial: action.payload }
    case "SET_SELECTED_CONSUMPTION":
      return { ...state, selectedConsumption: action.payload }
    case "SET_SELECTED_REQUEST":
      return { ...state, selectedRequest: action.payload }
    case "SET_STATS":
      return { ...state, stats: action.payload }
    case "ADD_CONSUMPTION":
      return {
        ...state,
        consumptionHistory: [action.payload, ...state.consumptionHistory],
      }
    case "ADD_REQUEST":
      return {
        ...state,
        requests: [action.payload, ...state.requests],
      }
    case "UPDATE_REQUEST":
      return {
        ...state,
        requests: state.requests.map((request) => (request.id === action.payload.id ? action.payload : request)),
        selectedRequest: state.selectedRequest?.id === action.payload.id ? action.payload : state.selectedRequest,
      }
    case "UPDATE_MATERIAL_STOCK":
      return {
        ...state,
        materials: state.materials.map((material) =>
          material.materialId === action.payload.materialId
            ? { ...material, currentStock: action.payload.newStock }
            : material,
        ),
      }
    default:
      return state
  }
}

interface ProfessionalMaterialsContextType extends ProfessionalMaterialsState {
  fetchMaterials: (professionalId: string, filters?: MaterialFilters) => Promise<void>
  fetchConsumptionHistory: (professionalId: string, filters?: ConsumptionFilters) => Promise<void>
  fetchRequests: (professionalId: string, filters?: RequestFilters) => Promise<void>
  fetchStats: (professionalId: string, period?: "week" | "month" | "quarter" | "year") => Promise<void>
  registerConsumption: (
    professionalId: string,
    consumption: Omit<MaterialConsumption, "id" | "material" | "createdAt" | "updatedAt">,
  ) => Promise<void>
  createRequest: (
    professionalId: string,
    request: Omit<MaterialRequest, "id" | "material" | "status" | "createdAt" | "updatedAt" | "requestedAt">,
  ) => Promise<void>
  cancelRequest: (professionalId: string, requestId: string) => Promise<void>
  setSelectedMaterial: (material: MaterialStock | null) => void
  setSelectedConsumption: (consumption: MaterialConsumption | null) => void
  setSelectedRequest: (request: MaterialRequest | null) => void
  clearError: () => void
}

const ProfessionalMaterialsContext = createContext<ProfessionalMaterialsContextType | undefined>(undefined)

export function ProfessionalMaterialsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(professionalMaterialsReducer, initialState)

  const setLoading = useCallback((key: keyof ProfessionalMaterialsState["loading"], value: boolean) => {
    dispatch({ type: "SET_LOADING", payload: { key, value } })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error })
  }, [])

  const fetchMaterials = useCallback(
    async (professionalId: string, filters: MaterialFilters = {}) => {
      try {
        setLoading("materials", true)
        setError(null)
        const response = await getProfessionalMaterials(professionalId, filters)
        dispatch({ type: "SET_MATERIALS", payload: response })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro ao buscar materiais")
      } finally {
        setLoading("materials", false)
      }
    },
    [setLoading, setError],
  )

  const fetchConsumptionHistory = useCallback(
    async (professionalId: string, filters: ConsumptionFilters = {}) => {
      try {
        setLoading("consumptionHistory", true)
        setError(null)
        const response = await getMaterialConsumptionHistory(professionalId, filters)
        dispatch({ type: "SET_CONSUMPTION_HISTORY", payload: response })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro ao buscar histórico de consumo")
      } finally {
        setLoading("consumptionHistory", false)
      }
    },
    [setLoading, setError],
  )

  const fetchRequests = useCallback(
    async (professionalId: string, filters: RequestFilters = {}) => {
      try {
        setLoading("requests", true)
        setError(null)
        const response = await getMaterialRequests(professionalId, filters)
        dispatch({ type: "SET_REQUESTS", payload: response })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro ao buscar solicitações")
      } finally {
        setLoading("requests", false)
      }
    },
    [setLoading, setError],
  )

  const fetchStats = useCallback(
    async (professionalId: string, period: "week" | "month" | "quarter" | "year" = "month") => {
      try {
        setLoading("stats", true)
        setError(null)
        const response = await getMaterialConsumptionStats(professionalId, period)
        dispatch({ type: "SET_STATS", payload: response.data })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro ao buscar estatísticas")
      } finally {
        setLoading("stats", false)
      }
    },
    [setLoading, setError],
  )

  const registerConsumption = useCallback(
    async (
      professionalId: string,
      consumption: Omit<MaterialConsumption, "id" | "material" | "createdAt" | "updatedAt">,
    ) => {
      try {
        setLoading("action", true)
        setError(null)
        const response = await registerMaterialConsumption(professionalId, consumption)
        dispatch({ type: "ADD_CONSUMPTION", payload: response.data })

        // Atualizar estoque do material
        const material = state.materials.find((m) => m.materialId === consumption.materialId)
        if (material) {
          dispatch({
            type: "UPDATE_MATERIAL_STOCK",
            payload: {
              materialId: consumption.materialId,
              newStock: material.currentStock - consumption.quantity,
            },
          })
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro ao registrar consumo")
        throw error
      } finally {
        setLoading("action", false)
      }
    },
    [setLoading, setError, state.materials],
  )

  const createRequest = useCallback(
    async (
      professionalId: string,
      request: Omit<MaterialRequest, "id" | "material" | "status" | "createdAt" | "updatedAt" | "requestedAt">,
    ) => {
      try {
        setLoading("action", true)
        setError(null)
        const response = await requestMaterialRestock(professionalId, request)
        dispatch({ type: "ADD_REQUEST", payload: response.data })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro ao criar solicitação")
        throw error
      } finally {
        setLoading("action", false)
      }
    },
    [setLoading, setError],
  )

  const cancelRequest = useCallback(
    async (professionalId: string, requestId: string) => {
      try {
        setLoading("action", true)
        setError(null)
        const response = await cancelMaterialRequest(professionalId, requestId)
        dispatch({ type: "UPDATE_REQUEST", payload: response.data })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro ao cancelar solicitação")
        throw error
      } finally {
        setLoading("action", false)
      }
    },
    [setLoading, setError],
  )

  const setSelectedMaterial = useCallback((material: MaterialStock | null) => {
    dispatch({ type: "SET_SELECTED_MATERIAL", payload: material })
  }, [])

  const setSelectedConsumption = useCallback((consumption: MaterialConsumption | null) => {
    dispatch({ type: "SET_SELECTED_CONSUMPTION", payload: consumption })
  }, [])

  const setSelectedRequest = useCallback((request: MaterialRequest | null) => {
    dispatch({ type: "SET_SELECTED_REQUEST", payload: request })
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  const value: ProfessionalMaterialsContextType = {
    ...state,
    fetchMaterials,
    fetchConsumptionHistory,
    fetchRequests,
    fetchStats,
    registerConsumption,
    createRequest,
    cancelRequest,
    setSelectedMaterial,
    setSelectedConsumption,
    setSelectedRequest,
    clearError,
  }

  return <ProfessionalMaterialsContext.Provider value={value}>{children}</ProfessionalMaterialsContext.Provider>
}

export function useProfessionalMaterialsContext() {
  const context = useContext(ProfessionalMaterialsContext)
  if (context === undefined) {
    throw new Error("useProfessionalMaterialsContext must be used within a ProfessionalMaterialsProvider")
  }
  return context
}
