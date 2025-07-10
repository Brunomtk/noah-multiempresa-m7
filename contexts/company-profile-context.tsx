"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { companyProfileApi } from "@/lib/api/company-profile"

interface CompanyProfileContextType {
  profile: any | null
  loading: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  updateProfile: (profileData: any) => Promise<boolean>
  updateLogo: (logoFile: File) => Promise<boolean>
  updateBusinessHours: (businessHours: any) => Promise<boolean>
  updateNotificationSettings: (notificationSettings: any) => Promise<boolean>
  updateSecuritySettings: (securitySettings: any) => Promise<boolean>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  toggleTwoFactorAuth: (enable: boolean) => Promise<any>
  updateSocialMedia: (socialMedia: any) => Promise<boolean>
  deactivateAccount: (reason: string, password: string) => Promise<boolean>
}

const CompanyProfileContext = createContext<CompanyProfileContextType | undefined>(undefined)

export function CompanyProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.getCompanyProfile()

      if (response.success && response.data) {
        setProfile(response.data)
      } else {
        setError(response.error || "Failed to fetch company profile")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch company profile",
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

  const updateProfile = async (profileData: any): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.updateCompanyProfile(profileData)

      if (response.success && response.data) {
        setProfile(response.data)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update profile")
        toast({
          title: "Error",
          description: response.error || "Failed to update profile",
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

  const updateLogo = async (logoFile: File): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.updateCompanyLogo(logoFile)

      if (response.success && response.data) {
        setProfile((prev: any) => ({
          ...prev,
          logo: response.data.logo,
        }))
        toast({
          title: "Success",
          description: "Logo updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update logo")
        toast({
          title: "Error",
          description: response.error || "Failed to update logo",
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

  const updateBusinessHours = async (businessHours: any): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.updateBusinessHours(businessHours)

      if (response.success && response.data) {
        setProfile(response.data)
        toast({
          title: "Success",
          description: "Business hours updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update business hours")
        toast({
          title: "Error",
          description: response.error || "Failed to update business hours",
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

  const updateNotificationSettings = async (notificationSettings: any): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.updateNotificationSettings(notificationSettings)

      if (response.success && response.data) {
        setProfile(response.data)
        toast({
          title: "Success",
          description: "Notification settings updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update notification settings")
        toast({
          title: "Error",
          description: response.error || "Failed to update notification settings",
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

  const updateSecuritySettings = async (securitySettings: any): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.updateSecuritySettings(securitySettings)

      if (response.success && response.data) {
        setProfile(response.data)
        toast({
          title: "Success",
          description: "Security settings updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update security settings")
        toast({
          title: "Error",
          description: response.error || "Failed to update security settings",
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

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.updatePassword(currentPassword, newPassword)

      if (response.success && response.data) {
        setProfile((prev: any) => ({
          ...prev,
          securitySettings: {
            ...prev.securitySettings,
            passwordLastChanged: response.data.passwordLastChanged,
          },
        }))
        toast({
          title: "Success",
          description: "Password updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update password")
        toast({
          title: "Error",
          description: response.error || "Failed to update password",
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

  const toggleTwoFactorAuth = async (enable: boolean): Promise<any> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.toggleTwoFactorAuth(enable)

      if (response.success && response.data) {
        setProfile((prev: any) => ({
          ...prev,
          securitySettings: {
            ...prev.securitySettings,
            twoFactorAuth: response.data.twoFactorAuth,
          },
        }))
        toast({
          title: "Success",
          description: `Two-factor authentication ${enable ? "enabled" : "disabled"} successfully`,
        })
        return response.data
      } else {
        setError(response.error || "Failed to update two-factor authentication")
        toast({
          title: "Error",
          description: response.error || "Failed to update two-factor authentication",
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

  const updateSocialMedia = async (socialMedia: any): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.updateSocialMedia(socialMedia)

      if (response.success && response.data) {
        setProfile(response.data)
        toast({
          title: "Success",
          description: "Social media links updated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to update social media links")
        toast({
          title: "Error",
          description: response.error || "Failed to update social media links",
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

  const deactivateAccount = async (reason: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await companyProfileApi.deactivateAccount(reason, password)

      if (response.success && response.data) {
        toast({
          title: "Account Deactivated",
          description: "Your account has been deactivated successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to deactivate account")
        toast({
          title: "Error",
          description: response.error || "Failed to deactivate account",
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

  // Load initial data
  useEffect(() => {
    fetchProfile()
  }, [])

  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateLogo,
    updateBusinessHours,
    updateNotificationSettings,
    updateSecuritySettings,
    updatePassword,
    toggleTwoFactorAuth,
    updateSocialMedia,
    deactivateAccount,
  }

  return <CompanyProfileContext.Provider value={value}>{children}</CompanyProfileContext.Provider>
}

export function useCompanyProfileContext() {
  const context = useContext(CompanyProfileContext)

  if (context === undefined) {
    throw new Error("useCompanyProfileContext must be used within a CompanyProfileProvider")
  }

  return context
}
