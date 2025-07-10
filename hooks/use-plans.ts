import { usePlansContext } from "@/contexts/plans-context"
import type { Plan, PlanFilters } from "@/types/plan"
import { formatCurrency } from "@/lib/utils"

export function usePlans() {
  const context = usePlansContext()

  // Format price for display
  const formatPrice = (price: number): string => {
    return formatCurrency(price)
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get status color for UI
  const getStatusColor = (status: "active" | "inactive"): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status label for display
  const getStatusLabel = (status: "active" | "inactive"): string => {
    switch (status) {
      case "active":
        return "Active"
      case "inactive":
        return "Inactive"
      default:
        return "Unknown"
    }
  }

  // Format duration for display
  const formatDuration = (months: number): string => {
    if (months === 1) {
      return "1 month"
    } else if (months === 12) {
      return "1 year"
    } else if (months > 12 && months % 12 === 0) {
      return `${months / 12} years`
    } else {
      return `${months} months`
    }
  }

  // Format limits for display
  const formatLimits = (plan: Plan): string[] => {
    const limitDescriptions: string[] = []

    if (plan.limits.professionals !== undefined) {
      limitDescriptions.push(
        plan.limits.professionals === 0
          ? "Unlimited professionals"
          : `Up to ${plan.limits.professionals} professionals`,
      )
    }

    if (plan.limits.teams !== undefined) {
      limitDescriptions.push(plan.limits.teams === 0 ? "Unlimited teams" : `Up to ${plan.limits.teams} teams`)
    }

    if (plan.limits.customers !== undefined) {
      limitDescriptions.push(
        plan.limits.customers === 0 ? "Unlimited customers" : `Up to ${plan.limits.customers} customers`,
      )
    }

    if (plan.limits.appointments !== undefined) {
      limitDescriptions.push(
        plan.limits.appointments === 0
          ? "Unlimited appointments"
          : `Up to ${plan.limits.appointments} appointments per month`,
      )
    }

    return limitDescriptions
  }

  // Update filters and trigger data fetch
  const updateFilters = (newFilters: Partial<PlanFilters>) => {
    context.updateFilters(newFilters)
  }

  // Reset filters to default values
  const resetFilters = () => {
    context.resetFilters()
  }

  return {
    ...context,
    formatPrice,
    formatDate,
    getStatusColor,
    getStatusLabel,
    formatDuration,
    formatLimits,
    updateFilters,
    resetFilters,
  }
}
