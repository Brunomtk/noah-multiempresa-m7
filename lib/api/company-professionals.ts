import type { ApiResponse, Professional, PaginatedResponse } from "@/types"
import { professionalsApi, type ProfessionalWithDetails } from "@/lib/api/professionals"
import { apiDelay } from "./utils"

// API de Profissionais da Empresa
export const companyProfessionalsApi = {
  // Listar profissionais da empresa (com paginação e filtros)
  async getCompanyProfessionals(
    companyId: string,
    page = 1,
    limit = 10,
    status?: string,
    teamId?: string,
    search?: string,
  ): Promise<ApiResponse<PaginatedResponse<Professional>>> {
    // Reutiliza a API de profissionais, mas sempre filtra pelo companyId
    return professionalsApi.getProfessionals(page, limit, status, teamId, search, companyId)
  },

  // Obter profissional da empresa por ID
  async getCompanyProfessionalById(companyId: string, id: string): Promise<ApiResponse<ProfessionalWithDetails>> {
    try {
      await apiDelay(500)

      const response = await professionalsApi.getProfessionalById(id)

      if (response.error) {
        return response
      }

      // Verificar se o profissional pertence à empresa
      if (response.data && response.data.companyId !== companyId) {
        return {
          error: "Professional not found in this company",
          status: 404,
        }
      }

      return response
    } catch (error) {
      console.error("Failed to fetch company professional:", error)
      return {
        error: "Failed to fetch company professional",
        status: 500,
      }
    }
  },

  // Criar novo profissional na empresa
  async createCompanyProfessional(
    companyId: string,
    professionalData: Omit<ProfessionalWithDetails, "id" | "createdAt" | "updatedAt" | "rating" | "completedServices">,
  ): Promise<ApiResponse<Professional>> {
    // Garantir que o companyId seja o correto
    const dataWithCompanyId = {
      ...professionalData,
      companyId,
    }

    return professionalsApi.createProfessional(dataWithCompanyId)
  },

  // Atualizar profissional da empresa
  async updateCompanyProfessional(
    companyId: string,
    id: string,
    professionalData: Partial<ProfessionalWithDetails>,
  ): Promise<ApiResponse<Professional>> {
    try {
      await apiDelay(500)

      // Verificar se o profissional pertence à empresa
      const checkResponse = await professionalsApi.getProfessionalById(id)

      if (checkResponse.error) {
        return checkResponse
      }

      if (checkResponse.data && checkResponse.data.companyId !== companyId) {
        return {
          error: "Professional not found in this company",
          status: 404,
        }
      }

      // Não permitir alterar o companyId
      const dataWithoutCompanyId = { ...professionalData }
      if (dataWithoutCompanyId.companyId) {
        delete dataWithoutCompanyId.companyId
      }

      return professionalsApi.updateProfessional(id, dataWithoutCompanyId)
    } catch (error) {
      console.error("Failed to update company professional:", error)
      return {
        error: "Failed to update company professional",
        status: 500,
      }
    }
  },

  // Excluir profissional da empresa
  async deleteCompanyProfessional(companyId: string, id: string): Promise<ApiResponse<null>> {
    try {
      await apiDelay(500)

      // Verificar se o profissional pertence à empresa
      const checkResponse = await professionalsApi.getProfessionalById(id)

      if (checkResponse.error) {
        return checkResponse
      }

      if (checkResponse.data && checkResponse.data.companyId !== companyId) {
        return {
          error: "Professional not found in this company",
          status: 404,
        }
      }

      return professionalsApi.deleteProfessional(id)
    } catch (error) {
      console.error("Failed to delete company professional:", error)
      return {
        error: "Failed to delete company professional",
        status: 500,
      }
    }
  },

  // Obter agenda do profissional da empresa
  async getCompanyProfessionalSchedule(
    companyId: string,
    id: string,
    startDate: string,
    endDate: string,
  ): Promise<ApiResponse<{ date: string; appointments: any[] }[]>> {
    try {
      await apiDelay(500)

      // Verificar se o profissional pertence à empresa
      const checkResponse = await professionalsApi.getProfessionalById(id)

      if (checkResponse.error) {
        return checkResponse
      }

      if (checkResponse.data && checkResponse.data.companyId !== companyId) {
        return {
          error: "Professional not found in this company",
          status: 404,
        }
      }

      return professionalsApi.getProfessionalSchedule(id, startDate, endDate)
    } catch (error) {
      console.error("Failed to fetch company professional schedule:", error)
      return {
        error: "Failed to fetch company professional schedule",
        status: 500,
      }
    }
  },

  // Obter equipes da empresa (para filtro)
  async getCompanyTeams(companyId: string): Promise<ApiResponse<{ id: string; name: string }[]>> {
    try {
      await apiDelay(300)

      // Em uma implementação real, filtraria as equipes pelo companyId
      // Por enquanto, retorna todas as equipes
      return professionalsApi.getTeams()
    } catch (error) {
      console.error("Failed to fetch company teams:", error)
      return {
        error: "Failed to fetch company teams",
        status: 500,
      }
    }
  },
}
