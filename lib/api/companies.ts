import type { ApiResponse, PaginatedResponse, Company, CreateCompanyData, UpdateCompanyData } from "@/types"
import { fetchApi } from "./utils"

// API de Empresas
export const companiesApi = {
  // Listar empresas (com paginação e filtros)
  async getCompanies(page = 1, limit = 10, name?: string): Promise<ApiResponse<PaginatedResponse<Company>>> {
    try {
      const params = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: limit.toString(),
      })

      if (name) {
        params.append("name", name)
      }

      const response = await fetchApi(`/Companies/paged?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return {
        data: {
          data: data.data,
          meta: data.meta,
        },
        status: 200,
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to fetch companies",
        status: 500,
      }
    }
  },

  // Obter empresa por ID
  async getCompanyById(id: number): Promise<ApiResponse<Company>> {
    try {
      const response = await fetchApi(`/Companies/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          return {
            error: "Company not found",
            status: 404,
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data, status: 200 }
    } catch (error) {
      console.error("Failed to fetch company:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to fetch company",
        status: 500,
      }
    }
  },

  // Criar nova empresa
  async createCompany(companyData: CreateCompanyData): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetchApi("/Companies/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return { data: result, status: 201 }
    } catch (error) {
      console.error("Failed to create company:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to create company",
        status: 500,
      }
    }
  },

  // Atualizar empresa
  async updateCompany(id: number, companyData: UpdateCompanyData): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetchApi(`/Companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return {
            error: "Company not found",
            status: 404,
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return { data: result, status: 200 }
    } catch (error) {
      console.error("Failed to update company:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to update company",
        status: 500,
      }
    }
  },

  // Excluir empresa
  async deleteCompany(id: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetchApi(`/Companies/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 404) {
          return {
            error: "Company not found",
            status: 404,
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return { data: true, status: 200 }
    } catch (error) {
      console.error("Failed to delete company:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to delete company",
        status: 500,
      }
    }
  },

  // Alterar status da empresa (ativar/desativar)
  async updateCompanyStatus(id: number, status: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetchApi(`/Companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return {
            error: "Company not found",
            status: 404,
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return { data: result, status: 200 }
    } catch (error) {
      console.error("Failed to update company status:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to update company status",
        status: 500,
      }
    }
  },

  // Listar todas as empresas (sem paginação)
  async getAllCompanies(): Promise<ApiResponse<Company[]>> {
    try {
      const response = await fetchApi("/Companies")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data, status: 200 }
    } catch (error) {
      console.error("Failed to fetch all companies:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to fetch companies",
        status: 500,
      }
    }
  },
}
