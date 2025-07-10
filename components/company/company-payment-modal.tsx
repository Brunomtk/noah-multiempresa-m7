"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Check, CreditCard, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function CompanyPaymentModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [status, setStatus] = useState("pending")
  const [amount, setAmount] = useState("")
  const [client, setClient] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 10000)}`)
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process payment creation
    setOpen(false)
    // Reset form
    setPaymentMethod("credit_card")
    setStatus("pending")
    setAmount("")
    setClient("")
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 10000)}`)
    setDueDate("")
  }

  const generateInvoiceNumber = () => {
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 10000)}`)
  }

  const setDueDateToday = () => {
    const today = new Date()
    setDueDate(today.toISOString().split("T")[0])
  }

  const setDueDatePlus30 = () => {
    const today = new Date()
    const plus30 = new Date(today)
    plus30.setDate(today.getDate() + 30)
    setDueDate(plus30.toISOString().split("T")[0])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>Create New Payment</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the payment details below to create a new payment record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-[#0f172a]">
              <TabsTrigger value="details" className="data-[state=active]:bg-[#2a3349]">
                Payment Details
              </TabsTrigger>
              <TabsTrigger value="client" className="data-[state=active]:bg-[#2a3349]">
                Client Info
              </TabsTrigger>
              <TabsTrigger value="options" className="data-[state=active]:bg-[#2a3349]">
                Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">
                    Invoice Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="invoice-number"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349]"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateInvoiceNumber}
                      className="bg-[#0f172a] border-[#2a3349]"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Amount <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 bg-[#0f172a] border-[#2a3349]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issue-date">
                    Issue Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="issue-date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="bg-[#0f172a] border-[#2a3349]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="due-date">
                      Due Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={setDueDateToday}
                        className="h-6 text-xs bg-[#0f172a] border-[#2a3349]"
                      >
                        Today
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={setDueDatePlus30}
                        className="h-6 text-xs bg-[#0f172a] border-[#2a3349]"
                      >
                        +30 days
                      </Button>
                    </div>
                  </div>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[#0f172a] border-[#2a3349]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">
                  Payment Method <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" className="border-[#2a3349]" />
                    <Label htmlFor="credit_card" className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" /> Credit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" className="border-[#2a3349]" />
                    <Label htmlFor="bank_transfer" className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" /> Bank Transfer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" className="border-[#2a3349]" />
                    <Label htmlFor="cash" className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" /> Cash
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "pending" && (
                <Alert className="bg-[#0f172a] border-amber-500/50 text-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>This payment will be marked as pending and can be updated later.</AlertDescription>
                </Alert>
              )}

              {status === "completed" && (
                <Alert className="bg-[#0f172a] border-green-500/50 text-green-500">
                  <Check className="h-4 w-4" />
                  <AlertDescription>This payment will be marked as completed.</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="client" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">
                  Client <span className="text-red-500">*</span>
                </Label>
                <Select value={client} onValueChange={setClient} required>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349]">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    <SelectItem value="client1">Acme Inc</SelectItem>
                    <SelectItem value="client2">Globex Corp</SelectItem>
                    <SelectItem value="client3">Stark Industries</SelectItem>
                    <SelectItem value="client4">Wayne Enterprises</SelectItem>
                    <SelectItem value="client5">Umbrella Corp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input id="contact-person" placeholder="John Doe" className="bg-[#0f172a] border-[#2a3349]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-[#0f172a] border-[#2a3349]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="(123) 456-7890" className="bg-[#0f172a] border-[#2a3349]" />
              </div>
            </TabsContent>

            <TabsContent value="options" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter payment description..."
                  className="min-h-[100px] bg-[#0f172a] border-[#2a3349]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter internal notes..."
                  className="min-h-[100px] bg-[#0f172a] border-[#2a3349]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input id="reference" placeholder="REF-12345" className="bg-[#0f172a] border-[#2a3349]" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="send-receipt" className="border-[#2a3349] data-[state=checked]:bg-[#06b6d4]" />
                <Label htmlFor="send-receipt">Send receipt to client</Label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-[#0f172a] border-[#2a3349]"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2]">
              Create Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Missing imports
import { Building2, RefreshCcw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
