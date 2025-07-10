"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/admin/date-range-picker"
import { PaymentModal } from "@/components/admin/payment-modal"
import { PaymentDetailsModal } from "@/components/admin/payment-details-modal"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  Bell,
  ArrowUpDown,
  DollarSign,
  CreditCard,
  AlertCircle,
  Clock,
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Mock data for payments
const mockPayments = [
  {
    id: "PAY-001",
    companyId: "COMP-001",
    companyName: "CleanTech Solutions",
    amount: 299.99,
    date: "2023-05-15",
    dueDate: "2023-05-30",
    status: "paid",
    paymentMethod: "credit_card",
    planName: "Premium",
    invoiceNumber: "INV-2023-001",
  },
  {
    id: "PAY-002",
    companyId: "COMP-002",
    companyName: "Sparkle Cleaning Co.",
    amount: 199.99,
    date: "2023-05-16",
    dueDate: "2023-05-31",
    status: "pending",
    paymentMethod: "bank_transfer",
    planName: "Standard",
    invoiceNumber: "INV-2023-002",
  },
  {
    id: "PAY-003",
    companyId: "COMP-003",
    companyName: "Fresh & Clean Services",
    amount: 399.99,
    date: "2023-05-10",
    dueDate: "2023-05-25",
    status: "overdue",
    paymentMethod: "credit_card",
    planName: "Enterprise",
    invoiceNumber: "INV-2023-003",
  },
  {
    id: "PAY-004",
    companyId: "COMP-004",
    companyName: "Pristine Cleaning",
    amount: 149.99,
    date: "2023-05-18",
    dueDate: "2023-06-02",
    status: "paid",
    paymentMethod: "pix",
    planName: "Basic",
    invoiceNumber: "INV-2023-004",
  },
  {
    id: "PAY-005",
    companyId: "COMP-005",
    companyName: "EcoClean Solutions",
    amount: 299.99,
    date: "2023-05-12",
    dueDate: "2023-05-27",
    status: "failed",
    paymentMethod: "credit_card",
    planName: "Premium",
    invoiceNumber: "INV-2023-005",
  },
  {
    id: "PAY-006",
    companyId: "COMP-001",
    companyName: "CleanTech Solutions",
    amount: 299.99,
    date: "2023-04-15",
    dueDate: "2023-04-30",
    status: "paid",
    paymentMethod: "credit_card",
    planName: "Premium",
    invoiceNumber: "INV-2023-006",
  },
  {
    id: "PAY-007",
    companyId: "COMP-002",
    companyName: "Sparkle Cleaning Co.",
    amount: 199.99,
    date: "2023-04-16",
    dueDate: "2023-04-30",
    status: "paid",
    paymentMethod: "bank_transfer",
    planName: "Standard",
    invoiceNumber: "INV-2023-007",
  },
  {
    id: "PAY-008",
    companyId: "COMP-003",
    companyName: "Fresh & Clean Services",
    amount: 399.99,
    date: "2023-04-10",
    dueDate: "2023-04-25",
    status: "paid",
    paymentMethod: "credit_card",
    planName: "Enterprise",
    invoiceNumber: "INV-2023-008",
  },
  {
    id: "PAY-009",
    companyId: "COMP-004",
    companyName: "Pristine Cleaning",
    amount: 149.99,
    date: "2023-03-18",
    dueDate: "2023-04-02",
    status: "paid",
    paymentMethod: "pix",
    planName: "Basic",
    invoiceNumber: "INV-2023-009",
  },
  {
    id: "PAY-010",
    companyId: "COMP-005",
    companyName: "EcoClean Solutions",
    amount: 299.99,
    date: "2023-03-12",
    dueDate: "2023-03-27",
    status: "paid",
    paymentMethod: "credit_card",
    planName: "Premium",
    invoiceNumber: "INV-2023-010",
  },
  {
    id: "PAY-011",
    companyId: "COMP-001",
    companyName: "CleanTech Solutions",
    amount: 299.99,
    date: "2023-06-15",
    dueDate: "2023-06-30",
    status: "pending",
    paymentMethod: "credit_card",
    planName: "Premium",
    invoiceNumber: "INV-2023-011",
  },
  {
    id: "PAY-012",
    companyId: "COMP-002",
    companyName: "Sparkle Cleaning Co.",
    amount: 199.99,
    date: "2023-06-16",
    dueDate: "2023-06-30",
    status: "pending",
    paymentMethod: "bank_transfer",
    planName: "Standard",
    invoiceNumber: "INV-2023-012",
  },
]

// Calculate stats data
const calculateStats = (payments) => {
  const totalRevenue = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const pendingPayments = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const overduePayments = payments
    .filter((payment) => payment.status === "overdue")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const failedPayments = payments
    .filter((payment) => payment.status === "failed")
    .reduce((sum, payment) => sum + payment.amount, 0)

  return {
    totalRevenue,
    pendingPayments,
    overduePayments,
    failedPayments,
  }
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [paymentToEdit, setPaymentToEdit] = useState<any>(null)
  const itemsPerPage = 8

  const statsData = calculateStats(mockPayments)

  // Sort and filter payments
  const sortedAndFilteredPayments = [...mockPayments]
    .filter((payment) => {
      const matchesSearch =
        payment.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus

      const matchesPaymentMethod = selectedPaymentMethod === "all" || payment.paymentMethod === selectedPaymentMethod

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "paid" && payment.status === "paid") ||
        (activeTab === "pending" && payment.status === "pending") ||
        (activeTab === "overdue" && payment.status === "overdue") ||
        (activeTab === "failed" && payment.status === "failed")

      return matchesSearch && matchesStatus && matchesPaymentMethod && matchesTab
    })
    .sort((a, b) => {
      if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      } else if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortField === "dueDate") {
        return sortDirection === "asc"
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      } else if (sortField === "company") {
        return sortDirection === "asc"
          ? a.companyName.localeCompare(b.companyName)
          : b.companyName.localeCompare(a.companyName)
      }
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredPayments.length / itemsPerPage)
  const paginatedPayments = sortedAndFilteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleOpenDetailsModal = (payment: any) => {
    setSelectedPayment(payment)
    setIsDetailsModalOpen(true)
  }

  const handleEditPayment = (payment: any) => {
    setPaymentToEdit(payment)
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setPaymentToEdit(null)
  }

  const handleMarkAsPaid = (paymentId: string) => {
    // In a real application, this would update the payment status in the database
    console.log(`Marking payment ${paymentId} as paid`)
    // For now, we'll just show an alert
    alert(`Payment ${paymentId} marked as paid`)
  }

  const handleSendReminder = (paymentId: string) => {
    // In a real application, this would send a payment reminder to the company
    console.log(`Sending reminder for payment ${paymentId}`)
    // For now, we'll just show an alert
    alert(`Reminder sent for payment ${paymentId}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Overdue
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-gray-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Failed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card"
      case "bank_transfer":
        return "Bank Transfer"
      case "pix":
        return "PIX"
      default:
        return method
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4 mr-1" />
      case "bank_transfer":
        return <DollarSign className="h-4 w-4 mr-1" />
      case "pix":
        return <DollarSign className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <Button
          onClick={() => {
            setPaymentToEdit(null)
            setIsPaymentModalOpen(true)
          }}
          className="flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          Register Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              R$ {statsData.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              R$ {statsData.pendingPayments.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Overdue Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              R$ {statsData.overduePayments.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Failed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">
              R$ {statsData.failedPayments.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by company or invoice..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>
          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value)
              setCurrentPage(1) // Reset to first page on filter change
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedPaymentMethod}
            onValueChange={(value) => {
              setSelectedPaymentMethod(value)
              setCurrentPage(1) // Reset to first page on filter change
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DatePickerWithRange
          dateRange={{}}
          onDateRangeChange={() => {
            setCurrentPage(1) // Reset to first page on date change
          }}
        />
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          setCurrentPage(1) // Reset to first page on tab change
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid" className="text-green-600">
            Paid
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-yellow-600">
            Pending
          </TabsTrigger>
          <TabsTrigger value="overdue" className="text-red-600">
            Overdue
          </TabsTrigger>
          <TabsTrigger value="failed" className="text-gray-600">
            Failed
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort("invoice")}>
                      Invoice
                      {sortField === "invoice" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("company")}>
                      Company
                      {sortField === "company" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                      Amount
                      {sortField === "amount" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                      Date
                      {sortField === "date" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("dueDate")}>
                      Due Date
                      {sortField === "dueDate" && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPayments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                        <TableCell>{payment.companyName}</TableCell>
                        <TableCell>{payment.planName}</TableCell>
                        <TableCell className="font-semibold">R$ {payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{new Date(payment.dueDate).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="flex items-center">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          {getPaymentMethodLabel(payment.paymentMethod)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDetailsModal(payment)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPayment(payment)}
                              title="Edit Payment"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault()
                                alert(`Downloading invoice ${payment.invoiceNumber}`)
                              }}
                              title="Download Invoice"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {(payment.status === "pending" || payment.status === "overdue") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMarkAsPaid(payment.id)}
                                title="Mark as Paid"
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {(payment.status === "pending" || payment.status === "overdue") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSendReminder(payment.id)}
                                title="Send Reminder"
                                className="text-blue-600"
                              >
                                <Bell className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={handleClosePaymentModal} paymentToEdit={paymentToEdit} />

      {selectedPayment && (
        <PaymentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          payment={selectedPayment}
        />
      )}
    </div>
  )
}
