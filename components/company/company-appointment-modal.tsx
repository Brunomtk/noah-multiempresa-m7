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

interface CompanyAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  appointment?: any
}

export function CompanyAppointmentModal({ isOpen, onClose, onSubmit, appointment }: CompanyAppointmentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    customer: "",
    address: "",
    team: "",
    start: "",
    startTime: "",
    end: "",
    endTime: "",
    status: "scheduled",
    type: "regular",
    notes: "",
  })

  useEffect(() => {
    if (appointment) {
      if (appointment.start && appointment.end) {
        setFormData({
          title: appointment.title || "",
          customer: appointment.customer || "",
          address: appointment.address || "",
          team: appointment.team || "",
          start: format(new Date(appointment.start), "yyyy-MM-dd"),
          startTime: format(new Date(appointment.start), "HH:mm"),
          end: format(new Date(appointment.end), "yyyy-MM-dd"),
          endTime: format(new Date(appointment.end), "HH:mm"),
          status: appointment.status || "scheduled",
          type: appointment.type || "regular",
          notes: appointment.notes || "",
        })
      } else {
        const now = new Date()
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

        setFormData({
          title: "",
          customer: "",
          address: "",
          team: "",
          start: format(now, "yyyy-MM-dd"),
          startTime: format(now, "HH:mm"),
          end: format(now, "yyyy-MM-dd"),
          endTime: format(oneHourLater, "HH:mm"),
          status: "scheduled",
          type: "regular",
          notes: "",
        })
      }
    } else {
      const now = new Date()
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

      setFormData({
        title: "",
        customer: "",
        address: "",
        team: "",
        start: format(now, "yyyy-MM-dd"),
        startTime: format(now, "HH:mm"),
        end: format(now, "yyyy-MM-dd"),
        endTime: format(oneHourLater, "HH:mm"),
        status: "scheduled",
        type: "regular",
        notes: "",
      })
    }
  }, [appointment, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Convert form data to appointment object
    const startDate = new Date(`${formData.start}T${formData.startTime}`)
    const endDate = new Date(`${formData.end}T${formData.endTime}`)

    const appointmentData = {
      ...formData,
      start: startDate,
      end: endDate,
      id: appointment?.id, // Preserve the ID if editing
    }

    // Remove unnecessary fields
    delete appointmentData.startTime
    delete appointmentData.endTime

    onSubmit(appointmentData)
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Sample customers for the dropdown
  const customers = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Sophia Davis",
    "William Miller",
    "Olivia Wilson",
    "James Moore",
    "Ava Taylor",
    "Alexander Anderson",
    "Charlotte Thomas",
    "Benjamin Jackson",
    "Mia White",
  ]

  // Sample teams for the dropdown
  const teams = ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment?.id ? "Edit Appointment" : "New Appointment"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {appointment?.id
              ? "Update the appointment information below."
              : "Fill in the information to schedule a new appointment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                placeholder="e.g. Regular Cleaning, Deep Cleaning, etc."
                required
              />
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
                placeholder="Full address where the service will be performed"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="team">Assigned Team</Label>
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
                <Label htmlFor="start">Start Date</Label>
                <Input
                  id="start"
                  type="date"
                  value={formData.start}
                  onChange={(e) => handleChange("start", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="end">End Date</Label>
                <Input
                  id="end"
                  type="date"
                  value={formData.end}
                  onChange={(e) => handleChange("end", e.target.value)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Service Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
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
                    <SelectItem value="scheduled" className="hover:bg-[#2a3349]">
                      Scheduled
                    </SelectItem>
                    <SelectItem value="in_progress" className="hover:bg-[#2a3349]">
                      In Progress
                    </SelectItem>
                    <SelectItem value="completed" className="hover:bg-[#2a3349]">
                      Completed
                    </SelectItem>
                    <SelectItem value="cancelled" className="hover:bg-[#2a3349]">
                      Cancelled
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
                placeholder="Additional information about the appointment"
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
