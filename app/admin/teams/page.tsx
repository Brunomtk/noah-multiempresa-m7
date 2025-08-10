"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getApiUrl } from "@/lib/api/utils"

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [teamToDelete, setTeamToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const { toast } = useToast()

  // Helper function to make API calls with authentication
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("noah_token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    // Clean up URL to avoid double /api/api/
    const cleanUrl = url.startsWith("/api/") ? url.substring(4) : url
    const fullUrl = `${getApiUrl()}${cleanUrl}`

    console.log("Making API call to:", fullUrl)

    const response = await fetch(fullUrl, {
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

  useEffect(() => {
    loadTeams()
    loadCompanies()
  }, [])

  const loadTeams = async () => {
    try {
      setIsLoading(true)
      console.log("Loading teams...")

      // Try multiple endpoints for teams
      const endpoints = [
        "/Team?PageNumber=1&PageSize=100",
        "/Teams?PageNumber=1&PageSize=100",
        "/api/Team?PageNumber=1&PageSize=100",
        "/api/Teams?PageNumber=1&PageSize=100",
      ]

      let data = null
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`)
          data = await apiCall(endpoint)
          console.log(`Success with endpoint: ${endpoint}`, data)
          break
        } catch (error) {
          console.log(`Failed endpoint: ${endpoint}`, error)
          continue
        }
      }

      if (data) {
        const teamsData = data.results || data.result || data.data || []
        console.log("Teams loaded:", teamsData)
        setTeams(teamsData)
      } else {
        console.warn("No teams data received from any endpoint")
        setTeams([])
      }
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
      console.log("Loading companies...")

      // Try multiple endpoints for companies
      const endpoints = [
        "/Companies/paged?PageNumber=1&PageSize=100",
        "/Company?PageNumber=1&PageSize=100",
        "/api/Companies/paged?PageNumber=1&PageSize=100",
        "/api/Company?PageNumber=1&PageSize=100",
      ]

      let data = null
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying companies endpoint: ${endpoint}`)
          data = await apiCall(endpoint)
          console.log(`Success with companies endpoint: ${endpoint}`, data)
          break
        } catch (error) {
          console.log(`Failed companies endpoint: ${endpoint}`, error)
          continue
        }
      }

      if (data) {
        const companiesData = data.result || data.results || data.data || []
        console.log("Companies loaded:", companiesData)
        setCompanies(companiesData)
      } else {
        console.warn("No companies data received from any endpoint")
        setCompanies([])
      }
    } catch (error) {
      console.error("Error loading companies:", error)
      setCompanies([])
    }
  }

  const handleAddTeam = async (data: any) => {
    try {
      console.log("Adding team:", data)
      const newTeam = await apiCall("/Team", {
        method: "POST",
        body: JSON.stringify(data),
      })
      setTeams([...teams, newTeam])
      setIsModalOpen(false)
      toast({
        title: "Team added successfully",
        description: `Team ${data.name} has been created.`,
      })
    } catch (error) {
      console.error("Error adding team:", error)
      toast({
        title: "Error",
        description: "Failed to add team",
        variant: "destructive",
      })
    }
  }

  const handleEditTeam = async (data: any) => {
    try {
      console.log("Editing team:", selectedTeam.id, data)
      const updatedTeam = await apiCall(`/Team/${selectedTeam.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      setTeams(teams.map((team) => (team.id === selectedTeam.id ? updatedTeam : team)))
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
    if (teamToDelete) {
      try {
        console.log("Deleting team:", teamToDelete.id)
        await apiCall(`/Team/${teamToDelete.id}`, {
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
    const matchesSearch = (team.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || team.status === statusFilter
    const matchesCompany = companyFilter === "all" || team.companyId?.toString() === companyFilter
    return matchesSearch && matchesStatus && matchesCompany
  })

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return { label: "Active", className: "border-green-500 text-green-500" }
      case "inactive":
        return { label: "Inactive", className: "border-red-500 text-red-500" }
      default:
        return { label: status || "Unknown", className: "border-gray-500 text-gray-500" }
    }
  }

  const getCompanyName = (companyId: number) => {
    const company = companies.find((c) => c.id === companyId)
    return company?.name || company?.companyName || "Unknown Company"
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
            <p className="text-gray-400">Manage teams and their members across all companies in the system.</p>
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
              placeholder="Search teams..."
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
                <SelectItem value="active" className="hover:bg-[#2a3349]">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="hover:bg-[#2a3349]">
                  Inactive
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
                  <SelectItem key={company.id} value={company.id.toString()} className="hover:bg-[#2a3349]">
                    {company.name || company.companyName}
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
                <TableHead className="text-white">Team</TableHead>
                <TableHead className="text-white">Company</TableHead>
                <TableHead className="text-white">Members</TableHead>
                <TableHead className="text-white">Leader</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-[#2a3349]">
                        <AvatarFallback className="bg-[#2a3349] text-[#06b6d4]">
                          {(team.name || "")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{team.name}</div>
                        <div className="text-xs text-gray-400">{team.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{getCompanyName(team.companyId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{team.memberCount || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{team.leaderName || "Not assigned"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(team.status).className}>
                      {getStatusBadge(team.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {team.createdDate ? new Date(team.createdDate).toLocaleDateString() : "N/A"}
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
