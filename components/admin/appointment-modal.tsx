"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Interfaces baseadas na estrutura real da API
interface Company {
  id: number
  name: string
  cnpj: string
  responsible: string
  email: string
  phone: string
  planId: number
  status: number
  createdDate: string
  updatedDate: string
}

interface Customer {
  id: number
  name: string
  document: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  observations: string
  status: number
  companyId: number
  company: Company
  createdDate: string
  updatedDate: string
}

interface Team {
  id: number
  name: string
  region: string
  description: string
  rating: number
  completedServices: number
  status: number
  companyId: number
  company: Company
  leaderId: number
  leader: any
  createdDate: string
  updatedDate: string
}

interface Professional {
  id: number
  name: string
  cpf: string
  email: string
  phone: string
  teamId: number
  companyId: number
  status: string
  rating: number | null
  completedServices: number | null
  createdAt: string
  updatedAt: string
}

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  appointment?: any
}

export function AppointmentModal({ isOpen, onClose, onSubmit, appointment }: AppointmentModalProps) {
  // Estados para os dados
  const [companies, setCompanies] = useState<Company[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])

  // Estados de loading
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [loadingProfessionals, setLoadingProfessionals] = useState(false)

  // Estados do formulário
  const [title, setTitle] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedProfessional, setSelectedProfessional] = useState("")
  const [type, setType] = useState("0") // 0 = Regular
  const [status, setStatus] = useState("0") // 0 = Scheduled
  const [startDate, setStartDate] = useState<Date>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")

  // Função para obter o token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("noah_token") || localStorage.getItem("token") || localStorage.getItem("authToken")
    }
    return null
  }

  // Função para fazer chamadas à API
  const apiCall = async (endpoint: string) => {
    const token = getAuthToken()
    const response = await fetch(`https://localhost:44394${endpoint}`, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Carregar companies
  const loadCompanies = async () => {
    try {
      setLoadingCompanies(true)
      const data = await apiCall("/api/Companies")
      console.log("Companies response:", data)
      setCompanies(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading companies:", error)
      setCompanies([])
    } finally {
      setLoadingCompanies(false)
    }
  }

  // Carregar customers
  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const data = await apiCall("/api/Customer")
      console.log("Customers response:", data)
      setCustomers(data.results || [])
    } catch (error) {
      console.error("Error loading customers:", error)
      setCustomers([])
    } finally {
      setLoadingCustomers(false)
    }
  }

  // Carregar teams
  const loadTeams = async () => {
    try {
      setLoadingTeams(true)
      const data = await apiCall("/api/Team?page=1&pageSize=100&status=all")
      console.log("Teams response:", data)
      setTeams(data.results || [])
    } catch (error) {
      console.error("Error loading teams:", error)
      setTeams([])
    } finally {
      setLoadingTeams(false)
    }
  }

  // Carregar professionals
  const loadProfessionals = async () => {
    try {
      setLoadingProfessionals(true)
      const data = await apiCall("/api/Professional")
      console.log("Professionals response:", data)
      setProfessionals(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading professionals:", error)
      setProfessionals([])
    } finally {
      setLoadingProfessionals(false)
    }
  }

  // Carregar todos os dados quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      loadCompanies()
      loadCustomers()
      loadTeams()
      loadProfessionals()
    }
  }, [isOpen])

  // Resetar formulário quando fechar
  useEffect(() => {
    if (!isOpen) {
      setTitle("")
      setSelectedCompany("")
      setSelectedCustomer("")
      setSelectedTeam("")
      setSelectedProfessional("")
      setType("0")
      setStatus("0")
      setStartDate(undefined)
      setStartTime("")
      setEndTime("")
      setAddress("") // Limpar endereço também
      setNotes("")
    }
  }, [isOpen])

  // Preencher endereço automaticamente quando selecionar cliente
  useEffect(() => {
    if (selectedCustomer && customers.length > 0) {
      const selectedCustomerData = customers.find((customer) => customer.id.toString() === selectedCustomer)
      if (selectedCustomerData && selectedCustomerData.address) {
        setAddress(selectedCustomerData.address)
      }
    }
  }, [selectedCustomer, customers])

  // Preencher dados quando editando
  useEffect(() => {
    if (appointment && isOpen) {
      setTitle(appointment.title || "")
      setSelectedCompany(appointment.companyId?.toString() || "")
      setSelectedCustomer(appointment.customerId?.toString() || "")
      setSelectedTeam(appointment.teamId?.toString() || "")
      setSelectedProfessional(appointment.professionalId?.toString() || "")
      setType(appointment.type?.toString() || "0")
      setStatus(appointment.status?.toString() || "0")
      setAddress(appointment.address || "")
      setNotes(appointment.notes || "")

      if (appointment.start) {
        const startDateTime = new Date(appointment.start)
        setStartDate(startDateTime)
        setStartTime(format(startDateTime, "HH:mm"))
      }

      if (appointment.end) {
        const endDateTime = new Date(appointment.end)
        setEndTime(format(endDateTime, "HH:mm"))
      }
    }
  }, [appointment, isOpen])

  // Filtrar dados baseado na empresa selecionada
  const filteredCustomers = customers.filter(
    (customer) => !selectedCompany || customer.companyId.toString() === selectedCompany,
  )

  const filteredTeams = teams.filter((team) => !selectedCompany || team.companyId.toString() === selectedCompany)

  const filteredProfessionals = professionals.filter(
    (professional) => !selectedCompany || professional.companyId.toString() === selectedCompany,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !title ||
      !selectedCompany ||
      !selectedCustomer ||
      !selectedTeam ||
      !selectedProfessional ||
      !startDate ||
      !startTime ||
      !endTime ||
      !address
    ) {
      alert("Please fill in all required fields")
      return
    }

    // Criar as datas de início e fim
    const startDateTime = new Date(startDate)
    const [startHour, startMinute] = startTime.split(":")
    startDateTime.setHours(Number.parseInt(startHour), Number.parseInt(startMinute), 0, 0)

    const endDateTime = new Date(startDate)
    const [endHour, endMinute] = endTime.split(":")
    endDateTime.setHours(Number.parseInt(endHour), Number.parseInt(endMinute), 0, 0)

    const appointmentData = {
      title,
      address,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      companyId: Number.parseInt(selectedCompany),
      customerId: Number.parseInt(selectedCustomer),
      teamId: Number.parseInt(selectedTeam),
      professionalId: Number.parseInt(selectedProfessional),
      status: Number.parseInt(status),
      type: Number.parseInt(type),
      notes,
    }

    console.log("Submitting appointment data:", appointmentData)
    onSubmit(appointmentData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a2234] border-[#2a3349] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {appointment && appointment.id ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the information to schedule a new appointment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter appointment title"
              className="bg-[#0f172a] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-white">
                Company *
              </Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder={loadingCompanies ? "Loading..." : "Select company"} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Customer */}
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-white">
                Customer *
              </Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder={loadingCustomers ? "Loading..." : "Select customer"} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {filteredCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Team */}
            <div className="space-y-2">
              <Label htmlFor="team" className="text-white">
                Team *
              </Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder={loadingTeams ? "Loading..." : "Select team"} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {filteredTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Professional */}
            <div className="space-y-2">
              <Label htmlFor="professional" className="text-white">
                Professional *
              </Label>
              <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder={loadingProfessionals ? "Loading..." : "Select professional"} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {filteredProfessionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id.toString()}>
                      {professional.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white">
                Type *
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="0">Regular</SelectItem>
                  <SelectItem value="1">Deep Cleaning</SelectItem>
                  <SelectItem value="2">Specialized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="0">Scheduled</SelectItem>
                  <SelectItem value="1">In Progress</SelectItem>
                  <SelectItem value="2">Completed</SelectItem>
                  <SelectItem value="3">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-white">Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-[#0f172a] border-[#2a3349] text-white hover:bg-[#2a3349]",
                      !startDate && "text-gray-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1a2234] border-[#2a3349]">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-white">
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
                required
              />
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-white">
                End Time *
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-white">
              Address *
            </Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter the service address"
              className="bg-[#0f172a] border-[#2a3349] text-white focus-visible:ring-[#06b6d4] resize-none"
              rows={3}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or special instructions"
              className="bg-[#0f172a] border-[#2a3349] text-white focus-visible:ring-[#06b6d4] resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              {appointment && appointment.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
