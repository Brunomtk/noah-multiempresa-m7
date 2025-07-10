"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus } from "lucide-react"
import { CompanyScheduleCalendar } from "@/components/company/company-schedule-calendar"
import { CompanyAppointmentModal } from "@/components/company/company-appointment-modal"
import { CompanyAppointmentDetailsModal } from "@/components/company/company-appointment-details-modal"
import { addHours } from "date-fns"

// Sample data for appointments
const generateSampleAppointments = () => {
  const now = new Date()
  const appointments = []

  // Generate 20 appointments over the next 30 days
  for (let i = 0; i < 20; i++) {
    const startDate = new Date(now)
    startDate.setDate(now.getDate() + Math.floor(Math.random() * 30))
    startDate.setHours(8 + Math.floor(Math.random() * 8), 0, 0, 0) // Between 8 AM and 4 PM

    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + 1 + Math.floor(Math.random() * 3)) // 1-3 hours duration

    const statusOptions = ["scheduled", "in_progress", "completed", "cancelled"]
    const statusIndex = Math.floor(Math.random() * (i > 15 ? 4 : 3)) // More likely to be scheduled for recent ones

    const typeOptions = ["regular", "deep", "specialized"]
    const typeIndex = Math.floor(Math.random() * 3)

    const customerNames = [
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

    appointments.push({
      id: i + 1,
      title: `${typeOptions[typeIndex].charAt(0).toUpperCase() + typeOptions[typeIndex].slice(1)} Cleaning Service`,
      customer: customerNames[Math.floor(Math.random() * customerNames.length)],
      address: `${Math.floor(Math.random() * 999) + 1} ${
        ["Main St", "Oak Ave", "Pine Rd", "Maple Dr", "Cedar Ln"][Math.floor(Math.random() * 5)]
      }, ${["Apt", "Suite", "Unit"][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 100) + 1}`,
      team: `Team ${["Alpha", "Beta", "Gamma", "Delta"][Math.floor(Math.random() * 4)]}`,
      start: startDate,
      end: endDate,
      status: statusOptions[statusIndex],
      type: typeOptions[typeIndex],
      notes:
        Math.random() > 0.7
          ? "Special instructions: " +
            [
              "Please focus on kitchen area",
              "Client has pets",
              "Use eco-friendly products only",
              "Entry code: 1234",
              "Please call 15 minutes before arrival",
            ][Math.floor(Math.random() * 5)]
          : "",
    })
  }

  return appointments
}

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [appointments, setAppointments] = useState<any[]>([])

  // Modal states
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Load sample data
    setAppointments(generateSampleAppointments())
  }, [])

  const filteredAppointments = appointments.filter((appointment) => {
    if (filterStatus !== "all" && appointment.status !== filterStatus) return false
    if (filterType !== "all" && appointment.type !== filterType) return false
    return true
  })

  const handleAddAppointment = (date?: Date) => {
    setSelectedAppointment(null)
    setIsEditing(false)
    setIsAppointmentModalOpen(true)

    // If a date is provided, we'll use it as the default start time
    if (date) {
      const endDate = addHours(date, 2)
      setSelectedAppointment({
        start: date,
        end: endDate,
      })
    }
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDetailsModalOpen(true)
  }

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsEditing(true)
    setIsAppointmentModalOpen(true)
    setIsDetailsModalOpen(false)
  }

  const handleDeleteAppointment = (appointment: any) => {
    // In a real app, you would call an API to delete the appointment
    setAppointments((prev) => prev.filter((a) => a.id !== appointment.id))
  }

  const handleSubmitAppointment = (data: any) => {
    if (isEditing && selectedAppointment) {
      // Update existing appointment
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === selectedAppointment.id ? { ...data, id: appointment.id } : appointment,
        ),
      )
    } else {
      // Add new appointment
      const newId = Math.max(0, ...appointments.map((a) => a.id)) + 1
      setAppointments((prev) => [...prev, { ...data, id: newId }])
    }

    setIsAppointmentModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Cleaning Schedule</h1>
          <p className="text-gray-400">View and manage your scheduled services</p>
        </div>
        <Button onClick={() => handleAddAppointment()} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px] bg-[#0f172a] border-[#2a3349] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                <SelectItem value="all" className="hover:bg-[#2a3349]">
                  All Status
                </SelectItem>
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

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px] bg-[#0f172a] border-[#2a3349] text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                <SelectItem value="all" className="hover:bg-[#2a3349]">
                  All Types
                </SelectItem>
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

            <div className="flex-1"></div>

            <Tabs defaultValue="week" className="w-full sm:w-auto" onValueChange={(value) => setViewMode(value as any)}>
              <TabsList className="bg-[#0f172a] border border-[#2a3349]">
                <TabsTrigger value="day" className="data-[state=active]:bg-[#2a3349] text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Day
                </TabsTrigger>
                <TabsTrigger value="week" className="data-[state=active]:bg-[#2a3349] text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Week
                </TabsTrigger>
                <TabsTrigger value="month" className="data-[state=active]:bg-[#2a3349] text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardContent className="p-0">
          <CompanyScheduleCalendar
            appointments={filteredAppointments}
            view={viewMode}
            onViewDetails={handleViewDetails}
            onEdit={handleEditAppointment}
            onDelete={handleDeleteAppointment}
            onAddAppointment={handleAddAppointment}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <CompanyAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSubmit={handleSubmitAppointment}
        appointment={selectedAppointment}
      />

      <CompanyAppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
      />
    </div>
  )
}
