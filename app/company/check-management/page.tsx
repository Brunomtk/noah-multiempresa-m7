"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, LogOut, Search, Clock, MapPin, User, Users, CheckCircle, AlertCircle, Timer } from "lucide-react"
import { CompanyCheckInModal } from "@/components/company/company-check-in-modal"
import { CompanyCheckInDetailsModal } from "@/components/company/company-check-in-details-modal"
import { CompanyCheckOutModal } from "@/components/company/company-check-out-modal"
import { CompanyCheckOutDetailsModal } from "@/components/company/company-check-out-details-modal"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Initial data for check-ins
const initialCheckIns = [
  {
    id: 1,
    professional: "John Doe",
    team: "Team Alpha",
    client: "ABC Corporation",
    location: "Main Office - 123 Main St",
    scheduledTime: "09:00 AM",
    checkInTime: "08:55 AM",
    status: "on-time",
    date: "2024-01-26",
    gpsVerified: true,
    notes: "Arrived early, all equipment ready",
  },
  {
    id: 2,
    professional: "Jane Smith",
    team: "Team Beta",
    client: "XYZ Industries",
    location: "Warehouse - 456 Industrial Ave",
    scheduledTime: "10:00 AM",
    checkInTime: "10:15 AM",
    status: "late",
    date: "2024-01-26",
    gpsVerified: true,
    notes: "Traffic delay on highway",
  },
  {
    id: 3,
    professional: "Mike Johnson",
    team: "Team Alpha",
    client: "Tech Solutions Inc",
    location: "Branch Office - 789 Business Blvd",
    scheduledTime: "11:00 AM",
    checkInTime: null,
    status: "pending",
    date: "2024-01-26",
    gpsVerified: false,
    notes: "",
  },
]

// Initial data for check-outs
const initialCheckOuts = [
  {
    id: 1,
    professional: "John Doe",
    team: "Team Alpha",
    client: "ABC Corporation",
    location: "Main Office - 123 Main St",
    checkInTime: "08:55 AM",
    scheduledEnd: "05:00 PM",
    checkOutTime: "05:05 PM",
    duration: "8h 10m",
    status: "completed",
    date: "2024-01-26",
    gpsVerified: true,
    tasksCompleted: true,
    notes: "All tasks completed successfully",
  },
  {
    id: 2,
    professional: "Jane Smith",
    team: "Team Beta",
    client: "XYZ Industries",
    location: "Warehouse - 456 Industrial Ave",
    checkInTime: "10:15 AM",
    scheduledEnd: "06:00 PM",
    checkOutTime: null,
    duration: "5h 45m",
    status: "in-progress",
    date: "2024-01-26",
    gpsVerified: false,
    tasksCompleted: false,
    notes: "",
  },
  {
    id: 3,
    professional: "Sarah Wilson",
    team: "Team Gamma",
    client: "Global Corp",
    location: "Downtown Office - 321 Business Ave",
    checkInTime: "07:00 AM",
    scheduledEnd: "03:00 PM",
    checkOutTime: "02:45 PM",
    duration: "7h 45m",
    status: "early-departure",
    date: "2024-01-26",
    gpsVerified: true,
    tasksCompleted: true,
    notes: "Finished all tasks early",
  },
]

export default function CheckManagementPage() {
  // State for check-ins
  const [checkIns, setCheckIns] = useState(initialCheckIns)
  const [checkInSearchTerm, setCheckInSearchTerm] = useState("")
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState<any>(null)
  const [isCheckInDetailsModalOpen, setIsCheckInDetailsModalOpen] = useState(false)

  // State for check-outs
  const [checkOuts, setCheckOuts] = useState(initialCheckOuts)
  const [checkOutSearchTerm, setCheckOutSearchTerm] = useState("")
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false)
  const [selectedCheckOut, setSelectedCheckOut] = useState<any>(null)
  const [isCheckOutDetailsModalOpen, setIsCheckOutDetailsModalOpen] = useState(false)

  // Active tab state
  const [activeTab, setActiveTab] = useState("check-in")

  const { toast } = useToast()

  // Filtered check-ins based on search term
  const filteredCheckIns = checkIns.filter((checkIn) => {
    const search = checkInSearchTerm.toLowerCase()
    return (
      checkIn.professional.toLowerCase().includes(search) ||
      checkIn.team.toLowerCase().includes(search) ||
      checkIn.client.toLowerCase().includes(search) ||
      checkIn.location.toLowerCase().includes(search)
    )
  })

  // Filtered check-outs based on search term
  const filteredCheckOuts = checkOuts.filter((checkOut) => {
    const search = checkOutSearchTerm.toLowerCase()
    return (
      checkOut.professional.toLowerCase().includes(search) ||
      checkOut.team.toLowerCase().includes(search) ||
      checkOut.client.toLowerCase().includes(search) ||
      checkOut.location.toLowerCase().includes(search)
    )
  })

  // Handle manual check-in
  const handleManualCheckIn = (data: any) => {
    const updatedCheckIn = {
      ...selectedCheckIn,
      checkInTime: data.checkInTime,
      status: data.status,
      notes: data.notes,
      gpsVerified: data.gpsVerified,
    }

    setCheckIns(checkIns.map((c) => (c.id === selectedCheckIn.id ? updatedCheckIn : c)))
    setIsCheckInModalOpen(false)
    setSelectedCheckIn(null)

    toast({
      title: "Check-in recorded",
      description: `${selectedCheckIn.professional} has been checked in successfully.`,
    })
  }

  // Handle check-out
  const handleCheckOut = (data: any) => {
    const updatedCheckOut = {
      ...selectedCheckOut,
      checkOutTime: data.checkOutTime,
      status: data.status,
      notes: data.notes,
      gpsVerified: data.gpsVerified,
      tasksCompleted: data.tasksCompleted,
    }

    setCheckOuts(checkOuts.map((c) => (c.id === selectedCheckOut.id ? updatedCheckOut : c)))
    setIsCheckOutModalOpen(false)
    setSelectedCheckOut(null)

    toast({
      title: "Check-out recorded",
      description: `${selectedCheckOut.professional} has been checked out successfully.`,
    })
  }

  // View check-in details
  const handleViewCheckInDetails = (checkIn: any) => {
    setSelectedCheckIn(checkIn)
    setIsCheckInDetailsModalOpen(true)
  }

  // View check-out details
  const handleViewCheckOutDetails = (checkOut: any) => {
    setSelectedCheckOut(checkOut)
    setIsCheckOutDetailsModalOpen(true)
  }

  // Get status badge for check-ins
  const getCheckInStatusBadge = (status: string) => {
    switch (status) {
      case "on-time":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500">On Time</Badge>
      case "late":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500">Late</Badge>
      case "pending":
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500">Pending</Badge>
      default:
        return null
    }
  }

  // Get status badge for check-outs
  const getCheckOutStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500">In Progress</Badge>
      case "early-departure":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500">Early Departure</Badge>
      default:
        return null
    }
  }

  // Stats for check-ins
  const checkInStats = {
    total: checkIns.length,
    onTime: checkIns.filter((c) => c.status === "on-time").length,
    late: checkIns.filter((c) => c.status === "late").length,
    pending: checkIns.filter((c) => c.status === "pending").length,
  }

  // Stats for check-outs
  const checkOutStats = {
    total: checkOuts.length,
    completed: checkOuts.filter((c) => c.status === "completed").length,
    inProgress: checkOuts.filter((c) => c.status === "in-progress").length,
    earlyDeparture: checkOuts.filter((c) => c.status === "early-departure").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Check Management</h1>
          <p className="text-gray-400">Monitor and manage professional check-ins and check-outs</p>
        </div>
      </div>

      <Tabs defaultValue="check-in" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#1a2234] border-[#2a3349]">
          <TabsTrigger value="check-in" className="data-[state=active]:bg-[#2a3349]">
            <LogIn className="h-4 w-4 mr-2" />
            Check-in Management
          </TabsTrigger>
          <TabsTrigger value="check-out" className="data-[state=active]:bg-[#2a3349]">
            <LogOut className="h-4 w-4 mr-2" />
            Check-out Management
          </TabsTrigger>
        </TabsList>

        {/* Check-in Tab Content */}
        <TabsContent value="check-in" className="space-y-6">
          <div className="flex justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search check-ins..."
                value={checkInSearchTerm}
                onChange={(e) => setCheckInSearchTerm(e.target.value)}
                className="pl-10 w-[300px] bg-[#1a2234] border-[#2a3349] text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-[#1a2234] border-[#2a3349]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Check-ins</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkInStats.total}</div>
                <p className="text-xs text-gray-400">Today's scheduled</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a2234] border-[#2a3349]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">On Time</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkInStats.onTime}</div>
                <p className="text-xs text-gray-400">
                  {Math.round((checkInStats.onTime / checkInStats.total) * 100)}% compliance
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a2234] border-[#2a3349]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Late</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkInStats.late}</div>
                <p className="text-xs text-gray-400">
                  {Math.round((checkInStats.late / checkInStats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a2234] border-[#2a3349]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkInStats.pending}</div>
                <p className="text-xs text-gray-400">Awaiting check-in</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardHeader>
              <CardTitle className="text-white">Today's Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2a3349]">
                    <TableHead className="text-gray-400">Professional</TableHead>
                    <TableHead className="text-gray-400">Team</TableHead>
                    <TableHead className="text-gray-400">Client</TableHead>
                    <TableHead className="text-gray-400">Location</TableHead>
                    <TableHead className="text-gray-400">Scheduled</TableHead>
                    <TableHead className="text-gray-400">Check-in</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">GPS</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCheckIns.map((checkIn) => (
                    <TableRow key={checkIn.id} className="border-[#2a3349]">
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {checkIn.professional}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{checkIn.team}</TableCell>
                      <TableCell className="text-white">{checkIn.client}</TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {checkIn.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{checkIn.scheduledTime}</TableCell>
                      <TableCell className="text-white">{checkIn.checkInTime || "-"}</TableCell>
                      <TableCell>{getCheckInStatusBadge(checkIn.status)}</TableCell>
                      <TableCell>
                        {checkIn.gpsVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {checkIn.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCheckIn(checkIn)
                                setIsCheckInModalOpen(true)
                              }}
                              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                            >
                              <LogIn className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewCheckInDetails(checkIn)}
                            className="text-gray-400 hover:text-white hover:bg-[#2a3349]"
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check-out Tab Content */}
        <TabsContent value="check-out" className="space-y-6">
          <div className="flex justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search check-outs..."
                value={checkOutSearchTerm}
                onChange={(e) => setCheckOutSearchTerm(e.target.value)}
                className="pl-10 w-[300px] bg-[#1a2234] border-[#2a3349] text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-[#1a2234] border-[#2a3349]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Sessions</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkOutStats.total}</div>
                <p className="text-xs text-gray-400">Active today</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a2234] border-[#2a3349]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkOutStats.completed}</div>
                <p className="text-xs text-gray-400">
                  {Math.round((checkOutStats.completed / checkOutStats.total) * 100)}% finished
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a2234] border-[#2a3349]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">In Progress</CardTitle>
                <Timer className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkOutStats.inProgress}</div>
                <p className="text-xs text-gray-400">Currently working</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a2234] border-[#2a3349]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Early Departure</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkOutStats.earlyDeparture}</div>
                <p className="text-xs text-gray-400">Left early</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardHeader>
              <CardTitle className="text-white">Today's Check-outs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2a3349]">
                    <TableHead className="text-gray-400">Professional</TableHead>
                    <TableHead className="text-gray-400">Team</TableHead>
                    <TableHead className="text-gray-400">Client</TableHead>
                    <TableHead className="text-gray-400">Location</TableHead>
                    <TableHead className="text-gray-400">Check-in</TableHead>
                    <TableHead className="text-gray-400">Check-out</TableHead>
                    <TableHead className="text-gray-400">Duration</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCheckOuts.map((checkOut) => (
                    <TableRow key={checkOut.id} className="border-[#2a3349]">
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {checkOut.professional}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{checkOut.team}</TableCell>
                      <TableCell className="text-white">{checkOut.client}</TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {checkOut.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{checkOut.checkInTime}</TableCell>
                      <TableCell className="text-white">{checkOut.checkOutTime || "-"}</TableCell>
                      <TableCell className="text-white">{checkOut.duration}</TableCell>
                      <TableCell>{getCheckOutStatusBadge(checkOut.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {checkOut.status === "in-progress" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCheckOut(checkOut)
                                setIsCheckOutModalOpen(true)
                              }}
                              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                            >
                              <LogOut className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewCheckOutDetails(checkOut)}
                            className="text-gray-400 hover:text-white hover:bg-[#2a3349]"
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Check-in Modals */}
      <CompanyCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => {
          setIsCheckInModalOpen(false)
          setSelectedCheckIn(null)
        }}
        onSubmit={handleManualCheckIn}
        checkIn={selectedCheckIn}
      />

      <CompanyCheckInDetailsModal
        isOpen={isCheckInDetailsModalOpen}
        onClose={() => {
          setIsCheckInDetailsModalOpen(false)
          setSelectedCheckIn(null)
        }}
        checkIn={selectedCheckIn}
      />

      {/* Check-out Modals */}
      <CompanyCheckOutModal
        isOpen={isCheckOutModalOpen}
        onClose={() => {
          setIsCheckOutModalOpen(false)
          setSelectedCheckOut(null)
        }}
        onSubmit={handleCheckOut}
        checkOut={selectedCheckOut}
      />

      <CompanyCheckOutDetailsModal
        isOpen={isCheckOutDetailsModalOpen}
        onClose={() => {
          setIsCheckOutDetailsModalOpen(false)
          setSelectedCheckOut(null)
        }}
        checkOut={selectedCheckOut}
      />
    </div>
  )
}
