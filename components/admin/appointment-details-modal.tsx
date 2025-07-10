"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Edit, MapPin, Trash2, User, Users } from "lucide-react"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"

interface AppointmentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: any
  onEdit: (appointment: any) => void
  onDelete: (appointment: any) => void
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onEdit,
  onDelete,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return { label: "Scheduled", className: "border-blue-500 text-blue-500" }
      case "in_progress":
        return { label: "In Progress", className: "border-yellow-500 text-yellow-500" }
      case "completed":
        return { label: "Completed", className: "border-green-500 text-green-500" }
      case "cancelled":
        return { label: "Cancelled", className: "border-red-500 text-red-500" }
      default:
        return { label: status, className: "border-gray-500 text-gray-500" }
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "regular":
        return { label: "Regular Cleaning", className: "border-blue-400 text-blue-400" }
      case "deep":
        return { label: "Deep Cleaning", className: "border-purple-400 text-purple-400" }
      case "specialized":
        return { label: "Specialized Service", className: "border-orange-400 text-orange-400" }
      default:
        return { label: type, className: "border-gray-400 text-gray-400" }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#06b6d4]" />
            Appointment Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">Complete information about the appointment</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{appointment.title}</h3>
            <Badge variant="outline" className={getStatusBadge(appointment.status).className}>
              {getStatusBadge(appointment.status).label}
            </Badge>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Date & Time</span>
            </div>
            <p className="font-medium">{format(appointment.start, "EEEE, MMMM d, yyyy")}</p>
            <p className="text-gray-400">
              {format(appointment.start, "h:mm a")} - {format(appointment.end, "h:mm a")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <User className="h-4 w-4" />
                <span className="text-sm">Customer</span>
              </div>
              <p className="font-medium">{appointment.customer}</p>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Assigned Team</span>
              </div>
              <p className="font-medium">{appointment.team}</p>
            </div>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Service Address</span>
            </div>
            <p className="font-medium">{appointment.address}</p>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className={getTypeBadge(appointment.type).className}>
              {getTypeBadge(appointment.type).label}
            </Badge>
            <span className="text-sm text-gray-400">
              Duration: {Math.round((appointment.end - appointment.start) / (1000 * 60 * 60))} hours
            </span>
          </div>

          {appointment.notes && (
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <span className="text-sm">Notes</span>
              </div>
              <p className="text-gray-400">{appointment.notes}</p>
            </div>
          )}

          <Separator className="bg-[#2a3349]" />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(appointment)}
              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onDelete(appointment)
                onClose()
              }}
              className="border-[#2a3349] text-red-500 hover:bg-[#2a3349] hover:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
