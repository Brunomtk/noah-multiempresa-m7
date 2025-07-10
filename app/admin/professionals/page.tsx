"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Calendar } from "lucide-react"
import { ProfessionalModal } from "@/components/admin/professional-modal"
import { ProfessionalDetailsModal } from "@/components/admin/professional-details-modal"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data
const initialProfessionals = [
  {
    id: 1,
    name: "Maria Silva",
    cpf: "123.456.789-00",
    team: "Team Alpha",
    status: "active",
    phone: "(11) 98765-4321",
    email: "maria.silva@noah.com",
    shift: "morning",
    weeklyHours: 40,
    photo: "",
    observations: "Excellent professional, always punctual",
    rating: 4.8,
    completedServices: 156,
  },
  {
    id: 2,
    name: "Ana Santos",
    cpf: "987.654.321-00",
    team: "Team Beta",
    status: "active",
    phone: "(11) 91234-5678",
    email: "ana.santos@noah.com",
    shift: "afternoon",
    weeklyHours: 40,
    photo: "",
    observations: "",
    rating: 4.9,
    completedServices: 203,
  },
  {
    id: 3,
    name: "Carla Oliveira",
    cpf: "456.789.012-34",
    team: "Team Alpha",
    status: "on_leave",
    phone: "(11) 94567-8901",
    email: "carla.oliveira@noah.com",
    shift: "morning",
    weeklyHours: 30,
    photo: "",
    observations: "On maternity leave until next month",
    rating: 4.7,
    completedServices: 98,
  },
  {
    id: 4,
    name: "Patricia Costa",
    cpf: "345.678.901-23",
    team: "Team Gamma",
    status: "active",
    phone: "(11) 93456-7890",
    email: "patricia.costa@noah.com",
    shift: "night",
    weeklyHours: 36,
    photo: "",
    observations: "",
    rating: 4.6,
    completedServices: 124,
  },
  {
    id: 5,
    name: "Fernanda Lima",
    cpf: "567.890.123-45",
    team: "Team Beta",
    status: "in_service",
    phone: "(11) 95678-9012",
    email: "fernanda.lima@noah.com",
    shift: "afternoon",
    weeklyHours: 40,
    photo: "",
    observations: "Specialized in deep cleaning",
    rating: 5.0,
    completedServices: 178,
  },
]

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState(initialProfessionals)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null)
  const [professionalToDelete, setProfessionalToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const { toast } = useToast()

  const handleAddProfessional = (data: any) => {
    const newProfessional = {
      id: professionals.length + 1,
      ...data,
      rating: 0,
      completedServices: 0,
    }
    setProfessionals([...professionals, newProfessional])
    setIsModalOpen(false)
    toast({
      title: "Professional added successfully",
      description: `${data.name} has been added to the system.`,
    })
  }

  const handleEditProfessional = (data: any) => {
    setProfessionals(
      professionals.map((professional) =>
        professional.id === selectedProfessional.id
          ? { ...professional, ...data, rating: professional.rating, completedServices: professional.completedServices }
          : professional,
      ),
    )
    setSelectedProfessional(null)
    setIsModalOpen(false)
    toast({
      title: "Professional updated successfully",
      description: `${data.name} has been updated.`,
    })
  }

  const handleDeleteProfessional = () => {
    if (professionalToDelete) {
      setProfessionals(professionals.filter((professional) => professional.id !== professionalToDelete.id))
      toast({
        title: "Professional deleted successfully",
        description: `${professionalToDelete.name} has been removed from the system.`,
        variant: "destructive",
      })
      setProfessionalToDelete(null)
    }
  }

  const handleViewDetails = (professional: any) => {
    setSelectedProfessional(professional)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (professional: any) => {
    setSelectedProfessional(professional)
    setIsModalOpen(true)
  }

  const handleViewSchedule = (professional: any) => {
    toast({
      title: "Professional Schedule",
      description: `Viewing schedule for ${professional.name}`,
    })
  }

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch =
      professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.cpf.includes(searchQuery) ||
      professional.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || professional.status === statusFilter
    const matchesTeam = teamFilter === "all" || professional.team === teamFilter
    return matchesSearch && matchesStatus && matchesTeam
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", className: "border-green-500 text-green-500" }
      case "in_service":
        return { label: "In Service", className: "border-blue-500 text-blue-500" }
      case "on_leave":
        return { label: "On Leave", className: "border-yellow-500 text-yellow-500" }
      default:
        return { label: status, className: "border-gray-500 text-gray-500" }
    }
  }

  const teams = ["Team Alpha", "Team Beta", "Team Gamma"]

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Professional Management</h1>
            <p className="text-gray-400">Manage all cleaning professionals in the system.</p>
          </div>
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              setSelectedProfessional(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Professional
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, CPF or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full lg:w-[300px] bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={
                  statusFilter === "all"
                    ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                    : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
                }
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => setStatusFilter("active")}
                className={
                  statusFilter === "active"
                    ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                    : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
                }
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "in_service" ? "default" : "outline"}
                onClick={() => setStatusFilter("in_service")}
                className={
                  statusFilter === "in_service"
                    ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                    : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
                }
              >
                In Service
              </Button>
            </div>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3 py-2 bg-[#1a2234] border border-[#2a3349] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1a2234]">
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-white">Professional</TableHead>
                <TableHead className="text-white">CPF</TableHead>
                <TableHead className="text-white">Team</TableHead>
                <TableHead className="text-white">Phone</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-center">Rating</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals.map((professional) => (
                <TableRow key={professional.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-[#2a3349]">
                        <AvatarImage src={professional.photo || "/placeholder.svg"} />
                        <AvatarFallback className="bg-[#2a3349] text-[#06b6d4]">
                          {professional.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{professional.name}</p>
                        <p className="text-xs text-gray-400">{professional.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{professional.cpf}</TableCell>
                  <TableCell className="text-gray-400">{professional.team}</TableCell>
                  <TableCell className="text-gray-400">{professional.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(professional.status).className}>
                      {getStatusBadge(professional.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-white">{professional.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(professional)}
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
                            onClick={() => handleEdit(professional)}
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
                            onClick={() => handleViewSchedule(professional)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Schedule</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setProfessionalToDelete(professional)}
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
            Showing <span className="font-medium text-white">{filteredProfessionals.length}</span> of{" "}
            <span className="font-medium text-white">{professionals.length}</span> professionals
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
              3
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

        <ProfessionalModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProfessional(null)
          }}
          onSubmit={selectedProfessional ? handleEditProfessional : handleAddProfessional}
          professional={selectedProfessional}
        />

        <ProfessionalDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedProfessional(null)
          }}
          professional={selectedProfessional}
        />

        <AlertDialog open={!!professionalToDelete} onOpenChange={() => setProfessionalToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the professional{" "}
                <span className="font-semibold text-white">{professionalToDelete?.name}</span> from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProfessional}
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
