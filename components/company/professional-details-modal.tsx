"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Users,
  Award,
  FileText,
  BarChart,
  CheckCircle,
  AlertCircle,
  Briefcase,
} from "lucide-react"

interface ProfessionalDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (professional: any) => void
  professional: any
}

export function ProfessionalDetailsModal({ isOpen, onClose, onEdit, professional }: ProfessionalDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!professional) return null

  // Sample performance data
  const performanceData = {
    onTimeArrival: 95,
    customerSatisfaction: 4.8,
    completedServices: 42,
    qualityScore: 92,
    efficiency: 88,
  }

  // Sample service history
  const serviceHistory = [
    {
      id: 1,
      date: "2023-06-05",
      client: "Tech Solutions Ltd",
      address: "123 Main St",
      type: "Commercial Cleaning",
      duration: "3h 15m",
      rating: 5,
      status: "completed",
    },
    {
      id: 2,
      date: "2023-06-03",
      client: "Riverside Apartments",
      address: "456 River Rd",
      type: "Deep Cleaning",
      duration: "4h 30m",
      rating: 4,
      status: "completed",
    },
    {
      id: 3,
      date: "2023-06-01",
      client: "Smith Family",
      address: "789 Oak St",
      type: "Residential Cleaning",
      duration: "2h 45m",
      rating: 5,
      status: "completed",
    },
    {
      id: 4,
      date: "2023-05-28",
      client: "Downtown Office",
      address: "101 Business Ave",
      type: "Commercial Cleaning",
      duration: "3h 00m",
      rating: 4,
      status: "completed",
    },
  ]

  // Sample upcoming services
  const upcomingServices = [
    {
      id: 101,
      date: "2023-06-10",
      time: "09:00 AM",
      client: "Global Tech Inc",
      address: "555 Tech Blvd",
      type: "Commercial Cleaning",
      team: "Alpha Team",
    },
    {
      id: 102,
      date: "2023-06-12",
      time: "02:00 PM",
      client: "Lakeside Condos",
      address: "222 Lake View Dr",
      type: "Deep Cleaning",
      team: "Alpha Team",
    },
  ]

  // Sample feedback
  const feedback = [
    {
      id: 1,
      date: "2023-06-05",
      client: "Tech Solutions Ltd",
      comment: "Very thorough and professional. Excellent attention to detail.",
      rating: 5,
    },
    {
      id: 2,
      date: "2023-06-03",
      client: "Riverside Apartments",
      comment: "Good service overall, but missed a few spots in the bathroom.",
      rating: 4,
    },
    {
      id: 3,
      date: "2023-05-20",
      client: "Johnson Family",
      comment: "Excellent service! Our house has never been cleaner.",
      rating: 5,
    },
  ]

  // Sample attendance
  const attendance = [
    { date: "2023-06-05", status: "on-time", checkIn: "08:55 AM", checkOut: "05:02 PM" },
    { date: "2023-06-04", status: "on-time", checkIn: "08:50 AM", checkOut: "05:00 PM" },
    { date: "2023-06-03", status: "late", checkIn: "09:15 AM", checkOut: "05:30 PM" },
    { date: "2023-06-02", status: "on-time", checkIn: "08:58 AM", checkOut: "05:05 PM" },
    { date: "2023-06-01", status: "on-time", checkIn: "08:45 AM", checkOut: "04:55 PM" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#06b6d4]" />
            Professional Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">Complete information about the professional</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4">
          <Avatar className="h-20 w-20 border-2 border-[#2a3349]">
            {professional.avatar ? (
              <AvatarImage src={professional.avatar || "/placeholder.svg"} alt={professional.name} />
            ) : (
              <AvatarFallback className="bg-[#2a3349] text-[#06b6d4] text-xl">
                {professional.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold">{professional.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={
                      professional.status === "active"
                        ? "border-green-500 text-green-500"
                        : "border-red-500 text-red-500"
                    }
                  >
                    {professional.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="border-[#06b6d4] text-[#06b6d4]">
                    {professional.role || "Cleaner"}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onEdit(professional)}
                className="bg-[#06b6d4] hover:bg-[#0891b2] text-white h-8 mt-2 md:mt-0"
              >
                Edit Professional
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-3">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">{professional.team || "Alpha Team"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">{professional.shift || "Morning"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-white">{performanceData.customerSatisfaction} Rating</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="bg-[#0f172a] border border-[#2a3349]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#2a3349]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-[#2a3349]">
              Services
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-[#2a3349]">
              Performance
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-[#2a3349]">
              Attendance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <CheckCircle className="h-8 w-8 text-[#06b6d4] mb-2" />
                  <span className="text-sm text-gray-400">Completed</span>
                  <span className="text-xl font-bold text-white">{performanceData.completedServices}</span>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Star className="h-8 w-8 text-[#06b6d4] mb-2" />
                  <span className="text-sm text-gray-400">Rating</span>
                  <span className="text-xl font-bold text-white">{performanceData.customerSatisfaction}</span>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="h-8 w-8 text-[#06b6d4] mb-2" />
                  <span className="text-sm text-gray-400">On-time</span>
                  <span className="text-xl font-bold text-white">{performanceData.onTimeArrival}%</span>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Document:</span>
                    <span className="text-sm">{professional.document || "123.456.789-00"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Birth Date:</span>
                    <span className="text-sm">{professional.birthDate || "1985-05-15"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Phone:</span>
                    <span className="text-sm">{professional.phone || "(555) 123-4567"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Email:</span>
                    <span className="text-sm">{professional.email || "maria.santos@example.com"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-400">Address:</span>
                    <span className="text-sm">{professional.address || "123 Main St, Apt 4B, Cityville"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base">Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Role:</span>
                    <span className="text-sm">{professional.role || "Senior Cleaner"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Team:</span>
                    <span className="text-sm">{professional.team || "Alpha Team"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Start Date:</span>
                    <span className="text-sm">{professional.startDate || "2020-03-10"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Shift:</span>
                    <span className="text-sm">{professional.shift || "Morning (6AM-2PM)"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-400">Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {(professional.skills || ["Regular Cleaning", "Deep Cleaning", "Window Cleaning"]).map(
                        (skill: string) => (
                          <Badge key={skill} variant="outline" className="text-xs border-[#2a3349]">
                            {skill}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">Recent Feedback</CardTitle>
                <CardDescription className="text-gray-400">Latest client reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.slice(0, 2).map((item) => (
                    <div key={item.id} className="p-3 border border-[#2a3349] rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.client}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{item.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {professional.notes && (
              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">{professional.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-4 space-y-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Upcoming Services</CardTitle>
                <CardDescription className="text-gray-400">Next scheduled services</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingServices.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingServices.map((service) => (
                      <div key={service.id} className="p-3 border border-[#2a3349] rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{service.client}</span>
                          <Badge variant="outline" className="border-[#06b6d4] text-[#06b6d4]">
                            {service.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-400">{service.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-400">{service.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-400">{service.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-400">{service.team}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-400">No upcoming services scheduled</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Service History</CardTitle>
                <CardDescription className="text-gray-400">Past services completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {serviceHistory.map((service) => (
                    <div key={service.id} className="p-3 border border-[#2a3349] rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{service.client}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{service.rating}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              service.status === "completed"
                                ? "border-green-500 text-green-500"
                                : "border-yellow-500 text-yellow-500"
                            }
                          >
                            {service.status === "completed" ? "Completed" : "Partial"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-400">{service.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-400">{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-400">{service.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-4 space-y-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Performance Metrics</CardTitle>
                <CardDescription className="text-gray-400">Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">On-time Arrival</span>
                    <span className="text-sm font-medium">{performanceData.onTimeArrival}%</span>
                  </div>
                  <Progress value={performanceData.onTimeArrival} className="h-2 bg-[#2a3349]" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-medium">{performanceData.customerSatisfaction} / 5</span>
                  </div>
                  <Progress value={performanceData.customerSatisfaction * 20} className="h-2 bg-[#2a3349]" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Quality Score</span>
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

            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Client Feedback</CardTitle>
                <CardDescription className="text-gray-400">All feedback received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.map((item) => (
                    <div key={item.id} className="p-3 border border-[#2a3349] rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.client}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{item.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-[#06b6d4]" />
                    <span className="font-medium">Overall Performance</span>
                  </div>
                  <Badge variant="outline" className="border-[#06b6d4] text-[#06b6d4]">
                    Excellent
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  This professional consistently performs above average in all metrics, with exceptional customer
                  satisfaction scores and quality of work.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-4 space-y-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Attendance Record</CardTitle>
                <CardDescription className="text-gray-400">Check-in and check-out history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendance.map((record, index) => (
                    <div key={index} className="p-3 border border-[#2a3349] rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{record.date}</span>
                        <Badge
                          variant="outline"
                          className={
                            record.status === "on-time"
                              ? "border-green-500 text-green-500"
                              : "border-yellow-500 text-yellow-500"
                          }
                        >
                          {record.status === "on-time" ? "On Time" : "Late"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <CheckCircle
                            className={`h-4 w-4 ${record.status === "on-time" ? "text-green-500" : "text-yellow-500"}`}
                          />
                          <span className="text-sm text-gray-400">Check-in: {record.checkIn}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-400">Check-out: {record.checkOut}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-3 border border-[#2a3349] rounded-md">
                    <span className="text-sm text-gray-400">On-time Rate</span>
                    <span className="text-xl font-bold text-white">
                      {(attendance.filter((a) => a.status === "on-time").length / attendance.length) * 100}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 border border-[#2a3349] rounded-md">
                    <span className="text-sm text-gray-400">Late Arrivals</span>
                    <span className="text-xl font-bold text-white">
                      {attendance.filter((a) => a.status === "late").length}
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 border border-[#2a3349] rounded-md">
                    <span className="text-sm text-gray-400">Avg. Work Hours</span>
                    <span className="text-xl font-bold text-white">8.2h</span>
                  </div>
                  <div className="flex flex-col items-center p-3 border border-[#2a3349] rounded-md">
                    <span className="text-sm text-gray-400">Overtime</span>
                    <span className="text-xl font-bold text-white">2.5h</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#06b6d4]" />
                      <span className="font-medium">Attendance Notes</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    This professional has an excellent attendance record with only occasional late arrivals.
                    Consistently works full shifts and sometimes stays overtime to complete tasks.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
