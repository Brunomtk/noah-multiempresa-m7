"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/admin/date-range-picker"
import { CompanyCheckRecordModal } from "@/components/company/company-check-record-modal"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, MapPin, Search, Plus, Eye, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { useCheckRecords } from "@/hooks/use-check-records"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

export default function CheckManagementPage() {
  const {
    checkRecords,
    selectedCheckRecord,
    loading,
    error,
    filters,
    fetchCheckRecords,
    fetchCheckRecordById,
    addCheckRecord,
    updateCheckRecordById,
    removeCheckRecord,
    updateFilters,
    resetFilters,
    setSelectedCheckRecord,
  } = useCheckRecords()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isCheckRecordModalOpen, setIsCheckRecordModalOpen] = useState(false)
  const [checkRecordToEdit, setCheckRecordToEdit] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [companyId, setCompanyId] = useState<string>("")

  // Initialize companyId from localStorage only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCompanyId = localStorage.getItem("companyId")
      if (storedCompanyId) {
        setCompanyId(storedCompanyId)
      }
    }
  }, [])

  // Filter check records based on search query, status, type, and tab
  const filteredCheckRecords = checkRecords.filter((record) => {
    const professionalName = record?.professionalName || ""
    const location = record?.location || ""

    const matchesSearch =
      professionalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())

    const recordStatus = record?.status?.toString() || ""
    const matchesStatus = selectedStatus === "all" || recordStatus === selectedStatus

    const recordType = record?.type?.toString() || ""
    const matchesType = selectedType === "all" || recordType === selectedType

    const status = record?.status
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "check-in" && record?.type === "check-in") ||
      (activeTab === "check-out" && record?.type === "check-out")

    return matchesSearch && matchesStatus && matchesType && matchesTab
  })

  const handleOpenDetailsModal = async (record: any) => {
    try {
      await fetchCheckRecordById(record.id)
    } catch (error) {
      console.error("Failed to fetch check record details:", error)
    }
  }

  const handleEditCheckRecord = async (record: any) => {
    try {
      await fetchCheckRecordById(record.id)
      setCheckRecordToEdit(selectedCheckRecord)
      setIsCheckRecordModalOpen(true)
    } catch (error) {
      console.error("Failed to fetch check record for editing:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "check-in":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "check-out":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Stats calculation with safe checks
  const stats = {
    total: checkRecords?.length || 0,
    checkIns: checkRecords?.filter((r) => r?.type === "check-in")?.length || 0,
    checkOuts: checkRecords?.filter((r) => r?.type === "check-out")?.length || 0,
    pending: checkRecords?.filter((r) => r?.status === "pending")?.length || 0,
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    updateFilters({ search: value })
  }

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value)
    updateFilters({ status: value === "all" ? undefined : value })
  }

  const handleTypeFilter = (value: string) => {
    setSelectedType(value)
    updateFilters({ type: value === "all" ? undefined : value })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Check Management</h1>
        <Button
          onClick={() => {
            setCheckRecordToEdit(null)
            setIsCheckRecordModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Check Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkIns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Check-outs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkOuts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search records..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="check-in">Check-in</SelectItem>
              <SelectItem value="check-out">Check-out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DatePickerWithRange dateRange={{}} onDateRangeChange={() => {}} />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="check-in">Check-ins</TabsTrigger>
          <TabsTrigger value="check-out">Check-outs</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professional</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading check records...
                      </TableCell>
                    </TableRow>
                  ) : filteredCheckRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No check records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCheckRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.professionalName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(record.type)}
                            <span className="capitalize">{record.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {record.location}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          {record.timestamp ? format(new Date(record.timestamp), "MMM dd, yyyy HH:mm") : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenDetailsModal(record)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CompanyCheckRecordModal
        isOpen={isCheckRecordModalOpen}
        onClose={() => {
          setIsCheckRecordModalOpen(false)
          setCheckRecordToEdit(null)
        }}
        checkRecordToEdit={checkRecordToEdit}
        onSubmit={checkRecordToEdit ? updateCheckRecordById : addCheckRecord}
      />
    </div>
  )
}
