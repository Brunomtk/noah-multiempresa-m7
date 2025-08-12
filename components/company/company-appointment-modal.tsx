"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"
import type { Appointment } from "@/types/appointment"
import type { Customer } from "@/types/customer"
import type { Team } from "@/types/team"
import type { Professional } from "@/types/professional"
import { apiRequest } from "@/lib/api/utils"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CompanyCheckRecordModal } from "@/components/company/company-check-record-modal"

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

  const [createCheckRecord, setCreateCheckRecord] = useState(false)
  const [isCheckRecordModalOpen, setIsCheckRecordModalOpen] = useState(false)
  const [createdAppointment, setCreatedAppointment] = useState<any>(null)

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

  const [date, setDate] = useState<Date>()
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
      const [customersResponse, teamsResponse, professionalsResponse] = await Promise.all([
        apiRequest(`/Customer?CompanyId=${user.companyId}&PageSize=100`),
        apiRequest(`/Team?CompanyId=${user.companyId}&PageSize=100`),
        apiRequest(`/Professional?CompanyId=${user.companyId}&PageSize=100`),
      ])

      // Handle paginated response format
      setCustomers(customersResponse?.results || customersResponse || [])
      setTeams(teamsResponse?.results || teamsResponse || [])
      setProfessionals(professionalsResponse?.results || professionalsResponse || [])
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        // Editing existing appointment
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

        if (appointment.start) {
          const startDateTime = new Date(appointment.start)
          setDate(startDateTime)
          setStartTime(format(startDateTime, "HH:mm"))
        }

        if (appointment.end) {
          const endDateTime = new Date(appointment.end)
          setEndTime(format(endDateTime, "HH:mm"))
        }
      } else {
        // Creating new appointment
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

        // Set default dates if provided in appointment prop
        if (appointment?.start) {
          setDate(new Date(appointment.start))
          setStartTime(format(new Date(appointment.start), "HH:mm"))
        } else {
          setDate(undefined)
          setStartTime("09:00")
        }

        if (appointment?.end) {
          setEndTime(format(new Date(appointment.end), "HH:mm"))
        } else {
          setEndTime("11:00")
        }
      }
      setCreateCheckRecord(false)
    }
  }, [isOpen, appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date for the appointment.",
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
      const startDateTime = new Date(date)
      const endDateTime = new Date(date)

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
        method: appointment?.id ? "PUT" : "POST",
        body: JSON.stringify(appointment?.id ? { ...submitData, id: appointment.id } : submitData),
      })

      // Show success message
      toast({
        title: "Success",
        description: appointment ? "Appointment updated successfully!" : "Appointment created successfully!",
        variant: "default",
      })

      if (createCheckRecord && !appointment?.id) {
        // Store the created appointment data for check record creation
        setCreatedAppointment({
          ...response,
          ...submitData,
          customer: customers.find((c) => c.id.toString() === formData.customerId),
          professional: professionals.find((p) => p.id.toString() === formData.professionalId),
          team: teams.find((t) => t.id.toString() === formData.teamId),
        })

        // Close appointment modal and open check record modal
        onClose()
        setIsCheckRecordModalOpen(true)
      } else {
        // Close modal normally
        onClose()
      }

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
    onClose()
  }

  const handleCheckRecordModalClose = () => {
    setIsCheckRecordModalOpen(false)
    setCreatedAppointment(null)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
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
                  <Select
                    value={formData.teamId}
                    onValueChange={(value) => setFormData({ ...formData, teamId: value })}
                  >
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

              {/* Type and Status */}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Date <span className="text-red-400">*</span>
                  </Label>
                  <DatePicker
                    date={date}
                    onDateChange={setDate}
                    placeholder="Pick appointment date"
                    className="bg-[#0f172a] border-[#2a3349] text-white hover:bg-[#1a2234] focus:border-[#06b6d4]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Start Time <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    End Time <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4]"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-[#0f172a] border-[#2a3349] text-white focus:border-[#06b6d4] min-h-[80px]"
                  placeholder="Enter any additional notes"
                />
              </div>

              {/* Check Record Option */}
              {!appointment?.id && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createCheckRecord"
                    checked={createCheckRecord}
                    onCheckedChange={setCreateCheckRecord}
                    className="border-[#2a3349] data-[state=checked]:bg-[#06b6d4] data-[state=checked]:border-[#06b6d4]"
                  />
                  <Label htmlFor="createCheckRecord" className="text-sm font-medium cursor-pointer">
                    Also create a check record for this appointment
                  </Label>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Appointment"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Check Record Modal */}
      <CompanyCheckRecordModal
        isOpen={isCheckRecordModalOpen}
        onClose={handleCheckRecordModalClose}
        prefilledData={
          createdAppointment
            ? {
                appointmentId: createdAppointment.id?.toString() || "",
                customerId: createdAppointment.customerId?.toString() || "",
                address: createdAppointment.address || "",
                professionalId: createdAppointment.professionalId?.toString() || "",
              }
            : undefined
        }
      />
    </>
  )
}
