"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LogOut, Search, Clock, MapPin, User, Users, CheckCircle, Timer } from "lucide-react"
import { CompanyCheckOutModal } from "@/components/company/company-check-out-modal"
import { CompanyCheckOutDetailsModal } from "@/components/company/company-check-out-details-modal"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function CheckOutPage() {
  const [checkOuts, setCheckOuts] = useState(initialCheckOuts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCheckOut, setSelectedCheckOut] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const { toast } = useToast()

  const filteredCheckOuts = checkOuts.filter((checkOut) => {
    const search = searchTerm.toLowerCase()
    return (
      checkOut.professional.toLowerCase().includes(search) ||
      checkOut.team.toLowerCase().includes(search) ||
      checkOut.client.toLowerCase().includes(search) ||
      checkOut.location.toLowerCase().includes(search)
    )
  })

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
    setIsModalOpen(false)
    setSelectedCheckOut(null)

    toast({
      title: "Check-out recorded",
      description: `${selectedCheckOut.professional} has been checked out successfully.`,
    })
  }

  const handleViewDetails = (checkOut: any) => {
    setSelectedCheckOut(checkOut)
    setIsDetailsModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
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

  const stats = {
    total: checkOuts.length,
    completed: checkOuts.filter((c) => c.status === "completed").length,
    inProgress: checkOuts.filter((c) => c.status === "in-progress").length,
    earlyDeparture: checkOuts.filter((c) => c.status === "early-departure").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Check-out Management</h1>
          <p className="text-gray-400">Monitor and manage professional check-outs</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search check-outs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px] bg-[#1a2234] border-[#2a3349] text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-gray-400">Active today</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <p className="text-xs text-gray-400">{Math.round((stats.completed / stats.total) * 100)}% finished</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">In Progress</CardTitle>
            <Timer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
            <p className="text-xs text-gray-400">Currently working</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Early Departure</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.earlyDeparture}</div>
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
                  <TableCell>{getStatusBadge(checkOut.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {checkOut.status === "in-progress" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCheckOut(checkOut)
                            setIsModalOpen(true)
                          }}
                          className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(checkOut)}
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

      <CompanyCheckOutModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCheckOut(null)
        }}
        onSubmit={handleCheckOut}
        checkOut={selectedCheckOut}
      />

      <CompanyCheckOutDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedCheckOut(null)
        }}
        checkOut={selectedCheckOut}
      />
    </div>
  )
}
