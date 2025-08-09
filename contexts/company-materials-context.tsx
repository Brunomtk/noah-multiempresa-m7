"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo } from "react"
import type { Material } from "../types"

interface CompanyMaterialsContextType {
  materials: Material[]
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>
  filteredMaterials: Material[]
}

const CompanyMaterialsContext = createContext<CompanyMaterialsContextType | undefined>(undefined)

export const CompanyMaterialsProvider: React.FC = ({ children }) => {
  const [materials, setMaterials] = useState<Material[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filteredMaterials = useMemo(() => {
    if (!searchTerm || !materials) return materials || []

    const searchLower = searchTerm.toLowerCase()
    return materials.filter(
      (material) =>
        material &&
        (material.name?.toLowerCase().includes(searchLower) ||
          material.category?.toLowerCase().includes(searchLower) ||
          material.supplier?.toLowerCase().includes(searchLower)),
    )
  }, [materials, searchTerm])

  return (
    <CompanyMaterialsContext.Provider value={{ materials, setMaterials, filteredMaterials }}>
      {children}
    </CompanyMaterialsContext.Provider>
  )
}

export const useCompanyMaterials = () => {
  const context = useContext(CompanyMaterialsContext)
  if (!context) {
    throw new Error("useCompanyMaterials must be used within a CompanyMaterialsProvider")
  }
  return context
}
