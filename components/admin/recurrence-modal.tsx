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
import type { RecurrenceFormData } from "@/types/recurrence"

interface RecurrenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  recurrence?: any
}

export function RecurrenceModal({ isOpen, onClose, onSubmit, recurrence }: RecurrenceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RecurrenceFormData>({
    title: "",
    customerId: "",
    address: "",
    teamId: "",
    companyId: "", // This would come from the company context in a real app
    frequency: "weekly",
    day: 1, // Monday
    time: "",
    duration: 60,
    status: "active",
    type: "regular",
    startDate: "",
    endDate: "",
    notes: "",
  })

  useEffect(() => {
    if (recurrence) {
      setFormData({
        title: recurrence.title || "",
        customerId: recurrence.customerId || "",
        address: recurrence.address || "",
        teamId: recurrence.teamId || "",
        companyId: recurrence.companyId || "",
        frequency: recurrence.frequency || "weekly",
        day: recurrence.day !== undefined ? recurrence.day : 1,
        time: recurrence.time || "",
        duration: recurrence.duration || 60,
        status: recurrence.status || "active",
        type: recurrence.type || "regular",
        startDate: recurrence.startDate || "",
        endDate: recurrence.endDate || "",
        notes: recurrence.notes || "",
      })
    } else {
      const today = new Date()
      const nextYear = new Date(today)
      nextYear.setFullYear(today.getFullYear() + 1)

      setFormData({
        title: "",
        customerId: "",
        address: "",
        teamId: "",
        companyId: "", // This would come from the company context in a real app
        frequency: "weekly",
        day: 1, // Monday
        time: "",
        duration: 60,
        status: "active",
        type: "regular",
        startDate: today.toISOString().split("T")[0],
        endDate: nextYear.toISOString().split("T")[0],
        notes: "",
      })
    }
  }, [recurrence])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Calculate next execution date if not provided
    const data = { ...formData }
    if (!data.nextExecution && data.startDate) {
      data.nextExecution = data.startDate
    }

    onSubmit({
      ...data,
      duration: Number.parseInt(data.duration.toString()),
    })
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Get day options based on frequency
  const getDayOptions = () => {
    switch (formData.frequency) {
      case "daily":
        return [
          { value: "Every day", label: "Every day" },
          { value: "Every weekday", label: "Every weekday (Mon-Fri)" },
          { value: "Every weekend", label: "Every weekend (Sat-Sun)" },
        ]
      case "weekly":
        return [
          { value: "Monday", label: "Monday" },
          { value: "Tuesday", label: "Tuesday" },
          { value: "Wednesday", label: "Wednesday" },
          { value: "Thursday", label: "Thursday" },
          { value: "Friday", label: "Friday" },
          { value: "Saturday", label: "Saturday" },
          { value: "Sunday", label: "Sunday" },
        ]
      case "biweekly":
        return [
          { value: "Monday", label: "Monday" },
          { value: "Tuesday", label: "Tuesday" },
          { value: "Wednesday", label: "Wednesday" },
          { value: "Thursday", label: "Thursday" },
          { value: "Friday", label: "Friday" },
          { value: "Saturday", label: "Saturday" },
          { value: "Sunday", label: "Sunday" },
        ]
      case "monthly":
        return [
          { value: "First Monday", label: "First Monday" },
          { value: "First Tuesday", label: "First Tuesday" },
          { value: "First Wednesday", label: "First Wednesday" },
          { value: "First Thursday", label: "First Thursday" },
          { value: "First Friday", label: "First Friday" },
          { value: "Last Monday", label: "Last Monday" },
          { value: "Last Friday", label: "Last Friday" },
          { value: "1", label: "1st day" },
          { value: "15", label: "15th day" },
          { value: "Last day", label: "Last day" },
        ]
      case "quarterly":
        return [
          { value: "First Monday of quarter", label: "First Monday of quarter" },
          { value: "First day of quarter", label: "First day of quarter" },
          { value: "Last day of quarter", label: "Last day of quarter" },
        ]
      default:
        return []
    }
  }

  // Sample customers for the dropdown
  const customers = [
    "Tech Solutions Ltd",
    "ABC Consulting",
    "XYZ Commerce",
    "Delta Industries",
    "Omega Services",
    "Global Tech",
    "Innovate Inc",
    "First Financial",
    "Build Right Construction",
    "Legal Partners",
    "Health Clinic",
  ]

  // Sample teams for the dropdown
  const teams = ["Team Alpha", "Team Beta", "Team Gamma"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recurrence ? "Edit Recurring Service" : "New Recurring Service"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {recurrence
              ? "Update the recurring service information below."
              : "Fill in the information to schedule a new recurring service."}
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
                placeholder="e.g. Weekly Office Cleaning, Monthly Deep Cleaning, etc."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={formData.customerId} onValueChange={(value) => handleChange("customerId", value)}>
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
              <Select value={formData.teamId} onValueChange={(value) => handleChange("teamId", value)}>
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
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => handleChange("frequency", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="daily" className="hover:bg-[#2a3349]">
                      Daily
                    </SelectItem>
                    <SelectItem value="weekly" className="hover:bg-[#2a3349]">
                      Weekly
                    </SelectItem>
                    <SelectItem value="biweekly" className="hover:bg-[#2a3349]">
                      Bi-weekly
                    </SelectItem>
                    <SelectItem value="monthly" className="hover:bg-[#2a3349]">
                      Monthly
                    </SelectItem>
                    <SelectItem value="quarterly" className="hover:bg-[#2a3349]">
                      Quarterly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="day">Day</Label>
                <Select value={formData.day.toString()} onValueChange={(value) => handleChange("day", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    {getDayOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value} className="hover:bg-[#2a3349]">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="time">Start Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration.toString()}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  min="30"
                  step="30"
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
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
                    <SelectItem value="active" className="hover:bg-[#2a3349]">
                      Active
                    </SelectItem>
                    <SelectItem value="paused" className="hover:bg-[#2a3349]">
                      Paused
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
                placeholder="Additional information about the recurring service"
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
