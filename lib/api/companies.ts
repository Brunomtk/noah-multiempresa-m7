import type { ApiResponse, Company, PaginatedResponse } from "@/types"
import { apiDelay } from "./utils"

// Dados mock para empresas
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Tech Solutions Ltd",
    cnpj: "12.345.678/0001-90",
    responsible: "John Smith",
    email: "contact@techsolutions.com",
    phone: "(11) 98765-4321",
    status: "active",
    planId: "1",
    planName: "Professional",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "ABC Consulting",
    cnpj: "98.765.432/0001-10",
    responsible: "Mary Johnson",
    email: "contact@abcconsulting.com",
    phone: "(11) 91234-5678",
    status: "active",
    planId: "2",
    planName: "Basic",
    createdAt: "2023-02-20T14:45:00Z",
    updatedAt: "2023-02-20T14:45:00Z",
  },
  {
    id: "3",
    name: "XYZ Commerce",
    cnpj: "45.678.901/0001-23",
    responsible: "Charles Brown",
    email: "contact@xyzcommerce.com",
    phone: "(11) 94567-8901",
    status: "inactive",
    planId: "3",
    planName: "Premium",
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
  {
    id: "4",
    name: "Delta Industries",
    cnpj: "34.567.890/0001-12",
    responsible: "Anna Davis",
    email: "contact@deltaindustries.com",
    phone: "(11) 93456-7890",
    status: "active",
    planId: "1",
    planName: "Professional",
    createdAt: "2023-04-05T11:20:00Z",
    updatedAt: "2023-04-05T11:20:00Z",
  },
  {
    id: "5",
    name: "Omega Services",
    cnpj: "56.789.012/0001-34",
    responsible: "Robert Wilson",
    email: "contact@omegaservices.com",
    phone: "(11) 95678-9012",
    status: "active",
    planId: "3",
    planName: "Premium",
    createdAt: "2023-05-12T16:30:00Z",
    updatedAt: "2023-05-12T16:30:00Z",
  },
]

// API de Empresas
export const companiesApi = {
  // Listar empresas (com paginação e filtros)
  async getCompanies(
    page = 1,
    limit = 10,
    status?: string,
    search?: string,
  ): Promise<ApiResponse<PaginatedResponse<Company>>> {
    try {
      await apiDelay(800)

      // Filtrar empresas com base nos parâmetros
      let filteredCompanies = [...mockCompanies]

      // Filtrar por status
      if (status && status !== "all") {
        filteredCompanies = filteredCompanies.filter((company) => company.status === status)
      }

      // Filtrar por termo de busca (nome ou CNPJ)
      if (search) {
        const searchLower = search.toLowerCase()
        filteredCompanies = filteredCompanies.filter(
          (company) => company.name.toLowerCase().includes(searchLower) || company.cnpj.includes(search),
        )
      }

      // Calcular paginação
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex)

      const paginatedResponse: PaginatedResponse<Company> = {
        data: paginatedCompanies,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(filteredCompanies.length / limit),
          totalItems: filteredCompanies.length,
          itemsPerPage: limit,
        },
      }

      return { data: paginatedResponse, status: 200 }
    } catch (error) {
      console.error("Failed to fetch companies:", error)
      return {
        error: "Failed to fetch companies",
        status: 500,
      }
    }
  },

  // Obter empresa por ID
  async getCompanyById(id: string): Promise<ApiResponse<Company>> {
    try {
      await apiDelay(500)

      const company = mockCompanies.find((c) => c.id === id)

      if (!company) {
        return {
          error: "Company not found",
          status: 404,
        }
      }

      return { data: company, status: 200 }
    } catch (error) {
      console.error("Failed to fetch company:", error)
      return {
        error: "Failed to fetch company",
        status: 500,
      }
    }
  },

  // Criar nova empresa
  async createCompany(companyData: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Company>> {
    try {
      await apiDelay(1000)

      // Simulação de criação de empresa
      const newCompany: Company = {
        id: Math.random().toString(36).substring(2, 9),
        ...companyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Em uma implementação real, a empresa seria adicionada ao banco de dados
      // mockCompanies.push(newCompany);

      return { data: newCompany, status: 201 }
    } catch (error) {
      console.error("Failed to create company:", error)
      return {
        error: "Failed to create company",
        status: 500,
      }
    }
  },

  // Atualizar empresa
  async updateCompany(id: string, companyData: Partial<Company>): Promise<ApiResponse<Company>> {
    try {
      await apiDelay(700)

      const companyIndex = mockCompanies.findIndex((c) => c.id === id)

      if (companyIndex === -1) {
        return {
          error: "Company not found",
          status: 404,
        }
      }

      // Simulação de atualização de empresa
      const updatedCompany: Company = {
        ...mockCompanies[companyIndex],
        ...companyData,
        updatedAt: new Date().toISOString(),
      }

      // Em uma implementação real, a empresa seria atualizada no banco de dados
      // mockCompanies[companyIndex] = updatedCompany;

      return { data: updatedCompany, status: 200 }
    } catch (error) {
      console.error("Failed to update company:", error)
      return {
        error: "Failed to update company",
        status: 500,
      }
    }
  },

  // Excluir empresa
  async deleteCompany(id: string): Promise<ApiResponse<null>> {
    try {
      await apiDelay(600)

      const companyIndex = mockCompanies.findIndex((c) => c.id === id)

      if (companyIndex === -1) {
        return {
          error: "Company not found",
          status: 404,
        }
      }

      // Em uma implementação real, a empresa seria removida do banco de dados
      // mockCompanies.splice(companyIndex, 1);

      return { status: 204 }
    } catch (error) {
      console.error("Failed to delete company:", error)
      return {
        error: "Failed to delete company",
        status: 500,
      }
    }
  },

  // Alterar status da empresa (ativar/desativar)
  async updateCompanyStatus(id: string, status: "active" | "inactive"): Promise<ApiResponse<Company>> {
    try {
      await apiDelay(500)

      const companyIndex = mockCompanies.findIndex((c) => c.id === id)

      if (companyIndex === -1) {
        return {
          error: "Company not found",
          status: 404,
        }
      }

      // Simulação de atualização de status
      const updatedCompany: Company = {
        ...mockCompanies[companyIndex],
        status,
        updatedAt: new Date().toISOString(),
      }

      // Em uma implementação real, o status seria atualizado no banco de dados
      // mockCompanies[companyIndex] = updatedCompany;

      return { data: updatedCompany, status: 200 }
    } catch (error) {
      console.error("Failed to update company status:", error)
      return {
        error: "Failed to update company status",
        status: 500,
      }
    }
  },
}
