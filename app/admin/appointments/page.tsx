"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Filter, Grid3X3, LayoutGrid, List, Plus } from "lucide-react"
import { AppointmentCalendar } from "@/components/admin/appointment-calendar"
import { AppointmentList } from "@/components/admin/appointment-list"
import { AppointmentModal } from "@/components/admin/appointment-modal"
import { AppointmentDetailsModal } from "@/components/admin/appointment-details-modal"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const initialAppointments = [
  {
    id: 1,
    title: "Regular Cleaning",
    customer: "Tech Solutions Ltd",
    address: "123 Main St, Suite 500",
    team: "Team Alpha",
    start: new Date(2025, 4, 26, 9, 0),
    end: new Date(2025, 4, 26, 11, 0),
    status: "scheduled",
    type: "regular",
    notes: "Focus on kitchen and meeting rooms",
  },
  {
    id: 2,
    title: "Deep Cleaning",
    customer: "ABC Consulting",
    address: "456 Oak Ave, Floor 3",
    team: "Team Beta",
    start: new Date(2025, 4, 26, 13, 0),
    end: new Date(2025, 4, 26, 17, 0),
    status: "in_progress",
    type: "deep",
    notes: "Post-renovation cleaning",
  },
  {
    id: 3,
    title: "Window Cleaning",
    customer: "XYZ Commerce",
    address: "789 Pine St",
    team: "Team Gamma",
    start: new Date(2025, 4, 27, 10, 0),
    end: new Date(2025, 4, 27, 12, 0),
    status: "scheduled",
    type: "specialized",
    notes: "External windows on floors 1-3",
  },
  {
    id: 4,
    title: "Regular Cleaning",
    customer: "Delta Industries",
    address: "101 Maple Dr, Building B",
    team: "Team Alpha",
    start: new Date(2025, 4, 27, 14, 0),
    end: new Date(2025, 4, 27, 16, 0),
    status: "scheduled",
    type: "regular",
    notes: "",
  },
  {
    id: 5,
    title: "Carpet Cleaning",
    customer: "Omega Services",
    address: "202 Elm St, Suite 100",
    team: "Team Beta",
    start: new Date(2025, 4, 28, 9, 0),
    end: new Date(2025, 4, 28, 13, 0),
    status: "scheduled",
    type: "specialized",
    notes: "All office carpets",
  },
  {
    id: 6,
    title: "Regular Cleaning",
    customer: "Global Tech",
    address: "303 Cedar Rd",
    team: "Team Gamma",
    start: new Date(2025, 4, 28, 15, 0),
    end: new Date(2025, 4, 28, 17, 0),
    status: "scheduled",
    type: "regular",
    notes: "",
  },
  {
    id: 7,
    title: "Deep Cleaning",
    customer: "Innovate Inc",
    address: "404 Birch Blvd, Floor 5",
    team: "Team Alpha",
    start: new Date(2025, 4, 29, 8, 0),
    end: new Date(2025, 4, 29, 12, 0),
    status: "scheduled",
    type: "deep",
    notes: "Complete office deep cleaning",
  },
  {
    id: 8,
    title: "Regular Cleaning",
    customer: "First Financial",
    address: "505 Walnut Way",
    team: "Team Beta",
    start: new Date(2025, 4, 29, 13, 0),
    end: new Date(2025, 4, 29, 15, 0),
    status: "scheduled",
    type: "regular",
    notes: "",
  },
  {
    id: 9,
    title: "Post-Construction Cleaning",
    customer: "Build Right Construction",
    address: "606 Spruce St",
    team: "Team Gamma",
    start: new Date(2025, 4, 30, 9, 0),
    end: new Date(2025, 4, 30, 17, 0),
    status: "scheduled",
    type: "specialized",
    notes: "New office space, heavy dust expected",
  },
  {
    id: 10,
    title: "Regular Cleaning",
    customer: "Legal Partners",
    address: "707 Ash Ave, Suite 300",
    team: "Team Alpha",
    start: new Date(2025, 4, 31, 7, 0),
    end: new Date(2025, 4, 31, 9, 0),
    status: "scheduled",
    type: "regular",
    notes: "Early morning cleaning before office hours",
  },
  {
    id: 11,
    title: "Deep Cleaning",
    customer: "Health Clinic",
    address: "808 Redwood Rd",
    team: "Team Beta",
    start: new Date(2025, 4, 31, 18, 0),
    end: new Date(2025, 4, 31, 22, 0),
    status: "scheduled",
    type: "deep",
    notes: "After-hours deep cleaning and sanitization",
  },
  {
    id: 12,
    title: "Regular Cleaning",
    customer: "Tech Solutions Ltd",
    address: "123 Main St, Suite 500",
    team: "Team Alpha",
    start: new Date(2025, 5, 2, 9, 0),
    end: new Date(2025, 5, 2, 11, 0),
    status: "scheduled",
    type: "regular",
    notes: "",
  },
  {
    id: 13,
    title: "Window Cleaning",
    customer: "ABC Consulting",
    address: "456 Oak Ave, Floor 3",
    team: "Team Gamma",
    start: new Date(2025, 5, 2, 13, 0),
    end: new Date(2025, 5, 2, 16, 0),
    status: "scheduled",
    type: "specialized",
    notes: "",
  },
  {
    id: 14,
    title: "Regular Cleaning",
    customer: "XYZ Commerce",
    address: "789 Pine St",
    team: "Team Beta",
    start: new Date(2025, 5, 3, 10, 0),
    end: new Date(2025, 5, 3, 12, 0),
    status: "scheduled",
    type: "regular",
    notes: "",
  },
  {
    id: 15,
    title: "Deep Cleaning",
    customer: "Delta Industries",
    address: "101 Maple Dr, Building B",
    team: "Team Alpha",
    start: new Date(2025, 5, 3, 14, 0),
    end: new Date(2025, 5, 3, 18, 0),
    status: "scheduled",
    type: "deep",
    notes: "Quarterly deep cleaning",
  },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState<any>(null)
  const [view, setView] = useState("week")
  const [displayMode, setDisplayMode] = useState("calendar")
  const [filters, setFilters] = useState({
    teams: ["Team Alpha", "Team Beta", "Team Gamma"],
    statuses: ["scheduled", "in_progress", "completed", "cancelled"],
    types: ["regular", "deep", "specialized"],
  })
  const { toast } = useToast()

  // Adicionar uma nova função para lidar com a adição de agendamentos a partir do calendário
  const handleAddAppointmentFromCalendar = (date: Date) => {
    // Criar um horário de término padrão (1 hora após o início)
    const endDate = new Date(date)
    endDate.setHours(date.getHours() + 1)

    // Criar um objeto de agendamento temporário com a data selecionada
    const tempAppointment = {
      start: date,
      end: endDate,
      // Outros campos podem ficar vazios, serão preenchidos no modal
    }

    setSelectedAppointment(tempAppointment)
    setIsModalOpen(true)
  }

  const handleAddAppointment = (data: any) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...data,
    }
    setAppointments([...appointments, newAppointment])
    setIsModalOpen(false)
    toast({
      title: "Appointment added successfully",
      description: `${data.title} for ${data.customer} has been scheduled.`,
    })
  }

  const handleEditAppointment = (data: any) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === selectedAppointment.id ? { ...appointment, ...data } : appointment,
      ),
    )
    setSelectedAppointment(null)
    setIsModalOpen(false)
    toast({
      title: "Appointment updated successfully",
      description: `${data.title} for ${data.customer} has been updated.`,
    })
  }

  const handleDeleteAppointment = () => {
    if (appointmentToDelete) {
      setAppointments(appointments.filter((appointment) => appointment.id !== appointmentToDelete.id))
      toast({
        title: "Appointment deleted successfully",
        description: `${appointmentToDelete.title} for ${appointmentToDelete.customer} has been removed.`,
        variant: "destructive",
      })
      setAppointmentToDelete(null)
    }
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const filteredAppointments = appointments.filter((appointment) => {
    return (
      filters.teams.includes(appointment.team) &&
      filters.statuses.includes(appointment.status) &&
      filters.types.includes(appointment.type)
    )
  })

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      if (checked) {
        if (!newFilters[filterType as keyof typeof newFilters].includes(value)) {
          newFilters[filterType as keyof typeof newFilters] = [
            ...newFilters[filterType as keyof typeof newFilters],
            value,
          ]
        }
      } else {
        newFilters[filterType as keyof typeof newFilters] = newFilters[filterType as keyof typeof newFilters].filter(
          (item) => item !== value,
        )
      }
      return newFilters
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Appointment Management</h1>
          <p className="text-gray-400">Schedule and manage all cleaning appointments.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              setSelectedAppointment(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-[#2a3349] text-white hover:bg-[#2a3349]">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#1a2234] border-[#2a3349] text-white p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Appointments</h4>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-400">Teams</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {["Team Alpha", "Team Beta", "Team Gamma"].map((team) => (
                      <div key={team} className="flex items-center space-x-2">
                        <Checkbox
                          id={`team-${team}`}
                          checked={filters.teams.includes(team)}
                          onCheckedChange={(checked) => handleFilterChange("teams", team, checked as boolean)}
                          className="border-[#2a3349] data-[state=checked]:bg-[#06b6d4] data-[state=checked]:border-[#06b6d4]"
                        />
                        <Label htmlFor={`team-${team}`} className="text-sm">
                          {team}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-400">Status</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "scheduled", label: "Scheduled" },
                      { value: "in_progress", label: "In Progress" },
                      { value: "completed", label: "Completed" },
                      { value: "cancelled", label: "Cancelled" },
                    ].map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status.value}`}
                          checked={filters.statuses.includes(status.value)}
                          onCheckedChange={(checked) =>
                            handleFilterChange("statuses", status.value, checked as boolean)
                          }
                          className="border-[#2a3349] data-[state=checked]:bg-[#06b6d4] data-[state=checked]:border-[#06b6d4]"
                        />
                        <Label htmlFor={`status-${status.value}`} className="text-sm">
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-400">Service Type</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "regular", label: "Regular Cleaning" },
                      { value: "deep", label: "Deep Cleaning" },
                      { value: "specialized", label: "Specialized Service" },
                    ].map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type.value}`}
                          checked={filters.types.includes(type.value)}
                          onCheckedChange={(checked) => handleFilterChange("types", type.value, checked as boolean)}
                          className="border-[#2a3349] data-[state=checked]:bg-[#06b6d4] data-[state=checked]:border-[#06b6d4]"
                        />
                        <Label htmlFor={`type-${type.value}`} className="text-sm">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1a2234] p-4 rounded-lg border border-[#2a3349]">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#06b6d4]" />
          <h2 className="text-lg font-medium text-white">Appointment Calendar</h2>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center">
            <Tabs value={view} onValueChange={setView} className="w-full">
              <TabsList className="bg-[#0f172a] border border-[#2a3349]">
                <TabsTrigger value="day">
                  <Clock className="h-4 w-4 mr-2" />
                  Day
                </TabsTrigger>
                <TabsTrigger value="week">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Week
                </TabsTrigger>
                <TabsTrigger value="month">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Select value={displayMode} onValueChange={setDisplayMode}>
            <SelectTrigger className="w-[130px] bg-[#0f172a] border-[#2a3349] text-white">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
              <SelectItem value="calendar" className="hover:bg-[#2a3349]">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Calendar</span>
                </div>
              </SelectItem>
              <SelectItem value="list" className="hover:bg-[#2a3349]">
                <div className="flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  <span>List</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {displayMode === "calendar" ? (
        <div className="bg-[#0f172a] border border-[#2a3349] rounded-lg overflow-hidden">
          <AppointmentCalendar
            appointments={filteredAppointments}
            view={view}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={setAppointmentToDelete}
            onAddAppointment={handleAddAppointmentFromCalendar}
          />
        </div>
      ) : (
        <AppointmentList
          appointments={filteredAppointments}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={setAppointmentToDelete}
        />
      )}

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedAppointment(null)
        }}
        onSubmit={selectedAppointment ? handleEditAppointment : handleAddAppointment}
        appointment={selectedAppointment}
      />

      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment}
        onEdit={handleEdit}
        onDelete={setAppointmentToDelete}
      />

      <AlertDialog open={!!appointmentToDelete} onOpenChange={() => setAppointmentToDelete(null)}>
        <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the appointment
              <span className="font-semibold text-white block mt-1">
                {appointmentToDelete?.title} for {appointmentToDelete?.customer}
              </span>
              scheduled for {appointmentToDelete?.start?.toLocaleString()}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAppointment}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
