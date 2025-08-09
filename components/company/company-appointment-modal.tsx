"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/types/appointment"
import type { Customer } from "@/types/customer"
import type { Team } from "@/types/team"
import type { Professional } from "@/types/professional"
import { apiRequest } from "@/lib/api/utils"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface CompanyAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  appointment?: Appointment | null
}

export function CompanyAppointmentModal({ isOpen, onClose, onSubmit, appointment }: CompanyAppointmentModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    customerId: "",
    teamId: "",
    professionalId: "",
    type: 1,
    status: 1,
    address: "",
    notes: "",
  })

  // Date and time states
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("11:00")

  // Data for dropdowns
  const [customers, setCustomers] = useState<Customer[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])

  // Load dropdown data
  useEffect(() => {
    if (isOpen && user?.companyId) {
      loadDropdownData()
    }
  }, [isOpen, user?.companyId])

  const loadDropdownData = async () => {
    if (!user?.companyId) return

    setIsLoadingData(true)
    try {
      // Load customers - usando o endpoint correto
      const customersResponse = await apiRequest(`/Customer`)
      if (customersResponse?.results) {
        // Filtrar apenas os customers da empresa do usuário
        const companyCustomers = customersResponse.results.filter(
          (customer: Customer) => customer.companyId === user.companyId,
        )
        setCustomers(companyCustomers)
      }

      // Load teams
      const teamsResponse = await apiRequest(`/Team`)
      if (teamsResponse?.results) {
        // Filtrar apenas os teams da empresa do usuário
        const companyTeams = teamsResponse.results.filter((team: Team) => team.companyId === user.companyId)
        setTeams(companyTeams)
      }

      // Load professionals
      const professionalsResponse = await apiRequest(`/Professional`)
      if (professionalsResponse?.results) {
        // Filtrar apenas os professionals da empresa do usuário
        const companyProfessionals = professionalsResponse.results.filter(
          (professional: Professional) => professional.companyId === user.companyId,
        )
        setProfessionals(companyProfessionals)
      }
    } catch (error) {
      console.error("Error loading dropdown data:", error)
      toast({
        title: "Error",
        description: "Failed to load form data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  // Auto-fill address when customer is selected
  useEffect(() => {
    if (formData.customerId && customers.length > 0) {
      const selectedCustomer = customers.find((customer) => customer.id.toString() === formData.customerId)
      if (selectedCustomer && selectedCustomer.address) {
        setFormData((prev) => ({
          ...prev,
          address: selectedCustomer.address || "",
        }))
      }
    }
  }, [formData.customerId, customers])

  // Initialize form data
  useEffect(() => {
    if (appointment) {
      const start = new Date(appointment.start)
      const end = new Date(appointment.end)

      setFormData({
        title: appointment.title || "",
        customerId: appointment.customerId?.toString() || "",
        teamId: appointment.teamId?.toString() || "",
        professionalId: appointment.professionalId?.toString() || "",
        type: appointment.type || 1,
        status: appointment.status || 1,
        address: appointment.address || "",
        notes: appointment.notes || "",
      })

      setStartDate(start)
      setEndDate(end)
      setStartTime(format(start, "HH:mm"))
      setEndTime(format(end, "HH:mm"))
    } else {
      // Reset form for new appointment
      const now = new Date()
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000)

      setFormData({
        title: "",
        customerId: "",
        teamId: "",
        professionalId: "",
        type: 1,
        status: 1,
        address: "",
        notes: "",
      })

      setStartDate(now)
      setEndDate(now)
      setStartTime("09:00")
      setEndTime("11:00")
    }
  }, [appointment, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select start and end dates.",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the appointment.",
        variant: "destructive",
      })
      return
    }

    if (!formData.address.trim()) {
      toast({
        title: "Error",
        description: "Please enter an address for the appointment.",
        variant: "destructive",
      })
      return
    }

    if (!formData.customerId) {
      toast({
        title: "Error",
        description: "Please select a customer.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Combine date and time
      const startDateTime = new Date(startDate)
      const endDateTime = new Date(endDate)

      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      startDateTime.setHours(startHour, startMinute, 0, 0)
      endDateTime.setHours(endHour, endMinute, 0, 0)

      // Validate end time is after start time
      if (endDateTime <= startDateTime) {
        toast({
          title: "Error",
          description: "End time must be after start time.",
          variant: "destructive",
        })
        return
      }

      // Format data exactly as the API expects
      const submitData = {
        title: formData.title.trim(),
        address: formData.address.trim(),
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        companyId: user?.companyId,
        customerId: Number.parseInt(formData.customerId),
        teamId: formData.teamId && formData.teamId !== "none" ? Number.parseInt(formData.teamId) : null,
        professionalId:
          formData.professionalId && formData.professionalId !== "none"
            ? Number.parseInt(formData.professionalId)
            : null,
        status: formData.status,
        type: formData.type,
        notes: formData.notes.trim() || null,
      }

      // Call the API directly instead of using onSubmit callback
      const response = await apiRequest("/Appointment", {
        method: "POST",
        body: JSON.stringify(submitData),
      })

      // Show success message
      toast({
        title: "Success",
        description: appointment ? "Appointment updated successfully!" : "Appointment created successfully!",
        variant: "default",
      })

      // Close modal and refresh data
      onClose()

      // Call onSubmit to refresh the parent component data
      if (onSubmit) {
        onSubmit(submitData)
      }
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

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a2234] border-[#2a3349] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {appointment ? "Edit Appointment" : "Create New Appointment"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#06b6d4]" />
            <span className="ml-2 text-gray-400">Loading form data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]"
                  placeholder="Enter appointment title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]"
                  placeholder="Enter service address"
                  required
                />
              </div>
            </div>

            {/* Customer Selection */}
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-sm font-medium">
                Customer <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => setFormData({ ...formData, customerId: value })}
              >
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team and Professional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team" className="text-sm font-medium">
                  Team (Optional)
                </Label>
                <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="none">No team assigned</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name} - {team.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="professional" className="text-sm font-medium">
                  Professional (Optional)
                </Label>
                <Select
                  value={formData.professionalId}
                  onValueChange={(value) => setFormData({ ...formData, professionalId: value })}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]">
                    <SelectValue placeholder="Select a professional" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="none">No professional assigned</SelectItem>
                    {professionals.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id.toString()}>
                        {professional.name} - {professional.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Service Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Service Type
                </Label>
                <Select
                  value={formData.type.toString()}
                  onValueChange={(value) => setFormData({ ...formData, type: Number.parseInt(value) })}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="0">Residential</SelectItem>
                    <SelectItem value="1">Commercial</SelectItem>
                    <SelectItem value="2">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status.toString()}
                  onValueChange={(value) => setFormData({ ...formData, status: Number.parseInt(value) })}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]">
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

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Start Date & Time <span className="text-red-400">*</span>
                </Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal bg-[#0f172a] border-[#2a3349] text-white hover:bg-[#1a2234] focus:border-[#06b6d4]",
                          !startDate && "text-gray-400",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM dd, yyyy") : "Pick a date"}
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
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-24 bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  End Date & Time <span className="text-red-400">*</span>
                </Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal bg-[#0f172a] border-[#2a3349] text-white hover:bg-[#1a2234] focus:border-[#06b6d4]",
                          !endDate && "text-gray-400",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1a2234] border-[#2a3349]">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-24 bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4] resize-none"
                rows={3}
                placeholder="Add any additional notes or special instructions..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-[#2a3349] text-white bg-transparent hover:bg-[#2a3349]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#06b6d4] hover:bg-[#0891b2] text-white min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {appointment ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{appointment ? "Update Appointment" : "Create Appointment"}</>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
