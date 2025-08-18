"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  CalendarClock,
  X,
  ExternalLink,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, addDays, subDays, isToday } from "date-fns"
import { useProfessionalSchedule } from "@/hooks/use-professional-schedule"
import { useAuth } from "@/contexts/auth-context"
import type { Appointment } from "@/types/appointment"

export default function ProfessionalSchedule() {
  const [view, setView] = useState("day")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  const { user } = useAuth()

  const {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    fetchAppointmentsByDateRange,
    scheduleSummary,
    fetchScheduleSummary,
  } = useProfessionalSchedule()

  // Memoize date strings to prevent unnecessary re-renders
  const dateRange = useMemo(() => {
    const startDate = format(subDays(currentDate, 30), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    const endDate = format(addDays(currentDate, 30), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    return { startDate, endDate }
  }, [currentDate])

  useEffect(() => {
    if (user?.professionalId) {
      fetchAppointmentsByDateRange(dateRange.startDate, dateRange.endDate, user.professionalId)
    }
  }, [dateRange.startDate, dateRange.endDate, fetchAppointmentsByDateRange, user?.professionalId])

  // Fetch schedule summary only once on mount
  useEffect(() => {
    if (user?.professionalId) {
      const now = new Date()
      fetchScheduleSummary(now.getMonth() + 1, now.getFullYear(), user.professionalId)
    }
  }, [fetchScheduleSummary, user?.professionalId])

  const filteredAppointments = useMemo(() => {
    if (!user?.professionalId) return []
    return appointments.filter(
      (appointment) =>
        appointment.professionalId === user.professionalId || appointment.professional?.id === user.professionalId,
    )
  }, [appointments, user?.professionalId])

  // Get appointments for the current day
  const getTodayAppointments = useMemo(() => {
    const formattedDate = format(currentDate, "yyyy-MM-dd")
    return filteredAppointments.filter((appointment) => {
      const appointmentDate = format(new Date(appointment.start), "yyyy-MM-dd")
      return appointmentDate === formattedDate
    })
  }, [filteredAppointments, currentDate])

  const generateDayTimeSlots = useMemo(() => {
    const timeSlots = []
    for (let i = 8; i <= 20; i++) {
      // Add hour slot (e.g., 08:00)
      const hourTime = i < 10 ? `0${i}:00` : `${i}:00`
      const hourAppointments = getTodayAppointments.filter((appointment) => {
        const startTime = new Date(appointment.start)
        const startHour = startTime.getHours()
        const startMinutes = startTime.getMinutes()
        return startHour === i && startMinutes < 30
      })

      timeSlots.push({
        time: hourTime,
        fullHour: `${i}:00`,
        appointments: hourAppointments,
        isHalfHour: false,
      })

      // Add half-hour slot (e.g., 08:30) - only if not the last hour
      if (i < 20) {
        const halfHourTime = i < 10 ? `0${i}:30` : `${i}:30`
        const halfHourAppointments = getTodayAppointments.filter((appointment) => {
          const startTime = new Date(appointment.start)
          const startHour = startTime.getHours()
          const startMinutes = startTime.getMinutes()
          return startHour === i && startMinutes >= 30
        })

        timeSlots.push({
          time: halfHourTime,
          fullHour: `${i}:30`,
          appointments: halfHourAppointments,
          isHalfHour: true,
        })
      }
    }
    return timeSlots
  }, [getTodayAppointments])

  // Generate hours for the day view (8 AM to 8 PM)
  const generateDayHours = useMemo(() => {
    const hours = []
    for (let i = 8; i <= 20; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`
      const appointmentsForHour = getTodayAppointments.filter((appointment) => {
        const startHour = new Date(appointment.start).getHours()
        return startHour === i
      })

      hours.push({
        hour,
        appointments: appointmentsForHour,
      })
    }
    return hours
  }, [getTodayAppointments])

  // Generate days for the week view
  const generateWeekDays = useMemo(() => {
    const days = []
    for (let i = -3; i <= 3; i++) {
      const date = i === 0 ? currentDate : i < 0 ? subDays(currentDate, Math.abs(i)) : addDays(currentDate, i)
      const formattedDate = format(date, "yyyy-MM-dd")
      const dayAppointments = filteredAppointments.filter((appointment) => {
        const appointmentDate = format(new Date(appointment.start), "yyyy-MM-dd")
        return appointmentDate === formattedDate
      })

      days.push({
        date,
        dayName: format(date, "EEE"),
        dayNumber: format(date, "d"),
        isToday: isToday(date),
        appointments: dayAppointments,
      })
    }
    return days
  }, [currentDate, filteredAppointments])

  // Generate days for the month view
  const generateMonthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the 1st
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, hasAppointment: false, appointments: [] })
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const formattedDate = format(date, "yyyy-MM-dd")
      const dayAppointments = filteredAppointments.filter((appointment) => {
        const appointmentDate = format(new Date(appointment.start), "yyyy-MM-dd")
        return appointmentDate === formattedDate
      })

      days.push({
        day,
        hasAppointment: dayAppointments.length > 0,
        appointments: dayAppointments,
      })
    }

    return days
  }, [currentDate, filteredAppointments])

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDetailsOpen(true)
  }

  const navigatePrevious = () => {
    if (view === "day") {
      setCurrentDate(subDays(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(subDays(currentDate, 7))
    } else {
      // Month view - go to previous month
      const newDate = new Date(currentDate)
      newDate.setMonth(newDate.getMonth() - 1)
      setCurrentDate(newDate)
    }
  }

  const navigateNext = () => {
    if (view === "day") {
      setCurrentDate(addDays(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, 7))
    } else {
      // Month view - go to next month
      const newDate = new Date(currentDate)
      newDate.setMonth(newDate.getMonth() + 1)
      setCurrentDate(newDate)
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get status badge styling
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return { label: "Scheduled", className: "bg-blue-50 text-blue-700 border-blue-200" }
      case 1:
        return { label: "In Progress", className: "bg-yellow-50 text-yellow-700 border-yellow-200" }
      case 2:
        return { label: "Completed", className: "bg-green-50 text-green-700 border-green-200" }
      case 3:
        return { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" }
      default:
        return { label: "Unknown", className: "bg-gray-50 text-gray-700 border-gray-200" }
    }
  }

  // Get type label
  const getTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return "Residential"
      case 1:
        return "Commercial"
      case 2:
        return "Industrial"
      default:
        return "Unknown"
    }
  }

  const getAppointmentStyle = (appointment: any) => {
    const startTime = new Date(appointment.start)
    const endTime = new Date(appointment.end)
    const startMinutes = startTime.getMinutes()
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60) // duration in minutes

    // Calculate height based on duration (minimum 40px, 2px per minute)
    const height = Math.max(40, Math.min(duration * 2, 120))

    // Calculate top offset within the 30-minute slot (0-30 minutes = 0-50px offset)
    const topOffset = startMinutes >= 30 ? (startMinutes - 30) * 1.67 : startMinutes * 1.67

    return {
      height: `${height}px`,
      marginTop: `${topOffset}px`,
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="mt-2 text-red-600">{error}</p>
          <Button onClick={() => fetchAppointments()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Schedule</h2>
        <p className="text-muted-foreground">View and manage your appointments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Tabs defaultValue="day" className="w-full sm:w-[300px]" onValueChange={setView} value={view}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {view === "day" && format(currentDate, "EEEE, MMMM d, yyyy")}
            {view === "week" && `Week of ${format(currentDate, "MMMM d, yyyy")}`}
            {view === "month" && format(currentDate, "MMMM yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Day View */}
          {view === "day" && (
            <div className="flex flex-col h-[600px] bg-[#1a2234] rounded-lg border border-[#2a3349]">
              <div className="flex justify-between items-center p-4 border-b border-[#2a3349]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigatePrevious}
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium text-white">{format(currentDate, "EEEE, MMMM d, yyyy")}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateNext}
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="relative min-h-full">
                  {Array.from({ length: 17 }, (_, i) => i + 6).map((hour) => (
                    <div
                      key={hour}
                      className="flex border-b border-[#2a3349] h-12 cursor-pointer hover:bg-[#1a2234]/30"
                    >
                      <div className="w-16 flex-shrink-0 border-r border-[#2a3349] p-1 text-xs text-gray-400 text-right pr-2">
                        {hour}:00
                      </div>
                      <div className="flex-1 relative"></div>
                    </div>
                  ))}

                  {getTodayAppointments.map((appointment) => {
                    const startDate = new Date(appointment.start)
                    const endDate = new Date(appointment.end)

                    if (startDate.toString() === "Invalid Date" || endDate.toString() === "Invalid Date") {
                      return null
                    }

                    const startHour = startDate.getHours()
                    const startMinutes = startDate.getMinutes()
                    const endHour = endDate.getHours()
                    const endMinutes = endDate.getMinutes()

                    const top = ((startHour - 6) * 60 + startMinutes) * (48 / 60)
                    const height = ((endHour - startHour) * 60 + (endMinutes - startMinutes)) * (48 / 60)

                    return (
                      <div
                        key={appointment.id}
                        className="absolute left-16 right-2 rounded-md p-2 border-l-4 border-blue-400 bg-[#0f172a] overflow-hidden cursor-pointer hover:bg-[#2a3349] transition-colors"
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height, 24)}px`,
                          maxHeight: `${height}px`,
                        }}
                        onClick={() => handleViewDetails(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="overflow-hidden">
                            <h4 className="font-medium text-sm truncate text-white">
                              {appointment.title || "No Title"}
                            </h4>
                            <p className="text-xs text-gray-400 truncate">
                              {appointment.customer?.name || "No customer"}
                            </p>
                            <div className="flex items-center mt-1">
                              <Badge
                                variant="outline"
                                className={`${getStatusBadge(appointment.status).className} text-white text-xs px-1 py-0 h-4`}
                              >
                                {getStatusBadge(appointment.status).label}
                              </Badge>
                              <span className="text-xs text-gray-400 ml-2">
                                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Week View */}
          {view === "week" && (
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-2">
                {generateWeekDays.map((day, i) => (
                  <div key={i} className="text-center">
                    <div className={`font-medium mb-2 ${day.isToday ? "text-primary" : ""}`}>{day.dayName}</div>
                    <div
                      className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center mb-2 
                        ${day.isToday ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      {day.dayNumber}
                    </div>
                    <div
                      className={`h-24 rounded-md border overflow-y-auto ${day.appointments.length > 0 ? "bg-primary/5 border-primary/20" : ""}`}
                    >
                      {day.appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="mx-1 my-1 px-1 py-1 text-xs bg-primary/10 text-primary rounded truncate cursor-pointer hover:bg-primary/20"
                          onClick={() => handleViewDetails(appointment)}
                        >
                          {format(new Date(appointment.start), "HH:mm")} - {appointment.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Week Appointments</h3>

                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusBadge(appointment.status).className}>
                              {getStatusBadge(appointment.status).label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(appointment.start), "MMM dd, yyyy")}
                            </span>
                            <Badge variant="secondary">{getTypeLabel(appointment.type)}</Badge>
                          </div>
                          <h3 className="font-semibold">{appointment.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.address}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(new Date(appointment.start), "HH:mm")} -{" "}
                              {format(new Date(appointment.end), "HH:mm")}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto bg-transparent"
                            onClick={() => handleViewDetails(appointment)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No appointments found</div>
                )}
              </div>
            </div>
          )}

          {/* Month View */}
          {view === "month" && (
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <div key={i} className="text-center font-medium p-2">
                    {day}
                  </div>
                ))}

                {generateMonthDays.map((dayData, i) => (
                  <div
                    key={i}
                    className={`h-24 p-1 border ${
                      dayData.day === null
                        ? "border-dashed text-muted-foreground/30"
                        : dayData.hasAppointment
                          ? "bg-primary/5 border-primary/20"
                          : ""
                    }`}
                  >
                    {dayData.day && (
                      <>
                        <div className="text-sm">{dayData.day}</div>
                        {dayData.appointments.slice(0, 2).map((appointment) => (
                          <div
                            key={appointment.id}
                            className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                            onClick={() => handleViewDetails(appointment)}
                          >
                            {format(new Date(appointment.start), "HH:mm")} - {appointment.title}
                          </div>
                        ))}
                        {dayData.appointments.length > 2 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            +{dayData.appointments.length - 2} more
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Monthly Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">Total Appointments</span>
                          <span className="text-2xl font-bold">{scheduleSummary?.totalAppointments || 0}</span>
                        </div>
                        <Calendar className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">Clients Served</span>
                          <span className="text-2xl font-bold">{scheduleSummary?.clientsServed || 0}</span>
                        </div>
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">Completion Rate</span>
                          <span className="text-2xl font-bold">{scheduleSummary?.completionRate || 0}%</span>
                        </div>
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Appointment Details</span>
                <Badge variant="outline" className={getStatusBadge(selectedAppointment.status).className}>
                  {getStatusBadge(selectedAppointment.status).label}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[calc(90vh-130px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pr-4">
                {/* Left Column - Service Details */}
                <div className="space-y-4 md:col-span-2">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedAppointment.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(selectedAppointment.start), "PPP, p")} -{" "}
                        {format(new Date(selectedAppointment.end), "p")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{selectedAppointment.address}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Service Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span> {getTypeLabel(selectedAppointment.type)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>{" "}
                        {getStatusBadge(selectedAppointment.status).label}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Company:</span>{" "}
                        {selectedAppointment.company?.name || "N/A"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Team:</span> {selectedAppointment.team?.name || "N/A"}
                      </div>
                    </div>
                  </div>

                  {selectedAppointment.notes && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <h4 className="font-medium">Notes</h4>
                        </div>
                        <p className="text-sm">{selectedAppointment.notes}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Column - Client Info & Actions */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Client Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&query=${selectedAppointment.customer?.name || "Customer"}`}
                            alt={selectedAppointment.customer?.name || "Customer"}
                          />
                          <AvatarFallback>
                            {selectedAppointment.customer?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{selectedAppointment.customer?.name || "No customer"}</div>
                          <div className="text-xs text-muted-foreground">Client</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {selectedAppointment.customer?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedAppointment.customer.phone}</span>
                          </div>
                        )}
                        {selectedAppointment.customer?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedAppointment.customer.email}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-0">
                      {selectedAppointment.customer?.phone && (
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="space-y-2">
                    <Button className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-500 hover:text-red-500 hover:bg-red-50 bg-transparent"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Check Page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
