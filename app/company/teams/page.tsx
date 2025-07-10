"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Users, Calendar, Clock, User, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TeamModal } from "@/components/company/team-modal"
import { TeamDetailsModal } from "@/components/company/team-details-modal"

// Mock data for teams
const mockTeams = [
  {
    id: 1,
    name: "Alpha Team",
    supervisor: "Maria Silva",
    shift: "Morning (6AM-2PM)",
    members: [
      { id: 1, name: "Maria Silva", role: "Team Leader", experience: "5 years", rating: 4.8 },
      { id: 2, name: "João Oliveira", role: "Senior Cleaner", experience: "3 years", rating: 4.7 },
      { id: 4, name: "Carlos Pereira", role: "Cleaner", experience: "1 year", rating: 4.5 },
      { id: 5, name: "Fernanda Lima", role: "Cleaner", experience: "4 years", rating: 4.8 },
    ],
    appointments: 12,
    completedServices: 45,
    rating: 4.8,
    status: "active",
    description: "Specialized in commercial cleaning for office buildings and retail spaces.",
    serviceTypes: ["Commercial Cleaning", "Deep Cleaning", "Regular Cleaning"],
  },
  {
    id: 2,
    name: "Beta Team",
    supervisor: "John Davis",
    shift: "Afternoon (2PM-10PM)",
    members: [
      { id: 6, name: "John Davis", role: "Team Leader", experience: "4 years", rating: 4.6 },
      { id: 7, name: "Ana Martins", role: "Cleaner", experience: "2 years", rating: 4.5 },
      { id: 8, name: "Pedro Santos", role: "Cleaner", experience: "1 year", rating: 4.3 },
    ],
    appointments: 8,
    completedServices: 32,
    rating: 4.6,
    status: "active",
    description: "Specialized in residential cleaning and post-construction services.",
    serviceTypes: ["Residential Cleaning", "Post-Construction Cleaning", "Window Cleaning"],
  },
  {
    id: 3,
    name: "Gamma Team",
    supervisor: "Sarah Johnson",
    shift: "Evening (10PM-6AM)",
    members: [
      { id: 9, name: "Sarah Johnson", role: "Team Leader", experience: "6 years", rating: 4.9 },
      { id: 10, name: "Miguel Costa", role: "Senior Cleaner", experience: "4 years", rating: 4.7 },
    ],
    appointments: 5,
    completedServices: 28,
    rating: 4.9,
    status: "active",
    description: "Night shift team specialized in cleaning commercial spaces after business hours.",
    serviceTypes: ["Commercial Cleaning", "Deep Cleaning"],
  },
  {
    id: 4,
    name: "Delta Team",
    supervisor: "Robert Brown",
    shift: "Morning (6AM-2PM)",
    members: [
      { id: 11, name: "Robert Brown", role: "Team Leader", experience: "7 years", rating: 4.7 },
      { id: 12, name: "Carla Ferreira", role: "Senior Cleaner", experience: "5 years", rating: 4.8 },
      { id: 13, name: "Lucas Mendes", role: "Cleaner", experience: "2 years", rating: 4.5 },
      { id: 14, name: "Sofia Almeida", role: "Cleaner", experience: "1 year", rating: 4.4 },
      { id: 15, name: "Bruno Castro", role: "Cleaner", experience: "3 years", rating: 4.6 },
    ],
    appointments: 15,
    completedServices: 52,
    rating: 4.7,
    status: "active",
    description: "Large team specialized in handling multiple residential properties simultaneously.",
    serviceTypes: ["Residential Cleaning", "Deep Cleaning", "Carpet Cleaning", "Window Cleaning"],
  },
  {
    id: 5,
    name: "Omega Team",
    supervisor: "Jennifer Lee",
    shift: "Flexible",
    members: [],
    appointments: 0,
    completedServices: 0,
    rating: 0,
    status: "inactive",
    description: "New team being formed, currently recruiting members.",
    serviceTypes: [],
  },
]

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [shiftFilter, setShiftFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  // Filter teams based on search term and filters
  const filteredTeams = mockTeams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.supervisor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || team.status === statusFilter

    const matchesShift =
      shiftFilter === "all" ||
      (shiftFilter === "morning" && team.shift.includes("Morning")) ||
      (shiftFilter === "afternoon" && team.shift.includes("Afternoon")) ||
      (shiftFilter === "evening" && team.shift.includes("Evening")) ||
      (shiftFilter === "flexible" && team.shift.includes("Flexible"))

    return matchesSearch && matchesStatus && matchesShift
  })

  const handleCreateTeam = () => {
    setSelectedTeam(null)
    setIsModalOpen(true)
  }

  const handleEditTeam = (team: any) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
    setIsDetailsModalOpen(false)
  }

  const handleViewTeamDetails = (team: any) => {
    setSelectedTeam(team)
    setIsDetailsModalOpen(true)
  }

  const handleSubmitTeam = (data: any) => {
    console.log("Team data submitted:", data)
    setIsModalOpen(false)
    // In a real app, you would update the team data here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Teams</h1>
          <p className="text-gray-400">Manage your cleaning teams and their assignments</p>
        </div>
        <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white" onClick={handleCreateTeam}>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Active Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <Users className="h-5 w-5 text-[#06b6d4]" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">
                {mockTeams.filter((team) => team.status === "active").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Total Professionals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <User className="h-5 w-5 text-[#06b6d4]" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">
                {mockTeams.reduce((sum, team) => sum + team.members.length, 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-[#06b6d4]" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">
                {mockTeams.reduce((sum, team) => sum + team.appointments, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search teams..."
                className="pl-8 bg-[#2a3349] border-0 text-white placeholder:text-gray-500 focus-visible:ring-[#06b6d4]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-400">Filters:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] bg-[#2a3349] border-0 text-white focus:ring-[#06b6d4]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger className="w-[130px] bg-[#2a3349] border-0 text-white focus:ring-[#06b6d4]">
                  <SelectValue placeholder="Shift" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-gray-400">Team Name</TableHead>
                <TableHead className="text-gray-400">Supervisor</TableHead>
                <TableHead className="text-gray-400">Shift</TableHead>
                <TableHead className="text-gray-400">Members</TableHead>
                <TableHead className="text-gray-400">Appointments</TableHead>
                <TableHead className="text-gray-400">Rating</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <TableRow key={team.id} className="border-[#2a3349] hover:bg-[#2a3349]">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#2a3349] p-2 rounded-full">
                          <Users className="h-4 w-4 text-[#06b6d4]" />
                        </div>
                        {team.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{team.supervisor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {team.shift}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{team.members.length}</TableCell>
                    <TableCell className="text-gray-400">{team.appointments}</TableCell>
                    <TableCell>
                      {team.rating > 0 ? (
                        <div className="flex items-center">
                          <div className="bg-[#2a3349] px-1.5 py-0.5 rounded flex items-center">
                            <span className="text-white mr-1">{team.rating}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3 h-3 text-yellow-500"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          team.status === "active"
                            ? "bg-green-500/20 text-green-500 border-green-500"
                            : "bg-gray-500/20 text-gray-400 border-gray-500"
                        }
                      >
                        {team.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                          onClick={() => handleViewTeamDetails(team)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                          onClick={() => handleEditTeam(team)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-400">
                    No teams found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Team Modal for creating/editing teams */}
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTeam}
        team={selectedTeam}
      />

      {/* Team Details Modal */}
      <TeamDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={handleEditTeam}
        team={selectedTeam}
      />
    </div>
  )
}
