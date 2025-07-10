"use client"

import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Eye, MapPin, Trash2, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AppointmentListProps {
  appointments: any[]
  onViewDetails: (appointment: any) => void
  onEdit: (appointment: any) => void
  onDelete: (appointment: any) => void
}

export function AppointmentList({ appointments, onViewDetails, onEdit, onDelete }: AppointmentListProps) {
  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => a.start.getTime() - b.start.getTime())

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
        return { label: "Regular", className: "border-blue-400 text-blue-400" }
      case "deep":
        return { label: "Deep", className: "border-purple-400 text-purple-400" }
      case "specialized":
        return { label: "Specialized", className: "border-orange-400 text-orange-400" }
      default:
        return { label: type, className: "border-gray-400 text-gray-400" }
    }
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border border-[#2a3349] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1a2234]">
            <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
              <TableHead className="text-white">Service</TableHead>
              <TableHead className="text-white">Date & Time</TableHead>
              <TableHead className="text-white">Customer</TableHead>
              <TableHead className="text-white">Team</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAppointments.map((appointment) => (
              <TableRow key={appointment.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                <TableCell className="font-medium text-white">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#2a3349] p-1.5 rounded-md">
                      <Calendar className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    {appointment.title}
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  <div>
                    <div>{format(appointment.start, "MMM d, yyyy")}</div>
                    <div className="text-xs">
                      {format(appointment.start, "h:mm a")} - {format(appointment.end, "h:mm a")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-white">{appointment.customer}</div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {appointment.address}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#06b6d4]" />
                    {appointment.team}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTypeBadge(appointment.type).className}>
                    {getTypeBadge(appointment.type).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadge(appointment.status).className}>
                    {getStatusBadge(appointment.status).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(appointment)}
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Details</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(appointment)}
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(appointment)}
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-[#2a3349]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
