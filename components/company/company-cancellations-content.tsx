"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Calendar, Clock, Download, Filter, Plus, Search, UserX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CompanyCancellationModal } from "@/components/company/company-cancellation-modal"
import { CompanyCancellationDetailsModal } from "@/components/company/company-cancellation-details-modal"
import { useCompanyCancellations } from "@/hooks/use-company-cancellations"
import { Skeleton } from "@/components/ui/skeleton"
import { RefundStatus, type Cancellation } from "@/types/cancellation"
import { format } from "date-fns"

export function CompanyCancellationsContent() {
  const {
    cancellations,
    loading,
    stats,
    filters,
    updateFilters,
    exportCancellations,
    formatDate,
    formatShortDate,
    getRefundStatusColor,
    getRefundStatusLabel,
    getCancelledByRoleLabel,
  } = useCompanyCancellations()

  const [selectedTab, setSelectedTab] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCancellation, setSelectedCancellation] = useState<Cancellation | null>(null)

  // Filter cancellations based on search query and selected tab
  const filteredCancellations = cancellations.filter((cancellation) => {
    const matchesSearch = filters.search
      ? cancellation.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        cancellation.reason.toLowerCase().includes(filters.search.toLowerCase()) ||
        cancellation.notes?.toLowerCase().includes(filters.search.toLowerCase()) ||
        cancellation.id.toString().includes(filters.search)
      : true

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "pending") return matchesSearch && cancellation.refundStatus === RefundStatus.Pending
    if (selectedTab === "processed") return matchesSearch && cancellation.refundStatus === RefundStatus.Processed
    if (selectedTab === "rejected") return matchesSearch && cancellation.refundStatus === RefundStatus.Rejected
    if (selectedTab === "not_applicable")
      return matchesSearch && cancellation.refundStatus === RefundStatus.NotApplicable

    return matchesSearch
  })

  const handleOpenDetails = (cancellation: Cancellation) => {
    setSelectedCancellation(cancellation)
    setIsDetailsModalOpen(true)
  }

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    if (value === "all") {
      updateFilters({ refundStatus: undefined })
    } else {
      const statusMap = {
        pending: RefundStatus.Pending,
        processed: RefundStatus.Processed,
        rejected: RefundStatus.Rejected,
        not_applicable: RefundStatus.NotApplicable,
      }
      updateFilters({ refundStatus: statusMap[value as keyof typeof statusMap] })
    }
  }

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    await exportCancellations(format)
  }

  if (loading && cancellations.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-[#2a3349]">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <div className="p-4 flex-1">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#2a3349]">
        <div>
          <h1 className="text-2xl font-bold text-white">Cancellations</h1>
          <p className="text-gray-400">Manage service cancellations and refunds</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#1a2234] bg-transparent"
            onClick={() => handleExport("csv")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Cancellation
          </Button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-hidden">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <UserX className="h-8 w-8 text-[#06b6d4]" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Processed</p>
                    <p className="text-2xl font-bold text-green-500">{stats.processed}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Rejected</p>
                    <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="all" className="h-full flex flex-col" onValueChange={handleTabChange}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <TabsList className="bg-[#1a2234] p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="processed"
                className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white"
              >
                Processed
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
                Rejected
              </TabsTrigger>
              <TabsTrigger
                value="not_applicable"
                className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white"
              >
                N/A
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search cancellations..."
                  className="pl-8 bg-[#1a2234] border-[#2a3349] text-white w-full"
                  value={filters.search || ""}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#1a2234] bg-transparent"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Card className="bg-[#0f172a] border-[#2a3349] h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Cancellation Records</CardTitle>
                <CardDescription>{filteredCancellations.length} cancellations found</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                <Table>
                  <TableHeader className="bg-[#1a2234]">
                    <TableRow className="hover:bg-[#1a2234] border-[#2a3349]">
                      <TableHead className="text-gray-400">ID</TableHead>
                      <TableHead className="text-gray-400">Customer</TableHead>
                      <TableHead className="text-gray-400">Reason</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Cancelled by</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index} className="hover:bg-[#1a2234] border-[#2a3349]">
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-48" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-8 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredCancellations.length === 0 ? (
                      <TableRow className="hover:bg-[#1a2234] border-[#2a3349]">
                        <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle className="h-8 w-8 mb-2 text-gray-500" />
                            <p>No cancellations found</p>
                            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCancellations.map((cancellation) => (
                        <TableRow
                          key={cancellation.id}
                          className="hover:bg-[#1a2234] border-[#2a3349] cursor-pointer"
                          onClick={() => handleOpenDetails(cancellation)}
                        >
                          <TableCell className="font-medium text-white">#{cancellation.id}</TableCell>
                          <TableCell>{cancellation.customerName || "N/A"}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={cancellation.reason}>
                            {cancellation.reason}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span>{formatShortDate(cancellation.cancelledAt)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(cancellation.cancelledAt), "HH:mm")}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRefundStatusColor(cancellation.refundStatus)}>
                              {getRefundStatusLabel(cancellation.refundStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>{getCancelledByRoleLabel(cancellation.cancelledByRole)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-white hover:bg-[#2a3349]"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenDetails(cancellation)
                              }}
                            >
                              <span className="sr-only">Open details</span>
                              <UserX className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>

      {/* Create Cancellation Modal */}
      <CompanyCancellationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Cancellation Details Modal */}
      {selectedCancellation && (
        <CompanyCancellationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          cancellation={selectedCancellation}
        />
      )}
    </div>
  )
}
