"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getProfessionals, getCompanies, getCustomers, getTeams, getAppointments } from "@/lib/api/check-records"

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  checkIn?: any
}

export function CheckInModal({ isOpen, onClose, onSubmit, checkIn }: CheckInModalProps) {
  const [formData, setFormData] = useState({
    professionalId: "",
    professionalName: "",
    companyId: "",
    customerId: "",
    customerName: "",
    appointmentId: "",
    address: "",
    teamId: "",
    teamName: "",
    checkInTime: null as Date | null,
    checkOutTime: null as Date | null,
    serviceType: "",
    notes: "",
  })

  const [professionals, setProfessionals] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [loadingStates, setLoadingStates] = useState({
    professionals: false,
    companies: false,
    customers: false,
    teams: false,
    appointments: false,
  })

  useEffect(() => {
    if (isOpen) {
      loadDropdownData()
      if (checkIn) {
        setFormData({
          professionalId: checkIn.professionalId?.toString() || "",
          professionalName: checkIn.professionalName || "",
          companyId: checkIn.companyId?.toString() || "",
          customerId: checkIn.customerId?.toString() || "",
          customerName: checkIn.customerName || "",
          appointmentId: checkIn.appointmentId?.toString() || "",
          address: checkIn.address || "",
          teamId: checkIn.teamId?.toString() || "",
          teamName: checkIn.teamName || "",
          checkInTime: checkIn.checkInTime ? new Date(checkIn.checkInTime) : null,
          checkOutTime: checkIn.checkOutTime ? new Date(checkIn.checkOutTime) : null,
          serviceType: checkIn.serviceType || "",
          notes: checkIn.notes || "",
        })
      } else {
        setFormData({
          professionalId: "",
          professionalName: "",
          companyId: "",
          customerId: "",
          customerName: "",
          appointmentId: "",
          address: "",
          teamId: "",
          teamName: "",
          checkInTime: null,
          checkOutTime: null,
          serviceType: "",
          notes: "",
        })
      }
    }
  }, [isOpen, checkIn])

  const loadDropdownData = async () => {
    setIsLoading(true)
    try {
      console.log("Loading dropdown data...")

      const [professionalsData, companiesData, customersData, teamsData, appointmentsData] = await Promise.allSettled([
        getProfessionals(),
        getCompanies(),
        getCustomers(),
        getTeams(),
        getAppointments(),
      ])

      // Handle professionals
      if (professionalsData.status === "fulfilled") {
        console.log("Professionals loaded:", professionalsData.value)
        setProfessionals(professionalsData.value)
      } else {
        console.error("Error loading professionals:", professionalsData.reason)
        setProfessionals([])
      }

      // Handle companies
      if (companiesData.status === "fulfilled") {
        console.log("Companies loaded:", companiesData.value)
        setCompanies(companiesData.value)
      } else {
        console.error("Error loading companies:", companiesData.reason)
        setCompanies([])
      }

      // Handle customers
      if (customersData.status === "fulfilled") {
        console.log("Customers loaded:", customersData.value)
        setCustomers(customersData.value)
      } else {
        console.error("Error loading customers:", customersData.reason)
        setCustomers([])
      }

      // Handle teams
      if (teamsData.status === "fulfilled") {
        console.log("Teams loaded:", teamsData.value)
        setTeams(teamsData.value)
      } else {
        console.error("Error loading teams:", teamsData.reason)
        setTeams([])
      }

      // Handle appointments
      if (appointmentsData.status === "fulfilled") {
        console.log("Appointments loaded:", appointmentsData.value)
        setAppointments(appointmentsData.value)
      } else {
        console.error("Error loading appointments:", appointmentsData.reason)
        setAppointments([])
      }
    } catch (error) {
      console.error("Error loading dropdown data:", error)
      setProfessionals([])
      setCompanies([])
      setCustomers([])
      setTeams([])
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      professionalId: Number.parseInt(formData.professionalId),
      professionalName: formData.professionalName,
      companyId: Number.parseInt(formData.companyId),
      customerId: Number.parseInt(formData.customerId),
      customerName: formData.customerName,
      appointmentId: Number.parseInt(formData.appointmentId),
      address: formData.address,
      teamId: Number.parseInt(formData.teamId),
      teamName: formData.teamName,
      checkInTime: formData.checkInTime?.toISOString() || null,
      checkOutTime: formData.checkOutTime?.toISOString() || null,
      serviceType: formData.serviceType,
      notes: formData.notes,
    }

    onSubmit(submitData)
  }

  const handleProfessionalChange = (value: string) => {
    const professional = professionals.find((p) => p.id.toString() === value)
    setFormData({
      ...formData,
      professionalId: value,
      professionalName: professional ? professional.name : "",
    })
  }

  const handleCustomerChange = (value: string) => {
    const customer = customers.find((c) => c.id.toString() === value)
    setFormData({
      ...formData,
      customerId: value,
      customerName: customer ? customer.name : "",
      address: customer ? customer.address : "",
    })
  }

  const handleTeamChange = (value: string) => {
    const team = teams.find((t) => t.id.toString() === value)
    setFormData({
      ...formData,
      teamId: value,
      teamName: team ? team.name : "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a2234] border-[#2a3349] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{checkIn ? "Edit Check-in Record" : "New Check-in Record"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {checkIn ? "Update the check-in record details." : "Create a new check-in record for tracking."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professional">Professional *</Label>
              <Select value={formData.professionalId} onValueChange={handleProfessionalChange} disabled={isLoading}>
                <SelectTrigger className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder={isLoading ? "Loading professionals..." : "Select professional"} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {professionals.length === 0 && !isLoading ? (
                    <SelectItem value="" disabled>
                      No professionals available
                    </SelectItem>
                  ) : (
                    professionals.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id.toString()}>
                        {professional.name ||
                          professional.firstName + " " + professional.lastName ||
                          `Professional ${professional.id}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder={isLoading ? "Loading companies..." : "Select company"} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {companies.length === 0 && !isLoading ? (
                    <SelectItem value="" disabled>
                      No companies available
                    </SelectItem>
                  ) : (
                    companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name || company.companyName || `Company ${company.id}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select value={formData.customerId} onValueChange={handleCustomerChange} disabled={isLoading}>
                <SelectTrigger className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment">Appointment</Label>
              <Select
                value={formData.appointmentId}
                onValueChange={(value) => setFormData({ ...formData, appointmentId: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select appointment" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {appointments.map((appointment) => (
                    <SelectItem key={appointment.id} value={appointment.id.toString()}>
                      {appointment.title || `Appointment ${appointment.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Select value={formData.teamId} onValueChange={handleTeamChange} disabled={isLoading}>
                <SelectTrigger className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Input
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
                placeholder="Enter service type"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
              placeholder="Enter address"
            />
          </div>

          {checkIn && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[#1a2234] border-[#2a3349] text-white hover:bg-[#2a3349]",
                        !formData.checkInTime && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkInTime ? format(formData.checkInTime, "PPP HH:mm") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1a2234] border-[#2a3349]" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.checkInTime || undefined}
                      onSelect={(date) => setFormData({ ...formData, checkInTime: date || null })}
                      initialFocus
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Check-out Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[#1a2234] border-[#2a3349] text-white hover:bg-[#2a3349]",
                        !formData.checkOutTime && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkOutTime ? format(formData.checkOutTime, "PPP HH:mm") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1a2234] border-[#2a3349]" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.checkOutTime || undefined}
                      onSelect={(date) => setFormData({ ...formData, checkOutTime: date || null })}
                      initialFocus
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white" disabled={isLoading}>
              {checkIn ? "Update" : "Create"} Check-in
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
