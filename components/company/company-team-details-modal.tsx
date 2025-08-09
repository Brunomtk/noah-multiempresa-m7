"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, MapPin, Star, Users, Building } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Team } from "@/types"

interface CompanyTeamDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (team: Team) => void
  team: Team | null
}

export function CompanyTeamDetailsModal({ isOpen, onClose, onEdit, team }: CompanyTeamDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!team) return null

  // Sample performance data
  const performanceData = {
    onTimeCompletion: 96,
    customerSatisfaction: 94,
    qualityScore: 92,
    efficiency: 89,
  }

  // Sample upcoming services
  const upcomingServices = [
    {
      id: 1,
      date: "2025-08-01",
      time: "09:00",
      customer: "Tech Solutions Ltd",
      address: "Rua das Flores, 123",
      type: "Limpeza Comercial",
    },
    {
      id: 2,
      date: "2025-08-02",
      time: "14:00",
      customer: "ABC Consultoria",
      address: "Av. Paulista, 456",
      type: "Limpeza Profunda",
    },
  ]

  // Sample completed services
  const completedServices = [
    {
      id: 101,
      date: "2025-07-28",
      customer: "Global Tech Inc",
      type: "Limpeza Comercial",
      rating: 5,
      revenue: "R$ 350,00",
    },
    {
      id: 102,
      date: "2025-07-26",
      customer: "Edifício Riverside",
      type: "Limpeza Profunda",
      rating: 4,
      revenue: "R$ 280,00",
    },
  ]

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-500/20 text-green-500 border-green-500">Active</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-500 border-red-500">Inactive</Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#06b6d4]" />
            Team Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">Complete team information</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mt-4">
          <div>
            <h3 className="text-xl font-semibold">{team.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">{team.region}</span>
              </div>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">{team.company?.name || "Empresa"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(team.status)}
            <Button size="sm" onClick={() => onEdit(team)} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white h-8">
              Edit Team
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card className="bg-[#0f172a] border-[#2a3349]">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Star className="h-8 w-8 text-[#06b6d4] mb-2" />
              <span className="text-sm text-gray-400">Rating</span>
              <span className="text-xl font-bold text-white">{team.rating.toFixed(1)}</span>
            </CardContent>
          </Card>

          <Card className="bg-[#0f172a] border-[#2a3349]">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-8 w-8 text-[#06b6d4] mb-2" />
              <span className="text-sm text-gray-400">Services</span>
              <span className="text-xl font-bold text-white">{team.completedServices}</span>
            </CardContent>
          </Card>

          <Card className="bg-[#0f172a] border-[#2a3349]">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Calendar className="h-8 w-8 text-[#06b6d4] mb-2" />
              <span className="text-sm text-gray-400">Upcoming</span>
              <span className="text-xl font-bold text-white">{upcomingServices.length}</span>
            </CardContent>
          </Card>
        </div>

        {team.description && (
          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349] mt-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-400">{team.description}</p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="bg-[#0f172a] border border-[#2a3349]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#2a3349]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-[#2a3349]">
              Performance
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-[#2a3349]">
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">Team Information</CardTitle>
                <CardDescription className="text-gray-400">Basic team data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-400">Name</span>
                    <p className="font-medium">{team.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Region</span>
                    <p className="font-medium">{team.region}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Created at</span>
                    <p className="font-medium">{new Date(team.createdDate).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Updated at</span>
                    <p className="font-medium">{new Date(team.updatedDate).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Latest services performed by the team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-2 border border-[#2a3349] rounded-md"
                    >
                      <div>
                        <p className="font-medium text-sm">{service.customer}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{service.date}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">{service.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="text-xs font-medium">{service.rating}</span>
                        </div>
                        <span className="text-sm font-medium text-green-500">{service.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Team Performance</CardTitle>
                <CardDescription className="text-gray-400">Team performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">On-time Completion</span>
                    <span className="text-sm font-medium">{performanceData.onTimeCompletion}%</span>
                  </div>
                  <Progress value={performanceData.onTimeCompletion} className="h-2 bg-[#2a3349]" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-medium">{performanceData.customerSatisfaction}%</span>
                  </div>
                  <Progress value={performanceData.customerSatisfaction} className="h-2 bg-[#2a3349]" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Quality</span>
                    <span className="text-sm font-medium">{performanceData.qualityScore}%</span>
                  </div>
                  <Progress value={performanceData.qualityScore} className="h-2 bg-[#2a3349]" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Efficiency</span>
                    <span className="text-sm font-medium">{performanceData.efficiency}%</span>
                  </div>
                  <Progress value={performanceData.efficiency} className="h-2 bg-[#2a3349]" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Upcoming Services</CardTitle>
                <CardDescription className="text-gray-400">Services scheduled for this team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 border border-[#2a3349] rounded-md"
                    >
                      <div>
                        <p className="font-medium">{service.customer}</p>
                        <p className="text-sm text-gray-400">
                          {service.date} às {service.time}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{service.address}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-[#06b6d4] text-[#06b6d4]">
                        {service.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
