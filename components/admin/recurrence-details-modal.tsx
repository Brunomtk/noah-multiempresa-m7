"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Edit, MapPin, RefreshCw, Trash2, User, Users } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { Recurrence } from "@/types/recurrence"

interface RecurrenceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  recurrence: Recurrence | null
  onEdit: (recurrence: Recurrence) => void
  onDelete: (recurrence: Recurrence) => void
}

export function RecurrenceDetailsModal({ isOpen, onClose, recurrence, onEdit, onDelete }: RecurrenceDetailsModalProps) {
  if (!recurrence) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", className: "border-green-500 text-green-500" }
      case "paused":
        return { label: "Paused", className: "border-yellow-500 text-yellow-500" }
      case "completed":
        return { label: "Completed", className: "border-blue-500 text-blue-500" }
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

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "biweekly":
        return "Bi-weekly"
      case "monthly":
        return "Monthly"
      case "quarterly":
        return "Quarterly"
      default:
        return frequency
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""}${
      hours > 0 && mins > 0 ? " and " : ""
    }${mins > 0 ? `${mins} minute${mins > 1 ? "s" : ""}` : ""}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-[#06b6d4]" />
            Recurring Service Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete information about the recurring service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{recurrence.title}</h3>
            <Badge variant="outline" className={getStatusBadge(recurrence.status).className}>
              {getStatusBadge(recurrence.status).label}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">Frequency</span>
              </div>
              <p className="font-medium">{getFrequencyLabel(recurrence.frequency)}</p>
              <p className="text-gray-400 text-sm">{recurrence.day}</p>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Time & Duration</span>
              </div>
              <p className="font-medium">{recurrence.time}</p>
              <p className="text-gray-400 text-sm">{formatDuration(recurrence.duration)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <User className="h-4 w-4" />
                <span className="text-sm">Customer</span>
              </div>
              <p className="font-medium">{recurrence.customer}</p>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Assigned Team</span>
              </div>
              <p className="font-medium">{recurrence.team}</p>
            </div>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Service Address</span>
            </div>
            <p className="font-medium">{recurrence.address}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Period</span>
              </div>
              <p className="font-medium">
                {recurrence.startDate} to {recurrence.endDate}
              </p>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Execution</span>
              </div>
              <p className="font-medium">
                {recurrence.lastExecution ? (
                  <>
                    Last: <span className="text-gray-400">{recurrence.lastExecution}</span>
                  </>
                ) : (
                  "No previous executions"
                )}
              </p>
              <p className="font-medium">
                {recurrence.nextExecution ? (
                  <>
                    Next: <span className="text-gray-400">{recurrence.nextExecution}</span>
                  </>
                ) : (
                  "No upcoming executions"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className={getTypeBadge(recurrence.type).className}>
              {getTypeBadge(recurrence.type).label}
            </Badge>
          </div>

          {recurrence.notes && (
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <span className="text-sm">Notes</span>
              </div>
              <p className="text-gray-400">{recurrence.notes}</p>
            </div>
          )}

          <Separator className="bg-[#2a3349]" />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(recurrence)}
              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onDelete(recurrence)
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
