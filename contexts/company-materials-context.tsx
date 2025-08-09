"use client"

import type React from "react"
import { createContext, useContext } from "react"

// Placeholder context since materials feature was removed
interface CompanyMaterialsContextType {
  materials: any[]
  isLoading: boolean
  error: string | null
}

const CompanyMaterialsContext = createContext<CompanyMaterialsContextType | undefined>(undefined)

export function CompanyMaterialsProvider({ children }: { children: React.ReactNode }) {
  console.warn("Company materials feature has been removed")

  const value: CompanyMaterialsContextType = {
    materials: [],
    isLoading: false,
    error: "Feature removed",
  }

  return <CompanyMaterialsContext.Provider value={value}>{children}</CompanyMaterialsContext.Provider>
}

export function useCompanyMaterials() {
  const context = useContext(CompanyMaterialsContext)
  if (context === undefined) {
    throw new Error("useCompanyMaterials must be used within a CompanyMaterialsProvider")
  }
  return context
}
