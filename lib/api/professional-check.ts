import type { CheckRecord } from "@/types/check-record"
import { performCheckIn, performCheckOut, updateCheckRecord } from "@/lib/api/check-records"

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
    clientName: string
    address: string
    serviceType: string
    scheduledTime: string
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

// Mock data para desenvolvimento
const mockCurrentAppointment = {
  id: "app123",
  clientName: "Maria Silva",
  address: "Rua das Flores, 123 - Apartamento 45 - Centro",
  serviceType: "Limpeza Residencial",
  scheduledTime: "14:30 - 16:30",
  notes: "Apartamento no 3º andar. Tem um cachorro pequeno e amigável. Chaves com a portaria.",
}

// Obter o status atual do check para o profissional
export const getCurrentCheckStatus = async (professionalId: string): Promise<CurrentCheckStatus> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Em um app real, você buscaria o próximo agendamento e verificaria se há um check-record associado
  // Aqui estamos simulando um agendamento pendente
  return {
    appointmentId: mockCurrentAppointment.id,
    checkRecordId: null,
    status: "pending",
    appointmentDetails: mockCurrentAppointment,
  }
}

// Realizar check-in com foto
export const performCheckInWithPhoto = async (
  professionalId: string,
  appointmentId: string,
  data: {
    photoBase64: string
    notes?: string
    location: CheckLocation
  },
): Promise<CheckRecord> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Em um app real, você faria upload da foto para um serviço de armazenamento
  // e então criaria o registro de check-in com a URL da foto

  // Criar o check record
  const checkInData: Omit<CheckRecord, "id" | "createdAt" | "updatedAt" | "checkOutTime" | "status"> = {
    professionalId,
    professionalName: "Nome do Profissional", // Em um app real, você obteria isso do perfil
    companyId: "comp1", // Em um app real, você obteria isso do contexto
    customerId: "cust1", // Em um app real, você obteria isso do agendamento
    customerName: mockCurrentAppointment.clientName,
    appointmentId,
    address: mockCurrentAppointment.address,
    serviceType: mockCurrentAppointment.serviceType,
    notes: data.notes,
  }

  const checkRecord = await performCheckIn(checkInData)

  // Simular armazenamento da foto
  console.log("Photo stored:", data.photoBase64.substring(0, 50) + "...")
  console.log("Location stored:", data.location)

  return checkRecord
}

// Realizar check-out com foto
export const performCheckOutWithPhoto = async (
  checkRecordId: string,
  data: {
    photoBase64: string
    notes?: string
    location: CheckLocation
  },
): Promise<CheckRecord> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Em um app real, você faria upload da foto para um serviço de armazenamento
  // e então atualizaria o registro de check-out com a URL da foto

  // Realizar o check-out
  const checkRecord = await performCheckOut(checkRecordId)

  // Atualizar as notas se fornecidas
  if (data.notes) {
    await updateCheckRecord(checkRecordId, { notes: data.notes })
  }

  // Simular armazenamento da foto
  console.log("Photo stored:", data.photoBase64.substring(0, 50) + "...")
  console.log("Location stored:", data.location)

  return checkRecord
}

// Obter histórico de checks do profissional
export const getProfessionalCheckHistory = async (
  professionalId: string,
  filters?: {
    startDate?: string
    endDate?: string
    status?: "checked_in" | "checked_out"
    limit?: number
    offset?: number
  },
): Promise<CheckRecord[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data - em um app real, você buscaria do backend
  return [
    {
      id: "check1",
      professionalId,
      professionalName: "Nome do Profissional",
      companyId: "comp1",
      customerId: "cust1",
      customerName: "Maria Silva",
      appointmentId: "app1",
      address: "Rua das Flores, 123 - Centro",
      teamId: "team1",
      teamName: "Equipe A",
      checkInTime: "2023-05-15T14:32:00Z",
      checkOutTime: "2023-05-15T16:45:00Z",
      status: "checked_out",
      serviceType: "Limpeza Residencial",
      notes: "Serviço concluído com sucesso",
      createdAt: "2023-05-15T14:30:00Z",
      updatedAt: "2023-05-15T16:45:00Z",
    },
    {
      id: "check2",
      professionalId,
      professionalName: "Nome do Profissional",
      companyId: "comp1",
      customerId: "cust2",
      customerName: "João Pereira",
      appointmentId: "app2",
      address: "Av. Principal, 456 - Sala 302",
      teamId: "team1",
      teamName: "Equipe A",
      checkInTime: "2023-05-14T09:05:00Z",
      checkOutTime: "2023-05-14T11:30:00Z",
      status: "checked_out",
      serviceType: "Limpeza Comercial",
      notes: "Cliente muito satisfeito",
      createdAt: "2023-05-14T09:00:00Z",
      updatedAt: "2023-05-14T11:30:00Z",
    },
  ]
}

// Obter fotos de um check específico
export const getCheckPhotos = async (checkRecordId: string): Promise<CheckPhoto[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data - em um app real, você buscaria do backend
  return [
    {
      id: "photo1",
      checkRecordId,
      photoUrl: "/placeholder.svg?height=300&width=400&query=before cleaning",
      photoType: "check_in",
      createdAt: "2023-05-15T14:32:00Z",
    },
    {
      id: "photo2",
      checkRecordId,
      photoUrl: "/placeholder.svg?height=300&width=400&query=after cleaning",
      photoType: "check_out",
      createdAt: "2023-05-15T16:45:00Z",
    },
  ]
}

// Verificar a localização em relação ao endereço do agendamento
export const verifyLocation = async (
  appointmentId: string,
  currentLocation: { latitude: number; longitude: number },
): Promise<{ isNearby: boolean; distance: number; accuracy: number }> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Em um app real, você usaria um serviço de geocodificação para verificar a distância
  // entre a localização atual e o endereço do agendamento

  // Simulando uma verificação de proximidade
  const randomDistance = Math.random() * 200 // 0-200 metros
  const isNearby = randomDistance < 100 // Consideramos "próximo" se estiver a menos de 100m

  return {
    isNearby,
    distance: randomDistance,
    accuracy: 15 + Math.random() * 20, // Precisão simulada entre 15-35m
  }
}
