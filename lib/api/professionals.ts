import type { ApiResponse, Professional, PaginatedResponse } from "@/types"
import { apiDelay } from "./utils"

// Dados mock para profissionais
const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "Maria Silva",
    cpf: "123.456.789-00",
    email: "maria.silva@noah.com",
    phone: "(11) 98765-4321",
    status: "active",
    teamId: "1",
    companyId: "1",
    rating: 4.8,
    completedServices: 156,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Ana Santos",
    cpf: "987.654.321-00",
    email: "ana.santos@noah.com",
    phone: "(11) 91234-5678",
    status: "active",
    teamId: "2",
    companyId: "1",
    rating: 4.9,
    completedServices: 203,
    createdAt: "2023-02-20T14:45:00Z",
    updatedAt: "2023-02-20T14:45:00Z",
  },
  {
    id: "3",
    name: "Carla Oliveira",
    cpf: "456.789.012-34",
    email: "carla.oliveira@noah.com",
    phone: "(11) 94567-8901",
    status: "inactive",
    teamId: "1",
    companyId: "2",
    rating: 4.7,
    completedServices: 98,
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
  {
    id: "4",
    name: "Patricia Costa",
    cpf: "345.678.901-23",
    email: "patricia.costa@noah.com",
    phone: "(11) 93456-7890",
    status: "active",
    teamId: "3",
    companyId: "3",
    rating: 4.6,
    completedServices: 124,
    createdAt: "2023-04-05T11:20:00Z",
    updatedAt: "2023-04-05T11:20:00Z",
  },
  {
    id: "5",
    name: "Fernanda Lima",
    cpf: "567.890.123-45",
    email: "fernanda.lima@noah.com",
    phone: "(11) 95678-9012",
    status: "active",
    teamId: "2",
    companyId: "1",
    rating: 5.0,
    completedServices: 178,
    createdAt: "2023-05-12T16:30:00Z",
    updatedAt: "2023-05-12T16:30:00Z",
  },
]

// Dados adicionais para profissionais
interface ProfessionalExtendedData {
  id: string
  shift: "morning" | "afternoon" | "night"
  weeklyHours: number
  photo?: string
  observations?: string
}

const mockProfessionalExtendedData: ProfessionalExtendedData[] = [
  {
    id: "1",
    shift: "morning",
    weeklyHours: 40,
    photo: "",
    observations: "Excellent professional, always punctual",
  },
  {
    id: "2",
    shift: "afternoon",
    weeklyHours: 40,
    photo: "",
    observations: "",
  },
  {
    id: "3",
    shift: "morning",
    weeklyHours: 30,
    photo: "",
    observations: "On maternity leave until next month",
  },
  {
    id: "4",
    shift: "night",
    weeklyHours: 36,
    photo: "",
    observations: "",
  },
  {
    id: "5",
    shift: "afternoon",
    weeklyHours: 40,
    photo: "",
    observations: "Specialized in deep cleaning",
  },
]

// Dados de performance para profissionais
interface ProfessionalPerformance {
  id: string
  punctuality: number
  quality: number
  customerSatisfaction: number
  attendance: number
}

const mockProfessionalPerformance: ProfessionalPerformance[] = [
  {
    id: "1",
    punctuality: 95,
    quality: 92,
    customerSatisfaction: 98,
    attendance: 96,
  },
  {
    id: "2",
    punctuality: 98,
    quality: 97,
    customerSatisfaction: 99,
    attendance: 95,
  },
  {
    id: "3",
    punctuality: 90,
    quality: 93,
    customerSatisfaction: 94,
    attendance: 88,
  },
  {
    id: "4",
    punctuality: 92,
    quality: 90,
    customerSatisfaction: 93,
    attendance: 94,
  },
  {
    id: "5",
    punctuality: 99,
    quality: 98,
    customerSatisfaction: 100,
    attendance: 97,
  },
]

// Dados de serviços recentes para profissionais
interface RecentService {
  id: string
  professionalId: string
  date: string
  time: string
  customer: string
  address: string
  rating: number
}

const mockRecentServices: RecentService[] = [
  {
    id: "1",
    professionalId: "1",
    date: "2023-06-05",
    time: "09:00 AM",
    customer: "John Smith",
    address: "123 Main St",
    rating: 5,
  },
  {
    id: "2",
    professionalId: "1",
    date: "2023-06-04",
    time: "02:00 PM",
    customer: "Mary Johnson",
    address: "456 Oak Ave",
    rating: 5,
  },
  {
    id: "3",
    professionalId: "1",
    date: "2023-06-03",
    time: "10:30 AM",
    customer: "Charles Brown",
    address: "789 Pine St",
    rating: 4,
  },
  {
    id: "4",
    professionalId: "2",
    date: "2023-06-05",
    time: "11:00 AM",
    customer: "Alice Williams",
    address: "321 Elm St",
    rating: 5,
  },
  {
    id: "5",
    professionalId: "2",
    date: "2023-06-04",
    time: "03:30 PM",
    customer: "Robert Davis",
    address: "654 Maple Ave",
    rating: 5,
  },
]

// Tipo para profissional com dados completos
export interface ProfessionalWithDetails extends Professional {
  shift: "morning" | "afternoon" | "night"
  weeklyHours: number
  photo?: string
  observations?: string
  performance?: {
    punctuality: number
    quality: number
    customerSatisfaction: number
    attendance: number
  }
  recentServices?: RecentService[]
  teamName?: string
}

// API de Profissionais
export const professionalsApi = {
  // Listar profissionais (com paginação e filtros)
  async getProfessionals(
    page = 1,
    limit = 10,
    status?: string,
    teamId?: string,
    search?: string,
    companyId?: string,
  ): Promise<ApiResponse<PaginatedResponse<Professional>>> {
    try {
      await apiDelay(800)

      // Filtrar profissionais com base nos parâmetros
      let filteredProfessionals = [...mockProfessionals]

      // Filtrar por companyId se fornecido
      if (companyId) {
        filteredProfessionals = filteredProfessionals.filter((professional) => professional.companyId === companyId)
      }

      // Filtrar por status
      if (status && status !== "all") {
        filteredProfessionals = filteredProfessionals.filter((professional) => professional.status === status)
      }

      // Filtrar por equipe
      if (teamId && teamId !== "all") {
        filteredProfessionals = filteredProfessionals.filter((professional) => professional.teamId === teamId)
      }

      // Filtrar por termo de busca (nome, CPF ou email)
      if (search) {
        const searchLower = search.toLowerCase()
        filteredProfessionals = filteredProfessionals.filter(
          (professional) =>
            professional.name.toLowerCase().includes(searchLower) ||
            professional.cpf.includes(search) ||
            professional.email.toLowerCase().includes(searchLower),
        )
      }

      // Calcular paginação
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProfessionals = filteredProfessionals.slice(startIndex, endIndex)

      const paginatedResponse: PaginatedResponse<Professional> = {
        data: paginatedProfessionals,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(filteredProfessionals.length / limit),
          totalItems: filteredProfessionals.length,
          itemsPerPage: limit,
        },
      }

      return { data: paginatedResponse, status: 200 }
    } catch (error) {
      console.error("Failed to fetch professionals:", error)
      return {
        error: "Failed to fetch professionals",
        status: 500,
      }
    }
  },

  // Obter profissional por ID (com detalhes completos)
  async getProfessionalById(id: string): Promise<ApiResponse<ProfessionalWithDetails>> {
    try {
      await apiDelay(500)

      const professional = mockProfessionals.find((p) => p.id === id)

      if (!professional) {
        return {
          error: "Professional not found",
          status: 404,
        }
      }

      // Obter dados estendidos
      const extendedData = mockProfessionalExtendedData.find((p) => p.id === id)
      const performance = mockProfessionalPerformance.find((p) => p.id === id)
      const recentServices = mockRecentServices.filter((s) => s.professionalId === id)

      const professionalWithDetails: ProfessionalWithDetails = {
        ...professional,
        shift: extendedData?.shift || "morning",
        weeklyHours: extendedData?.weeklyHours || 40,
        photo: extendedData?.photo || "",
        observations: extendedData?.observations || "",
        performance: performance
          ? {
              punctuality: performance.punctuality,
              quality: performance.quality,
              customerSatisfaction: performance.customerSatisfaction,
              attendance: performance.attendance,
            }
          : undefined,
        recentServices: recentServices,
        teamName: professional.teamId === "1" ? "Team Alpha" : professional.teamId === "2" ? "Team Beta" : "Team Gamma",
      }

      return { data: professionalWithDetails, status: 200 }
    } catch (error) {
      console.error("Failed to fetch professional:", error)
      return {
        error: "Failed to fetch professional",
        status: 500,
      }
    }
  },

  // Criar novo profissional
  async createProfessional(
    professionalData: Omit<ProfessionalWithDetails, "id" | "createdAt" | "updatedAt" | "rating" | "completedServices">,
  ): Promise<ApiResponse<Professional>> {
    try {
      await apiDelay(1000)

      // Extrair dados básicos do profissional
      const { shift, weeklyHours, photo, observations, performance, recentServices, teamName, ...basicData } =
        professionalData

      // Simulação de criação de profissional
      const newProfessional: Professional = {
        id: Math.random().toString(36).substring(2, 9),
        ...basicData,
        rating: 0,
        completedServices: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Em uma implementação real, o profissional seria adicionado ao banco de dados
      // mockProfessionals.push(newProfessional);

      // Também seriam salvos os dados estendidos
      // mockProfessionalExtendedData.push({
      //   id: newProfessional.id,
      //   shift,
      //   weeklyHours,
      //   photo,
      //   observations,
      // });

      return { data: newProfessional, status: 201 }
    } catch (error) {
      console.error("Failed to create professional:", error)
      return {
        error: "Failed to create professional",
        status: 500,
      }
    }
  },

  // Atualizar profissional
  async updateProfessional(
    id: string,
    professionalData: Partial<ProfessionalWithDetails>,
  ): Promise<ApiResponse<Professional>> {
    try {
      await apiDelay(700)

      const professionalIndex = mockProfessionals.findIndex((p) => p.id === id)

      if (professionalIndex === -1) {
        return {
          error: "Professional not found",
          status: 404,
        }
      }

      // Extrair dados básicos do profissional
      const { shift, weeklyHours, photo, observations, performance, recentServices, teamName, ...basicData } =
        professionalData

      // Simulação de atualização de profissional
      const updatedProfessional: Professional = {
        ...mockProfessionals[professionalIndex],
        ...basicData,
        updatedAt: new Date().toISOString(),
      }

      // Em uma implementação real, o profissional seria atualizado no banco de dados
      // mockProfessionals[professionalIndex] = updatedProfessional;

      // Também seriam atualizados os dados estendidos
      // const extendedDataIndex = mockProfessionalExtendedData.findIndex((p) => p.id === id);
      // if (extendedDataIndex !== -1 && (shift || weeklyHours !== undefined || photo !== undefined || observations !== undefined)) {
      //   mockProfessionalExtendedData[extendedDataIndex] = {
      //     ...mockProfessionalExtendedData[extendedDataIndex],
      //     ...(shift && { shift }),
      //     ...(weeklyHours !== undefined && { weeklyHours }),
      //     ...(photo !== undefined && { photo }),
      //     ...(observations !== undefined && { observations }),
      //   };
      // }

      return { data: updatedProfessional, status: 200 }
    } catch (error) {
      console.error("Failed to update professional:", error)
      return {
        error: "Failed to update professional",
        status: 500,
      }
    }
  },

  // Excluir profissional
  async deleteProfessional(id: string): Promise<ApiResponse<null>> {
    try {
      await apiDelay(600)

      const professionalIndex = mockProfessionals.findIndex((p) => p.id === id)

      if (professionalIndex === -1) {
        return {
          error: "Professional not found",
          status: 404,
        }
      }

      // Em uma implementação real, o profissional seria removido do banco de dados
      // mockProfessionals.splice(professionalIndex, 1);

      // Também seriam removidos os dados estendidos
      // const extendedDataIndex = mockProfessionalExtendedData.findIndex((p) => p.id === id);
      // if (extendedDataIndex !== -1) {
      //   mockProfessionalExtendedData.splice(extendedDataIndex, 1);
      // }

      // E os dados de performance
      // const performanceIndex = mockProfessionalPerformance.findIndex((p) => p.id === id);
      // if (performanceIndex !== -1) {
      //   mockProfessionalPerformance.splice(performanceIndex, 1);
      // }

      return { status: 204 }
    } catch (error) {
      console.error("Failed to delete professional:", error)
      return {
        error: "Failed to delete professional",
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

  // Obter equipes disponíveis (para filtro)
  async getTeams(): Promise<ApiResponse<{ id: string; name: string }[]>> {
    try {
      await apiDelay(300)

      const teams = [
        { id: "1", name: "Team Alpha" },
        { id: "2", name: "Team Beta" },
        { id: "3", name: "Team Gamma" },
      ]

      return { data: teams, status: 200 }
    } catch (error) {
      console.error("Failed to fetch teams:", error)
      return {
        error: "Failed to fetch teams",
        status: 500,
      }
    }
  },
}
