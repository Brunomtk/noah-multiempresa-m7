"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

interface Material {
  id: number
  name: string
  category: string
  supplier: string
  unitPrice: number
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  description?: string
  status: "active" | "inactive"
  lastUpdated: string
}

interface MaterialFilters {
  category?: string
  supplier?: string
  status?: "active" | "inactive"
  lowStock?: boolean
}

interface CompanyMaterialsContextType {
  materials: Material[]
  loading: boolean
  error: string | null
  searchTerm: string
  filters: MaterialFilters
  currentPage: number
  totalPages: number
  totalItems: number
  statistics: {
    totalMaterials: number
    lowStockCount: number
    outOfStockCount: number
    totalValue: number
  }

  // Actions
  setSearchTerm: (term: string) => void
  setPage: (page: number) => void
  updateFilters: (filters: MaterialFilters) => void
  reloadData: () => void
}

const CompanyMaterialsContext = createContext<CompanyMaterialsContextType | undefined>(undefined)

// Mock data for materials
const mockMaterials: Material[] = [
  {
    id: 1,
    name: "Detergente Multiuso",
    category: "Produtos de Limpeza",
    supplier: "Fornecedor A",
    unitPrice: 12.5,
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    unit: "L",
    description: "Detergente concentrado para limpeza geral",
    status: "active",
    lastUpdated: "2025-01-29T10:00:00Z",
  },
  {
    id: 2,
    name: "Aspirador Industrial",
    category: "Equipamentos",
    supplier: "Fornecedor B",
    unitPrice: 850.0,
    currentStock: 3,
    minStock: 2,
    maxStock: 10,
    unit: "UN",
    description: "Aspirador de pó industrial 1400W",
    status: "active",
    lastUpdated: "2025-01-28T15:30:00Z",
  },
  {
    id: 3,
    name: "Luvas Descartáveis",
    category: "Descartáveis",
    supplier: "Fornecedor C",
    unitPrice: 0.25,
    currentStock: 0,
    minStock: 50,
    maxStock: 500,
    unit: "UN",
    description: "Luvas de látex descartáveis tamanho M",
    status: "active",
    lastUpdated: "2025-01-27T09:15:00Z",
  },
  {
    id: 4,
    name: "Uniforme Completo",
    category: "Uniformes",
    supplier: "Fornecedor D",
    unitPrice: 45.0,
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unit: "UN",
    description: "Uniforme completo com camisa e calça",
    status: "active",
    lastUpdated: "2025-01-26T14:20:00Z",
  },
  {
    id: 5,
    name: "Desinfetante",
    category: "Produtos de Limpeza",
    supplier: "Fornecedor A",
    unitPrice: 8.75,
    currentStock: 45,
    minStock: 20,
    maxStock: 80,
    unit: "L",
    description: "Desinfetante bactericida",
    status: "active",
    lastUpdated: "2025-01-25T11:45:00Z",
  },
]

export function CompanyMaterialsProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filters, setFilters] = useState<MaterialFilters>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(mockMaterials.length)

  // Calculate statistics
  const statistics = {
    totalMaterials: materials.length,
    lowStockCount: materials.filter((m) => m.currentStock <= m.minStock && m.currentStock > 0).length,
    outOfStockCount: materials.filter((m) => m.currentStock === 0).length,
    totalValue: materials.reduce((total, material) => total + material.currentStock * material.unitPrice, 0),
  }

  // Reload data function
  const reloadData = useCallback(() => {
    setLoading(true)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      try {
        // Apply filters
        let filteredMaterials = [...mockMaterials]

        if (filters.category) {
          filteredMaterials = filteredMaterials.filter((m) => m.category === filters.category)
        }

        if (filters.supplier) {
          filteredMaterials = filteredMaterials.filter((m) => m.supplier === filters.supplier)
        }

        if (filters.status) {
          filteredMaterials = filteredMaterials.filter((m) => m.status === filters.status)
        }

        if (filters.lowStock) {
          filteredMaterials = filteredMaterials.filter((m) => m.currentStock <= m.minStock)
        }

        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase()
          filteredMaterials = filteredMaterials.filter(
            (m) =>
              m.name.toLowerCase().includes(searchLower) ||
              m.category.toLowerCase().includes(searchLower) ||
              m.supplier.toLowerCase().includes(searchLower),
          )
        }

        setMaterials(filteredMaterials)
        setTotalItems(filteredMaterials.length)
        setTotalPages(Math.ceil(filteredMaterials.length / 10))
      } catch (err) {
        setError("Failed to load materials")
        toast({
          title: "Error",
          description: "Failed to load materials",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [filters, searchTerm])

  // Update filters function
  const updateFilters = useCallback((newFilters: MaterialFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  // Set page function
  const setPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Load data on mount and when dependencies change
  useEffect(() => {
    reloadData()
  }, [reloadData])

  const value = {
    materials,
    loading,
    error,
    searchTerm,
    filters,
    currentPage,
    totalPages,
    totalItems,
    statistics,
    setSearchTerm,
    setPage,
    updateFilters,
    reloadData,
  }

  return <CompanyMaterialsContext.Provider value={value}>{children}</CompanyMaterialsContext.Provider>
}

export function useCompanyMaterialsContext() {
  const context = useContext(CompanyMaterialsContext)

  if (context === undefined) {
    throw new Error("useCompanyMaterialsContext must be used within a CompanyMaterialsProvider")
  }

  return context
}
