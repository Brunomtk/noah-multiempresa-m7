"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, LogIn, LogOut, Clock } from "lucide-react"
import { CheckInModal } from "@/components/admin/check-in-modal"
import { CheckInDetailsModal } from "@/components/admin/check-in-details-modal"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"

// Sample data
const initialCheckIns = [
  {
    id: 1,
    professional: "Maria Silva",
    professionalId: "MS001",
    company: "Tech Solutions Ltd",
    customer: "Tech Solutions HQ",
    address: "123 Main St, Suite 500",
    checkInTime: new Date(2025, 4, 26, 9, 0),
    checkOutTime: new Date(2025, 4, 26, 11, 0),
    status: "completed",
    serviceType: "regular",
    notes: "Cleaning completed as scheduled",
    team: "Team Alpha",
  },
  {
    id: 2,
    professional: "João Santos",
    professionalId: "JS002",
    company: "ABC Consulting",
    customer: "ABC Consulting HQ",
    address: "456 Oak Ave, Floor 3",
    checkInTime: new Date(2025, 4, 26, 13, 0),
    checkOutTime: null,
    status: "in_progress",
    serviceType: "deep",
    notes: "Deep cleaning in progress",
    team: "Team Beta",
  },
  {
    id: 3,
    professional: "Ana Oliveira",
    professionalId: "AO003",
    company: "XYZ Commerce",
    customer: "XYZ Commerce HQ",
    address: "789 Pine St",
    checkInTime: new Date(2025, 4, 27, 10, 0),
    checkOutTime: new Date(2025, 4, 27, 14, 30),
    status: "completed",
    serviceType: "specialized",
    notes: "Window cleaning completed",
    team: "Team Gamma",
  },
  {
    id: 4,
    professional: "Carlos Mendes",
    professionalId: "CM004",
    company: "Delta Industries",
    customer: "Delta Industries HQ",
    address: "101 Maple Dr, Building B",
    checkInTime: null,
    checkOutTime: null,
    status: "pending",
    serviceType: "regular",
    notes: "Scheduled for tomorrow",
    team: "Team Alpha",
  },
  {
    id: 5,
    professional: "Patricia Costa",
    professionalId: "PC005",
    company: "Omega Services",
    customer: "Omega Services HQ",
    address: "202 Elm St, Suite 100",
    checkInTime: new Date(2025, 4, 28, 9, 0),
    checkOutTime: new Date(2025, 4, 28, 12, 45),
    status: "completed",
    serviceType: "specialized",
    notes: "Carpet cleaning completed",
    team: "Team Beta",
  },
  {
    id: 6,
    professional: "Roberto Alves",
    professionalId: "RA006",
    company: "Global Tech",
    customer: "Global Tech HQ",
    address: "303 Cedar Rd",
    checkInTime: new Date(2025, 4, 28, 15, 0),
    checkOutTime: null,
    status: "in_progress",
    serviceType: "regular",
    notes: "Regular cleaning in progress",
    team: "Team Gamma",
  },
  {
    id: 7,
    professional: "Fernanda Lima",
    professionalId: "FL007",
    company: "Innovate Inc",
    customer: "Innovate Inc HQ",
    address: "404 Birch Blvd, Floor 5",
    checkInTime: null,
    checkOutTime: null,
    status: "pending",
    serviceType: "deep",
    notes: "Scheduled for next week",
    team: "Team Alpha",
  },
]

export default function CheckInPage() {
  const [checkIns, setCheckIns] = useState(initialCheckIns)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState<any>(null)
  const [checkInToDelete, setCheckInToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()
  const [companyFilter, setCompanyFilter] = useState("all")
  const companies = ["Tech Solutions Ltd", "ABC Consulting", "XYZ Commerce", "Delta Industries", "Omega Services"]

  const handleAddCheckIn = (data: any) => {
    const newCheckIn = {
      id: checkIns.length + 1,
      ...data,
    }
    setCheckIns([...checkIns, newCheckIn])
    setIsModalOpen(false)
    toast({
      title: "Check-in added successfully",
      description: `Check-in for ${data.professional} at ${data.customer} has been registered.`,
    })
  }

  const handleEditCheckIn = (data: any) => {
    setCheckIns(checkIns.map((checkIn) => (checkIn.id === selectedCheckIn.id ? { ...checkIn, ...data } : checkIn)))
    setSelectedCheckIn(null)
    setIsModalOpen(false)
    toast({
      title: "Check-in updated successfully",
      description: `Check-in for ${data.professional} at ${data.customer} has been updated.`,
    })
  }

  const handleDeleteCheckIn = () => {
    if (checkInToDelete) {
      setCheckIns(checkIns.filter((checkIn) => checkIn.id !== checkInToDelete.id))
      toast({
        title: "Check-in deleted successfully",
        description: `Check-in for ${checkInToDelete.professional} at ${checkInToDelete.customer} has been removed.`,
        variant: "destructive",
      })
      setCheckInToDelete(null)
    }
  }

  const handleViewDetails = (checkIn: any) => {
    setSelectedCheckIn(checkIn)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (checkIn: any) => {
    setSelectedCheckIn(checkIn)
    setIsModalOpen(true)
  }

  const handleQuickCheckOut = (checkIn: any) => {
    if (checkIn.status === "in_progress") {
      const updatedCheckIn = {
        ...checkIn,
        checkOutTime: new Date(),
        status: "completed",
      }

      setCheckIns(checkIns.map((item) => (item.id === checkIn.id ? updatedCheckIn : item)))

      toast({
        title: "Check-out completed",
        description: `${checkIn.professional} has checked out from ${checkIn.customer}.`,
      })
    }
  }

  const filteredCheckIns = checkIns.filter((checkIn) => {
    const matchesSearch =
      checkIn.professional.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkIn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkIn.professionalId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || checkIn.status === statusFilter
    const matchesCompany = companyFilter === "all" || checkIn.company === companyFilter
    return matchesSearch && matchesStatus && matchesCompany
  })

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Check-in/Check-out Management</h1>
            <p className="text-gray-400">Monitor all check-ins and check-outs across all companies in the system.</p>
          </div>
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              setSelectedCheckIn(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Check-in
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by professional, ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[300px] bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-[#1a2234] border-[#2a3349] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                <SelectItem value="all" className="hover:bg-[#2a3349]">
                  All Statuses
                </SelectItem>
                <SelectItem value="pending" className="hover:bg-[#2a3349]">
                  Pending
                </SelectItem>
                <SelectItem value="in_progress" className="hover:bg-[#2a3349]">
                  In Progress
                </SelectItem>
                <SelectItem value="completed" className="hover:bg-[#2a3349]">
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[180px] bg-[#1a2234] border-[#2a3349] text-white">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                <SelectItem value="all" className="hover:bg-[#2a3349]">
                  All Companies
                </SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company} className="hover:bg-[#2a3349]">
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1a2234]">
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-white">Professional</TableHead>
                <TableHead className="text-white">Company</TableHead>
                <TableHead className="text-white">Customer</TableHead>
                <TableHead className="text-white">Check-in</TableHead>
                <TableHead className="text-white">Check-out</TableHead>
                <TableHead className="text-white">Service Type</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCheckIns.map((checkIn) => (
                <TableRow key={checkIn.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-[#2a3349]">
                        <AvatarFallback className="bg-[#2a3349] text-[#06b6d4]">
                          {checkIn.professional
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{checkIn.professional}</div>
                        <div className="text-xs text-gray-400">ID: {checkIn.professionalId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{checkIn.company}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-white">{checkIn.customer}</div>
                      <div className="text-xs text-gray-400">{checkIn.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {checkIn.checkInTime ? (
                      <div className="flex items-center gap-1">
                        <LogIn className="h-3 w-3 text-green-500" />
                        <span className="text-gray-400">{format(checkIn.checkInTime, "MMM d, yyyy HH:mm")}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {checkIn.checkOutTime ? (
                      <div className="flex items-center gap-1">
                        <LogOut className="h-3 w-3 text-red-500" />
                        <span className="text-gray-400">{format(checkIn.checkOutTime, "MMM d, yyyy HH:mm")}</span>
                      </div>
                    ) : checkIn.status === "in_progress" ? (
                      <span className="text-gray-500">In progress</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getServiceTypeBadge(checkIn.serviceType).className}>
                      {getServiceTypeBadge(checkIn.serviceType).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(checkIn.status).className}>
                      {getStatusBadge(checkIn.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(checkIn)}
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
                            onClick={() => handleEdit(checkIn)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>

                      {checkIn.status === "in_progress" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuickCheckOut(checkIn)}
                              className="h-8 w-8 text-gray-400 hover:text-green-500 hover:bg-[#2a3349]"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Quick Check-out</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCheckInToDelete(checkIn)}
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

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{filteredCheckIns.length}</span> of{" "}
            <span className="font-medium text-white">{checkIns.length}</span> check-ins
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] bg-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
            >
              Next
            </Button>
          </div>
        </div>

        <CheckInModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCheckIn(null)
          }}
          onSubmit={selectedCheckIn ? handleEditCheckIn : handleAddCheckIn}
          checkIn={selectedCheckIn}
        />

        <CheckInDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedCheckIn(null)
          }}
          checkIn={selectedCheckIn}
          onEdit={handleEdit}
          onDelete={setCheckInToDelete}
        />

        <AlertDialog open={!!checkInToDelete} onOpenChange={() => setCheckInToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the check-in record for
                <span className="font-semibold text-white block mt-1">
                  {checkInToDelete?.professional} at {checkInToDelete?.customer}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCheckIn}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
