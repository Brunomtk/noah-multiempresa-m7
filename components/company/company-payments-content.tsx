"use client"

import { useState } from "react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Calendar, CreditCard, DollarSign, FileText, MoreHorizontal, Plus, RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCompanyPaymentsContext } from "@/contexts/company-payments-context"
import { CompanyPaymentModal } from "./company-payment-modal"
import { CompanyPaymentDetailsModal } from "./company-payment-details-modal"
import type { Payment } from "@/types/payment"

export function CompanyPaymentsContent() {
  const { payments, isLoading, error, statistics, fetchPayments, markAsPaid, markAsOverdue, markAsCancelled } =
    useCompanyPaymentsContext()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDetailsModalOpen(true)
  }

  const handleMarkAsPaid = async (payment: Payment) => {
    try {
      await markAsPaid(payment.id)
    } catch (error) {
      console.error("Failed to mark payment as paid:", error)
    }
  }

  const handleMarkAsOverdue = async (payment: Payment) => {
    try {
      await markAsOverdue(payment.id)
    } catch (error) {
      console.error("Failed to mark payment as overdue:", error)
    }
  }

  const handleMarkAsCancelled = async (payment: Payment) => {
    try {
      await markAsCancelled(payment.id)
    } catch (error) {
      console.error("Failed to cancel payment:", error)
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary">Pending</Badge>
      case 1:
        return <Badge variant="default">Paid</Badge>
      case 2:
        return <Badge variant="destructive">Overdue</Badge>
      case 3:
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getMethodBadge = (method: number) => {
    switch (method) {
      case 0:
        return <Badge variant="outline">Credit Card</Badge>
      case 1:
        return <Badge variant="outline">Debit Card</Badge>
      case 2:
        return <Badge variant="outline">Bank Transfer</Badge>
      case 3:
        return <Badge variant="outline">PIX</Badge>
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      searchTerm === "" ||
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.planName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status.toString() === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalAmount = statistics?.totalAmount || filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const paidAmount =
    statistics?.completedAmount ||
    filteredPayments.filter((payment) => payment.status === 1).reduce((sum, payment) => sum + payment.amount, 0)
  const pendingAmount =
    statistics?.pendingAmount ||
    filteredPayments.filter((payment) => payment.status === 0).reduce((sum, payment) => sum + payment.amount, 0)

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading payments: {error.message}</p>
          <Button onClick={() => fetchPayments()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage your company payments and invoices</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => fetchPayments()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">All payments combined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
            <p className="text-xs text-muted-foreground">Successfully received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter payments by status and search terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by reference, company, plan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="0">Pending</SelectItem>
                  <SelectItem value="1">Paid</SelectItem>
                  <SelectItem value="2">Overdue</SelectItem>
                  <SelectItem value="3">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>A list of all payments for your company</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No payments found</p>
                        <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Create First Payment
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.reference}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{getMethodBadge(payment.method)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.dueDate
                          ? format(new Date(payment.dueDate), "MMM dd, yyyy", { locale: enUS })
                          : "No due date"}
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate
                          ? format(new Date(payment.paymentDate), "MMM dd, yyyy", { locale: enUS })
                          : "Not paid"}
                      </TableCell>
                      <TableCell>{format(new Date(payment.createdDate), "MMM dd, yyyy", { locale: enUS })}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(payment)}>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {payment.status === 0 && (
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(payment)}>
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {payment.status === 0 && (
                              <DropdownMenuItem onClick={() => handleMarkAsOverdue(payment)}>
                                Mark as Overdue
                              </DropdownMenuItem>
                            )}
                            {payment.status !== 3 && (
                              <DropdownMenuItem className="text-red-600" onClick={() => handleMarkAsCancelled(payment)}>
                                Cancel Payment
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CompanyPaymentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchPayments()}
      />

      {selectedPayment && (
        <CompanyPaymentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedPayment(null)
          }}
          payment={selectedPayment}
        />
      )}
    </div>
  )
}
