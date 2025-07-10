"use client"

import { useState } from "react"
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
  Package,
  HistoryIcon,
  CalendarClock,
  X,
  ExternalLink,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, addDays, subDays, isToday } from "date-fns"

export default function ProfessionalSchedule() {
  const [view, setView] = useState("day")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Sample data for appointments
  const appointments = [
    {
      id: 1,
      title: "Residential Cleaning",
      date: "2023-05-27",
      displayDate: "Tomorrow, 05/27/2023",
      time: "10:00 - 12:00",
      startTime: "10:00",
      endTime: "12:00",
      location: "Tree Park Residential, House 15",
      address: "123 Tree Park Avenue, Apt 15, New York, NY 10001",
      status: "Scheduled",
      client: {
        name: "John Smith",
        phone: "(555) 123-4567",
        email: "john.smith@example.com",
        image: "/placeholder.svg?height=40&width=40&query=JS",
      },
      service: {
        type: "Standard Cleaning",
        duration: "2 hours",
        frequency: "Weekly",
        price: "$120.00",
        rooms: ["Living Room", "Kitchen", "2 Bathrooms", "2 Bedrooms"],
      },
      notes:
        "Client has a dog, please make sure the gate is closed at all times. Use the provided eco-friendly cleaning products only.",
      materials: ["All-purpose cleaner", "Glass cleaner", "Microfiber cloths", "Vacuum cleaner"],
      history: [
        { date: "05/20/2023", status: "Completed", notes: "Client was very satisfied" },
        { date: "05/13/2023", status: "Completed", notes: "Finished 15 minutes early" },
        { date: "05/06/2023", status: "Completed", notes: "No special observations" },
      ],
    },
    {
      id: 2,
      title: "Commercial Cleaning",
      date: "2023-05-29",
      displayDate: "05/29/2023",
      time: "14:00 - 17:00",
      startTime: "14:00",
      endTime: "17:00",
      location: "Business Office, Tower B, 3rd floor",
      address: "456 Business Avenue, Tower B, 3rd Floor, New York, NY 10002",
      status: "Scheduled",
      client: {
        name: "Acme Corporation",
        phone: "(555) 987-6543",
        email: "facilities@acmecorp.com",
        image: "/placeholder.svg?height=40&width=40&query=AC",
      },
      service: {
        type: "Deep Office Cleaning",
        duration: "3 hours",
        frequency: "Bi-weekly",
        price: "$250.00",
        rooms: ["Reception", "Conference Room", "Open Office Space", "Executive Offices", "Restrooms", "Kitchen"],
      },
      notes:
        "Security check-in required at the main entrance. Cleaning must be done after business hours. Special attention to the conference room as there's a meeting scheduled for the next morning.",
      materials: ["Commercial disinfectant", "Floor cleaner", "Carpet cleaner", "Industrial vacuum", "Window cleaner"],
      history: [
        { date: "05/15/2023", status: "Completed", notes: "Extra attention to conference room as requested" },
        { date: "05/01/2023", status: "Completed", notes: "Replaced air fresheners in all rooms" },
        { date: "04/15/2023", status: "Rescheduled", notes: "Building closed for maintenance" },
      ],
    },
    {
      id: 3,
      title: "Post-Construction Cleaning",
      date: "2023-06-01",
      displayDate: "06/01/2023",
      time: "08:00 - 13:00",
      startTime: "08:00",
      endTime: "13:00",
      location: "New Horizon Condominium, Block A, Apt 202",
      address: "789 New Horizon Lane, Block A, Apt 202, New York, NY 10003",
      status: "Scheduled",
      client: {
        name: "New Horizon Properties",
        phone: "(555) 456-7890",
        email: "projects@newhorizon.com",
        image: "/placeholder.svg?height=40&width=40&query=NH",
      },
      service: {
        type: "Post-Construction Deep Clean",
        duration: "5 hours",
        frequency: "One-time",
        price: "$450.00",
        rooms: ["Entire 2-bedroom apartment", "Balcony", "Hallway"],
      },
      notes:
        "Construction was just completed. Focus on removing dust, paint spots, and construction debris. Property manager will provide access and will be present during the service.",
      materials: [
        "Heavy-duty vacuum",
        "Paint remover",
        "Dust masks",
        "Protective gloves",
        "Industrial cleaning agents",
      ],
      history: [],
    },
    {
      id: 4,
      title: "Office Deep Cleaning",
      date: "2023-05-25", // Today
      displayDate: "Today, 05/25/2023",
      time: "09:00 - 11:30",
      startTime: "09:00",
      endTime: "11:30",
      location: "Downtown Office Complex, Building C",
      address: "789 Business District, Building C, New York, NY 10004",
      status: "In Progress",
      client: {
        name: "Tech Innovations Inc",
        phone: "(555) 222-3333",
        email: "facilities@techinnovations.com",
        image: "/placeholder.svg?height=40&width=40&query=TI",
      },
      service: {
        type: "Office Deep Cleaning",
        duration: "2.5 hours",
        frequency: "Monthly",
        price: "$180.00",
        rooms: ["Open Office Area", "Executive Suite", "Conference Rooms", "Break Room", "Restrooms"],
      },
      notes:
        "Focus on sanitizing all surfaces. The CEO will be hosting clients tomorrow, so pay special attention to the executive suite and main conference room.",
      materials: ["Sanitizer", "Glass cleaner", "Floor polish", "Dusting tools", "Air fresheners"],
      history: [
        { date: "04/25/2023", status: "Completed", notes: "All areas cleaned as requested" },
        { date: "03/25/2023", status: "Completed", notes: "Additional carpet cleaning performed" },
      ],
    },
    {
      id: 5,
      title: "Residential Maintenance",
      date: "2023-05-25", // Today
      displayDate: "Today, 05/25/2023",
      time: "14:00 - 16:00",
      startTime: "14:00",
      endTime: "16:00",
      location: "Sunset Apartments, Unit 303",
      address: "456 Sunset Boulevard, Unit 303, New York, NY 10005",
      status: "Scheduled",
      client: {
        name: "Emma Johnson",
        phone: "(555) 444-5555",
        email: "emma.johnson@example.com",
        image: "/placeholder.svg?height=40&width=40&query=EJ",
      },
      service: {
        type: "Regular Maintenance",
        duration: "2 hours",
        frequency: "Weekly",
        price: "$100.00",
        rooms: ["Living Room", "Kitchen", "Bathroom", "Bedroom"],
      },
      notes:
        "Client has allergies, please use the hypoallergenic cleaning products provided. The cat should be kept in the bedroom during cleaning.",
      materials: ["Hypoallergenic cleaner", "Microfiber cloths", "HEPA vacuum", "Natural air freshener"],
      history: [
        { date: "05/18/2023", status: "Completed", notes: "Client was very satisfied" },
        { date: "05/11/2023", status: "Completed", notes: "Extra attention to kitchen as requested" },
      ],
    },
  ]

  // Get appointments for the current day
  const getTodayAppointments = () => {
    const formattedDate = format(currentDate, "yyyy-MM-dd")
    return appointments.filter((appointment) => appointment.date === formattedDate)
  }

  // Generate hours for the day view (8 AM to 8 PM)
  const generateDayHours = () => {
    const hours = []
    for (let i = 8; i <= 20; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`
      const appointments = getTodayAppointments().filter((appointment) => {
        const startHour = Number.parseInt(appointment.startTime.split(":")[0])
        return startHour === i
      })

      hours.push({
        hour,
        appointments,
      })
    }
    return hours
  }

  // Generate days for the week view
  const generateWeekDays = () => {
    const days = []
    for (let i = -3; i <= 3; i++) {
      const date = i === 0 ? currentDate : i < 0 ? subDays(currentDate, Math.abs(i)) : addDays(currentDate, i)
      const formattedDate = format(date, "yyyy-MM-dd")
      const dayAppointments = appointments.filter((appointment) => appointment.date === formattedDate)

      days.push({
        date,
        dayName: format(date, "EEE"),
        dayNumber: format(date, "d"),
        isToday: isToday(date),
        appointments: dayAppointments,
      })
    }
    return days
  }

  // Generate days for the month view
  const generateMonthDays = () => {
    const days = []
    for (let i = 1; i <= 31; i++) {
      days.push({
        day: i,
        hasAppointment: [5, 12, 18, 23, 25, 27, 29].includes(i),
      })
    }
    return days
  }

  const handleViewDetails = (appointment) => {
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
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return { label: "Scheduled", className: "bg-blue-50 text-blue-700 border-blue-200" }
      case "in progress":
      case "in_progress":
        return { label: "In Progress", className: "bg-yellow-50 text-yellow-700 border-yellow-200" }
      case "completed":
        return { label: "Completed", className: "bg-green-50 text-green-700 border-green-200" }
      case "cancelled":
        return { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" }
      default:
        return { label: status, className: "bg-gray-50 text-gray-700 border-gray-200" }
    }
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
          {/* Day View - Improved */}
          {view === "day" && (
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 divide-y">
                  {generateDayHours().map((hourData, i) => (
                    <div
                      key={i}
                      className={`p-2 min-h-[100px] ${hourData.appointments.length > 0 ? "bg-primary/5" : ""}`}
                    >
                      <div className="font-medium text-sm text-muted-foreground sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-1">
                        {hourData.hour}
                      </div>
                      <div className="space-y-2 mt-1">
                        {hourData.appointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-2 bg-primary/10 text-primary rounded-md border border-primary/20 hover:bg-primary/15 transition-colors cursor-pointer"
                            onClick={() => handleViewDetails(appointment)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{appointment.title}</div>
                              <Badge variant="outline" className={getStatusBadge(appointment.status).className}>
                                {getStatusBadge(appointment.status).label}
                              </Badge>
                            </div>
                            <div className="text-xs flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{appointment.location}</span>
                            </div>
                            <div className="text-xs flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                              {appointment.time}
                            </div>
                            <div className="text-xs flex items-center mt-1">
                              <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                              {appointment.client.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Today's Appointments</h3>
                <div className="space-y-3">
                  {getTodayAppointments().length > 0 ? (
                    getTodayAppointments().map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getStatusBadge(appointment.status).className}>
                                {getStatusBadge(appointment.status).label}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{appointment.time}</span>
                            </div>
                            <h3 className="font-semibold">{appointment.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={appointment.client.image || "/placeholder.svg"}
                                  alt={appointment.client.name}
                                />
                                <AvatarFallback>
                                  {appointment.client.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{appointment.client.name}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No appointments scheduled for today</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Week View */}
          {view === "week" && (
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-2">
                {generateWeekDays().map((day, i) => (
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
                          {appointment.startTime} - {appointment.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>

                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusBadge(appointment.status).className}>
                            {getStatusBadge(appointment.status).label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{appointment.displayDate}</span>
                        </div>
                        <h3 className="font-semibold">{appointment.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{appointment.time}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-auto"
                          onClick={() => handleViewDetails(appointment)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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

                {/* Empty cells for days before the 1st */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-24 p-1 border border-dashed text-muted-foreground/30 text-sm"
                  ></div>
                ))}

                {/* Actual days of the month */}
                {generateMonthDays().map((dayData, i) => (
                  <div
                    key={`day-${i}`}
                    className={`h-24 p-1 border ${dayData.hasAppointment ? "bg-primary/5 border-primary/20" : ""}`}
                  >
                    <div className="text-sm">{dayData.day}</div>
                    {dayData.day === 5 && (
                      <div
                        className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleViewDetails(appointments[0])}
                      >
                        10:00 - Residential
                      </div>
                    )}
                    {dayData.day === 12 && (
                      <div
                        className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleViewDetails(appointments[1])}
                      >
                        14:00 - Office
                      </div>
                    )}
                    {dayData.day === 18 && (
                      <div
                        className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleViewDetails(appointments[2])}
                      >
                        09:00 - Hospital
                      </div>
                    )}
                    {dayData.day === 23 && (
                      <div
                        className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleViewDetails(appointments[0])}
                      >
                        11:00 - School
                      </div>
                    )}
                    {dayData.day === 25 && (
                      <div
                        className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleViewDetails(appointments[3])}
                      >
                        09:00 - Office
                      </div>
                    )}
                    {dayData.day === 25 && (
                      <div
                        className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleViewDetails(appointments[4])}
                      >
                        14:00 - Residential
                      </div>
                    )}
                    {dayData.day === 27 && (
                      <div
                        className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleViewDetails(appointments[0])}
                      >
                        10:00 - Residential
                      </div>
                    )}
                    {dayData.day === 29 && (
                      <div
                        className="mt-1 text-xs bg-primary/10 text-primary rounded p-0.5 truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleViewDetails(appointments[1])}
                      >
                        14:00 - Commercial
                      </div>
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
                          <span className="text-2xl font-bold">12</span>
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
                          <span className="text-2xl font-bold">8</span>
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
                          <span className="text-2xl font-bold">100%</span>
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

      {/* Appointment Details Dialog - Improved */}
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
                        {selectedAppointment.displayDate}, {selectedAppointment.time}
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
                        <span className="text-muted-foreground">Type:</span> {selectedAppointment.service.type}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span> {selectedAppointment.service.duration}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>{" "}
                        {selectedAppointment.service.frequency}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span> {selectedAppointment.service.price}
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Areas:</span>{" "}
                      {selectedAppointment.service.rooms.join(", ")}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium">Special Instructions</h4>
                    </div>
                    <p className="text-sm">{selectedAppointment.notes}</p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Required Materials</h4>
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedAppointment.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>

                  {selectedAppointment.history.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <HistoryIcon className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">Service History</h4>
                        </div>
                        <div className="space-y-2">
                          {selectedAppointment.history.map((record, index) => (
                            <div key={index} className="text-sm border-l-2 border-primary/20 pl-3 py-1">
                              <div className="font-medium">
                                {record.date} - {record.status}
                              </div>
                              <div className="text-muted-foreground">{record.notes}</div>
                            </div>
                          ))}
                        </div>
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
                            src={selectedAppointment.client.image || "/placeholder.svg"}
                            alt={selectedAppointment.client.name}
                          />
                          <AvatarFallback>
                            {selectedAppointment.client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{selectedAppointment.client.name}</div>
                          <div className="text-xs text-muted-foreground">Client</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedAppointment.client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedAppointment.client.email}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
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
                    <Button variant="outline" className="w-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="w-full">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-500 hover:bg-red-50">
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
