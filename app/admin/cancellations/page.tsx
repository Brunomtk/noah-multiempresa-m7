"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Building2,
  Clock,
  AlertTriangle,
  DollarSign,
  Filter,
} from "lucide-react"
import { CancellationModal } from "@/components/admin/cancellation-modal"
import { CancellationDetailsModal } from "@/components/admin/cancellation-details-modal"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Cancellation {
  id: string
  appointmentId: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  professional: {
    id: string
    name: string
    specialty: string
  }
  company: {
    id: string
    name: string
  }
  service: string
  originalDate: string
  originalTime: string
  price: number
  cancelledAt: string
  cancelledBy: "customer" | "professional" | "company" | "system"
  reason: string
  status: "pending" | "approved" | "rejected"
  refundStatus: "pending" | "processed" | "not_applicable"
  refundAmount?: number
  notes?: string
  policyApplied?: string
}

// Mock data
const mockCancellations: Cancellation[] = [
  {
    id: "CAN-001",
    appointmentId: "APT-2023-001",
    customer: {
      id: "CUST-001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(11) 98765-4321",
    },
    professional: {
      id: "PROF-001",
      name: "Dr. Maria Santos",
      specialty: "Dermatology",
    },
    company: {
      id: "COMP-001",
      name: "Total Health Clinic",
    },
    service: "Dermatology Consultation",
    originalDate: "2023-05-15",
    originalTime: "14:30",
    price: 180.0,
    cancelledAt: "2023-05-13T10:30:00Z",
    cancelledBy: "customer",
    reason: "Unavoidable work commitment came up",
    status: "pending",
    refundStatus: "pending",
    refundAmount: 162.0,
    policyApplied: "Cancellation more than 24h in advance: 90% refund",
  },
  {
    id: "CAN-002",
    appointmentId: "APT-2023-002",
    customer: {
      id: "CUST-002",
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 91234-5678",
    },
    professional: {
      id: "PROF-002",
      name: "Dr. Carlos Oliveira",
      specialty: "Physical Therapy",
    },
    company: {
      id: "COMP-002",
      name: "Physical Rehabilitation Center",
    },
    service: "Physical Therapy Session",
    originalDate: "2023-05-16",
    originalTime: "10:00",
    price: 120.0,
    cancelledAt: "2023-05-15T18:45:00Z",
    cancelledBy: "customer",
    reason: "I have flu symptoms",
    status: "approved",
    refundStatus: "processed",
    refundAmount: 120.0,
    notes: "Provided medical certificate",
    policyApplied: "Cancellation due to health reasons with certificate: 100% refund",
  },
  {
    id: "CAN-003",
    appointmentId: "APT-2023-003",
    customer: {
      id: "CUST-003",
      name: "Pedro Mendes",
      email: "pedro.mendes@email.com",
      phone: "(11) 97777-8888",
    },
    professional: {
      id: "PROF-003",
      name: "Dr. Luciana Ferreira",
      specialty: "Nutrition",
    },
    company: {
      id: "COMP-001",
      name: "Total Health Clinic",
    },
    service: "Nutrition Consultation",
    originalDate: "2023-05-17",
    originalTime: "16:00",
    price: 150.0,
    cancelledAt: "2023-05-17T15:30:00Z",
    cancelledBy: "customer",
    reason: "Couldn't arrive on time due to traffic",
    status: "rejected",
    refundStatus: "not_applicable",
    policyApplied: "Cancellation with less than 1h notice: no refund",
  },
  {
    id: "CAN-004",
    appointmentId: "APT-2023-004",
    customer: {
      id: "CUST-004",
      name: "Mariana Alves",
      email: "mariana.alves@email.com",
      phone: "(11) 95555-6666",
    },
    professional: {
      id: "PROF-004",
      name: "Dr. Roberto Souza",
      specialty: "Psychology",
    },
    company: {
      id: "COMP-003",
      name: "Mental Wellness Center",
    },
    service: "Therapy Session",
    originalDate: "2023-05-18",
    originalTime: "09:00",
    price: 200.0,
    cancelledAt: "2023-05-16T14:20:00Z",
    cancelledBy: "professional",
    reason: "Professional had to be absent due to family emergency",
    status: "approved",
    refundStatus: "processed",
    refundAmount: 200.0,
    policyApplied: "Cancellation by professional: 100% refund",
  },
  {
    id: "CAN-005",
    appointmentId: "APT-2023-005",
    customer: {
      id: "CUST-005",
      name: "Luiz Gonzaga",
      email: "luiz.gonzaga@email.com",
      phone: "(11) 93333-2222",
    },
    professional: {
      id: "PROF-005",
      name: "Dr. Patricia Lima",
      specialty: "Dentistry",
    },
    company: {
      id: "COMP-004",
      name: "Premium Dental",
    },
    service: "Dental Cleaning",
    originalDate: "2023-05-19",
    originalTime: "11:30",
    price: 160.0,
    cancelledAt: "2023-05-18T08:15:00Z",
    cancelledBy: "company",
    reason: "Technical issue with equipment",
    status: "approved",
    refundStatus: "processed",
    refundAmount: 160.0,
    policyApplied: "Cancellation by company: 100% refund",
  },
  {
    id: "CAN-006",
    appointmentId: "APT-2023-006",
    customer: {
      id: "CUST-006",
      name: "Fernanda Dias",
      email: "fernanda.dias@email.com",
      phone: "(11) 94444-1111",
    },
    professional: {
      id: "PROF-002",
      name: "Dr. Carlos Oliveira",
      specialty: "Physical Therapy",
    },
    company: {
      id: "COMP-002",
      name: "Physical Rehabilitation Center",
    },
    service: "Postural Assessment",
    originalDate: "2023-05-20",
    originalTime: "15:00",
    price: 140.0,
    cancelledAt: "2023-05-19T16:40:00Z",
    cancelledBy: "customer",
    reason: "Need to reschedule for next week",
    status: "pending",
    refundStatus: "pending",
    refundAmount: 98.0,
    policyApplied: "Cancellation with less than 24h notice: 70% refund",
  },
]

export default function CancellationsPage() {
  const [cancellations, setCancellations] = useState<Cancellation[]>(mockCancellations)
  const [filteredCancellations, setFilteredCancellations] = useState<Cancellation[]>(mockCancellations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCancellation, setSelectedCancellation] = useState<Cancellation | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  // Additional filters
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [cancelledByFilter, setCancelledByFilter] = useState<string>("all")
  const [refundStatusFilter, setRefundStatusFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Statistics
  const pendingCount = cancellations.filter((c) => c.status === "pending").length
  const approvedCount = cancellations.filter((c) => c.status === "approved").length
  const rejectedCount = cancellations.filter((c) => c.status === "rejected").length
  const totalRefundAmount = cancellations
    .filter((c) => c.refundStatus === "processed")
    .reduce((sum, c) => sum + (c.refundAmount || 0), 0)

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedTab, dateFilter, cancelledByFilter, refundStatusFilter, cancellations])

  const applyFilters = () => {
    let filtered = [...cancellations]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.service.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (selectedTab !== "all") {
      filtered = filtered.filter((c) => c.status === selectedTab)
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)
      const lastMonth = new Date(today)
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      filtered = filtered.filter((c) => {
        const cancelDate = new Date(c.cancelledAt)
        switch (dateFilter) {
          case "today":
            return cancelDate.toDateString() === today.toDateString()
          case "yesterday":
            return cancelDate.toDateString() === yesterday.toDateString()
          case "last7days":
            return cancelDate >= lastWeek
          case "last30days":
            return cancelDate >= lastMonth
          default:
            return true
        }
      })
    }

    // Cancelled by filter
    if (cancelledByFilter !== "all") {
      filtered = filtered.filter((c) => c.cancelledBy === cancelledByFilter)
    }

    // Refund status filter
    if (refundStatusFilter !== "all") {
      filtered = filtered.filter((c) => c.refundStatus === refundStatusFilter)
    }

    setFilteredCancellations(filtered)
  }

  const handleAddCancellation = () => {
    setSelectedCancellation(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleViewDetails = (cancellation: Cancellation) => {
    setSelectedCancellation(cancellation)
    setIsDetailsModalOpen(true)
  }

  const handleApproveCancellation = (id: string) => {
    setCancellations(
      cancellations.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: "approved",
            refundStatus: c.refundAmount ? "processed" : "not_applicable",
          }
        }
        return c
      }),
    )

    toast({
      title: "Cancellation approved",
      description: "The cancellation has been approved and the customer has been notified.",
    })
  }

  const handleRejectCancellation = (id: string) => {
    setCancellations(
      cancellations.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: "rejected",
            refundStatus: "not_applicable",
          }
        }
        return c
      }),
    )

    toast({
      title: "Cancellation rejected",
      description: "The cancellation has been rejected and the customer has been notified.",
    })
  }

  const handleSaveCancellation = (data: Cancellation) => {
    if (isEditing && selectedCancellation) {
      setCancellations(cancellations.map((c) => (c.id === selectedCancellation.id ? data : c)))
      toast({
        title: "Cancellation updated",
        description: "The cancellation information has been updated successfully.",
      })
    } else {
      const newCancellation: Cancellation = {
        ...data,
        id: `CAN-${String(cancellations.length + 1).padStart(3, "0")}`,
        cancelledAt: new Date().toISOString(),
      }
      setCancellations([...cancellations, newCancellation])
      toast({
        title: "Cancellation registered",
        description: "The new cancellation has been registered successfully.",
      })
    }
    setIsModalOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const getRefundBadge = (status: string) => {
    switch (status) {
      case "processed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Processed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Pending
          </Badge>
        )
      case "not_applicable":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            N/A
          </Badge>
        )
      default:
        return null
    }
  }

  const getCancelledByIcon = (cancelledBy: string) => {
    switch (cancelledBy) {
      case "customer":
        return <User className="h-4 w-4" />
      case "professional":
        return <User className="h-4 w-4" />
      case "company":
        return <Building2 className="h-4 w-4" />
      case "system":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  const getCancelledByLabel = (cancelledBy: string) => {
    switch (cancelledBy) {
      case "customer":
        return "Customer"
      case "professional":
        return "Professional"
      case "company":
        return "Company"
      case "system":
        return "System"
      default:
        return cancelledBy
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Cancellation Management</h1>
        <Button onClick={handleAddCancellation} className="bg-[#06b6d4] hover:bg-[#0891b2]">
          <Plus className="mr-2 h-4 w-4" />
          Register Cancellation
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Pending</CardTitle>
            <CardDescription>Awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">{pendingCount}</span>
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Action needed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Approved</CardTitle>
            <CardDescription>Confirmed cancellations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">{approvedCount}</span>
              <Badge variant="outline" className="border-green-500 text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Rejected</CardTitle>
            <CardDescription>Denied cancellations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">{rejectedCount}</span>
              <Badge variant="outline" className="border-red-500 text-red-500">
                <XCircle className="h-4 w-4 mr-1" />
                Not approved
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Total Refunded</CardTitle>
            <CardDescription>Processed amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">$ {totalRefundAmount.toFixed(2)}</span>
              <Badge variant="outline" className="border-[#06b6d4] text-[#06b6d4]">
                <DollarSign className="h-4 w-4 mr-1" />
                Financial
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="bg-[#1a2234] border border-[#2a3349]">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#2a3349]">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-[#2a3349]">
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-[#2a3349]">
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-[#2a3349]">
              Rejected
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cancellation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a2234] border-[#2a3349] text-white w-full sm:w-[250px]"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className={`border-[#2a3349] ${showFilters ? "bg-[#2a3349] text-white" : "text-gray-400"}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <Card className="bg-[#1a2234] border-[#2a3349] p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Period</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    <SelectItem value="all">All periods</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last7days">Last 7 days</SelectItem>
                    <SelectItem value="last30days">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Cancelled by</label>
                <Select value={cancelledByFilter} onValueChange={setCancelledByFilter}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select who cancelled" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Refund Status</label>
                <Select value={refundStatusFilter} onValueChange={setRefundStatusFilter}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="not_applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        <TabsContent value={selectedTab} className="space-y-4">
          <div className="rounded-lg border border-[#2a3349] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1a2234] hover:bg-[#1a2234]">
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Customer</TableHead>
                  <TableHead className="text-gray-400">Service</TableHead>
                  <TableHead className="text-gray-400">Original Date</TableHead>
                  <TableHead className="text-gray-400">Cancelled on</TableHead>
                  <TableHead className="text-gray-400">Cancelled by</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Refund</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCancellations.length === 0 ? (
                  <TableRow className="bg-[#0f172a] hover:bg-[#1a2234] border-b border-[#2a3349]">
                    <TableCell colSpan={9} className="text-center py-6 text-gray-400">
                      No cancellations found with the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCancellations.map((cancellation) => (
                    <TableRow
                      key={cancellation.id}
                      className="bg-[#0f172a] hover:bg-[#1a2234] border-b border-[#2a3349]"
                    >
                      <TableCell className="text-white font-medium">{cancellation.appointmentId}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white">{cancellation.customer.name}</span>
                          <span className="text-xs text-gray-400">{cancellation.customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{cancellation.service}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-white">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(cancellation.originalDate).toLocaleDateString()}
                          </div>
                          <span className="text-xs text-gray-400">{cancellation.originalTime}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          {new Date(cancellation.cancelledAt).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="p-1 bg-[#2a3349] rounded">{getCancelledByIcon(cancellation.cancelledBy)}</div>
                          {getCancelledByLabel(cancellation.cancelledBy)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(cancellation.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getRefundBadge(cancellation.refundStatus)}
                          {cancellation.refundAmount && (
                            <span className="text-sm text-gray-400">$ {cancellation.refundAmount.toFixed(2)}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {cancellation.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-green-500 text-green-500 hover:bg-green-500/10"
                                onClick={() => handleApproveCancellation(cancellation.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-500 text-red-500 hover:bg-red-500/10"
                                onClick={() => handleRejectCancellation(cancellation.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                            onClick={() => handleViewDetails(cancellation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCancellations.length} of {cancellations.length} cancellations
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="border-[#2a3349] text-gray-400">
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled className="border-[#2a3349] text-gray-400">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CancellationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        cancellation={selectedCancellation}
        isEditing={isEditing}
        onSave={handleSaveCancellation}
      />

      <CancellationDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        cancellation={selectedCancellation}
      />
    </div>
  )
}
