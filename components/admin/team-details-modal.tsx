"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Building2,
  User,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Phone,
  Mail,
  Award,
  Target,
  Activity,
} from "lucide-react"

interface TeamMember {
  id: number
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
  rating: number
  completedTasks: number
  status: "active" | "inactive" | "on-leave"
  joinedDate: string
}

interface TeamActivity {
  id: number
  type: "task_completed" | "member_joined" | "performance_update" | "meeting"
  description: string
  timestamp: string
  memberName?: string
  memberAvatar?: string
}

interface TeamPerformance {
  completionRate: number
  averageRating: number
  totalTasks: number
  completedTasks: number
  onTimeDelivery: number
  customerSatisfaction: number
}

interface Team {
  id: number
  name: string
  description: string
  companyId: number
  companyName: string
  leaderId?: number
  leaderName?: string
  leaderAvatar?: string
  membersCount: number
  status: number
  createdDate: string
  updatedDate: string
  members?: TeamMember[]
  performance?: TeamPerformance
  recentActivities?: TeamActivity[]
}

interface TeamDetailsModalProps {
  team: Team
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function TeamDetailsModal({ team, onEdit, onDelete, onClose }: TeamDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for demonstration
  const mockMembers: TeamMember[] = [
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@example.com",
      phone: "(11) 99999-9999",
      role: "Team Leader",
      rating: 4.8,
      completedTasks: 45,
      status: "active",
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@example.com",
      phone: "(11) 88888-8888",
      role: "Senior Professional",
      rating: 4.6,
      completedTasks: 38,
      status: "active",
      joinedDate: "2024-02-01",
    },
    {
      id: 3,
      name: "Ana Costa",
      email: "ana@example.com",
      phone: "(11) 77777-7777",
      role: "Professional",
      rating: 4.4,
      completedTasks: 32,
      status: "on-leave",
      joinedDate: "2024-02-15",
    },
  ]

  const mockPerformance: TeamPerformance = {
    completionRate: 92,
    averageRating: 4.6,
    totalTasks: 150,
    completedTasks: 138,
    onTimeDelivery: 89,
    customerSatisfaction: 94,
  }

  const mockActivities: TeamActivity[] = [
    {
      id: 1,
      type: "task_completed",
      description: "Completed cleaning service at Office Building A",
      timestamp: "2024-01-10T14:30:00Z",
      memberName: "Maria Silva",
    },
    {
      id: 2,
      type: "member_joined",
      description: "New member joined the team",
      timestamp: "2024-01-09T09:00:00Z",
      memberName: "Ana Costa",
    },
    {
      id: 3,
      type: "performance_update",
      description: "Team performance rating updated to 4.6/5",
      timestamp: "2024-01-08T16:45:00Z",
    },
    {
      id: 4,
      type: "meeting",
      description: "Weekly team meeting completed",
      timestamp: "2024-01-08T10:00:00Z",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "on-leave":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "inactive":
        return "Inactive"
      case "on-leave":
        return "On Leave"
      default:
        return "Unknown"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "member_joined":
        return <User className="h-4 w-4 text-blue-500" />
      case "performance_update":
        return <TrendingUp className="h-4 w-4 text-purple-500" />
      case "meeting":
        return <Users className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{team.name}</h2>
              <p className="text-muted-foreground">{team.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant={team.status === 1 ? "default" : "secondary"}>
                  {team.status === 1 ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created {new Date(team.createdDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{team.membersCount}</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold">{mockPerformance.averageRating}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{mockPerformance.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{mockPerformance.completedTasks}</div>
              <div className="text-sm text-muted-foreground">Tasks Done</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{team.companyName}</div>
                        <div className="text-sm text-muted-foreground">Company ID: {team.companyId}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Leader */}
              {team.leaderName && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Team Leader
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={team.leaderAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{team.leaderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{team.leaderName}</div>
                        <div className="text-sm text-muted-foreground">Team Leader</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Team Created</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(team.createdDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Last Updated</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(team.updatedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members ({mockMembers.length})</CardTitle>
                  <CardDescription>All members currently assigned to this team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.role}</div>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">{member.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">{renderStars(member.rating)}</div>
                            <span className="text-sm font-medium">{member.rating}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {member.completedTasks} tasks completed
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                            <Badge variant="outline" className="text-xs">
                              {getStatusLabel(member.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Overall Completion</span>
                        <span className="font-medium">{mockPerformance.completionRate}%</span>
                      </div>
                      <Progress value={mockPerformance.completionRate} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        {mockPerformance.completedTasks} of {mockPerformance.totalTasks} tasks completed
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      On-Time Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>On-Time Rate</span>
                        <span className="font-medium">{mockPerformance.onTimeDelivery}%</span>
                      </div>
                      <Progress value={mockPerformance.onTimeDelivery} className="h-2" />
                      <div className="text-sm text-muted-foreground">Tasks delivered on schedule</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Average Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Team Rating</span>
                        <span className="font-medium">{mockPerformance.averageRating}/5.0</span>
                      </div>
                      <Progress value={(mockPerformance.averageRating / 5) * 100} className="h-2" />
                      <div className="flex items-center gap-1">{renderStars(mockPerformance.averageRating)}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Customer Satisfaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Satisfaction Rate</span>
                        <span className="font-medium">{mockPerformance.customerSatisfaction}%</span>
                      </div>
                      <Progress value={mockPerformance.customerSatisfaction} className="h-2" />
                      <div className="text-sm text-muted-foreground">Based on customer feedback</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>Latest team activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.description}</div>
                          {activity.memberName && (
                            <div className="text-sm text-muted-foreground">by {activity.memberName}</div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 p-6 border-t bg-background">
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
