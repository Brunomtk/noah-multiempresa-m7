"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  updatePlanStatus,
  getPlanSubscribers,
} from "@/lib/api/plans"
import type { Plan, PlanFormData, PlanFilters } from "@/types/plan"

interface PlansContextType {
  plans: Plan[]
  currentPlan: Plan | null
  loading: boolean
  error: string | null
  filters: PlanFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  fetchPlans: (page?: number, limit?: number) => Promise<void>
  fetchPlan: (id: string) => Promise<void>
  addPlan: (planData: PlanFormData) => Promise<boolean>
  editPlan: (id: string, planData: Partial<PlanFormData>) => Promise<boolean>
  removePlan: (id: string) => Promise<boolean>
  activatePlan: (id: string) => Promise<boolean>
  deactivatePlan: (id: string) => Promise<boolean>
  updateFilters: (newFilters: Partial<PlanFilters>) => void
  resetFilters: () => void
  fetchPlanSubscribers: (planId: string, page?: number, limit?: number) => Promise<any[]>
}

const defaultPagination = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
}

const PlansContext = createContext<PlansContextType | undefined>(undefined)

export function PlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<PlanFilters>({})
  const [pagination, setPagination] = useState(defaultPagination)

  const fetchPlans = async (page = 1, limit = 10) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPlans(page, limit, filters.status, filters.search)

      if (response.success && response.data) {
        setPlans(response.data.items)
        setPagination({
          currentPage: response.data.meta.currentPage,
          totalPages: response.data.meta.totalPages,
          totalItems: response.data.meta.totalItems,
          itemsPerPage: response.data.meta.itemsPerPage,
        })
      } else {
        setError(response.error || "Failed to fetch plans")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch plans",
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPlan = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPlan(id)

      if (response.success && response.data) {
        setCurrentPlan(response.data)
      } else {
        setError(response.error || "Failed to fetch plan")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch plan",
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addPlan = async (planData: PlanFormData): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await createPlan(planData)

      if (response.success && response.data) {
        setPlans((prevPlans) => [...prevPlans, response.data])
        toast({
          title: "Success",
          description: "Plan created successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to create plan")
        toast({
          title: "Error",
          description: response.error || "Failed to create plan",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const editPlan = async (id: string, planData: Partial<PlanFormData>): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await updatePlan(id, planData)

      if (response.success && response.data) {
        setPlans((prevPlans) => prevPlans.map((plan) => (plan.id === id ? response.data : plan)))

        if (currentPlan && currentPlan.id === id) {
          setCurrentPlan(response.data)
        }

        toast({
          title: "Success",
          description: "Plan updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update plan")
        toast({
          title: "Error",
          description: response.error || "Failed to update plan",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const removePlan = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await deletePlan(id)

      if (response.success) {
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id))

        if (currentPlan && currentPlan.id === id) {
          setCurrentPlan(null)
        }

        toast({
          title: "Success",
          description: "Plan deleted successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to delete plan")
        toast({
          title: "Error",
          description: response.error || "Failed to delete plan",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const activatePlan = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await updatePlanStatus(id, "active")

      if (response.success && response.data) {
        setPlans((prevPlans) => prevPlans.map((plan) => (plan.id === id ? response.data : plan)))

        if (currentPlan && currentPlan.id === id) {
          setCurrentPlan(response.data)
        }

        toast({
          title: "Success",
          description: "Plan activated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to activate plan")
        toast({
          title: "Error",
          description: response.error || "Failed to activate plan",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const deactivatePlan = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await updatePlanStatus(id, "inactive")

      if (response.success && response.data) {
        setPlans((prevPlans) => prevPlans.map((plan) => (plan.id === id ? response.data : plan)))

        if (currentPlan && currentPlan.id === id) {
          setCurrentPlan(response.data)
        }

        toast({
          title: "Success",
          description: "Plan deactivated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to deactivate plan")
        toast({
          title: "Error",
          description: response.error || "Failed to deactivate plan",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<PlanFilters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }))
  }

  const resetFilters = () => {
    setFilters({})
  }

  const fetchPlanSubscribers = async (planId: string, page = 1, limit = 10): Promise<any[]> => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPlanSubscribers(planId, page, limit)

      if (response.success && response.data) {
        return response.data.items
      } else {
        setError(response.error || "Failed to fetch plan subscribers")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch plan subscribers",
          variant: "destructive",
        })
        return []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch plans when filters change
  useEffect(() => {
    fetchPlans()
  }, [filters])

  const value = {
    plans,
    currentPlan,
    loading,
    error,
    filters,
    pagination,
    fetchPlans,
    fetchPlan,
    addPlan,
    editPlan,
    removePlan,
    activatePlan,
    deactivatePlan,
    updateFilters,
    resetFilters,
    fetchPlanSubscribers,
  }

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>
}

export function usePlansContext() {
  const context = useContext(PlansContext)

  if (context === undefined) {
    throw new Error("usePlansContext must be used within a PlansProvider")
  }

  return context
}
