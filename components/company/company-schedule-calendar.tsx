"use client"

import { useState } from "react"
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isToday,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CompanyScheduleCalendarProps {
  appointments: any[]
  view: string
  onViewDetails: (appointment: any) => void
  onEdit: (appointment: any) => void
  onDelete: (appointment: any) => void
  onAddAppointment: (date: Date) => void
}

export function CompanyScheduleCalendar({
  appointments,
  view,
  onViewDetails,
  onEdit,
  onDelete,
  onAddAppointment,
}: CompanyScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "in_progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "regular":
        return "border-blue-400"
      case "deep":
        return "border-purple-400"
      case "specialized":
        return "border-orange-400"
      default:
        return "border-gray-400"
    }
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM

    const dayAppointments = appointments.filter((appointment) => isSameDay(appointment.start, currentDate))

    return (
      <div className="flex flex-col h-[600px]">
        <div className="flex justify-between items-center p-4 border-b border-[#2a3349]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate((prev) => addDays(prev, -1))}
            className="border-[#2a3349] text-white hover:bg-[#2a3349]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium text-white">{format(currentDate, "EEEE, MMMM d, yyyy")}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate((prev) => addDays(prev, 1))}
            className="border-[#2a3349] text-white hover:bg-[#2a3349]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="relative min-h-full">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex border-b border-[#2a3349] h-12 cursor-pointer hover:bg-[#1a2234]/30"
                onClick={() => {
                  const date = new Date(currentDate)
                  date.setHours(hour, 0, 0, 0)
                  onAddAppointment(date)
                }}
              >
                <div className="w-16 flex-shrink-0 border-r border-[#2a3349] p-1 text-xs text-gray-400 text-right pr-2">
                  {hour}:00
                </div>
                <div className="flex-1 relative"></div>
              </div>
            ))}

            {dayAppointments.map((appointment) => {
              const startHour = appointment.start.getHours()
              const startMinutes = appointment.start.getMinutes()
              const endHour = appointment.end.getHours()
              const endMinutes = appointment.end.getMinutes()

              const top = ((startHour - 7) * 60 + startMinutes) * (48 / 60)
              const height = ((endHour - startHour) * 60 + (endMinutes - startMinutes)) * (48 / 60)

              return (
                <div
                  key={appointment.id}
                  className={`absolute left-16 right-2 rounded-md p-2 border-l-4 ${getTypeColor(appointment.type)} bg-[#1a2234] overflow-hidden cursor-pointer hover:bg-[#2a3349] transition-colors`}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    maxHeight: `${height}px`,
                  }}
                  onClick={() => onViewDetails(appointment)}
                >
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                      <h4 className="font-medium text-sm truncate">{appointment.title}</h4>
                      <p className="text-xs text-gray-400 truncate">{appointment.customer}</p>
                      <div className="flex items-center mt-1">
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(appointment.status)} text-white text-xs px-1 py-0 h-4`}
                        >
                          {appointment.status.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-gray-400 ml-2">
                          {format(appointment.start, "h:mm a")} - {format(appointment.end, "h:mm a")}
                        </span>
                      </div>
                    </div>

                    <TooltipProvider>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1a2234] border-[#2a3349] text-white">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onViewDetails(appointment)
                            }}
                            className="hover:bg-[#2a3349] cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onEdit(appointment)
                            }}
                            className="hover:bg-[#2a3349] cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(appointment)
                            }}
                            className="hover:bg-[#2a3349] text-red-500 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipProvider>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start, end })
    const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM

    return (
      <div className="flex flex-col h-[600px]">
        <div className="flex justify-between items-center p-4 border-b border-[#2a3349]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate((prev) => subWeeks(prev, 1))}
            className="border-[#2a3349] text-white hover:bg-[#2a3349]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium text-white">
            {format(start, "MMM d")} - {format(end, "MMM d, yyyy")}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate((prev) => addWeeks(prev, 1))}
            className="border-[#2a3349] text-white hover:bg-[#2a3349]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 sticky top-0 bg-[#0f172a] z-10 border-b border-[#2a3349]">
              <div className="w-16 border-r border-[#2a3349]"></div>
              {days.map((day) => (
                <div
                  key={day.toString()}
                  className={`p-2 text-center border-r border-[#2a3349] last:border-r-0 ${
                    isToday(day) ? "bg-[#1a2234]" : ""
                  }`}
                >
                  <div className="text-sm font-medium text-white">{format(day, "EEE")}</div>
                  <div className={`text-xs ${isToday(day) ? "text-[#06b6d4]" : "text-gray-400"}`}>
                    {format(day, "MMM d")}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 h-12 border-b border-[#2a3349]">
                  <div className="w-16 border-r border-[#2a3349] p-1 text-xs text-gray-400 text-right pr-2">
                    {hour}:00
                  </div>
                  {days.map((day) => (
                    <div
                      key={`${hour}-${day}`}
                      className="border-r border-[#2a3349] last:border-r-0 relative cursor-pointer hover:bg-[#1a2234]/30"
                      onClick={() => {
                        const date = new Date(day)
                        date.setHours(hour, 0, 0, 0)
                        onAddAppointment(date)
                      }}
                    ></div>
                  ))}
                </div>
              ))}

              {/* Appointments */}
              {days.map((day, dayIndex) => {
                const dayAppointments = appointments.filter((appointment) => isSameDay(appointment.start, day))

                return dayAppointments.map((appointment) => {
                  const startHour = appointment.start.getHours()
                  const startMinutes = appointment.start.getMinutes()
                  const endHour = appointment.end.getHours()
                  const endMinutes = appointment.end.getMinutes()

                  const top = ((startHour - 7) * 60 + startMinutes) * (48 / 60)
                  const height = ((endHour - startHour) * 60 + (endMinutes - startMinutes)) * (48 / 60)
                  const left = 64 + dayIndex * (100 / 7) // 64px for time column, 7 days

                  return (
                    <div
                      key={appointment.id}
                      className={`absolute rounded-md p-1 border-l-4 ${getTypeColor(
                        appointment.type,
                      )} bg-[#1a2234] overflow-hidden cursor-pointer hover:bg-[#2a3349] transition-colors`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `${left}%`,
                        width: `calc(${100 / 8}% - 8px)`,
                        marginLeft: "4px",
                        marginRight: "4px",
                      }}
                      onClick={() => onViewDetails(appointment)}
                    >
                      <h4 className="font-medium text-xs truncate">{appointment.title}</h4>
                      <p className="text-xs text-gray-400 truncate">{appointment.customer}</p>
                      <p className="text-xs text-gray-400">{format(appointment.start, "h:mm a")}</p>
                    </div>
                  )
                })
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })

    // Get the first day of the month and adjust for the grid
    const firstDayOfMonth = start.getDay()
    const daysFromPrevMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Adjust for Monday start

    // Get days from previous month to fill the grid
    const prevMonthDays = eachDayOfInterval({
      start: addDays(start, -daysFromPrevMonth),
      end: addDays(start, -1),
    })

    // Calculate how many days we need from the next month
    const totalDaysToShow = 42 // 6 weeks
    const daysFromNextMonth = totalDaysToShow - days.length - prevMonthDays.length

    // Get days from next month
    const nextMonthDays = eachDayOfInterval({
      start: addDays(end, 1),
      end: addDays(end, daysFromNextMonth),
    })

    // Combine all days
    const allDays = [...prevMonthDays, ...days, ...nextMonthDays]

    return (
      <div className="flex flex-col h-[600px]">
        <div className="flex justify-between items-center p-4 border-b border-[#2a3349]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate((prev) => subMonths(prev, 1))}
            className="border-[#2a3349] text-white hover:bg-[#2a3349]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium text-white">{format(currentDate, "MMMM yyyy")}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate((prev) => addMonths(prev, 1))}
            className="border-[#2a3349] text-white hover:bg-[#2a3349]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 border-b border-[#2a3349]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="p-2 text-center border-r border-[#2a3349] last:border-r-0">
              <div className="text-sm font-medium text-white">{day}</div>
            </div>
          ))}
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-7 auto-rows-[minmax(100px,_1fr)]">
            {allDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentDate)
              const dayAppointments = appointments.filter((appointment) => isSameDay(appointment.start, day))

              return (
                <div
                  key={index}
                  className={`border-r border-b border-[#2a3349] last:border-r-0 p-2 ${
                    isCurrentMonth ? "bg-transparent" : "bg-[#0f172a]/50"
                  } ${isToday(day) ? "bg-[#06b6d4]/10" : ""} cursor-pointer hover:bg-[#1a2234]/30`}
                  onClick={() => {
                    // Se clicar em uma área vazia, adicionar um novo agendamento às 9h
                    const date = new Date(day)
                    date.setHours(9, 0, 0, 0)
                    onAddAppointment(date)
                  }}
                >
                  <div className="text-xs font-medium mb-1 text-right">
                    <span className={isCurrentMonth ? "text-white" : "text-gray-500"}>{format(day, "d")}</span>
                  </div>

                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`rounded-sm p-1 border-l-2 ${getTypeColor(
                          appointment.type,
                        )} bg-[#1a2234] text-white text-xs cursor-pointer hover:bg-[#2a3349] transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewDetails(appointment)
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(appointment.status)}`}></div>
                          <span className="truncate">{format(appointment.start, "h:mm a")}</span>
                        </div>
                        <div className="truncate font-medium">{appointment.title}</div>
                      </div>
                    ))}

                    {dayAppointments.length > 3 && (
                      <button
                        className="text-xs text-[#06b6d4] hover:text-[#0891b2] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Set the current date to this day and switch to day view
                          setCurrentDate(day)
                        }}
                      >
                        +{dayAppointments.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="h-full">
        {view === "day" && renderDayView()}
        {view === "week" && renderWeekView()}
        {view === "month" && renderMonthView()}
      </div>
    </TooltipProvider>
  )
}
