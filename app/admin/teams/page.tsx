"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
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

interface Company {
  id: number
  name: string
  cnpj: string
  responsible: string
  email: string
  phone: string
  planId: number
  planName?: string
  status: number
  createdDate: string
  updatedDate: string
}

interface Team {
  id: number
  name: string
  description?: string
  companyId: number
  company?: Company
  leaderId?: number
  region?: string
  status: number
  rating?: number
  completedServices?: number
  createdDate?: string
  updatedDate?: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("noah_token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`https://localhost:44394${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  const loadTeams = async () => {
    try {
      setIsLoading(true)
      const data = await apiCall("/api/Team?PageNumber=1&PageSize=100")
      console.log("Teams loaded:", data)
      setTeams(data.results || [])
    } catch (error) {
      console.error("Error loading teams:", error)
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      })
      setTeams([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadCompanies = async () => {
    try {
      const data = await apiCall("/api/Companies/paged?PageNumber=1&PageSize=100")
      console.log("Companies loaded:", data)
      setCompanies(data.result || [])
    } catch (error) {
      console.error("Error loading companies:", error)
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive",
      })
      setCompanies([])
    }
  }

  useEffect(() => {
    loadTeams()
    loadCompanies()
  }, [])

  const filteredTeams = (teams || []).filter(
    (team) =>
      team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.company?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTeam = async (data: any) => {
    try {
      const response = await apiCall("/api/Team", {
        method: "POST",
        body: JSON.stringify(data),
      })

      const newTeam = {
        id: Date.now(), // Temporary ID
        ...data,
        rating: 0,
        completedServices: 0,
        company: companies.find((c) => c.id === data.companyId),
      }

      setTeams([...teams, newTeam])
      setIsModalOpen(false)
      toast({
        title: "Team added successfully",
        description: `Team ${data.name} has been created.`,
      })
    } catch (error) {
      console.error("Error creating team:", error)
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      })
    }
  }

  const handleEditTeam = async (data: any) => {
    if (!selectedTeam) return

    try {
      await apiCall(`/api/Team/${selectedTeam.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })

      setTeams(
        teams.map((team) =>
          team.id === selectedTeam.id
            ? {
                ...team,
                ...data,
                company: companies.find((c) => c.id === data.companyId),
              }
            : team,
        ),
      )
      setSelectedTeam(null)
      setIsModalOpen(false)
      toast({
        title: "Team updated successfully",
        description: `Team ${data.name} has been updated.`,
      })
    } catch (error) {
      console.error("Error updating team:", error)
      toast({
        title: "Error",
        description: "Failed to update team",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return

    try {
      await apiCall(`/api/Team/${teamToDelete.id}`, {
        method: "DELETE",
      })

      setTeams(teams.filter((team) => team.id !== teamToDelete.id))
      toast({
        title: "Team deleted successfully",
        description: `Team ${teamToDelete.name} has been removed.`,
        variant: "destructive",
      })
      setTeamToDelete(null)
    } catch (error) {
      console.error("Error deleting team:", error)
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (team: Team) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status: number) => {
    return status === 1
      ? { label: "Active", className: "border-green-500 text-green-500" }
      : { label: "Inactive", className: "border-red-500 text-red-500" }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading teams...</div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Teams Management</h1>
            <p className="text-gray-400">Manage all teams across different companies in the system.</p>
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

        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px] bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
            />
          </div>
        </div>

        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1a2234]">
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-white">Team</TableHead>
                <TableHead className="text-white">Company</TableHead>
                <TableHead className="text-white">Region</TableHead>
                <TableHead className="text-white">Leader ID</TableHead>
                <TableHead className="text-white">Performance</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.length === 0 ? (
                <TableRow className="border-[#2a3349] bg-[#0f172a]">
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No teams found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeams.map((team) => (
                  <TableRow key={team.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-[#2a3349]">
                          <AvatarFallback className="bg-[#2a3349] text-[#06b6d4]">
                            {team.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "T"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{team.name || "N/A"}</div>
                          <div className="text-xs text-gray-400">{team.description || "No description"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{team.company?.name || "N/A"}</TableCell>
                    <TableCell className="text-gray-400">{team.region || "N/A"}</TableCell>
                    <TableCell className="text-gray-400">Leader #{team.leaderId || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          <div className="text-white">{team.rating || 0}/5.0</div>
                          <div className="text-xs text-gray-400">{team.completedServices || 0} services</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(team.status || 0).className}>
                        {getStatusBadge(team.status || 0).label}
                      </Badge>
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
                ))
              )}
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
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
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
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
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
          companies={companies}
          leaders={[]}
        />

        <TeamDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedTeam(null)
          }}
          team={selectedTeam}
          onEdit={handleEdit}
          onDelete={setTeamToDelete}
        />

        <AlertDialog open={!!teamToDelete} onOpenChange={() => setTeamToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the team
                <span className="font-semibold text-white block mt-1">{teamToDelete?.name}</span>
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
