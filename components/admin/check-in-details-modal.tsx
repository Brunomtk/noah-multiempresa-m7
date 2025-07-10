"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Clock, Edit, LogIn, LogOut, Trash2, Users } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { format, formatDistanceStrict } from "date-fns"

interface CheckInDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  checkIn: any
  onEdit: (checkIn: any) => void
  onDelete: (checkIn: any) => void
}

export function CheckInDetailsModal({ isOpen, onClose, checkIn, onEdit, onDelete }: CheckInDetailsModalProps) {
  if (!checkIn) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pending", className: "border-yellow-500 text-yellow-500" }
      case "in_progress":
        return { label: "In Progress", className: "border-blue-500 text-blue-500" }
      case "completed":
        return { label: "Completed", className: "border-green-500 text-green-500" }
      default:
        return { label: status, className: "border-gray-500 text-gray-500" }
    }
  }

  const getServiceTypeBadge = (type: string) => {
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

  // Calculate duration if both check-in and check-out times exist
  const getDuration = () => {
    if (checkIn.checkInTime && checkIn.checkOutTime) {
      return formatDistanceStrict(checkIn.checkOutTime, checkIn.checkInTime)
    }
    return null
  }

  const duration = getDuration()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#06b6d4]" />
            Check-in/Check-out Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete information about the check-in/check-out record
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{checkIn.professional}</h3>
              <p className="text-gray-400">ID: {checkIn.professionalId}</p>
            </div>
            <Badge variant="outline" className={getStatusBadge(checkIn.status).className}>
              {getStatusBadge(checkIn.status).label}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Company</span>
              </div>
              <p className="font-medium">{checkIn.company}</p>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Team</span>
              </div>
              <p className="font-medium">{checkIn.team}</p>
            </div>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Customer</span>
            </div>
            <p className="font-medium">{checkIn.customer}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <LogIn className="h-4 w-4" />
                <span className="text-sm">Check-in Time</span>
              </div>
              {checkIn.checkInTime ? (
                <p className="font-medium">{format(checkIn.checkInTime, "MMMM d, yyyy HH:mm")}</p>
              ) : (
                <p className="text-gray-500">Not checked in yet</p>
              )}
            </div>

            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Check-out Time</span>
              </div>
              {checkIn.checkOutTime ? (
                <p className="font-medium">{format(checkIn.checkOutTime, "MMMM d, yyyy HH:mm")}</p>
              ) : (
                <p className="text-gray-500">Not checked out yet</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className={getServiceTypeBadge(checkIn.serviceType).className}>
              {getServiceTypeBadge(checkIn.serviceType).label}
            </Badge>
            {duration && (
              <div className="bg-[#0f172a] px-3 py-1 rounded-md border border-[#2a3349]">
                <span className="text-sm">Duration: {duration}</span>
              </div>
            )}
          </div>

          {checkIn.notes && (
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <span className="text-sm">Notes</span>
              </div>
              <p className="text-gray-400">{checkIn.notes}</p>
            </div>
          )}

          <Separator className="bg-[#2a3349]" />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(checkIn)}
              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onDelete(checkIn)
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
