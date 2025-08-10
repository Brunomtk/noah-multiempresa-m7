"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import {
  getRecentActivities,
  getDashboardChartData,
  getDashboardCheckRecords,
  getCompaniesCount,
  getProfessionalsCount,
  getCustomersCount,
} from "@/lib/api/dashboard"

interface DashboardState {
  stats: {
    totalCompanies: number
    totalProfessionals: number
    totalCustomers: number
    totalAppointments: number
    activeAppointments: number
    completedAppointments: number
    pendingPayments: number
    totalRevenue: number
  }
  recentActivities: any[]
  chartData: any[]
  checkRecords: any[]
  isLoading: boolean
  error: string | null
}

interface DashboardContextType {
  state: DashboardState
  loadDashboardData: () => Promise<void>
  loadStats: () => Promise<void>
  loadActivities: () => Promise<void>
  loadChartData: (period?: string, type?: string) => Promise<void>
  loadCheckRecords: (page?: number, pageSize?: number) => Promise<void>
}

const initialState: DashboardState = {
  stats: {
    totalCompanies: 0,
    totalProfessionals: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    activeAppointments: 0,
    completedAppointments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  },
  recentActivities: [],
  chartData: [],
  checkRecords: [],
  isLoading: false,
  error: null,
}

type DashboardAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_STATS"; payload: any }
  | { type: "SET_ACTIVITIES"; payload: any[] }
  | { type: "SET_CHART_DATA"; payload: any[] }
  | { type: "SET_CHECK_RECORDS"; payload: any[] }

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "SET_STATS":
      return { ...state, stats: action.payload }
    case "SET_ACTIVITIES":
      return { ...state, recentActivities: action.payload }
    case "SET_CHART_DATA":
      return { ...state, chartData: action.payload }
    case "SET_CHECK_RECORDS":
      return { ...state, checkRecords: action.payload }
    default:
      return state
  }
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  const loadStats = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      // Load individual counts to build stats
      const [companiesResult, professionalsResult, customersResult] = await Promise.all([
        getCompaniesCount(),
        getProfessionalsCount(),
        getCustomersCount(),
      ])

      const stats = {
        totalCompanies: companiesResult.data || 0,
        totalProfessionals: professionalsResult.data || 0,
        totalCustomers: customersResult.data || 0,
        totalAppointments: 0,
        activeAppointments: 0,
        completedAppointments: 0,
        pendingPayments: 0,
        totalRevenue: 0,
      }

      dispatch({ type: "SET_STATS", payload: stats })
      console.log("Dashboard stats loaded:", stats)
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load dashboard statistics" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const loadActivities = async () => {
    try {
      const result = await getRecentActivities(10)
      if (result.status === 200) {
        dispatch({ type: "SET_ACTIVITIES", payload: result.data || [] })
        console.log("Recent activities loaded:", result.data)
      }
    } catch (error) {
      console.error("Error loading recent activities:", error)
      dispatch({ type: "SET_ACTIVITIES", payload: [] })
    }
  }

  const loadChartData = async (period = "7d", type = "appointments") => {
    try {
      const result = await getDashboardChartData(period, type)
      if (result.status === 200) {
        dispatch({ type: "SET_CHART_DATA", payload: result.data || [] })
        console.log("Chart data loaded:", result.data)
      }
    } catch (error) {
      console.error("Error loading chart data:", error)
      dispatch({ type: "SET_CHART_DATA", payload: [] })
    }
  }

  const loadCheckRecords = async (page = 1, pageSize = 10) => {
    try {
      // Ensure parameters are numbers, not objects
      const pageNumber = typeof page === "object" ? 1 : Number(page) || 1
      const pageSizeNumber = typeof pageSize === "object" ? 10 : Number(pageSize) || 10

      console.log("Loading check records with params:", { page: pageNumber, pageSize: pageSizeNumber })

      const result = await getDashboardCheckRecords(pageNumber, pageSizeNumber)
      if (result.status === 200) {
        dispatch({ type: "SET_CHECK_RECORDS", payload: result.data?.data || [] })
        console.log("Check records loaded:", result.data)
      }
    } catch (error) {
      console.error("Error loading check records:", error)
      dispatch({ type: "SET_CHECK_RECORDS", payload: [] })
    }
  }

  const loadDashboardData = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      await Promise.all([loadStats(), loadActivities(), loadChartData(), loadCheckRecords(1, 10)])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load dashboard data" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const contextValue: DashboardContextType = {
    state,
    loadDashboardData,
    loadStats,
    loadActivities,
    loadChartData,
    loadCheckRecords,
  }

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
