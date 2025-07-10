"use client"

import type React from "react"
import { CheckCircle } from "lucide-react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, DollarSign, FileText, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for companies and plans
const mockCompanies = [
  { id: "COMP-001", name: "CleanTech Solutions" },
  { id: "COMP-002", name: "Sparkle Cleaning Co." },
  { id: "COMP-003", name: "Fresh & Clean Services" },
  { id: "COMP-004", name: "Pristine Cleaning" },
  { id: "COMP-005", name: "EcoClean Solutions" },
]

const mockPlans = [
  { id: "PLAN-001", name: "Basic", price: 149.99 },
  { id: "PLAN-002", name: "Standard", price: 199.99 },
  { id: "PLAN-003", name: "Premium", price: 299.99 },
  { id: "PLAN-004", name: "Enterprise", price: 399.99 },
]

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentToEdit?: any
}

export function PaymentModal({ isOpen, onClose, paymentToEdit }: PaymentModalProps) {
  const [companyId, setCompanyId] = useState(paymentToEdit?.companyId || "")
  const [planId, setPlanId] = useState(paymentToEdit?.planId || "")
  const [amount, setAmount] = useState(paymentToEdit?.amount?.toString() || "")
  const [paymentMethod, setPaymentMethod] = useState(paymentToEdit?.paymentMethod || "credit_card")
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(
    paymentToEdit?.date ? new Date(paymentToEdit.date) : new Date(),
  )
  const [dueDate, setDueDate] = useState<Date | undefined>(
    paymentToEdit?.dueDate ? new Date(paymentToEdit.dueDate) : undefined,
  )
  const [status, setStatus] = useState(paymentToEdit?.status || "pending")
  const [invoiceNumber, setInvoiceNumber] = useState(paymentToEdit?.invoiceNumber || "")
  const [notes, setNotes] = useState(paymentToEdit?.notes || "")
  const [sendReceipt, setSendReceipt] = useState(paymentToEdit?.sendReceipt || true)
  const [activeTab, setActiveTab] = useState("payment-info")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when paymentToEdit changes
  useEffect(() => {
    if (paymentToEdit) {
      setCompanyId(paymentToEdit.companyId || "")
      setPlanId(paymentToEdit.planId || "")
      setAmount(paymentToEdit.amount?.toString() || "")
      setPaymentMethod(paymentToEdit.paymentMethod || "credit_card")
      setPaymentDate(paymentToEdit.date ? new Date(paymentToEdit.date) : new Date())
      setDueDate(paymentToEdit.dueDate ? new Date(paymentToEdit.dueDate) : undefined)
      setStatus(paymentToEdit.status || "pending")
      setInvoiceNumber(paymentToEdit.invoiceNumber || "")
      setNotes(paymentToEdit.notes || "")
      setSendReceipt(paymentToEdit.sendReceipt || true)
    } else {
      // Reset form for new payment
      setCompanyId("")
      setPlanId("")
      setAmount("")
      setPaymentMethod("credit_card")
      setPaymentDate(new Date())
      setDueDate(undefined)
      setStatus("pending")
      setInvoiceNumber("")
      setNotes("")
      setSendReceipt(true)
    }
    setErrors({})
  }, [paymentToEdit, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!companyId) newErrors.companyId = "Company is required"
    if (!planId) newErrors.planId = "Plan is required"
    if (!amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required"
    if (!paymentDate) newErrors.paymentDate = "Payment date is required"
    if (!invoiceNumber) newErrors.invoiceNumber = "Invoice number is required"
    if (!status) newErrors.status = "Status is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // In a real application, this would save the payment to the database
    const paymentData = {
      id:
        paymentToEdit?.id ||
        `PAY-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
      companyId,
      companyName: mockCompanies.find((company) => company.id === companyId)?.name,
      planId,
      planName: mockPlans.find((plan) => plan.id === planId)?.name,
      amount: Number.parseFloat(amount),
      paymentMethod,
      date: paymentDate?.toISOString().split("T")[0],
      dueDate: dueDate?.toISOString().split("T")[0],
      status,
      invoiceNumber,
      notes,
      sendReceipt,
    }

    console.log("Payment data:", paymentData)

    // Close the modal
    onClose()

    // Show success message
    alert(paymentToEdit ? "Payment updated successfully!" : "Payment registered successfully!")
  }

  // Auto-generate invoice number if not provided
  const generateInvoiceNumber = () => {
    if (!invoiceNumber) {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      setInvoiceNumber(`INV-${year}${month}-${random}`)
    }
  }

  // Auto-fill amount when plan is selected
  const handlePlanChange = (value: string) => {
    setPlanId(value)
    const selectedPlan = mockPlans.find((plan) => plan.id === value)
    if (selectedPlan) {
      setAmount(selectedPlan.price.toString())
    }
  }

  // Calculate due date based on payment date (30 days later)
  const calculateDueDate = () => {
    if (paymentDate) {
      const calculatedDueDate = new Date(paymentDate)
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 30)
      setDueDate(calculatedDueDate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {paymentToEdit ? "Edit Payment" : "Register New Payment"}
          </DialogTitle>
          <DialogDescription>Fill in the payment details below.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="payment-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="payment-info">Payment Information</TabsTrigger>
            <TabsTrigger value="additional-info">Additional Details</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="payment-info" className="space-y-4 mt-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Select value={companyId} onValueChange={setCompanyId} required>
                    <SelectTrigger id="company" className={errors.companyId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companyId && <p className="text-red-500 text-sm mt-1">{errors.companyId}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan" className="text-right">
                  Plan <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Select value={planId} onValueChange={handlePlanChange} required>
                    <SelectTrigger id="plan" className={errors.planId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - R$ {plan.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.planId && <p className="text-red-500 text-sm mt-1">{errors.planId}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount (R$) <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={errors.amount ? "border-red-500" : ""}
                    required
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoice" className="text-right">
                  Invoice No. <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3 flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="invoice"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className={errors.invoiceNumber ? "border-red-500" : ""}
                      required
                    />
                    {errors.invoiceNumber && <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber}</p>}
                  </div>
                  <Button type="button" variant="outline" onClick={generateInvoiceNumber} className="whitespace-nowrap">
                    Generate
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment-method" className="text-right">
                  Method <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                    <SelectTrigger id="payment-method" className={errors.paymentMethod ? "border-red-500" : ""}>
                      <SelectValue placeholder="Payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment-date" className="text-right">
                  Date <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="payment-date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !paymentDate && "text-muted-foreground",
                              errors.paymentDate && "border-red-500",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {paymentDate ? format(paymentDate, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                      {errors.paymentDate && <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due-date" className="text-right">
                  Due Date
                </Label>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="due-date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dueDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button type="button" variant="outline" onClick={calculateDueDate} className="whitespace-nowrap">
                      +30 days
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger id="status" className={errors.status ? "border-red-500" : ""}>
                      <SelectValue placeholder="Payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional-info" className="space-y-4 mt-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes about this payment..."
                  className="col-span-3 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="send-receipt" className="text-right">
                  Send Receipt
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="send-receipt" checked={sendReceipt} onCheckedChange={setSendReceipt} />
                  <Label htmlFor="send-receipt" className="font-normal">
                    Send receipt to company email
                  </Label>
                </div>
              </div>

              {status === "paid" && (
                <Alert className="col-span-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    This payment has been marked as paid. A receipt will {sendReceipt ? "be sent" : "not be sent"} to
                    the company.
                  </AlertDescription>
                </Alert>
              )}

              {status === "overdue" && (
                <Alert className="col-span-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    This payment is overdue. Consider sending a reminder to the company.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="gap-1">
                <FileText className="h-4 w-4" />
                {paymentToEdit ? "Update Payment" : "Register Payment"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
