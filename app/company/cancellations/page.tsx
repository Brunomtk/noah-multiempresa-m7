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

// Sample data for cancellations
const cancellations = [
  {
    id: "CAN-1001",
    client: "Sarah Johnson",
    service: "Regular Cleaning",
    date: "2025-05-20",
    time: "09:00 AM",
    status: "Refunded",
    reason: "Client Schedule Conflict",
    professional: "Maria Garcia",
    refundAmount: "$75.00",
    createdAt: "2025-05-18T14:30:00",
  },
  {
    id: "CAN-1002",
    client: "Robert Williams",
    service: "Deep Cleaning",
    date: "2025-05-22",
    time: "01:00 PM",
    status: "Rescheduled",
    reason: "Professional Unavailable",
    professional: "James Wilson",
    refundAmount: "$0.00",
    createdAt: "2025-05-19T10:15:00",
  },
  {
    id: "CAN-1003",
    client: "Emily Davis",
    service: "Move-out Cleaning",
    date: "2025-05-23",
    time: "10:00 AM",
    status: "Cancelled",
    reason: "Client Dissatisfaction",
    professional: "Ana Martinez",
    refundAmount: "$120.00",
    createdAt: "2025-05-20T09:45:00",
  },
  {
    id: "CAN-1004",
    client: "Michael Brown",
    service: "Regular Cleaning",
    date: "2025-05-24",
    time: "02:30 PM",
    status: "Partial Refund",
    reason: "Weather Conditions",
    professional: "David Thompson",
    refundAmount: "$45.00",
    createdAt: "2025-05-21T16:20:00",
  },
  {
    id: "CAN-1005",
    client: "Jennifer Miller",
    service: "Window Cleaning",
    date: "2025-05-25",
    time: "11:00 AM",
    status: "Rescheduled",
    reason: "Client Request",
    professional: "Sofia Rodriguez",
    refundAmount: "$0.00",
    createdAt: "2025-05-22T08:30:00",
  },
  {
    id: "CAN-1006",
    client: "Daniel Wilson",
    service: "Deep Cleaning",
    date: "2025-05-26",
    time: "09:30 AM",
    status: "Cancelled",
    reason: "System Error",
    professional: "John Smith",
    refundAmount: "$150.00",
    createdAt: "2025-05-23T13:10:00",
  },
]

export default function CancellationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCancellation, setSelectedCancellation] = useState(null)

  // Filter cancellations based on search query and selected tab
  const filteredCancellations = cancellations.filter((cancellation) => {
    const matchesSearch =
      cancellation.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cancellation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cancellation.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cancellation.professional.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "refunded") return matchesSearch && cancellation.status === "Refunded"
    if (selectedTab === "rescheduled") return matchesSearch && cancellation.status === "Rescheduled"
    if (selectedTab === "cancelled") return matchesSearch && cancellation.status === "Cancelled"
    if (selectedTab === "partial") return matchesSearch && cancellation.status === "Partial Refund"

    return matchesSearch
  })

  const handleOpenDetails = (cancellation) => {
    setSelectedCancellation(cancellation)
    setIsDetailsModalOpen(true)
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
            className="border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#1a2234]"
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
        <Tabs defaultValue="all" className="h-full flex flex-col" onValueChange={setSelectedTab}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <TabsList className="bg-[#1a2234] p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="refunded" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
                Refunded
              </TabsTrigger>
              <TabsTrigger
                value="rescheduled"
                className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white"
              >
                Rescheduled
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white"
              >
                Cancelled
              </TabsTrigger>
              <TabsTrigger value="partial" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
                Partial
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search cancellations..."
                  className="pl-8 bg-[#1a2234] border-[#2a3349] text-white w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#1a2234]"
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
                      <TableHead className="text-gray-400">Client</TableHead>
                      <TableHead className="text-gray-400">Service</TableHead>
                      <TableHead className="text-gray-400">Date & Time</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Reason</TableHead>
                      <TableHead className="text-gray-400">Refund</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCancellations.length === 0 ? (
                      <TableRow className="hover:bg-[#1a2234] border-[#2a3349]">
                        <TableCell colSpan={8} className="text-center py-8 text-gray-400">
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
                          <TableCell className="font-medium text-white">{cancellation.id}</TableCell>
                          <TableCell>{cancellation.client}</TableCell>
                          <TableCell>{cancellation.service}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span>{new Date(cancellation.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <Clock className="h-3 w-3" />
                              <span>{cancellation.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`
                                ${cancellation.status === "Refunded" ? "bg-red-500/20 text-red-500 hover:bg-red-500/20" : ""}
                                ${cancellation.status === "Rescheduled" ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" : ""}
                                ${cancellation.status === "Cancelled" ? "bg-orange-500/20 text-orange-500 hover:bg-orange-500/20" : ""}
                                ${cancellation.status === "Partial Refund" ? "bg-purple-500/20 text-purple-500 hover:bg-purple-500/20" : ""}
                              `}
                            >
                              {cancellation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={cancellation.reason}>
                            {cancellation.reason}
                          </TableCell>
                          <TableCell>{cancellation.refundAmount}</TableCell>
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
