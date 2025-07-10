"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User, Route } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for professionals
const mockProfessionals = [
  {
    id: 1,
    name: "Maria Santos",
    team: "Alpha Team",
    avatar: "/placeholder.svg?height=40&width=40&query=MS",
    status: "on-service",
    location: "123 Main St, Suite 500",
    client: "Acme Corporation",
    lastUpdate: "2 min ago",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "João Silva",
    team: "Beta Team",
    avatar: "/placeholder.svg?height=40&width=40&query=JS",
    status: "on-service",
    location: "456 Oak Ave",
    client: "John Smith",
    lastUpdate: "5 min ago",
    coordinates: { lat: 40.7148, lng: -74.013 },
  },
  {
    id: 3,
    name: "Ana Oliveira",
    team: "Gamma Team",
    avatar: "/placeholder.svg?height=40&width=40&query=AO",
    status: "traveling",
    location: "En route to 789 Business Blvd",
    client: "Tech Solutions Inc",
    lastUpdate: "1 min ago",
    coordinates: { lat: 40.7218, lng: -74.009 },
  },
  {
    id: 4,
    name: "Carlos Pereira",
    team: "Alpha Team",
    avatar: "/placeholder.svg?height=40&width=40&query=CP",
    status: "off-duty",
    location: "Office",
    client: "-",
    lastUpdate: "30 min ago",
    coordinates: { lat: 40.7158, lng: -74.001 },
  },
  {
    id: 5,
    name: "Fernanda Lima",
    team: "Delta Team",
    avatar: "/placeholder.svg?height=40&width=40&query=FL",
    status: "on-service",
    location: "321 Pine St",
    client: "Sarah Johnson",
    lastUpdate: "8 min ago",
    coordinates: { lat: 40.7198, lng: -74.003 },
  },
]

export default function GPSTrackingPage() {
  const [teamFilter, setTeamFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProfessional, setSelectedProfessional] = useState(null)

  const filteredProfessionals = mockProfessionals.filter((professional) => {
    const matchesTeam = teamFilter === "all" || professional.team === teamFilter
    const matchesStatus = statusFilter === "all" || professional.status === statusFilter

    return matchesTeam && matchesStatus
  })

  // Get unique teams for filter
  const teams = Array.from(new Set(mockProfessionals.map((p) => p.team)))

  const getStatusColor = (status) => {
    switch (status) {
      case "on-service":
        return "bg-green-500/20 text-green-500 border-green-500"
      case "traveling":
        return "bg-blue-500/20 text-blue-500 border-blue-500"
      case "off-duty":
        return "bg-gray-500/20 text-gray-400 border-gray-500"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "on-service":
        return "On Service"
      case "traveling":
        return "Traveling"
      case "off-duty":
        return "Off Duty"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">GPS Tracking</h1>
          <p className="text-gray-400">Track your cleaning professionals in real-time</p>
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
              <SelectItem value="on-service">On Service</SelectItem>
              <SelectItem value="traveling">Traveling</SelectItem>
              <SelectItem value="off-duty">Off Duty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#1a2234] border-[#2a3349] h-[500px]">
            <CardHeader>
              <CardTitle className="text-white text-lg">Live Map</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[400px] bg-[#2a3349] rounded-md">
              <div className="text-center text-gray-400">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-[#06b6d4]" />
                <p>Map view would be displayed here</p>
                <p className="text-sm mt-2">Showing {filteredProfessionals.length} professionals</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardHeader>
              <CardTitle className="text-white text-lg">Professionals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[420px] overflow-y-auto">
              {filteredProfessionals.length > 0 ? (
                filteredProfessionals.map((professional) => (
                  <div
                    key={professional.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedProfessional === professional.id
                        ? "bg-[#2a3349] border border-[#06b6d4]"
                        : "bg-[#2a3349] hover:bg-[#343e59]"
                    }`}
                    onClick={() => setSelectedProfessional(professional.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
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
                          <div className="font-medium text-white">{professional.name}</div>
                          <div className="text-xs text-gray-400">{professional.team}</div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(professional.status)}>
                        {getStatusLabel(professional.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1 text-gray-400">
                        <MapPin className="h-3 w-3 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{professional.location}</span>
                      </div>
                      {professional.status !== "off-duty" && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <User className="h-3 w-3 text-gray-500 flex-shrink-0" />
                          <span>{professional.client}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                        <span>Updated {professional.lastUpdate}</span>
                      </div>
                    </div>
                    {professional.status !== "off-duty" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 h-8 border-[#2a3349] text-white hover:bg-[#343e59]"
                      >
                        <Route className="h-3 w-3 mr-1" />
                        View Route
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400">No professionals found matching your filters</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
