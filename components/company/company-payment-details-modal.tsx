"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDownToLine, Check, Clock, Download, FileText, Mail, Printer, RefreshCw, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NoahLogo } from "@/components/noah-logo"

interface PaymentData {
  id: string
  invoice: string
  amount: string
  date: string
  status: string
  method: string
  client: string
}

export function CompanyPaymentDetailsModal({
  children,
  paymentId,
  paymentData,
}: {
  children: React.ReactNode
  paymentId: string
  paymentData: PaymentData
}) {
  const [open, setOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "border-green-500 text-green-500"
      case "pending":
        return "border-amber-500 text-amber-500"
      case "overdue":
        return "border-red-500 text-red-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Check className="h-4 w-4 mr-1" />
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />
      case "overdue":
        return <X className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Payment Details</DialogTitle>
            <Badge variant="outline" className={getStatusColor(paymentData.status)}>
              <div className="flex items-center">
                {getStatusIcon(paymentData.status)}
                {paymentData.status}
              </div>
            </Badge>
          </div>
          <DialogDescription className="text-gray-400">
            View and manage payment information for invoice {paymentData.invoice}.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-[#0f172a]">
            <TabsTrigger value="details" className="data-[state=active]:bg-[#2a3349]">
              Details
            </TabsTrigger>
            <TabsTrigger value="invoice" className="data-[state=active]:bg-[#2a3349]">
              Invoice
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#2a3349]">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID:</span>
                    <span>{paymentData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Invoice:</span>
                    <span>{paymentData.invoice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="font-semibold">${paymentData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span>{paymentData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method:</span>
                    <span>{paymentData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference:</span>
                    <span>REF-{Math.floor(Math.random() * 10000)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Client:</span>
                    <span>{paymentData.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contact:</span>
                    <span>John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-[#06b6d4]">
                      contact@{paymentData.client.toLowerCase().replace(/\s+/g, "")}.com
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span>(123) 456-7890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address:</span>
                    <span className="text-right">
                      123 Business St.
                      <br />
                      New York, NY 10001
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Payment Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  {paymentData.status === "Completed"
                    ? "Payment was processed successfully. Receipt has been sent to the client."
                    : paymentData.status === "Pending"
                      ? "Payment is pending processing. Will be updated once the transaction is complete."
                      : "Payment is overdue. Please follow up with the client."}
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="bg-[#0f172a] border-[#2a3349]">
                <Mail className="h-4 w-4 mr-2" />
                Send Receipt
              </Button>
              <Button variant="outline" size="sm" className="bg-[#0f172a] border-[#2a3349]">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button size="sm" className="bg-[#06b6d4] hover:bg-[#0891b2]">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="invoice" className="space-y-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-2">
                    <NoahLogo className="h-8 w-8" />
                    <div>
                      <h3 className="font-bold text-lg">Noah Platform</h3>
                      <p className="text-sm text-gray-400">Professional Services</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-bold">INVOICE</h2>
                    <p className="text-[#06b6d4]">{paymentData.invoice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-400">Bill To:</h4>
                    <p className="font-medium">{paymentData.client}</p>
                    <p className="text-sm text-gray-400">123 Business St.</p>
                    <p className="text-sm text-gray-400">New York, NY 10001</p>
                    <p className="text-sm text-gray-400">
                      contact@{paymentData.client.toLowerCase().replace(/\s+/g, "")}.com
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Invoice Date:</span>
                      <span>{paymentData.date}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Due Date:</span>
                      <span>{paymentData.date}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Status:</span>
                      <span
                        className={
                          paymentData.status === "Completed"
                            ? "text-green-500"
                            : paymentData.status === "Pending"
                              ? "text-amber-500"
                              : "text-red-500"
                        }
                      >
                        {paymentData.status}
                      </span>
                    </div>
                  </div>
                </div>

                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b border-[#2a3349] text-left">
                      <th className="py-2 text-gray-400">Description</th>
                      <th className="py-2 text-gray-400 text-right">Quantity</th>
                      <th className="py-2 text-gray-400 text-right">Rate</th>
                      <th className="py-2 text-gray-400 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#2a3349]">
                      <td className="py-3">Professional Services</td>
                      <td className="py-3 text-right">1</td>
                      <td className="py-3 text-right">${paymentData.amount}</td>
                      <td className="py-3 text-right">${paymentData.amount}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}></td>
                      <td className="py-3 text-right text-gray-400">Subtotal:</td>
                      <td className="py-3 text-right">${paymentData.amount}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}></td>
                      <td className="py-1 text-right text-gray-400">Tax (0%):</td>
                      <td className="py-1 text-right">$0.00</td>
                    </tr>
                    <tr>
                      <td colSpan={2}></td>
                      <td className="py-3 text-right font-semibold">Total:</td>
                      <td className="py-3 text-right font-bold">${paymentData.amount}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="border-t border-[#2a3349] pt-4">
                  <h4 className="text-sm font-semibold mb-2">Payment Method</h4>
                  <p className="text-sm text-gray-400">{paymentData.method}</p>

                  <h4 className="text-sm font-semibold mt-4 mb-2">Notes</h4>
                  <p className="text-sm text-gray-400">Thank you for your business!</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-[#2a3349] py-4">
                <Button variant="outline" size="sm" className="bg-[#0f172a] border-[#2a3349]">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="bg-[#0f172a] border-[#2a3349]">
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" className="bg-[#0f172a] border-[#2a3349]">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Invoice
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Payment Timeline</CardTitle>
                <CardDescription className="text-gray-400">
                  History of all activities related to this payment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="w-px h-full bg-[#2a3349] my-1"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Invoice Created</h4>
                        <Badge variant="outline" className="border-gray-500 text-gray-400">
                          System
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Invoice {paymentData.invoice} was created.</p>
                      <p className="text-xs text-gray-500 mt-1">{paymentData.date} • 10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="w-px h-full bg-[#2a3349] my-1"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Invoice Sent</h4>
                        <Badge variant="outline" className="border-gray-500 text-gray-400">
                          Admin
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Invoice was sent to client via email.</p>
                      <p className="text-xs text-gray-500 mt-1">{paymentData.date} • 10:35 AM</p>
                    </div>
                  </div>

                  {paymentData.status === "Completed" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="w-px h-full bg-[#2a3349] my-1"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Payment Received</h4>
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            System
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Payment of ${paymentData.amount} was received via {paymentData.method}.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{paymentData.date} • 2:15 PM</p>
                      </div>
                    </div>
                  )}

                  {paymentData.status === "Pending" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                          <Clock className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Payment Pending</h4>
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            System
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Awaiting payment confirmation.</p>
                        <p className="text-xs text-gray-500 mt-1">{paymentData.date} • 2:15 PM</p>
                      </div>
                    </div>
                  )}

                  {paymentData.status === "Overdue" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                          <X className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Payment Overdue</h4>
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            System
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Payment is past due date. Reminder sent to client.</p>
                        <p className="text-xs text-gray-500 mt-1">{paymentData.date} • 2:15 PM</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
