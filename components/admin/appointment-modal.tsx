"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { getApiUrl } from "@/lib/api/utils"
import { useToast } from "@/hooks/use-toast"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  appointment?: any
}

export function AppointmentModal({ isOpen, onClose, onSubmit, appointment }: AppointmentModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [professionals, setProfessionals] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    companyId: "",
    customerId: "",
    teamId: "",
    professionalId: "",
    type: "",
    status: "0",
    date: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    notes: "",
  })

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("noah_token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const url = `${getApiUrl()}/${endpoint}`
    console.log("Making API call to:", url)

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen])

  useEffect(() => {
    if (appointment) {
      const startDate =
        appointment.start && appointment.start !== "0001-01-01T00:00:00" ? new Date(appointment.start) : undefined
      const endDate =
        appointment.end && appointment.end !== "0001-01-01T00:00:00" ? new Date(appointment.end) : undefined

      setFormData({
        title: appointment.title || "",
        address: appointment.address || "",
        companyId: appointment.companyId?.toString() || "",
        customerId: appointment.customerId?.toString() || "",
        teamId: appointment.teamId?.toString() || "none",
        professionalId: appointment.professionalId?.toString() || "none",
        type: appointment.type?.toString() || "",
        status: appointment.status?.toString() || "0",
        date: startDate,
        startTime: startDate ? format(startDate, "HH:mm") : "",
        endTime: endDate ? format(endDate, "HH:mm") : "",
        notes: appointment.notes || "",
      })
    } else {
      setFormData({
        title: "",
        address: "",
        companyId: "",
        customerId: "",
        teamId: "none",
        professionalId: "none",
        type: "",
        status: "0",
        date: undefined,
        startTime: "",
        endTime: "",
        notes: "",
      })
    }
  }, [appointment])

  const loadInitialData = async () => {
    setLoadingData(true)
    try {
      const [companiesData, customersData, teamsData, professionalsData] = await Promise.all([
        apiCall("Companies"),
        apiCall("Customer"),
        apiCall("Team"),
        apiCall("Professional"),
      ])

      setCompanies(companiesData.results || companiesData || [])
      setCustomers(customersData.results || customersData || [])
      setTeams(teamsData.results || teamsData || [])
      setProfessionals(professionalsData.results || professionalsData || [])
    } catch (error) {
      console.error("Error loading initial data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.date) {
        toast({
          title: "Error",
          description: "Please select a date for the appointment.",
          variant: "destructive",
        })
        return
      }

      if (!formData.startTime || !formData.endTime) {
        toast({
          title: "Error",
          description: "Please select start and end times.",
          variant: "destructive",
        })
        return
      }

      let startDateTime = ""
      let endDateTime = ""

      if (formData.date && formData.startTime) {
        const [hours, minutes] = formData.startTime.split(":")
        const start = new Date(formData.date)
        start.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
        startDateTime = start.toISOString()
      }

      if (formData.date && formData.endTime) {
        const [hours, minutes] = formData.endTime.split(":")
        const end = new Date(formData.date)
        end.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
        endDateTime = end.toISOString()

        const startTime = new Date(startDateTime)
        const endTime = new Date(endDateTime)
        if (endTime <= startTime) {
          toast({
            title: "Error",
            description: "End time must be after start time.",
            variant: "destructive",
          })
          return
        }
      }

      const appointmentData = {
        title: formData.title,
        address: formData.address,
        start: startDateTime,
        end: endDateTime,
        companyId: Number.parseInt(formData.companyId),
        customerId: Number.parseInt(formData.customerId),
        teamId: formData.teamId && formData.teamId !== "none" ? Number.parseInt(formData.teamId) : null,
        professionalId:
          formData.professionalId && formData.professionalId !== "none"
            ? Number.parseInt(formData.professionalId)
            : null,
        status: Number.parseInt(formData.status),
        type: Number.parseInt(formData.type),
        notes: formData.notes,
      }

      await onSubmit(appointmentData)

      toast({
        title: "Success",
        description: appointment ? "Appointment updated successfully!" : "Appointment created successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error("Error submitting appointment:", error)
      toast({
        title: "Error",
        description: "Failed to save appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment ? "Edit Appointment" : "New Appointment"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {appointment
              ? "Update the appointment information below."
              : "Fill in the information to create a new appointment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  placeholder="Enter appointment title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Service Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="0" className="hover:bg-[#2a3349]">
                      Residential
                    </SelectItem>
                    <SelectItem value="1" className="hover:bg-[#2a3349]">
                      Commercial
                    </SelectItem>
                    <SelectItem value="2" className="hover:bg-[#2a3349]">
                      Industrial
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                placeholder="Enter service address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => handleChange("companyId", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder={loadingData ? "Loading..." : "Select a company"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()} className="hover:bg-[#2a3349]">
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => handleChange("customerId", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder={loadingData ? "Loading..." : "Select a customer"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()} className="hover:bg-[#2a3349]">
                        {customer.name || customer.customerName || `Customer #${customer.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="team">Team (Optional)</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => handleChange("teamId", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder={loadingData ? "Loading..." : "Select a team"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    <SelectItem value="none" className="hover:bg-[#2a3349]">
                      No team
                    </SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()} className="hover:bg-[#2a3349]">
                        {team.name || `Team #${team.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="professional">Professional (Optional)</Label>
                <Select
                  value={formData.professionalId}
                  onValueChange={(value) => handleChange("professionalId", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder={loadingData ? "Loading..." : "Select a professional"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    <SelectItem value="none" className="hover:bg-[#2a3349]">
                      No professional
                    </SelectItem>
                    {professionals.map((professional) => (
                      <SelectItem
                        key={professional.id}
                        value={professional.id.toString()}
                        className="hover:bg-[#2a3349]"
                      >
                        {professional.name || professional.professionalName || `Professional #${professional.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <DatePicker
                  date={formData.date}
                  onDateChange={(date) => handleChange("date", date)}
                  placeholder="Pick appointment date"
                  className="bg-[#0f172a] border-[#2a3349] text-white hover:bg-[#2a3349]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="0" className="hover:bg-[#2a3349]">
                    Scheduled
                  </SelectItem>
                  <SelectItem value="1" className="hover:bg-[#2a3349]">
                    In Progress
                  </SelectItem>
                  <SelectItem value="2" className="hover:bg-[#2a3349]">
                    Completed
                  </SelectItem>
                  <SelectItem value="3" className="hover:bg-[#2a3349]">
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white min-h-[80px]"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || loadingData}
              className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
