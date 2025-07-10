"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Download,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Building,
  Calendar,
  FileText,
  DollarSign,
  CreditCard,
  Mail,
  Printer,
  Copy,
  ExternalLink,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface PaymentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  payment: any
}

export function PaymentDetailsModal({ isOpen, onClose, payment }: PaymentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details")

  // Mock payment history data
  const paymentHistory = [
    {
      date: "2023-05-15T10:30:00",
      action: "Payment created",
      user: "Admin User",
      details: "Invoice generated and sent to company",
    },
    {
      date: "2023-05-15T10:35:00",
      action: "Email sent",
      user: "System",
      details: "Payment notification sent to company",
    },
    {
      date: "2023-05-15T14:22:00",
      action: "Payment received",
      user: "System",
      details: "Payment processed via Credit Card",
    },
    {
      date: "2023-05-15T14:25:00",
      action: "Status updated",
      user: "System",
      details: "Payment status changed from 'pending' to 'paid'",
    },
    {
      date: "2023-05-15T14:30:00",
      action: "Receipt sent",
      user: "System",
      details: "Payment receipt sent to company email",
    },
  ]

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
            <XCircle className="h-3 w-3" /> Failed
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
        return <CreditCard className="h-5 w-5 text-blue-500" />
      case "bank_transfer":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "pix":
        return <DollarSign className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const handleDownloadInvoice = () => {
    // In a real application, this would download the invoice
    console.log(`Downloading invoice ${payment.invoiceNumber}`)
    alert(`Downloading invoice ${payment.invoiceNumber}`)
  }

  const handleSendInvoice = () => {
    // In a real application, this would send the invoice to the company
    console.log(`Sending invoice ${payment.invoiceNumber} to ${payment.companyName}`)
    alert(`Invoice ${payment.invoiceNumber} sent to ${payment.companyName}`)
  }

  const handleMarkAsPaid = () => {
    // In a real application, this would update the payment status in the database
    console.log(`Marking payment ${payment.id} as paid`)
    alert(`Payment ${payment.id} marked as paid`)
    onClose()
  }

  const handlePrintInvoice = () => {
    // In a real application, this would print the invoice
    console.log(`Printing invoice ${payment.invoiceNumber}`)
    alert(`Printing invoice ${payment.invoiceNumber}`)
  }

  const handleCopyInvoiceLink = () => {
    // In a real application, this would copy the invoice link to clipboard
    console.log(`Copying invoice link for ${payment.invoiceNumber}`)
    alert(`Invoice link for ${payment.invoiceNumber} copied to clipboard`)
  }

  const handleViewOnline = () => {
    // In a real application, this would open the invoice in a new tab
    console.log(`Opening invoice ${payment.invoiceNumber} online`)
    alert(`Opening invoice ${payment.invoiceNumber} in a new tab`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Payment Details
          </DialogTitle>
          <DialogDescription>Detailed information about the payment.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{payment.invoiceNumber}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(payment.status)}
                  <span className="text-sm text-muted-foreground">
                    {payment.status === "paid" && `Paid on ${new Date(payment.date).toLocaleDateString()}`}
                    {payment.status === "pending" && `Due on ${new Date(payment.dueDate).toLocaleDateString()}`}
                    {payment.status === "overdue" && `Overdue since ${new Date(payment.dueDate).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">R$ {payment.amount.toFixed(2)}</div>
                <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground mt-1">
                  {getPaymentMethodIcon(payment.paymentMethod)}
                  {getPaymentMethodLabel(payment.paymentMethod)}
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Company</Label>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{payment.companyName}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Plan</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{payment.planName}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Payment Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(payment.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Due Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Payment Status</h4>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-md">
                {getStatusIcon(payment.status)}
                <div>
                  <p className="font-medium">
                    {payment.status === "paid" && "Payment Confirmed"}
                    {payment.status === "pending" && "Awaiting Payment"}
                    {payment.status === "overdue" && "Payment Overdue"}
                    {payment.status === "failed" && "Payment Failed"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.status === "paid" && `Paid on ${new Date(payment.date).toLocaleDateString()}`}
                    {payment.status === "pending" && `Due on ${new Date(payment.dueDate).toLocaleDateString()}`}
                    {payment.status === "overdue" && `Overdue since ${new Date(payment.dueDate).toLocaleDateString()}`}
                    {payment.status === "failed" && "There was a problem processing the payment"}
                  </p>
                </div>
              </div>
            </div>

            {(payment.status === "pending" || payment.status === "overdue") && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Actions</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleSendInvoice}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button className="flex-1" onClick={handleMarkAsPaid}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="invoice" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Invoice {payment.invoiceNumber}</CardTitle>
                <CardDescription>Generated on {new Date(payment.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold">From</h4>
                      <p>Noah Platform</p>
                      <p>123 Business Street</p>
                      <p>São Paulo, SP 01234-567</p>
                    </div>
                    <div className="text-right">
                      <h4 className="font-semibold">To</h4>
                      <p>{payment.companyName}</p>
                      <p>Customer ID: {payment.companyId}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="grid grid-cols-4 font-semibold text-sm py-2">
                      <div>Description</div>
                      <div className="text-right">Quantity</div>
                      <div className="text-right">Unit Price</div>
                      <div className="text-right">Total</div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 py-4">
                      <div>{payment.planName} Plan</div>
                      <div className="text-right">1</div>
                      <div className="text-right">R$ {payment.amount.toFixed(2)}</div>
                      <div className="text-right">R$ {payment.amount.toFixed(2)}</div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-3 text-right font-semibold">Subtotal</div>
                      <div className="text-right">R$ {payment.amount.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-3 text-right font-semibold">Tax (0%)</div>
                      <div className="text-right">R$ 0.00</div>
                    </div>
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-3 text-right font-semibold">Total</div>
                      <div className="text-right font-bold">R$ {payment.amount.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-md text-sm">
                    <p className="font-semibold">Payment Information</p>
                    <p>Method: {getPaymentMethodLabel(payment.paymentMethod)}</p>
                    <p>Status: {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</p>
                    <p>Due Date: {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyInvoiceLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewOnline}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Online
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleSendInvoice}>
                <Mail className="h-4 w-4 mr-2" />
                Send by Email
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-4">
              {paymentHistory.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {event.action.includes("Payment created") && <FileText className="h-5 w-5" />}
                      {event.action.includes("Email") && <Mail className="h-5 w-5" />}
                      {event.action.includes("Payment received") && <DollarSign className="h-5 w-5" />}
                      {event.action.includes("Status") && <CheckCircle className="h-5 w-5" />}
                      {event.action.includes("Receipt") && <Download className="h-5 w-5" />}
                    </div>
                    {index < paymentHistory.length - 1 && (
                      <div className="absolute top-10 bottom-0 left-5 w-0.5 bg-muted" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleString()}</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {event.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{event.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleDownloadInvoice}>
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
