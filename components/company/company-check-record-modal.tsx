"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createCheckRecord, getProfessionals, getCustomers, getTeams, getAppointments } from "@/lib/api/check-records"

interface CompanyCheckRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CompanyCheckRecordModal({ isOpen, onClose, onSuccess }: CompanyCheckRecordModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [professionals, setProfessionals] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])

  const [formData, setFormData] = useState({
    professionalId: "",
    customerId: "",
    appointmentId: "",
    address: "",
    teamId: "",
    serviceType: "",
    notes: "",
  })

  const { toast } = useToast()

  // Get company ID from localStorage or context
  const getCompanyId = () => {
    const userData = localStorage.getItem("noah_user")
    if (userData) {
      const user = JSON.parse(userData)
      return user.companyId || 1
    }
    return 1
  }

  const companyId = getCompanyId()

  // Load dropdown data
  useEffect(() => {
    if (isOpen) {
      loadDropdownData()
    }
  }, [isOpen])

  const loadDropdownData = async () => {
    try {
      const [professionalsData, customersData, teamsData, appointmentsData] = await Promise.all([
        getProfessionals(companyId),
        getCustomers(companyId),
        getTeams(companyId),
        getAppointments(companyId),
      ])

      setProfessionals(professionalsData)
      setCustomers(customersData)
      setTeams(teamsData)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error loading dropdown data:", error)
      toast({
        title: "Error",
        description: "Failed to load form data",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Find selected items to get names
      const selectedProfessional = professionals.find((p) => p.id.toString() === formData.professionalId)
      const selectedCustomer = customers.find((c) => c.id.toString() === formData.customerId)
      const selectedTeam = teams.find((t) => t.id.toString() === formData.teamId)

      await createCheckRecord({
        professionalId: Number.parseInt(formData.professionalId),
        professionalName: selectedProfessional?.name || "",
        companyId: companyId,
        customerId: Number.parseInt(formData.customerId),
        customerName: selectedCustomer?.name || "",
        appointmentId: Number.parseInt(formData.appointmentId),
        address: formData.address,
        teamId: formData.teamId ? Number.parseInt(formData.teamId) : undefined,
        teamName: selectedTeam?.name || "",
        serviceType: formData.serviceType,
        notes: formData.notes,
        status: 0, // Pending
      })

      toast({
        title: "Success",
        description: "Check record created successfully",
      })

      onSuccess()
      onClose()
      resetForm()
    } catch (error) {
      console.error("Error creating check record:", error)
      toast({
        title: "Error",
        description: "Failed to create check record",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      professionalId: "",
      customerId: "",
      appointmentId: "",
      address: "",
      teamId: "",
      serviceType: "",
      notes: "",
    })
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>Create Check Record</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new check record for professional tracking
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="professionalId">Professional *</Label>
                <Select
                  value={formData.professionalId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, professionalId: value }))}
                  required
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select professional" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    {professionals.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id.toString()}>
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
                  required
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="appointmentId">Appointment *</Label>
                <Select
                  value={formData.appointmentId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, appointmentId: value }))}
                  required
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select appointment" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    {appointments.map((appointment) => (
                      <SelectItem key={appointment.id} value={appointment.id.toString()}>
                        {appointment.title || `Appointment #${appointment.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="teamId">Team</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, teamId: value }))}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select team (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                placeholder="Enter service address"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Input
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) => setFormData((prev) => ({ ...prev, serviceType: e.target.value }))}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                placeholder="Enter service type"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
                className="bg-[#0f172a] border-[#2a3349] text-white resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
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
                  Creating...
                </>
              ) : (
                "Create Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
