import { useCompanyPlanContext } from "@/contexts/company-plan-context"

export function useCompanyPlan() {
  const context = useCompanyPlanContext()

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Get payment status color for UI
  const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      case "refunded":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Calculate prorated amount for plan changes
  const calculateProratedAmount = (newPlanPrice: number): number => {
    if (!context.currentPlan) return 0

    const today = new Date()
    const expiryDate = new Date(context.currentPlan.expiryDate)
    const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const daysInMonth = 30 // Simplified
    const currentPlanDailyRate = context.currentPlan.price / daysInMonth
    const newPlanDailyRate = newPlanPrice / daysInMonth

    return (newPlanDailyRate - currentPlanDailyRate) * daysRemaining
  }

  // Calculate renewal price based on period and apply discounts
  const calculateRenewalPrice = (period: string): number => {
    if (!context.currentPlan) return 0

    const monthlyPrice = context.currentPlan.price

    switch (period) {
      case "1-month":
        return monthlyPrice
      case "6-months":
        return monthlyPrice * 6 * 0.95 // 5% discount
      case "1-year":
        return monthlyPrice * 12 * 0.9 // 10% discount
      case "2-years":
        return monthlyPrice * 24 * 0.85 // 15% discount
      default:
        return monthlyPrice
    }
  }

  // Calculate discount percentage based on renewal period
  const getDiscountPercentage = (period: string): number => {
    switch (period) {
      case "1-month":
        return 0
      case "6-months":
        return 5
      case "1-year":
        return 10
      case "2-years":
        return 15
      default:
        return 0
    }
  }

  // Calculate new expiry date based on renewal period
  const calculateNewExpiryDate = (period: string): string => {
    if (!context.currentPlan) return ""

    const currentExpiryDate = new Date(context.currentPlan.expiryDate)
    const newExpiryDate = new Date(currentExpiryDate)

    if (period === "1-month") {
      newExpiryDate.setMonth(newExpiryDate.getMonth() + 1)
    } else if (period === "6-months") {
      newExpiryDate.setMonth(newExpiryDate.getMonth() + 6)
    } else if (period === "1-year") {
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1)
    } else if (period === "2-years") {
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 2)
    }

    return formatDate(newExpiryDate.toISOString())
  }

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format card expiry date
  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  // Get upcoming payment date
  const getUpcomingPaymentDate = (): string => {
    if (!context.currentPlan) return ""

    const expiryDate = new Date(context.currentPlan.expiryDate)

    // If auto-renew is enabled, the next payment is on the expiry date
    if (context.currentPlan.autoRenew) {
      return formatDate(expiryDate.toISOString())
    }

    return "No upcoming payments"
  }

  // Check if a plan is an upgrade from current plan
  const isUpgrade = (planId: string): boolean => {
    if (!context.currentPlan || !context.availablePlans) return false

    const currentPlan = context.availablePlans.find((p) => p.id === context.currentPlan.id)
    const newPlan = context.availablePlans.find((p) => p.id === planId)

    if (!currentPlan || !newPlan) return false

    return newPlan.price > currentPlan.price
  }

  // Get new features when upgrading plans
  const getNewFeatures = (planId: string): string[] => {
    if (!context.currentPlan || !context.availablePlans) return []

    const currentPlan = context.availablePlans.find((p) => p.id === context.currentPlan.id)
    const newPlan = context.availablePlans.find((p) => p.id === planId)

    if (!currentPlan || !newPlan) return []

    return newPlan.features.filter((feature: string) => !currentPlan.features.includes(feature))
  }

  return {
    ...context,
    formatCurrency,
    formatDate,
    getPaymentStatusColor,
    calculateProratedAmount,
    calculateRenewalPrice,
    getDiscountPercentage,
    calculateNewExpiryDate,
    formatCardNumber,
    formatExpiryDate,
    getUpcomingPaymentDate,
    isUpgrade,
    getNewFeatures,
  }
}
