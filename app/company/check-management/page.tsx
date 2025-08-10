"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, LogOut, Search, Clock, MapPin, User, Users, CheckCircle, Timer, Plus } from "lucide-react"
import { CompanyCheckInModal } from "@/components/company/company-check-in-modal"
import { CompanyCheckInDetailsModal } from "@/components/company/company-check-in-details-modal"
import { CompanyCheckOutModal } from "@/components/company/company-check-out-modal"
import { CompanyCheckOutDetailsModal } from "@/components/company/company-check-out-details-modal"
import { CompanyCheckRecordModal } from "@/components/company/company-check-record-modal"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCheckRecords, performCheckIn, performCheckOut, type CheckRecordFilters } from "@/lib/api/check-records"
import type { CheckRecord } from "@/types/check-record"
import { CHECK_RECORD_STATUS } from "@/types/check-record"

export default function CheckManagementPage() {
  // State for check records
  const [checkRecords, setCheckRecords] = useState<CheckRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [companyId, setCompanyId] = useState<number>(1)
  const [isClient, setIsClient] = useState(false)

  // Modal states
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false)
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false)
  const [isCheckRecordModalOpen, setIsCheckRecordModalOpen] = useState(false)
  const [isCheckInDetailsModalOpen, setIsCheckInDetailsModalOpen] = useState(false)
  const [isCheckOutDetailsModalOpen, setIsCheckOutDetailsModalOpen] = useState(false)

  const [selectedRecord, setSelectedRecord] = useState<CheckRecord | null>(null)
  const [activeTab, setActiveTab] = useState("check-in")

  const { toast } = useToast()

  // Set client flag and get company ID from localStorage (only on client side)
  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("noah_user")
        if (userData) {
          const user = JSON.parse(userData)
          setCompanyId(user.companyId || 1)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        setCompanyId(1)
      }
    }
  }, [])

  // Fetch check records
  const fetchCheckRecords = async () => {
    if (!isClient) return

    setIsLoading(true)
    try {
      const filters: CheckRecordFilters = {
        companyId: companyId,
        pageSize: 100,
      }

      if (searchTerm) {
        filters.search = searchTerm
      }

      const records = await getCheckRecords(filters)
      setCheckRecords(records)
    } catch (error) {
      console.error("Error fetching check records:", error)
      if (isClient) {
        toast({
          title: "Error",
          description: "Failed to fetch check records",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isClient && companyId) {
      fetchCheckRecords()
    }
  }, [searchTerm, companyId, isClient])

  // Filter records for check-in tab (pending and checked-in)
  const getCheckInRecords = (): CheckRecord[] => {
    return checkRecords.filter(
      (record) => record.status === CHECK_RECORD_STATUS.PENDING || record.status === CHECK_RECORD_STATUS.CHECKED_IN,
    )
  }

  // Filter records for check-out tab (checked-in and checked-out)
  const getCheckOutRecords = (): CheckRecord[] => {
    return checkRecords.filter(
      (record) => record.status === CHECK_RECORD_STATUS.CHECKED_IN || record.status === CHECK_RECORD_STATUS.CHECKED_OUT,
    )
  }

  // Handle manual check-in
  const handleManualCheckIn = async (recordId: string) => {
    try {
      const record = checkRecords.find((r) => r.id.toString() === recordId)
      if (!record) return

      const updatedRecord = await performCheckIn({
        professionalId: record.professionalId,
        professionalName: record.professionalName,
        companyId: record.companyId,
        customerId: record.customerId,
        customerName: record.customerName,
        appointmentId: record.appointmentId,
        address: record.address,
        teamId: record.teamId,
        teamName: record.teamName,
        serviceType: record.serviceType,
        notes: record.notes,
      })

      // Update the record in state
      setCheckRecords((prev) => prev.map((r) => (r.id === record.id ? updatedRecord : r)))

      toast({
        title: "Success",
        description: "Check-in recorded successfully",
      })
    } catch (error) {
      console.error("Error performing check-in:", error)
      toast({
        title: "Error",
        description: "Failed to perform check-in",
        variant: "destructive",
      })
    }
  }

  // Handle check-out
  const handleCheckOut = async (recordId: string) => {
    try {
      const updatedRecord = await performCheckOut(recordId)

      // Update the record in state
      setCheckRecords((prev) => prev.map((r) => (r.id.toString() === recordId ? updatedRecord : r)))

      toast({
        title: "Success",
        description: "Check-out recorded successfully",
      })
    } catch (error) {
      console.error("Error performing check-out:", error)
      toast({
        title: "Error",
        description: "Failed to perform check-out",
        variant: "destructive",
      })
    }
  }

  // View check-in details
  const handleViewCheckInDetails = (record: CheckRecord) => {
    setSelectedRecord(record)
    setIsCheckInDetailsModalOpen(true)
  }

  // View check-out details
  const handleViewCheckOutDetails = (record: CheckRecord) => {
    setSelectedRecord(record)
    setIsCheckOutDetailsModalOpen(true)
  }

  // Get status badge
  const getStatusBadge = (status: number | string) => {
    const numStatus = typeof status === "string" ? Number.parseInt(status) : status

    switch (numStatus) {
      case CHECK_RECORD_STATUS.PENDING:
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500">Pending</Badge>
      case CHECK_RECORD_STATUS.CHECKED_IN:
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500">Checked In</Badge>
      case CHECK_RECORD_STATUS.CHECKED_OUT:
        return <Badge className="bg-green-500/20 text-green-500 border-green-500">Checked Out</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500">Unknown</Badge>
    }
  }

  // Format time
  const formatTime = (dateString: string | null): string => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate duration
  const calculateDuration = (checkInTime: string | null, checkOutTime: string | null): string => {
    if (!checkInTime || !checkOutTime) return "-"

    const start = new Date(checkInTime)
    const end = new Date(checkOutTime)
    const durationMs = end.getTime() - start.getTime()

    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  // Stats for check-ins
  const checkInRecords = getCheckInRecords()
  const checkInStats = {
    total: checkInRecords.length,
    pending: checkInRecords.filter((r) => r.status === CHECK_RECORD_STATUS.PENDING).length,
    checkedIn: checkInRecords.filter((r) => r.status === CHECK_RECORD_STATUS.CHECKED_IN).length,
  }

  // Stats for check-outs
  const checkOutRecords = getCheckOutRecords()
  const checkOutStats = {
    total: checkOutRecords.length,
    inProgress: checkOutRecords.filter((r) => r.status === CHECK_RECORD_STATUS.CHECKED_IN).length,
    completed: checkOutRecords.filter((r) => r.status === CHECK_RECORD_STATUS.CHECKED_OUT).length,
  }

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading check records...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Check Management</h1>
          <p className="text-gray-400">Monitor and manage professional check-ins and check-outs</p>
        </div>
        <Button onClick={() => setIsCheckRecordModalOpen(true)} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Check Record
        </Button>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[300px] bg-[#1a2234] border-[#2a3349] text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
                <CardTitle className="text-sm font-medium text-gray-400">Checked In</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkInStats.checkedIn}</div>
                <p className="text-xs text-gray-400">Currently working</p>
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
              <CardTitle className="text-white">Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2a3349]">
                    <TableHead className="text-gray-400">Professional</TableHead>
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Team</TableHead>
                    <TableHead className="text-gray-400">Address</TableHead>
                    <TableHead className="text-gray-400">Service Type</TableHead>
                    <TableHead className="text-gray-400">Check-in Time</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkInRecords.map((record) => (
                    <TableRow key={record.id} className="border-[#2a3349]">
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {record.professionalName || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{record.customerName || "N/A"}</TableCell>
                      <TableCell className="text-white">{record.teamName || "N/A"}</TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {record.address}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{record.serviceType}</TableCell>
                      <TableCell className="text-white">{formatTime(record.checkInTime)}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {record.status === CHECK_RECORD_STATUS.PENDING && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleManualCheckIn(record.id.toString())}
                              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                            >
                              <LogIn className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewCheckInDetails(record)}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[300px] bg-[#1a2234] border-[#2a3349] text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
                <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{checkOutStats.completed}</div>
                <p className="text-xs text-gray-400">Finished sessions</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardHeader>
              <CardTitle className="text-white">Check-outs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2a3349]">
                    <TableHead className="text-gray-400">Professional</TableHead>
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Team</TableHead>
                    <TableHead className="text-gray-400">Address</TableHead>
                    <TableHead className="text-gray-400">Check-in</TableHead>
                    <TableHead className="text-gray-400">Check-out</TableHead>
                    <TableHead className="text-gray-400">Duration</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkOutRecords.map((record) => (
                    <TableRow key={record.id} className="border-[#2a3349]">
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {record.professionalName || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{record.customerName || "N/A"}</TableCell>
                      <TableCell className="text-white">{record.teamName || "N/A"}</TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {record.address}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{formatTime(record.checkInTime)}</TableCell>
                      <TableCell className="text-white">{formatTime(record.checkOutTime)}</TableCell>
                      <TableCell className="text-white">
                        {calculateDuration(record.checkInTime, record.checkOutTime)}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {record.status === CHECK_RECORD_STATUS.CHECKED_IN && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCheckOut(record.id.toString())}
                              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                            >
                              <LogOut className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewCheckOutDetails(record)}
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

      {/* Modals */}
      <CompanyCheckRecordModal
        isOpen={isCheckRecordModalOpen}
        onClose={() => setIsCheckRecordModalOpen(false)}
        onSuccess={fetchCheckRecords}
      />

      <CompanyCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => {
          setIsCheckInModalOpen(false)
          setSelectedRecord(null)
        }}
        onSubmit={() => {
          setIsCheckInModalOpen(false)
          setSelectedRecord(null)
          fetchCheckRecords()
        }}
        checkIn={selectedRecord}
      />

      <CompanyCheckInDetailsModal
        isOpen={isCheckInDetailsModalOpen}
        onClose={() => {
          setIsCheckInDetailsModalOpen(false)
          setSelectedRecord(null)
        }}
        checkIn={selectedRecord}
      />

      <CompanyCheckOutModal
        isOpen={isCheckOutModalOpen}
        onClose={() => {
          setIsCheckOutModalOpen(false)
          setSelectedRecord(null)
        }}
        onSubmit={() => {
          setIsCheckOutModalOpen(false)
          setSelectedRecord(null)
          fetchCheckRecords()
        }}
        checkOut={selectedRecord}
      />

      <CompanyCheckOutDetailsModal
        isOpen={isCheckOutDetailsModalOpen}
        onClose={() => {
          setIsCheckOutDetailsModalOpen(false)
          setSelectedRecord(null)
        }}
        checkOut={selectedRecord}
      />
    </div>
  )
}
