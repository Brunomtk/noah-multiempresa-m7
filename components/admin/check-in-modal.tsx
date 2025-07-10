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
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  checkIn?: any
}

export function CheckInModal({ isOpen, onClose, onSubmit, checkIn }: CheckInModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    professional: "",
    professionalId: "",
    company: "",
    customer: "",
    address: "",
    team: "",
    checkInTime: "",
    checkInTimeDate: "",
    checkOutTime: "",
    checkOutTimeDate: "",
    status: "pending",
    serviceType: "regular",
    notes: "",
  })

  useEffect(() => {
    if (checkIn) {
      setFormData({
        professional: checkIn.professional || "",
        professionalId: checkIn.professionalId || "",
        company: checkIn.company || "",
        customer: checkIn.customer || "",
        address: checkIn.address || "",
        team: checkIn.team || "",
        checkInTimeDate: checkIn.checkInTime ? format(checkIn.checkInTime, "yyyy-MM-dd") : "",
        checkInTime: checkIn.checkInTime ? format(checkIn.checkInTime, "HH:mm") : "",
        checkOutTimeDate: checkIn.checkOutTime ? format(checkIn.checkOutTime, "yyyy-MM-dd") : "",
        checkOutTime: checkIn.checkOutTime ? format(checkIn.checkOutTime, "HH:mm") : "",
        status: checkIn.status || "pending",
        serviceType: checkIn.serviceType || "regular",
        notes: checkIn.notes || "",
      })
    } else {
      const now = new Date()

      setFormData({
        professional: "",
        professionalId: "",
        company: "",
        customer: "",
        address: "",
        team: "",
        checkInTimeDate: format(now, "yyyy-MM-dd"),
        checkInTime: format(now, "HH:mm"),
        checkOutTimeDate: "",
        checkOutTime: "",
        status: "pending",
        serviceType: "regular",
        notes: "",
      })
    }
  }, [checkIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Convert form data to check-in object
    let checkInTime = null
    if (formData.checkInTimeDate && formData.checkInTime) {
      checkInTime = new Date(`${formData.checkInTimeDate}T${formData.checkInTime}`)
    }

    let checkOutTime = null
    if (formData.checkOutTimeDate && formData.checkOutTime) {
      checkOutTime = new Date(`${formData.checkOutTimeDate}T${formData.checkOutTime}`)
    }

    // Determine status based on check-in/check-out times
    let status = formData.status
    if (checkInTime && !checkOutTime) {
      status = "in_progress"
    } else if (checkInTime && checkOutTime) {
      status = "completed"
    } else if (!checkInTime) {
      status = "pending"
    }

    const checkInData = {
      professional: formData.professional,
      professionalId: formData.professionalId,
      company: formData.company,
      customer: formData.customer,
      address: formData.address,
      team: formData.team,
      checkInTime,
      checkOutTime,
      status,
      serviceType: formData.serviceType,
      notes: formData.notes,
    }

    onSubmit(checkInData)
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Sample professionals for the dropdown
  const professionals = [
    { name: "Maria Silva", id: "MS001" },
    { name: "João Santos", id: "JS002" },
    { name: "Ana Oliveira", id: "AO003" },
    { name: "Carlos Mendes", id: "CM004" },
    { name: "Patricia Costa", id: "PC005" },
    { name: "Roberto Alves", id: "RA006" },
    { name: "Fernanda Lima", id: "FL007" },
  ]

  // Sample companies for the dropdown
  const companies = [
    "Tech Solutions Ltd",
    "ABC Consulting",
    "XYZ Commerce",
    "Delta Industries",
    "Omega Services",
    "Global Tech",
    "Innovate Inc",
  ]

  // Sample customers for the dropdown
  const customers = [
    "Tech Solutions Ltd",
    "ABC Consulting",
    "XYZ Commerce",
    "Delta Industries",
    "Omega Services",
    "Global Tech",
    "Innovate Inc",
  ]

  // Sample teams for the dropdown
  const teams = ["Team Alpha", "Team Beta", "Team Gamma"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{checkIn ? "Edit Check-in Record" : "New Check-in Record"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {checkIn
              ? "Update the check-in/check-out information below."
              : "Fill in the information to register a new check-in."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="professional">Professional</Label>
              <Select
                value={formData.professional}
                onValueChange={(value) => {
                  const professional = professionals.find((p) => p.name === value)
                  handleChange("professional", value)
                  if (professional) {
                    handleChange("professionalId", professional.id)
                  }
                }}
              >
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a professional" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                  {professionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.name} className="hover:bg-[#2a3349]">
                      {professional.name} ({professional.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="professionalId">Professional ID</Label>
              <Input
                id="professionalId"
                value={formData.professionalId}
                onChange={(e) => handleChange("professionalId", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                disabled
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Select value={formData.company} onValueChange={(value) => handleChange("company", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                  {companies.map((company) => (
                    <SelectItem key={company} value={company} className="hover:bg-[#2a3349]">
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={formData.customer} onValueChange={(value) => handleChange("customer", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                  {customers.map((customer) => (
                    <SelectItem key={customer} value={customer} className="hover:bg-[#2a3349]">
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Service Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                placeholder="Full address where the service is performed"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="team">Team</Label>
              <Select value={formData.team} onValueChange={(value) => handleChange("team", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {teams.map((team) => (
                    <SelectItem key={team} value={team} className="hover:bg-[#2a3349]">
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkInTimeDate">Check-in Date</Label>
                <Input
                  id="checkInTimeDate"
                  type="date"
                  value={formData.checkInTimeDate}
                  onChange={(e) => handleChange("checkInTimeDate", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => handleChange("checkInTime", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkOutTimeDate">Check-out Date</Label>
                <Input
                  id="checkOutTimeDate"
                  type="date"
                  value={formData.checkOutTimeDate}
                  onChange={(e) => handleChange("checkOutTimeDate", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => handleChange("checkOutTime", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleChange("serviceType", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="regular" className="hover:bg-[#2a3349]">
                      Regular Cleaning
                    </SelectItem>
                    <SelectItem value="deep" className="hover:bg-[#2a3349]">
                      Deep Cleaning
                    </SelectItem>
                    <SelectItem value="specialized" className="hover:bg-[#2a3349]">
                      Specialized Service
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="pending" className="hover:bg-[#2a3349]">
                      Pending
                    </SelectItem>
                    <SelectItem value="in_progress" className="hover:bg-[#2a3349]">
                      In Progress
                    </SelectItem>
                    <SelectItem value="completed" className="hover:bg-[#2a3349]">
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white min-h-[80px]"
                placeholder="Additional information about the check-in/check-out"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
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
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
