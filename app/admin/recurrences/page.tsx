"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, RefreshCw } from "lucide-react"
import { RecurrenceModal } from "@/components/admin/recurrence-modal"
import { RecurrenceDetailsModal } from "@/components/admin/recurrence-details-modal"
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
import { useRecurrences } from "@/hooks/use-recurrences"

// Sample data
const initialRecurrences = [
  {
    id: 1,
    title: "Weekly Office Cleaning",
    customer: "Tech Solutions Ltd",
    address: "123 Main St, Suite 500",
    team: "Team Alpha",
    frequency: "weekly",
    day: "Monday",
    time: "09:00",
    duration: 120,
    status: "active",
    type: "regular",
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    notes: "Focus on kitchen and meeting rooms",
    lastExecution: "2025-05-20",
    nextExecution: "2025-05-27",
  },
  {
    id: 2,
    title: "Bi-weekly Deep Cleaning",
    customer: "ABC Consulting",
    address: "456 Oak Ave, Floor 3",
    team: "Team Beta",
    frequency: "biweekly",
    day: "Wednesday",
    time: "14:00",
    duration: 240,
    status: "active",
    type: "deep",
    startDate: "2025-02-05",
    endDate: "2025-12-31",
    notes: "Include carpet cleaning",
    lastExecution: "2025-05-15",
    nextExecution: "2025-05-29",
  },
  {
    id: 3,
    title: "Monthly Window Cleaning",
    customer: "XYZ Commerce",
    address: "789 Pine St",
    team: "Team Gamma",
    frequency: "monthly",
    day: "First Friday",
    time: "10:00",
    duration: 180,
    status: "active",
    type: "specialized",
    startDate: "2025-01-03",
    endDate: "2025-12-31",
    notes: "External windows on floors 1-3",
    lastExecution: "2025-05-03",
    nextExecution: "2025-06-07",
  },
  {
    id: 4,
    title: "Daily Morning Cleaning",
    customer: "Delta Industries",
    address: "101 Maple Dr, Building B",
    team: "Team Alpha",
    frequency: "daily",
    day: "Every weekday",
    time: "06:00",
    duration: 90,
    status: "active",
    type: "regular",
    startDate: "2025-03-01",
    endDate: "2025-12-31",
    notes: "Before office hours",
    lastExecution: "2025-05-24",
    nextExecution: "2025-05-27",
  },
  {
    id: 5,
    title: "Quarterly Deep Cleaning",
    customer: "Omega Services",
    address: "202 Elm St, Suite 100",
    team: "Team Beta",
    frequency: "quarterly",
    day: "First Monday of quarter",
    time: "08:00",
    duration: 480,
    status: "paused",
    type: "deep",
    startDate: "2025-01-06",
    endDate: "2025-12-31",
    notes: "Full day deep cleaning",
    lastExecution: "2025-04-07",
    nextExecution: "2025-07-07",
  },
  {
    id: 6,
    title: "Weekly Carpet Cleaning",
    customer: "Global Tech",
    address: "303 Cedar Rd",
    team: "Team Gamma",
    frequency: "weekly",
    day: "Friday",
    time: "16:00",
    duration: 120,
    status: "active",
    type: "specialized",
    startDate: "2025-02-07",
    endDate: "2025-12-31",
    notes: "Focus on high-traffic areas",
    lastExecution: "2025-05-23",
    nextExecution: "2025-05-30",
  },
  {
    id: 7,
    title: "Monthly HVAC Cleaning",
    customer: "Innovate Inc",
    address: "404 Birch Blvd, Floor 5",
    team: "Team Alpha",
    frequency: "monthly",
    day: "Last Saturday",
    time: "09:00",
    duration: 360,
    status: "completed",
    type: "specialized",
    startDate: "2025-01-25",
    endDate: "2025-05-31",
    notes: "HVAC system maintenance and cleaning",
    lastExecution: "2025-05-25",
    nextExecution: null,
  },
]

export default function RecurrencesPage() {
  const {
    recurrences,
    loading,
    selectedRecurrence,
    filters,
    handleSearch,
    handleStatusFilter,
    handleTypeFilter,
    addRecurrence,
    editRecurrence,
    removeRecurrence,
    selectRecurrence,
  } = useRecurrences()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [recurrenceToDelete, setRecurrenceToDelete] = useState<any>(null)
  const { toast } = useToast()

  const handleAddRecurrence = (data: any) => {
    addRecurrence({
      ...data,
      customerId: data.customer, // Map the form field to the API field
      companyId: "comp_1", // Use the current company ID from context in a real app
    })
    setIsModalOpen(false)
    toast({
      title: "Recurrence added successfully",
      description: `${data.title} for ${data.customer} has been scheduled.`,
    })
  }

  const handleEditRecurrence = (data: any) => {
    if (selectedRecurrence) {
      editRecurrence(selectedRecurrence.id, {
        ...data,
        customerId: data.customer, // Map the form field to the API field
      })
      setIsModalOpen(false)
      toast({
        title: "Recurrence updated successfully",
        description: `${data.title} for ${data.customer} has been updated.`,
      })
    }
  }

  const handleDeleteRecurrence = () => {
    if (recurrenceToDelete) {
      removeRecurrence(recurrenceToDelete.id)
      setRecurrenceToDelete(null)
    }
  }

  const handleViewDetails = (recurrence: any) => {
    selectRecurrence(recurrence)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (recurrence: any) => {
    selectRecurrence(recurrence)
    setIsModalOpen(true)
  }

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
        return { label: "Regular", className: "border-blue-400 text-blue-400" }
      case "deep":
        return { label: "Deep", className: "border-purple-400 text-purple-400" }
      case "specialized":
        return { label: "Specialized", className: "border-orange-400 text-orange-400" }
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Recurrence Management</h1>
            <p className="text-gray-400">Manage all recurring cleaning services.</p>
          </div>
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              selectRecurrence(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Recurrence
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or customer..."
              value={filters.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-full md:w-[300px] bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select value={filters.status} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] bg-[#1a2234] border-[#2a3349] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                <SelectItem value="all" className="hover:bg-[#2a3349]">
                  All Statuses
                </SelectItem>
                <SelectItem value="active" className="hover:bg-[#2a3349]">
                  Active
                </SelectItem>
                <SelectItem value="paused" className="hover:bg-[#2a3349]">
                  Paused
                </SelectItem>
                <SelectItem value="completed" className="hover:bg-[#2a3349]">
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px] bg-[#1a2234] border-[#2a3349] text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                <SelectItem value="all" className="hover:bg-[#2a3349]">
                  All Types
                </SelectItem>
                <SelectItem value="regular" className="hover:bg-[#2a3349]">
                  Regular
                </SelectItem>
                <SelectItem value="deep" className="hover:bg-[#2a3349]">
                  Deep
                </SelectItem>
                <SelectItem value="specialized" className="hover:bg-[#2a3349]">
                  Specialized
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06b6d4]"></div>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#1a2234]">
                <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                  <TableHead className="text-white">Service</TableHead>
                  <TableHead className="text-white">Customer</TableHead>
                  <TableHead className="text-white">Frequency</TableHead>
                  <TableHead className="text-white">Next Execution</TableHead>
                  <TableHead className="text-white">Team</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recurrences.map((recurrence) => (
                  <TableRow key={recurrence.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#2a3349] p-1.5 rounded-md">
                          <RefreshCw className="h-4 w-4 text-[#06b6d4]" />
                        </div>
                        {recurrence.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{recurrence.customer}</TableCell>
                    <TableCell className="text-gray-400">
                      <div className="flex flex-col">
                        <span>{getFrequencyLabel(recurrence.frequency)}</span>
                        <span className="text-xs">{recurrence.day}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {recurrence.nextExecution ? (
                        <div className="flex flex-col">
                          <span>{recurrence.nextExecution}</span>
                          <span className="text-xs">{recurrence.time}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Completed</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-400">{recurrence.team}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeBadge(recurrence.type).className}>
                        {getTypeBadge(recurrence.type).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(recurrence.status).className}>
                        {getStatusBadge(recurrence.status).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(recurrence)}
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
                              onClick={() => handleEdit(recurrence)}
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
                              onClick={() => setRecurrenceToDelete(recurrence)}
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
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{recurrences.length}</span> of{" "}
            <span className="font-medium text-white">{recurrences.length}</span> recurrences
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

        <RecurrenceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            selectRecurrence(null)
          }}
          onSubmit={selectedRecurrence ? handleEditRecurrence : handleAddRecurrence}
          recurrence={selectedRecurrence}
        />

        <RecurrenceDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            selectRecurrence(null)
          }}
          recurrence={selectedRecurrence}
          onEdit={handleEdit}
          onDelete={setRecurrenceToDelete}
        />

        <AlertDialog open={!!recurrenceToDelete} onOpenChange={() => setRecurrenceToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the recurring service
                <span className="font-semibold text-white block mt-1">
                  {recurrenceToDelete?.title} for {recurrenceToDelete?.customer}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRecurrence}
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
