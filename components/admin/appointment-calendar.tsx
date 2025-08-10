"use client"

import { useState, useMemo } from "react"
import { Calendar, momentLocalizer, type View } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import type { Appointment } from "@/types/appointment"

const localizer = momentLocalizer(moment)

interface AppointmentCalendarProps {
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
  onDateClick: (date: Date) => void
  view: "day" | "week" | "month"
}

export function AppointmentCalendar({
  appointments,
  onAppointmentClick,
  onDateClick,
  view: initialView,
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<View>(initialView)

  // Transform appointments to calendar events
  const events = useMemo(() => {
    return appointments
      .filter((appointment) => {
        // Filter out appointments with invalid dates
        const start = appointment.start
        const end = appointment.end
        return (
          start &&
          end &&
          start !== "0001-01-01T00:00:00" &&
          end !== "0001-01-01T00:00:00" &&
          new Date(start).getFullYear() > 1900 &&
          new Date(end).getFullYear() > 1900
        )
      })
      .map((appointment) => ({
        id: appointment.id,
        title: appointment.title || appointment.customer?.name || `Appointment #${appointment.id}`,
        start: new Date(appointment.start),
        end: new Date(appointment.end),
        resource: appointment,
        allDay: false,
      }))
  }, [appointments])

  const handleSelectEvent = (event: any) => {
    onAppointmentClick(event.resource)
  }

  const handleSelectSlot = ({ start }: { start: Date }) => {
    onDateClick(start)
  }

  const handleNavigate = (date: Date) => {
    setCurrentDate(date)
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const goToPrevious = () => {
    let newDate: Date
    switch (currentView) {
      case "month":
        newDate = moment(currentDate).subtract(1, "month").toDate()
        break
      case "week":
        newDate = moment(currentDate).subtract(1, "week").toDate()
        break
      case "day":
        newDate = moment(currentDate).subtract(1, "day").toDate()
        break
      default:
        newDate = moment(currentDate).subtract(1, "week").toDate()
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    let newDate: Date
    switch (currentView) {
      case "month":
        newDate = moment(currentDate).add(1, "month").toDate()
        break
      case "week":
        newDate = moment(currentDate).add(1, "week").toDate()
        break
      case "day":
        newDate = moment(currentDate).add(1, "day").toDate()
        break
      default:
        newDate = moment(currentDate).add(1, "week").toDate()
    }
    setCurrentDate(newDate)
  }

  const eventStyleGetter = (event: any) => {
    const appointment = event.resource as Appointment
    let backgroundColor = "#06b6d4"

    // Color code by status
    switch (appointment.status) {
      case 0:
        backgroundColor = "#f59e0b" // Scheduled - amber
        break
      case 1:
        backgroundColor = "#3b82f6" // In Progress - blue
        break
      case 2:
        backgroundColor = "#10b981" // Completed - green
        break
      case 3:
        backgroundColor = "#ef4444" // Cancelled - red
        break
      default:
        backgroundColor = "#06b6d4" // Default - cyan
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "12px",
        padding: "2px 4px",
      },
    }
  }

  const formats = {
    timeGutterFormat: "HH:mm",
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
    agendaTimeFormat: "HH:mm",
    agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
  }

  return (
    <div className="bg-[#1a2234] rounded-lg border border-[#2a3349] p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[#06b6d4]" />
          <h3 className="text-lg font-medium text-white">{moment(currentDate).format("MMMM YYYY")}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="calendar-container" style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          view={currentView}
          date={currentDate}
          selectable
          popup
          eventPropGetter={eventStyleGetter}
          formats={formats}
          min={new Date(2024, 0, 1, 6, 0)} // 6 AM
          max={new Date(2024, 0, 1, 22, 0)} // 10 PM
          step={30}
          timeslots={2}
          style={{
            color: "white",
            backgroundColor: "#0f172a",
          }}
          components={{
            toolbar: () => null, // Hide default toolbar since we have custom header
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#f59e0b]"></div>
          <span className="text-gray-400">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#3b82f6]"></div>
          <span className="text-gray-400">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#10b981]"></div>
          <span className="text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#ef4444]"></div>
          <span className="text-gray-400">Cancelled</span>
        </div>
      </div>

      <style jsx global>{`
        .calendar-container .rbc-calendar {
          background-color: #0f172a;
          color: white;
        }
        
        .calendar-container .rbc-header {
          background-color: #1a2234;
          color: white;
          border-bottom: 1px solid #2a3349;
          padding: 8px;
        }
        
        .calendar-container .rbc-time-view {
          background-color: #0f172a;
        }
        
        .calendar-container .rbc-time-header {
          background-color: #1a2234;
          border-bottom: 1px solid #2a3349;
        }
        
        .calendar-container .rbc-time-content {
          border-top: 1px solid #2a3349;
        }
        
        .calendar-container .rbc-timeslot-group {
          border-bottom: 1px solid #2a3349;
        }
        
        .calendar-container .rbc-time-slot {
          border-top: 1px solid #374151;
        }
        
        .calendar-container .rbc-day-slot {
          border-right: 1px solid #2a3349;
        }
        
        .calendar-container .rbc-today {
          background-color: rgba(6, 182, 212, 0.1);
        }
        
        .calendar-container .rbc-off-range-bg {
          background-color: #111827;
        }
        
        .calendar-container .rbc-month-view {
          background-color: #0f172a;
        }
        
        .calendar-container .rbc-date-cell {
          color: white;
          padding: 8px;
        }
        
        .calendar-container .rbc-date-cell.rbc-off-range {
          color: #6b7280;
        }
        
        .calendar-container .rbc-month-row {
          border-bottom: 1px solid #2a3349;
        }
        
        .calendar-container .rbc-day-bg {
          border-right: 1px solid #2a3349;
        }
        
        .calendar-container .rbc-time-gutter {
          background-color: #1a2234;
          color: white;
          border-right: 1px solid #2a3349;
        }
        
        .calendar-container .rbc-current-time-indicator {
          background-color: #06b6d4;
        }
      `}</style>
    </div>
  )
}
