"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Plus, Filter, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useCheckRecords } from "@/hooks/use-check-records"
import { CompanyCheckInModal } from "@/components/company/company-check-in-modal"
import { CompanyCheckOutModal } from "@/components/company/company-check-out-modal"
import { CompanyCheckInDetailsModal } from "@/components/company/company-check-in-details-modal"
import { CompanyCheckOutDetailsModal } from "@/components/company/company-check-out-details-modal"
import { CompanyCheckRecordModal } from "@/components/company/company-check-record-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type CheckRecord, CHECK_RECORD_STATUS } from "@/types/check-record"
import { useAuth } from "@/contexts/auth-context"

export default function CheckManagementPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { records: checkRecords, isLoading, fetchRecords, createRecord, updateRecord, deleteRecord } = useCheckRecords()

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false)
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false)
  const [isCheckInDetailsModalOpen, setIsCheckInDetailsModalOpen] = useState(false)
  const [isCheckOutDetailsModalOpen, setIsCheckOutDetailsModalOpen] = useState(false)
  const [isCheckRecordModalOpen, setIsCheckRecordModalOpen] = useState(false)
  const [selectedCheckRecord, setSelectedCheckRecord] = useState<CheckRecord | null>(null)
  const [activeTab, setActiveTab] = useState("check-in")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined)
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageCount: 1,
    pageSize: 10,
    totalItems: 0,
    firstRowOnPage: 1,
    lastRowOnPage: 10,
  })

  useEffect(() => {
    loadCheckRecords()
  }, [currentPage, statusFilter, dateFilter, searchTerm])

  const loadCheckRecords = async () => {
    const filters = {
      page: currentPage,
      pageSize: 10,
      search: searchTerm,
      status: statusFilter,
      date: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
      companyId: user?.companyId || 1,
    }

    await fetchRecords(filters)
  }

  const handleAddCheckRecord = async (data: any) => {
    const result = await createRecord(data)
    if (result) {
      setIsCheckRecordModalOpen(false)
      toast({
        title: "Success",
        description: "Check record created successfully",
      })
    }
  }

  const handleUpdateCheckRecord = async (data: any) => {
    if (selectedCheckRecord) {
      const result = await updateRecord(selectedCheckRecord.id.toString(), data)
      if (result) {
        setIsCheckInModalOpen(false)
        setIsCheckOutModalOpen(false)
        toast({
          title: "Success",
          description: "Check record updated successfully",
        })
      }
    }
  }

  // Filter records for check-in tab (pending and checked-in)
  const getCheckInRecords = (): CheckRecord[] => {
    if (!Array.isArray(checkRecords)) {
      return []
    }
    return checkRecords.filter(
      (record) => record.status === CHECK_RECORD_STATUS.PENDING || record.status === CHECK_RECORD_STATUS.CHECKED_IN,
    )
  }

  // Filter records for check-out tab (checked-in only)
  const getCheckOutRecords = (): CheckRecord[] => {
    if (!Array.isArray(checkRecords)) {
      return []
    }
    return checkRecords.filter((record) => record.status === CHECK_RECORD_STATUS.CHECKED_IN)
  }

  // Filter records for history tab (completed and cancelled)
  const getHistoryRecords = (): CheckRecord[] => {
    if (!Array.isArray(checkRecords)) {
      return []
    }
    return checkRecords.filter(
      (record) =>
        record.status === CHECK_RECORD_STATUS.COMPLETED ||
        record.status === CHECK_RECORD_STATUS.CANCELLED ||
        record.status === CHECK_RECORD_STATUS.CHECKED_OUT,
    )
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "all" ? undefined : Number.parseInt(value))
    setCurrentPage(1)
  }

  const handleDateFilterChange = (date: Date | undefined) => {
    setDateFilter(date)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter(undefined)
    setDateFilter(undefined)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case CHECK_RECORD_STATUS.PENDING:
        return <Badge className="bg-yellow-500">Pending</Badge>
      case CHECK_RECORD_STATUS.CHECKED_IN:
        return <Badge className="bg-blue-500">Checked In</Badge>
      case CHECK_RECORD_STATUS.CHECKED_OUT:
        return <Badge className="bg-purple-500">Checked Out</Badge>
      case CHECK_RECORD_STATUS.COMPLETED:
        return <Badge className="bg-green-500">Completed</Badge>
      case CHECK_RECORD_STATUS.CANCELLED:
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const renderCheckRecordsList = (records: CheckRecord[]) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-white">Loading check records...</div>
        </div>
      )
    }

    if (!records.length) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-white">No check records found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your filters or create a new check record.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {records.map((record) => (
          <Card key={record.id} className="bg-[#1a2234] border-[#2a3349] overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src="/placeholder-user.jpg" alt={record.professionalName} />
                  <AvatarFallback className="bg-[#06b6d4]">{record.professionalName?.charAt(0) || "P"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">{record.professionalName}</p>
                    {getStatusBadge(record.status)}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <span className="truncate">{record.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center text-xs text-gray-400">
                      <span>
                        {record.checkInTime
                          ? `Check-in: ${format(new Date(record.checkInTime), "MMM d, yyyy HH:mm")}`
                          : "Not checked in"}
                      </span>
                    </div>
                    {record.checkOutTime && (
                      <div className="flex items-center text-xs text-gray-400">
                        <span>Check-out: {format(new Date(record.checkOutTime), "MMM d, yyyy HH:mm")}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                    onClick={() => {
                      setSelectedCheckRecord(record)
                      if (activeTab === "check-in") {
                        setIsCheckInDetailsModalOpen(true)
                      } else if (activeTab === "check-out") {
                        setIsCheckOutDetailsModalOpen(true)
                      } else {
                        // For history tab, show check-in details by default
                        setIsCheckInDetailsModalOpen(true)
                      }
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Pagination */}
        {pagination.pageCount > 1 && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-400">
              Showing {pagination.firstRowOnPage || 1} to {pagination.lastRowOnPage || 0} of {pagination.totalItems}{" "}
              records
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="border-[#2a3349] text-white hover:bg-[#2a3349]"
              >
                Previous
              </Button>
              <span className="text-sm text-white">
                Page {pagination.currentPage} of {pagination.pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.pageCount}
                className="border-[#2a3349] text-white hover:bg-[#2a3349]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Check Management</h1>
          <p className="text-gray-400">Manage check-ins and check-outs for professionals.</p>
        </div>
        <Button
          className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
          onClick={() => {
            setSelectedCheckRecord(null)
            setIsCheckRecordModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Check Record
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Check Records</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <CardDescription className="text-gray-400">View and manage all check records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by professional name or address..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-[#0f172a] border-[#2a3349] text-white placeholder-gray-400"
              />
            </div>

            {isFilterOpen && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex-1">
                  <Select value={statusFilter?.toString() || "all"} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-full bg-[#0f172a] border-[#2a3349] text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="0">Pending</SelectItem>
                      <SelectItem value="1">Checked In</SelectItem>
                      <SelectItem value="2">Checked Out</SelectItem>
                      <SelectItem value="3">Completed</SelectItem>
                      <SelectItem value="4">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal border-[#2a3349] bg-[#0f172a] hover:bg-[#2a3349] ${
                          !dateFilter ? "text-gray-400" : "text-white"
                        }`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1a2234] border-[#2a3349]">
                      <DatePicker mode="single" selected={dateFilter} onSelect={handleDateFilterChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  variant="outline"
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 bg-[#0f172a] border border-[#2a3349]">
                <TabsTrigger
                  value="check-in"
                  className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white"
                >
                  Check-In
                </TabsTrigger>
                <TabsTrigger
                  value="check-out"
                  className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white"
                >
                  Check-Out
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white"
                >
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="check-in" className="mt-4">
                {renderCheckRecordsList(getCheckInRecords())}
              </TabsContent>
              <TabsContent value="check-out" className="mt-4">
                {renderCheckRecordsList(getCheckOutRecords())}
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                {renderCheckRecordsList(getHistoryRecords())}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CompanyCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => {
          setIsCheckInModalOpen(false)
          setSelectedCheckRecord(null)
        }}
        onSubmit={handleUpdateCheckRecord}
        checkIn={selectedCheckRecord}
      />

      <CompanyCheckOutModal
        isOpen={isCheckOutModalOpen}
        onClose={() => {
          setIsCheckOutModalOpen(false)
          setSelectedCheckRecord(null)
        }}
        onSubmit={handleUpdateCheckRecord}
        checkOut={selectedCheckRecord}
      />

      <CompanyCheckInDetailsModal
        isOpen={isCheckInDetailsModalOpen}
        onClose={() => {
          setIsCheckInDetailsModalOpen(false)
          setSelectedCheckRecord(null)
        }}
        checkIn={selectedCheckRecord}
        onCheckOut={() => {
          setIsCheckInDetailsModalOpen(false)
          setIsCheckOutModalOpen(true)
        }}
      />

      <CompanyCheckOutDetailsModal
        isOpen={isCheckOutDetailsModalOpen}
        onClose={() => {
          setIsCheckOutDetailsModalOpen(false)
          setSelectedCheckRecord(null)
        }}
        checkOut={selectedCheckRecord}
      />

      <CompanyCheckRecordModal
        isOpen={isCheckRecordModalOpen}
        onClose={() => {
          setIsCheckRecordModalOpen(false)
          setSelectedCheckRecord(null)
        }}
        onSubmit={handleAddCheckRecord}
      />
    </div>
  )
}
