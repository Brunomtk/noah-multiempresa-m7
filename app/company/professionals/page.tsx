"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, User, Phone, Clock, Users, Star, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfessionalModal } from "@/components/company/professional-modal"
import { ProfessionalDetailsModal } from "@/components/company/professional-details-modal"

// Mock data for professionals
const mockProfessionals = [
  {
    id: 1,
    name: "Maria Santos",
    document: "123.456.789-00",
    phone: "(555) 123-4567",
    email: "maria.santos@example.com",
    team: "Alpha Team",
    shift: "Morning",
    role: "Senior Cleaner",
    rating: 4.8,
    completedServices: 45,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&query=MS",
    skills: ["Regular Cleaning", "Deep Cleaning", "Window Cleaning"],
    startDate: "2020-03-10",
  },
  {
    id: 2,
    name: "João Silva",
    document: "987.654.321-00",
    phone: "(555) 987-6543",
    email: "joao.silva@example.com",
    team: "Beta Team",
    shift: "Afternoon",
    role: "Cleaner",
    rating: 4.5,
    completedServices: 32,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&query=JS",
    skills: ["Regular Cleaning", "Carpet Cleaning"],
    startDate: "2021-05-15",
  },
  {
    id: 3,
    name: "Ana Oliveira",
    document: "456.789.123-00",
    phone: "(555) 456-7890",
    email: "ana.oliveira@example.com",
    team: "Gamma Team",
    shift: "Evening",
    role: "Team Leader",
    rating: 4.9,
    completedServices: 58,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&query=AO",
    skills: ["Regular Cleaning", "Deep Cleaning", "Commercial Cleaning", "Residential Cleaning"],
    startDate: "2019-11-20",
  },
  {
    id: 4,
    name: "Carlos Pereira",
    document: "789.123.456-00",
    phone: "(555) 789-1234",
    email: "carlos.pereira@example.com",
    team: "Alpha Team",
    shift: "Morning",
    role: "Cleaner",
    rating: 4.2,
    completedServices: 27,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&query=CP",
    skills: ["Regular Cleaning", "Window Cleaning"],
    startDate: "2022-01-10",
  },
  {
    id: 5,
    name: "Fernanda Lima",
    document: "321.654.987-00",
    phone: "(555) 321-6549",
    email: "fernanda.lima@example.com",
    team: "Delta Team",
    shift: "Afternoon",
    role: "Specialist",
    rating: 4.7,
    completedServices: 41,
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40&query=FL",
    skills: ["Deep Cleaning", "Post-construction Cleaning", "Sanitization"],
    startDate: "2020-08-05",
  },
]

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [teamFilter, setTeamFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleOpenDetailsModal = (professional: any) => {
    setSelectedProfessional(professional)
    setIsDetailsModalOpen(true)
  }

  const handleOpenEditModal = (professional: any = null) => {
    setSelectedProfessional(professional)
    setIsEditModalOpen(true)
  }

  const handleSubmitProfessional = (data: any) => {
    // In a real application, this would update the database
    console.log("Professional data submitted:", data)
    setIsEditModalOpen(false)
    // Would refresh the data here
  }

  const filteredProfessionals = mockProfessionals.filter((professional) => {
    const matchesSearch =
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.document.includes(searchTerm) ||
      professional.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.phone.includes(searchTerm)

    const matchesTeam = teamFilter === "all" || professional.team === teamFilter
    const matchesStatus = statusFilter === "all" || professional.status === statusFilter
    const matchesTab = activeTab === "all" || professional.status === activeTab

    return matchesSearch && matchesTeam && matchesStatus && matchesTab
  })

  // Get unique teams for filter
  const teams = Array.from(new Set(mockProfessionals.map((p) => p.team)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Professionals</h1>
          <p className="text-gray-400">Manage your cleaning professionals and track their performance</p>
        </div>
        <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white" onClick={() => handleOpenEditModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Professional
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Active Professionals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <User className="h-5 w-5 text-[#06b6d4]" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">
                {mockProfessionals.filter((p) => p.status === "active").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <Star className="h-5 w-5 text-[#06b6d4]" />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-white">
                  {(mockProfessionals.reduce((sum, p) => sum + p.rating, 0) / mockProfessionals.length).toFixed(1)}
                </span>
                <Star className="h-5 w-5 text-yellow-500 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Completed Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <Clock className="h-5 w-5 text-[#06b6d4]" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">
                {mockProfessionals.reduce((sum, p) => sum + p.completedServices, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-[#0f172a] border border-[#2a3349]">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#2a3349]">
                All Professionals
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-[#2a3349]">
                Active
              </TabsTrigger>
              <TabsTrigger value="inactive" className="data-[state=active]:bg-[#2a3349]">
                Inactive
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search professionals..."
                className="pl-8 bg-[#2a3349] border-0 text-white placeholder:text-gray-500 focus-visible:ring-[#06b6d4]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#2a3349] border-0 text-white focus:ring-[#06b6d4]">
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#2a3349] border-0 text-white focus:ring-[#06b6d4]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-gray-400">Professional</TableHead>
                <TableHead className="text-gray-400">Contact</TableHead>
                <TableHead className="text-gray-400">Team</TableHead>
                <TableHead className="text-gray-400">Role</TableHead>
                <TableHead className="text-gray-400">Rating</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals.length > 0 ? (
                filteredProfessionals.map((professional) => (
                  <TableRow key={professional.id} className="border-[#2a3349] hover:bg-[#2a3349]">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={professional.avatar || "/placeholder.svg"} alt={professional.name} />
                          <AvatarFallback className="bg-[#2a3349] text-[#06b6d4]">
                            {professional.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{professional.name}</div>
                          <div className="text-xs text-gray-400">{professional.document}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-500" />
                          {professional.phone}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3 text-gray-500" />
                          {professional.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="h-3 w-3 text-gray-500" />
                        {professional.team}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{professional.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-white font-medium">{professional.rating}</span>
                        <Star className="h-3 w-3 text-yellow-500 ml-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          professional.status === "active"
                            ? "bg-green-500/20 text-green-500 border-green-500"
                            : "bg-gray-500/20 text-gray-400 border-gray-500"
                        }
                      >
                        {professional.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                          onClick={() => handleOpenDetailsModal(professional)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                          onClick={() => handleOpenEditModal(professional)}
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
                    No professionals found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProfessionalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmitProfessional}
        professional={selectedProfessional}
      />

      <ProfessionalDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={handleOpenEditModal}
        professional={selectedProfessional}
      />
    </div>
  )
}
