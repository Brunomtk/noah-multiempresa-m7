"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Users } from "lucide-react"
import { TeamModal } from "@/components/admin/team-modal"
import { TeamDetailsModal } from "@/components/admin/team-details-modal"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample data
const initialTeams = [
  {
    id: 1,
    name: "Team Alpha",
    leader: "Maria Silva",
    region: "North Zone",
    members: 8,
    status: "active",
    description: "Specialized in residential cleaning",
    completedServices: 342,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Team Beta",
    leader: "João Santos",
    region: "South Zone",
    members: 6,
    status: "active",
    description: "Specialized in commercial cleaning",
    completedServices: 287,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Team Gamma",
    leader: "Ana Oliveira",
    region: "East Zone",
    members: 7,
    status: "active",
    description: "Specialized in post-construction cleaning",
    completedServices: 198,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Team Delta",
    leader: "Carlos Mendes",
    region: "West Zone",
    members: 5,
    status: "inactive",
    description: "Specialized in industrial cleaning",
    completedServices: 156,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Team Omega",
    leader: "Patricia Costa",
    region: "Central Zone",
    members: 9,
    status: "active",
    description: "Specialized in deep cleaning services",
    completedServices: 412,
    rating: 4.9,
  },
]

export default function TeamsPage() {
  const [teams, setTeams] = useState(initialTeams)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [teamToDelete, setTeamToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const handleAddTeam = (data: any) => {
    const newTeam = {
      id: teams.length + 1,
      ...data,
      completedServices: 0,
      rating: 0,
    }
    setTeams([...teams, newTeam])
    setIsModalOpen(false)
    toast({
      title: "Team added successfully",
      description: `${data.name} has been added to the system.`,
    })
  }

  const handleEditTeam = (data: any) => {
    setTeams(
      teams.map((team) =>
        team.id === selectedTeam.id
          ? { ...team, ...data, completedServices: team.completedServices, rating: team.rating }
          : team,
      ),
    )
    setSelectedTeam(null)
    setIsModalOpen(false)
    toast({
      title: "Team updated successfully",
      description: `${data.name} has been updated.`,
    })
  }

  const handleDeleteTeam = () => {
    if (teamToDelete) {
      setTeams(teams.filter((team) => team.id !== teamToDelete.id))
      toast({
        title: "Team deleted successfully",
        description: `${teamToDelete.name} has been removed from the system.`,
        variant: "destructive",
      })
      setTeamToDelete(null)
    }
  }

  const handleViewDetails = (team: any) => {
    setSelectedTeam(team)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (team: any) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || team.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Team Management</h1>
            <p className="text-gray-400">Manage all cleaning teams in the system.</p>
          </div>
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              setSelectedTeam(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Team
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, leader or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[300px] bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={
                statusFilter === "all"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
              }
            >
              All
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
              variant={statusFilter === "inactive" ? "default" : "outline"}
              onClick={() => setStatusFilter("inactive")}
              className={
                statusFilter === "inactive"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
              }
            >
              Inactive
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1a2234]">
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-white">Team</TableHead>
                <TableHead className="text-white">Leader</TableHead>
                <TableHead className="text-white">Region</TableHead>
                <TableHead className="text-white text-center">Members</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-center">Rating</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#2a3349] p-1.5 rounded-md">
                        <Users className="h-4 w-4 text-[#06b6d4]" />
                      </div>
                      {team.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-[#2a3349]">
                        <AvatarFallback className="bg-[#2a3349] text-[#06b6d4] text-xs">
                          {team.leader
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {team.leader}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{team.region}</TableCell>
                  <TableCell className="text-center text-gray-400">{team.members}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        team.status === "active" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                      }
                    >
                      {team.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-white">{team.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(team)}
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
                            onClick={() => handleEdit(team)}
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
                            onClick={() => setTeamToDelete(team)}
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
            Showing <span className="font-medium text-white">{filteredTeams.length}</span> of{" "}
            <span className="font-medium text-white">{teams.length}</span> teams
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
              Next
            </Button>
          </div>
        </div>

        <TeamModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTeam(null)
          }}
          onSubmit={selectedTeam ? handleEditTeam : handleAddTeam}
          team={selectedTeam}
        />

        <TeamDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedTeam(null)
          }}
          team={selectedTeam}
        />

        <AlertDialog open={!!teamToDelete} onOpenChange={() => setTeamToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the team{" "}
                <span className="font-semibold text-white">{teamToDelete?.name}</span> from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTeam} className="bg-red-600 hover:bg-red-700 text-white border-0">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
