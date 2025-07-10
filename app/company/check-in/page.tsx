"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LogIn, Search, Clock, MapPin, User, Users, CheckCircle, AlertCircle } from "lucide-react"
import { CompanyCheckInModal } from "@/components/company/company-check-in-modal"
import { CompanyCheckInDetailsModal } from "@/components/company/company-check-in-details-modal"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function CheckInPage() {
  const [checkIns, setCheckIns] = useState(initialCheckIns)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const { toast } = useToast()

  const filteredCheckIns = checkIns.filter((checkIn) => {
    const search = searchTerm.toLowerCase()
    return (
      checkIn.professional.toLowerCase().includes(search) ||
      checkIn.team.toLowerCase().includes(search) ||
      checkIn.client.toLowerCase().includes(search) ||
      checkIn.location.toLowerCase().includes(search)
    )
  })

  const handleManualCheckIn = (data: any) => {
    const updatedCheckIn = {
      ...selectedCheckIn,
      checkInTime: data.checkInTime,
      status: data.status,
      notes: data.notes,
      gpsVerified: data.gpsVerified,
    }

    setCheckIns(checkIns.map((c) => (c.id === selectedCheckIn.id ? updatedCheckIn : c)))
    setIsModalOpen(false)
    setSelectedCheckIn(null)

    toast({
      title: "Check-in recorded",
      description: `${selectedCheckIn.professional} has been checked in successfully.`,
    })
  }

  const handleViewDetails = (checkIn: any) => {
    setSelectedCheckIn(checkIn)
    setIsDetailsModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
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

  const stats = {
    total: checkIns.length,
    onTime: checkIns.filter((c) => c.status === "on-time").length,
    late: checkIns.filter((c) => c.status === "late").length,
    pending: checkIns.filter((c) => c.status === "pending").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Check-in Management</h1>
          <p className="text-gray-400">Monitor and manage professional check-ins</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search check-ins..."
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
            <CardTitle className="text-sm font-medium text-gray-400">Total Check-ins</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-gray-400">Today's scheduled</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">On Time</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.onTime}</div>
            <p className="text-xs text-gray-400">{Math.round((stats.onTime / stats.total) * 100)}% compliance</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Late</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.late}</div>
            <p className="text-xs text-gray-400">{Math.round((stats.late / stats.total) * 100)}% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pending}</div>
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
                  <TableCell>{getStatusBadge(checkIn.status)}</TableCell>
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
                            setIsModalOpen(true)
                          }}
                          className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                        >
                          <LogIn className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(checkIn)}
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

      <CompanyCheckInModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCheckIn(null)
        }}
        onSubmit={handleManualCheckIn}
        checkIn={selectedCheckIn}
      />

      <CompanyCheckInDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedCheckIn(null)
        }}
        checkIn={selectedCheckIn}
      />
    </div>
  )
}
