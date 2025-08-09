"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, User, CalendarIcon, RefreshCw, Search, LogIn, LogOut } from "lucide-react"
import { useProfessionalCheck } from "@/hooks/use-professional-check"
import { PhotoCapture } from "@/components/professional/photo-capture"
import type { CheckRecord } from "@/types/check-record"

export default function ProfessionalCheckPage() {
  const {
    currentStatus,
    isLoading,
    error,
    checkHistory,
    refreshCurrentStatus,
    performCheckIn,
    performCheckOut,
    loadCheckHistory,
    formatTime,
    calculateDuration,
  } = useProfessionalCheck()

  const [selectedRecord, setSelectedRecord] = useState<CheckRecord | null>(null)
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false)
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false)
  const [checkInPhoto, setCheckInPhoto] = useState<string>("")
  const [checkOutPhoto, setCheckOutPhoto] = useState<string>("")
  const [checkInNotes, setCheckInNotes] = useState("")
  const [checkOutNotes, setCheckOutNotes] = useState("")
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    startDate: null as Date | null,
    endDate: null as Date | null,
  })

  useEffect(() => {
    loadCheckHistory()
  }, [])

  const handleCheckIn = async () => {
    if (!selectedRecord) return

    const result = await performCheckIn({
      photoBase64: checkInPhoto,
      notes: checkInNotes,
    })

    if (result) {
      setCheckInDialogOpen(false)
      setCheckInPhoto("")
      setCheckInNotes("")
      setSelectedRecord(null)
      refreshCurrentStatus()
      loadCheckHistory()
    }
  }

  const handleCheckOut = async () => {
    if (!selectedRecord) return

    const result = await performCheckOut({
      photoBase64: checkOutPhoto,
      notes: checkOutNotes,
    })

    if (result) {
      setCheckOutDialogOpen(false)
      setCheckOutPhoto("")
      setCheckOutNotes("")
      setSelectedRecord(null)
      refreshCurrentStatus()
      loadCheckHistory()
    }
  }

  const getStatusBadge = (record: CheckRecord) => {
    if (record.checkInTime && record.checkOutTime) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
    } else if (record.checkInTime && !record.checkOutTime) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Checked In</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
    }
  }

  const canCheckIn = (record: CheckRecord) => {
    return !record.checkInTime
  }

  const canCheckOut = (record: CheckRecord) => {
    return record.checkInTime && !record.checkOutTime
  }

  const filteredHistory = checkHistory.filter((record) => {
    const matchesSearch =
      record.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.address?.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.serviceType?.toLowerCase().includes(filters.search.toLowerCase())

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "pending" && !record.checkInTime) ||
      (filters.status === "checked_in" && record.checkInTime && !record.checkOutTime) ||
      (filters.status === "completed" && record.checkInTime && record.checkOutTime)

    return matchesSearch && matchesStatus
  })

  if (isLoading && !checkHistory.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading check records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Check In/Out Management</h2>
        <p className="text-muted-foreground">Manage your check-in and check-out records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Check Records History
          </CardTitle>
          <CardDescription>View and manage all your check-in/out records</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, address, or service..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                refreshCurrentStatus()
                loadCheckHistory()
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Records Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <CalendarIcon className="h-8 w-8 mx-auto mb-2" />
                        <p>No check records found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{record.customerName || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.serviceType}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{record.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(record)}</TableCell>
                      <TableCell>
                        {record.checkInTime ? (
                          <span className="text-sm">{formatTime(record.checkInTime)}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.checkOutTime ? (
                          <span className="text-sm">{formatTime(record.checkOutTime)}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{calculateDuration(record.checkInTime, record.checkOutTime)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {canCheckIn(record) && (
                            <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedRecord(record)}>
                                  <LogIn className="h-4 w-4 mr-1" />
                                  Check In
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Check In</DialogTitle>
                                  <DialogDescription>
                                    Register your arrival at {selectedRecord?.customerName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <PhotoCapture
                                    label="Location Photo (Optional)"
                                    onPhotoCapture={setCheckInPhoto}
                                    onPhotoRemove={() => setCheckInPhoto("")}
                                    capturedPhoto={checkInPhoto}
                                  />
                                  <div className="space-y-2">
                                    <Label htmlFor="checkin-notes">Notes (Optional)</Label>
                                    <Textarea
                                      id="checkin-notes"
                                      placeholder="Any observations about the location?"
                                      value={checkInNotes}
                                      onChange={(e) => setCheckInNotes(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={handleCheckIn} className="flex-1">
                                      Confirm Check In
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setCheckInDialogOpen(false)
                                        setSelectedRecord(null)
                                        setCheckInPhoto("")
                                        setCheckInNotes("")
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {canCheckOut(record) && (
                            <Dialog open={checkOutDialogOpen} onOpenChange={setCheckOutDialogOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedRecord(record)}>
                                  <LogOut className="h-4 w-4 mr-1" />
                                  Check Out
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Check Out</DialogTitle>
                                  <DialogDescription>
                                    Register your departure from {selectedRecord?.customerName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <PhotoCapture
                                    label="Completion Photo (Optional)"
                                    onPhotoCapture={setCheckOutPhoto}
                                    onPhotoRemove={() => setCheckOutPhoto("")}
                                    capturedPhoto={checkOutPhoto}
                                  />
                                  <div className="space-y-2">
                                    <Label htmlFor="checkout-notes">Service Notes (Optional)</Label>
                                    <Textarea
                                      id="checkout-notes"
                                      placeholder="Any notes about the service completed?"
                                      value={checkOutNotes}
                                      onChange={(e) => setCheckOutNotes(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={handleCheckOut} className="flex-1">
                                      Confirm Check Out
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setCheckOutDialogOpen(false)
                                        setSelectedRecord(null)
                                        setCheckOutPhoto("")
                                        setCheckOutNotes("")
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
