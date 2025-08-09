"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, User, Building, Users, FileText, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface CheckInDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  checkIn: any
  onEdit: (checkIn: any) => void
  onDelete: (checkIn: any) => void
}

export function CheckInDetailsModal({ isOpen, onClose, checkIn, onEdit, onDelete }: CheckInDetailsModalProps) {
  if (!checkIn) return null

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return { label: "Pending", className: "border-yellow-500 text-yellow-500" }
      case 1:
        return { label: "Checked In", className: "border-blue-500 text-blue-500" }
      case 2:
        return { label: "Checked Out", className: "border-green-500 text-green-500" }
      default:
        return { label: "Unknown", className: "border-gray-500 text-gray-500" }
    }
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Not set"
    try {
      return format(new Date(dateString), "PPP 'at' HH:mm")
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a2234] border-[#2a3349] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-[#2a3349]">
              <AvatarFallback className="bg-[#2a3349] text-[#06b6d4]">
                {(checkIn.professionalName || "")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">{checkIn.professionalName || "N/A"}</div>
              <div className="text-sm text-gray-400">Check-in Record Details</div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            View detailed information about this check-in record.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Status</span>
            <Badge variant="outline" className={getStatusBadge(checkIn.status).className}>
              {getStatusBadge(checkIn.status).label}
            </Badge>
          </div>

          <Separator className="bg-[#2a3349]" />

          {/* Professional Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <User className="h-4 w-4" />
              Professional Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <div className="text-white font-medium">{checkIn.professionalName || "N/A"}</div>
              </div>
              <div>
                <span className="text-gray-400">ID:</span>
                <div className="text-white font-medium">{checkIn.professionalId || "N/A"}</div>
              </div>
            </div>
          </div>

          <Separator className="bg-[#2a3349]" />

          {/* Customer Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Customer:</span>
                <div className="text-white font-medium">{checkIn.customerName || "N/A"}</div>
              </div>
              {checkIn.address && (
                <div>
                  <span className="text-gray-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Address:
                  </span>
                  <div className="text-white font-medium">{checkIn.address}</div>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-[#2a3349]" />

          {/* Team Information */}
          {checkIn.teamName && (
            <>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Team:</span>
                    <div className="text-white font-medium">{checkIn.teamName}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Team ID:</span>
                    <div className="text-white font-medium">{checkIn.teamId}</div>
                  </div>
                </div>
              </div>
              <Separator className="bg-[#2a3349]" />
            </>
          )}

          {/* Time Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Information
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Check-in Time:</span>
                <div className="text-white font-medium">{formatDateTime(checkIn.checkInTime)}</div>
              </div>
              <div>
                <span className="text-gray-400">Check-out Time:</span>
                <div className="text-white font-medium">{formatDateTime(checkIn.checkOutTime)}</div>
              </div>
            </div>
          </div>

          <Separator className="bg-[#2a3349]" />

          {/* Service Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400">Service Information</h4>
            <div className="text-sm">
              <span className="text-gray-400">Service Type:</span>
              <div className="text-white font-medium">{checkIn.serviceType || "N/A"}</div>
            </div>
          </div>

          {/* Notes */}
          {checkIn.notes && (
            <>
              <Separator className="bg-[#2a3349]" />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </h4>
                <div className="text-sm text-white bg-[#0f172a] p-3 rounded-md border border-[#2a3349]">
                  {checkIn.notes}
                </div>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator className="bg-[#2a3349]" />
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Record Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Created:</span>
                <div className="text-white font-medium">{formatDateTime(checkIn.createdDate)}</div>
              </div>
              <div>
                <span className="text-gray-400">Updated:</span>
                <div className="text-white font-medium">{formatDateTime(checkIn.updatedDate)}</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit(checkIn)}
            className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => onDelete(checkIn)}
            className="bg-transparent border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={onClose} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
