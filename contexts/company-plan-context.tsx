"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import {
  getCurrentCompanyPlan,
  getAvailablePlans,
  getPlanPaymentHistory,
  changePlan,
  renewPlan,
  updateAutoRenewal,
  getPlanUsage,
  downloadInvoice,
  getBillingInfo,
  updateBillingInfo,
  updatePaymentMethod,
} from "@/lib/api/company-plan"
import type { Payment } from "@/types/payment"

interface CompanyPlanContextType {
  currentPlan: any | null
  availablePlans: any[]
  paymentHistory: Payment[]
  planUsage: any | null
  billingInfo: any | null
  loading: boolean
  error: string | null
  fetchCurrentPlan: () => Promise<void>
  fetchAvailablePlans: () => Promise<void>
  fetchPaymentHistory: () => Promise<void>
  fetchPlanUsage: () => Promise<void>
  fetchBillingInfo: () => Promise<void>
  handleChangePlan: (planId: string, billingCycle: string) => Promise<boolean>
  handleRenewPlan: (renewalPeriod: string, autoRenew: boolean, paymentMethod: string) => Promise<boolean>
  handleUpdateAutoRenewal: (autoRenew: boolean) => Promise<boolean>
  handleDownloadInvoice: (invoiceId: string) => Promise<string | null>
  handleUpdateBillingInfo: (billingData: any) => Promise<boolean>
  handleUpdatePaymentMethod: (paymentData: any) => Promise<boolean>
  calculateDaysRemaining: () => number
  isExpiringSoon: () => boolean
}

const CompanyPlanContext = createContext<CompanyPlanContextType | undefined>(undefined)

export function CompanyPlanProvider({ children }: { children: ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<any | null>(null)
  const [availablePlans, setAvailablePlans] = useState<any[]>([])
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([])
  const [planUsage, setPlanUsage] = useState<any | null>(null)
  const [billingInfo, setBillingInfo] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrentPlan = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getCurrentCompanyPlan()

      if (response.success && response.data) {
        setCurrentPlan(response.data)
      } else {
        setError(response.error || "Failed to fetch current plan")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch current plan",
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

  const fetchAvailablePlans = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getAvailablePlans()

      if (response.success && response.data) {
        setAvailablePlans(response.data)
      } else {
        setError(response.error || "Failed to fetch available plans")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch available plans",
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

  const fetchPaymentHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPlanPaymentHistory()

      if (response.success && response.data) {
        setPaymentHistory(response.data)
      } else {
        setError(response.error || "Failed to fetch payment history")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch payment history",
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

  const fetchPlanUsage = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPlanUsage()

      if (response.success && response.data) {
        setPlanUsage(response.data)
      } else {
        setError(response.error || "Failed to fetch plan usage")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch plan usage",
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

  const fetchBillingInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getBillingInfo()

      if (response.success && response.data) {
        setBillingInfo(response.data)
      } else {
        setError(response.error || "Failed to fetch billing information")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch billing information",
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

  const handleChangePlan = async (planId: string, billingCycle: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await changePlan(planId, billingCycle)

      if (response.success && response.data) {
        setCurrentPlan(response.data)
        toast({
          title: "Success",
          description: "Plan changed successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to change plan")
        toast({
          title: "Error",
          description: response.error || "Failed to change plan",
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

  const handleRenewPlan = async (
    renewalPeriod: string,
    autoRenew: boolean,
    paymentMethod: string,
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await renewPlan(renewalPeriod, autoRenew, paymentMethod)

      if (response.success && response.data) {
        setCurrentPlan(response.data)
        toast({
          title: "Success",
          description: "Plan renewed successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to renew plan")
        toast({
          title: "Error",
          description: response.error || "Failed to renew plan",
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

  const handleUpdateAutoRenewal = async (autoRenew: boolean): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await updateAutoRenewal(autoRenew)

      if (response.success && response.data) {
        setCurrentPlan((prev: any) => ({ ...prev, autoRenew }))
        toast({
          title: "Success",
          description: `Auto-renewal ${autoRenew ? "enabled" : "disabled"} successfully`,
        })
        return true
      } else {
        setError(response.error || "Failed to update auto-renewal setting")
        toast({
          title: "Error",
          description: response.error || "Failed to update auto-renewal setting",
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

  const handleDownloadInvoice = async (invoiceId: string): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await downloadInvoice(invoiceId)

      if (response.success && response.data) {
        return response.data.downloadUrl
      } else {
        setError(response.error || "Failed to download invoice")
        toast({
          title: "Error",
          description: response.error || "Failed to download invoice",
          variant: "destructive",
        })
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBillingInfo = async (billingData: any): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await updateBillingInfo(billingData)

      if (response.success && response.data) {
        setBillingInfo(response.data)
        toast({
          title: "Success",
          description: "Billing information updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update billing information")
        toast({
          title: "Error",
          description: response.error || "Failed to update billing information",
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

  const handleUpdatePaymentMethod = async (paymentData: any): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await updatePaymentMethod(paymentData)

      if (response.success && response.data) {
        setBillingInfo((prev: any) => ({
          ...prev,
          paymentMethod: response.data.paymentMethod,
        }))
        toast({
          title: "Success",
          description: "Payment method updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update payment method")
        toast({
          title: "Error",
          description: response.error || "Failed to update payment method",
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

  // Calculate days remaining until expiry
  const calculateDaysRemaining = (): number => {
    if (!currentPlan) return 0

    const today = new Date()
    const expiryDate = new Date(currentPlan.expiryDate)
    return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Check if plan is expiring soon (within 30 days)
  const isExpiringSoon = (): boolean => {
    const daysRemaining = calculateDaysRemaining()
    return daysRemaining <= 30 && daysRemaining > 0
  }

  // Load initial data
  useEffect(() => {
    fetchCurrentPlan()
    fetchAvailablePlans()
    fetchPaymentHistory()
    fetchPlanUsage()
    fetchBillingInfo()
  }, [])

  const value = {
    currentPlan,
    availablePlans,
    paymentHistory,
    planUsage,
    billingInfo,
    loading,
    error,
    fetchCurrentPlan,
    fetchAvailablePlans,
    fetchPaymentHistory,
    fetchPlanUsage,
    fetchBillingInfo,
    handleChangePlan,
    handleRenewPlan,
    handleUpdateAutoRenewal,
    handleDownloadInvoice,
    handleUpdateBillingInfo,
    handleUpdatePaymentMethod,
    calculateDaysRemaining,
    isExpiringSoon,
  }

  return <CompanyPlanContext.Provider value={value}>{children}</CompanyPlanContext.Provider>
}

export function useCompanyPlanContext() {
  const context = useContext(CompanyPlanContext)

  if (context === undefined) {
    throw new Error("useCompanyPlanContext must be used within a CompanyPlanProvider")
  }

  return context
}
