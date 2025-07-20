import type { ApiResponse, Professional, CreateProfessionalRequest, UpdateProfessionalRequest } from "@/types"
import { apiDelay } from "./utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44394/api"

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("noah_token")
  }
  return null
}

// Helper function to create headers
const createHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Tipo para profissional com dados completos
export interface ProfessionalWithDetails extends Professional {
  shift?: "morning" | "afternoon" | "night"
  weeklyHours?: number
  photo?: string
  observations?: string
  performance?: {
    punctuality: number
    quality: number
    customerSatisfaction: number
    attendance: number
  }
  recentServices?: any[]
  teamName?: string
  companyName?: string
}

// API de Profissionais
export const professionalsApi = {
  // Listar profissionais (com paginação e filtros)
  async getProfessionals(
    page = 1,
    limit = 100,
    status?: string,
    teamId?: string,
    search?: string,
    companyId?: string,
  ): Promise<ApiResponse<Professional[]>> {
    try {
      await apiDelay(300)

      const url = new URL(`${API_BASE_URL}/Professional`)

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: createHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let data: Professional[] = await response.json()

      // Aplicar filtros no frontend já que a API não suporta filtros
      if (status && status !== "all") {
        data = data.filter((professional) => professional.status === status)
      }

      if (teamId && teamId !== "all") {
        data = data.filter((professional) => professional.teamId === Number.parseInt(teamId))
      }

      if (companyId && companyId !== "all") {
        data = data.filter((professional) => professional.companyId === Number.parseInt(companyId))
      }

      if (search) {
        const searchLower = search.toLowerCase()
        data = data.filter(
          (professional) =>
            professional.name.toLowerCase().includes(searchLower) ||
            professional.cpf.includes(search) ||
            professional.email.toLowerCase().includes(searchLower),
        )
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      console.error("Failed to fetch professionals:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to fetch professionals",
        status: 500,
      }
    }
  },

  // Obter profissional por ID (com detalhes completos)
  async getProfessionalById(id: string): Promise<ApiResponse<ProfessionalWithDetails>> {
    try {
      await apiDelay(300)

      const response = await fetch(`${API_BASE_URL}/Professional/${id}`, {
        method: "GET",
        headers: createHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return {
            error: "Professional not found",
            status: 404,
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Professional = await response.json()

      // Estender com dados adicionais de mock para compatibilidade
      const professionalWithDetails: ProfessionalWithDetails = {
        ...data,
        shift: "morning",
        weeklyHours: 40,
        photo: "",
        observations: "",
        teamName: `Team ${data.teamId}`,
        companyName: `Company ${data.companyId}`,
      }

      return {
        data: professionalWithDetails,
        status: response.status,
      }
    } catch (error) {
      console.error("Failed to fetch professional:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to fetch professional",
        status: 500,
      }
    }
  },

  // Criar novo profissional
  async createProfessional(professionalData: CreateProfessionalRequest): Promise<ApiResponse<Professional>> {
    try {
      await apiDelay(800)

      const response = await fetch(`${API_BASE_URL}/Professional`, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(professionalData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Professional = await response.json()

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      console.error("Failed to create professional:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to create professional",
        status: 500,
      }
    }
  },

  // Atualizar profissional
  async updateProfessional(
    id: string,
    professionalData: UpdateProfessionalRequest,
  ): Promise<ApiResponse<Professional>> {
    try {
      await apiDelay(600)

      const response = await fetch(`${API_BASE_URL}/Professional/${id}`, {
        method: "PUT",
        headers: createHeaders(),
        body: JSON.stringify(professionalData),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return {
            error: "Professional not found",
            status: 404,
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Professional = await response.json()

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      console.error("Failed to update professional:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to update professional",
        status: 500,
      }
    }
  },

  // Excluir profissional
  async deleteProfessional(id: string): Promise<ApiResponse<null>> {
    try {
      await apiDelay(400)

      const response = await fetch(`${API_BASE_URL}/Professional/${id}`, {
        method: "DELETE",
        headers: createHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return {
            error: "Professional not found",
            status: 404,
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return {
        status: response.status,
      }
    } catch (error) {
      console.error("Failed to delete professional:", error)
      return {
        error: error instanceof Error ? error.message : "Failed to delete professional",
        status: 500,
      }
    }
  },

  // Obter equipes disponíveis (para filtro)
  async getTeams(): Promise<ApiResponse<{ id: number; name: string }[]>> {
    try {
      await apiDelay(300)

      const response = await fetch(`${API_BASE_URL}/Team`, {
        method: "GET",
        headers: createHeaders(),
      })

      if (!response.ok) {
        console.error(`Teams API error: ${response.status}`)
        return {
          data: [],
          status: response.status,
        }
      }

      const data = await response.json()
      console.log("Teams API response:", data)

      // Verificar se a resposta tem a estrutura esperada
      let teams: { id: number; name: string }[] = []

      if (Array.isArray(data)) {
        // Se data é um array direto
        teams = data.map((team: any) => ({
          id: team.id,
          name: team.name,
        }))
      } else if (data.results && Array.isArray(data.results)) {
        // Se data tem uma propriedade results
        teams = data.results.map((team: any) => ({
          id: team.id,
          name: team.name,
        }))
      } else if (data.data && Array.isArray(data.data)) {
        // Se data tem uma propriedade data
        teams = data.data.map((team: any) => ({
          id: team.id,
          name: team.name,
        }))
      }

      return { data: teams, status: 200 }
    } catch (error) {
      console.error("Failed to fetch teams:", error)
      return {
        data: [],
        error: "Failed to fetch teams",
        status: 500,
      }
    }
  },

  // Obter empresas disponíveis (para filtro)
  async getCompanies(): Promise<ApiResponse<{ id: number; name: string }[]>> {
    try {
      await apiDelay(300)

      // Usar o endpoint correto: /Companies (plural)
      const response = await fetch(`${API_BASE_URL}/Companies`, {
        method: "GET",
        headers: createHeaders(),
      })

      if (!response.ok) {
        console.error(`Companies API error: ${response.status}`)
        return {
          data: [],
          status: response.status,
        }
      }

      const data = await response.json()
      console.log("Companies API response:", data)

      // A API retorna um array direto de empresas
      let companies: { id: number; name: string }[] = []

      if (Array.isArray(data)) {
        // Mapear os dados da empresa para o formato esperado
        companies = data.map((company: any) => ({
          id: company.id,
          name: company.name,
        }))
      }

      console.log("Mapped companies:", companies)
      return { data: companies, status: 200 }
    } catch (error) {
      console.error("Failed to fetch companies:", error)
      return {
        data: [],
        error: "Failed to fetch companies",
        status: 500,
      }
    }
  },

  // Obter agenda do profissional
  async getProfessionalSchedule(
    id: string,
    startDate: string,
    endDate: string,
  ): Promise<ApiResponse<{ date: string; appointments: any[] }[]>> {
    try {
      await apiDelay(700)

      // Simulação de agenda do profissional
      const schedule = [
        {
          date: "2023-06-05",
          appointments: [
            {
              id: "1",
              title: "House Cleaning",
              customer: "John Smith",
              address: "123 Main St",
              start: "09:00",
              end: "11:00",
              status: "completed",
            },
            {
              id: "2",
              title: "Office Cleaning",
              customer: "ABC Corp",
              address: "456 Business Ave",
              start: "13:00",
              end: "15:00",
              status: "completed",
            },
          ],
        },
        {
          date: "2023-06-06",
          appointments: [
            {
              id: "3",
              title: "Apartment Cleaning",
              customer: "Mary Johnson",
              address: "789 Residential Blvd",
              start: "10:00",
              end: "12:00",
              status: "scheduled",
            },
          ],
        },
        {
          date: "2023-06-07",
          appointments: [
            {
              id: "4",
              title: "Deep Cleaning",
              customer: "Robert Davis",
              address: "101 Clean St",
              start: "09:00",
              end: "13:00",
              status: "scheduled",
            },
            {
              id: "5",
              title: "Window Cleaning",
              customer: "Sarah Wilson",
              address: "202 Glass Ave",
              start: "14:30",
              end: "16:30",
              status: "scheduled",
            },
          ],
        },
      ]

      return { data: schedule, status: 200 }
    } catch (error) {
      console.error("Failed to fetch professional schedule:", error)
      return {
        error: "Failed to fetch professional schedule",
        status: 500,
      }
    }
  },
}
