import { apiRequest } from "./utils"
import type { CheckRecord } from "@/types/check-record"

// Interface para foto de check
export interface CheckPhoto {
  id: string
  checkRecordId: string
  photoUrl: string
  photoType: "check_in" | "check_out"
  createdAt: string
}

// Interface para localização
export interface CheckLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: string
  address?: string
  distance?: number
}

// Interface para o status do check atual
export interface CurrentCheckStatus {
  appointmentId: string | null
  checkRecordId: string | null
  status: "pending" | "checked_in" | "checked_out" | "no_appointment"
  appointmentDetails?: {
    id: string
    title: string
    address: string
    start: string
    end: string
    customerName: string
    serviceType: string
    notes?: string
  } | null
  checkInTime?: string
  checkOutTime?: string
  checkInPhoto?: string
  checkOutPhoto?: string
  checkInNotes?: string
  checkOutNotes?: string
  location?: CheckLocation
}

// Interface para filtros de check records
export interface CheckRecordFilters {
  professionalId?: number
  companyId?: number
  customerId?: number
  teamId?: number
  appointmentId?: number
  status?: string
  serviceType?: string
  startDate?: string
  endDate?: string
  search?: string
  pageNumber?: number
  pageSize?: number
}

// Interface para resposta paginada
export interface CheckRecordResponse {
  results: CheckRecord[]
  currentPage: number
  pageCount: number
  pageSize: number
  totalItems: number
  firstRowOnPage: number
  lastRowOnPage: number
}

// Obter check records do profissional
export const getProfessionalCheckRecords = async (
  professionalId: number,
  filters?: CheckRecordFilters,
): Promise<CheckRecordResponse> => {
  try {
    const params = new URLSearchParams()

    // Sempre filtrar pelo profissional
    params.append("professionalId", professionalId.toString())

    if (filters?.companyId) params.append("companyId", filters.companyId.toString())
    if (filters?.customerId) params.append("customerId", filters.customerId.toString())
    if (filters?.teamId) params.append("teamId", filters.teamId.toString())
    if (filters?.appointmentId) params.append("appointmentId", filters.appointmentId.toString())
    if (filters?.status) params.append("status", filters.status)
    if (filters?.serviceType) params.append("serviceType", filters.serviceType)
    if (filters?.startDate) params.append("startDate", filters.startDate)
    if (filters?.endDate) params.append("endDate", filters.endDate)
    if (filters?.search) params.append("search", filters.search)
    if (filters?.pageNumber) params.append("pageNumber", filters.pageNumber.toString())
    if (filters?.pageSize) params.append("pageSize", filters.pageSize.toString())

    const queryString = params.toString()
    const url = queryString ? `/CheckRecord?${queryString}` : "/CheckRecord"

    const response = await apiRequest(url)
    return response
  } catch (error) {
    console.error("Error fetching professional check records:", error)
    throw error
  }
}

// Obter agendamentos do profissional
export const getProfessionalAppointments = async (professionalId: number): Promise<any[]> => {
  try {
    const params = new URLSearchParams()
    params.append("professionalId", professionalId.toString())

    const response = await apiRequest(`/Appointment?${params.toString()}`)
    return response.results || []
  } catch (error) {
    console.error("Error fetching professional appointments:", error)
    throw error
  }
}

// Obter o status atual do check para o profissional
export const getCurrentCheckStatus = async (professionalId: number): Promise<CurrentCheckStatus> => {
  try {
    // Primeiro, buscar check records do profissional para hoje
    const today = new Date().toISOString().split("T")[0]
    const checkRecords = await getProfessionalCheckRecords(professionalId, {
      startDate: today,
      endDate: today,
      pageSize: 10,
    })

    if (checkRecords.results.length === 0) {
      return {
        appointmentId: null,
        checkRecordId: null,
        status: "no_appointment",
        appointmentDetails: null,
      }
    }

    // Pegar o primeiro check record (mais recente)
    const checkRecord = checkRecords.results[0]

    // Buscar detalhes do agendamento
    const appointments = await getProfessionalAppointments(professionalId)
    const appointment = appointments.find((apt) => apt.id === checkRecord.appointmentId)

    // Determinar o status baseado nos tempos de check
    let status: "pending" | "checked_in" | "checked_out" = "pending"
    if (checkRecord.checkInTime && !checkRecord.checkOutTime) {
      status = "checked_in"
    } else if (checkRecord.checkInTime && checkRecord.checkOutTime) {
      status = "checked_out"
    }

    return {
      appointmentId: checkRecord.appointmentId.toString(),
      checkRecordId: checkRecord.id.toString(),
      status,
      appointmentDetails: appointment
        ? {
            id: appointment.id.toString(),
            title: appointment.title || checkRecord.serviceType,
            address: checkRecord.address,
            start: appointment.start || new Date().toISOString(),
            end: appointment.end || new Date().toISOString(),
            customerName: checkRecord.customerName || "Customer",
            serviceType: checkRecord.serviceType,
            notes: appointment.notes || checkRecord.notes,
          }
        : {
            id: checkRecord.appointmentId.toString(),
            title: checkRecord.serviceType,
            address: checkRecord.address,
            start: new Date().toISOString(),
            end: new Date().toISOString(),
            customerName: checkRecord.customerName || "Customer",
            serviceType: checkRecord.serviceType,
            notes: checkRecord.notes,
          },
      checkInTime: checkRecord.checkInTime,
      checkOutTime: checkRecord.checkOutTime,
      checkInNotes: checkRecord.notes,
    }
  } catch (error) {
    console.error("Error getting current check status:", error)
    throw error
  }
}

// Realizar check-in
export const performCheckInWithPhoto = async (
  professionalId: number,
  appointmentId: number,
  data: {
    photoBase64?: string
    notes?: string
    location?: CheckLocation
  },
): Promise<CheckRecord> => {
  try {
    // Buscar dados do agendamento
    const appointments = await getProfessionalAppointments(professionalId)
    const appointment = appointments.find((apt) => apt.id === appointmentId)

    if (!appointment) {
      throw new Error("Agendamento não encontrado")
    }

    const checkInData = {
      professionalId,
      professionalName: appointment.professional?.name || "Profissional",
      companyId: appointment.companyId,
      customerId: appointment.customerId,
      customerName: appointment.customer?.name || "Cliente",
      appointmentId,
      address: appointment.address,
      teamId: appointment.teamId,
      teamName: appointment.team?.name || "Equipe",
      serviceType: appointment.title,
      notes: data.notes || "",
    }

    const response = await apiRequest("/CheckRecord/check-in", {
      method: "POST",
      body: JSON.stringify(checkInData),
    })

    return response
  } catch (error) {
    console.error("Error performing check-in:", error)
    throw error
  }
}

// Realizar check-out
export const performCheckOutWithPhoto = async (
  checkRecordId: number,
  data: {
    photoBase64?: string
    notes?: string
    location?: CheckLocation
  },
): Promise<CheckRecord> => {
  try {
    const response = await apiRequest(`/CheckRecord/check-out/${checkRecordId}`, {
      method: "POST",
      body: "",
    })

    // Se há notas adicionais, atualizar o registro
    if (data.notes) {
      // Buscar o registro atual
      const currentRecord = await apiRequest(`/CheckRecord/${checkRecordId}`)

      // Atualizar com as novas notas
      const updateData = {
        ...currentRecord,
        notes: data.notes,
      }

      await apiRequest(`/CheckRecord/${checkRecordId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      })
    }

    return response
  } catch (error) {
    console.error("Error performing check-out:", error)
    throw error
  }
}

// Obter histórico de checks do profissional
export const getProfessionalCheckHistory = async (
  professionalId: number,
  filters?: {
    startDate?: string
    endDate?: string
    status?: "checked_in" | "checked_out"
    limit?: number
    offset?: number
  },
): Promise<CheckRecord[]> => {
  try {
    const checkFilters: CheckRecordFilters = {
      professionalId,
      pageSize: filters?.limit || 50,
      pageNumber: filters?.offset ? Math.floor(filters.offset / (filters.limit || 50)) + 1 : 1,
    }

    if (filters?.startDate) checkFilters.startDate = filters.startDate
    if (filters?.endDate) checkFilters.endDate = filters.endDate
    if (filters?.status) {
      checkFilters.status = filters.status === "checked_in" ? "1" : "2"
    }

    const response = await getProfessionalCheckRecords(professionalId, checkFilters)
    return response.results
  } catch (error) {
    console.error("Error fetching professional check history:", error)
    throw error
  }
}

// Obter fotos de um check específico (mock - não implementado na API)
export const getCheckPhotos = async (checkRecordId: string): Promise<CheckPhoto[]> => {
  // Mock data - em um app real, você buscaria do backend
  return [
    {
      id: "photo1",
      checkRecordId,
      photoUrl: "/placeholder.svg?height=300&width=400",
      photoType: "check_in",
      createdAt: new Date().toISOString(),
    },
    {
      id: "photo2",
      checkRecordId,
      photoUrl: "/placeholder.svg?height=300&width=400",
      photoType: "check_out",
      createdAt: new Date().toISOString(),
    },
  ]
}

// Verificar a localização em relação ao endereço do agendamento (mock)
export const verifyLocation = async (
  appointmentId: number,
  currentLocation: { latitude: number; longitude: number },
): Promise<{ isNearby: boolean; distance: number; accuracy: number }> => {
  // Simulando uma verificação de proximidade
  const randomDistance = Math.random() * 200 // 0-200 metros
  const isNearby = randomDistance < 100 // Consideramos "próximo" se estiver a menos de 100m

  return {
    isNearby,
    distance: randomDistance,
    accuracy: 15 + Math.random() * 20, // Precisão simulada entre 15-35m
  }
}
