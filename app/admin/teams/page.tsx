"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TeamModal } from "@/components/admin/team-modal"
import { TeamDetailsModal } from "@/components/admin/team-details-modal"
import { Plus, Search, Eye, Edit, Trash2, Users, MapPin, Building } from "lucide-react"
import type { Team, Leader } from "@/types"
import { teamsApi } from "@/lib/api/teams"
import { leadersApi } from "@/lib/api/leaders"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadTeams()
    loadLeaders()
  }, [currentPage, statusFilter])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await teamsApi.getAll(currentPage, 10, statusFilter)
      setTeams(response.results)
      setTotalPages(response.pageCount)
    } catch (error) {
      console.error("Failed to load teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadLeaders = async () => {
    try {
      const leadersData = await leadersApi.getAll()
      setLeaders(leadersData)
    } catch (error) {
      console.error("Failed to load leaders:", error)
    }
  }

  const handleCreateTeam = async (data: any) => {
    try {
      const teamData = {
        name: data.name,
        leaderId: Number.parseInt(data.leaderId),
        region: data.region,
        description: data.description,
        companyId: Number.parseInt(data.companyId),
      }

      await teamsApi.create(teamData)
      await loadTeams()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to create team:", error)
    }
  }

  const handleUpdateTeam = async (data: any) => {
    if (!selectedTeam) return

    try {
      const teamData = {
        id: selectedTeam.id,
        createdDate: selectedTeam.createdDate,
        updatedDate: new Date().toISOString(),
        name: data.name,
        region: data.region,
        description: data.description,
        rating: selectedTeam.rating,
        completedServices: selectedTeam.completedServices,
        status: data.status === "active" ? 1 : 0,
        companyId: Number.parseInt(data.companyId),
        leaderId: Number.parseInt(data.leaderId),
      }

      await teamsApi.update(selectedTeam.id, teamData)
      await loadTeams()
      setIsModalOpen(false)
      setSelectedTeam(null)
    } catch (error) {
      console.error("Failed to update team:", error)
    }
  }

  const handleDeleteTeam = async (id: number) => {
    if (confirm("Are you sure you want to delete this team?")) {
      try {
        await teamsApi.delete(id)
        await loadTeams()
      } catch (error) {
        console.error("Failed to delete team:", error)
      }
    }
  }

  const openEditModal = (team: Team) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  const openDetailsModal = (team: Team) => {
    setSelectedTeam(team)
    setIsDetailsModalOpen(true)
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.company?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inactive</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Teams</h1>
          <p className="text-gray-400">Manage your teams and their assignments</p>
        </div>
        <Button
          onClick={() => {
            setSelectedTeam(null)
            setIsModalOpen(true)
          }}
          className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-[#06b6d4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{teams.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Teams</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{teams.filter((team) => team.status === 1).length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Regions</CardTitle>
            <MapPin className="h-4 w-4 text-[#06b6d4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{new Set(teams.map((team) => team.region)).size}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Companies</CardTitle>
            <Building className="h-4 w-4 text-[#06b6d4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{new Set(teams.map((team) => team.companyId)).size}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Teams List</CardTitle>
              <CardDescription className="text-gray-400">Manage and organize your teams</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-[#0f172a] border-[#2a3349] text-white w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]/50">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Leader</TableHead>
                <TableHead className="text-gray-400">Region</TableHead>
                <TableHead className="text-gray-400">Company</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Services</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                    Loading teams...
                  </TableCell>
                </TableRow>
              ) : filteredTeams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                    No teams found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeams.map((team) => (
                  <TableRow key={team.id} className="border-[#2a3349] hover:bg-[#2a3349]/50">
                    <TableCell className="text-white font-medium">{team.name}</TableCell>
                    <TableCell className="text-gray-300">
                      {leaders.find((l) => l.id === team.leaderId)?.name || "Not assigned"}
                    </TableCell>
                    <TableCell className="text-gray-300">{team.region}</TableCell>
                    <TableCell className="text-gray-300">{team.company?.name || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(team.status)}</TableCell>
                    <TableCell className="text-gray-300">{team.completedServices}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsModal(team)}
                          className="text-gray-400 hover:text-white hover:bg-[#2a3349]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(team)}
                          className="text-gray-400 hover:text-white hover:bg-[#2a3349]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTeam(null)
        }}
        onSubmit={selectedTeam ? handleUpdateTeam : handleCreateTeam}
        team={selectedTeam}
        leaders={leaders}
      />

      <TeamDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedTeam(null)
        }}
        team={selectedTeam}
      />
    </div>
  )
}
