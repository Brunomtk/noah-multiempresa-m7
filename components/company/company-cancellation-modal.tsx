"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCompanyCancellations } from "@/hooks/use-company-cancellations"
import { RefundStatus, CancelledByRole, type Cancellation, type CancellationFormData } from "@/types/cancellation"
import { useAuth } from "@/contexts/auth-context"

interface CompanyCancellationModalProps {
  isOpen: boolean
  onClose: () => void
  cancellation?: Cancellation
}

export function CompanyCancellationModal({ isOpen, onClose, cancellation }: CompanyCancellationModalProps) {
  const { addCancellation, updateCancellation, getCancellationReasons, getCustomers, getAppointments } =
    useCompanyCancellations()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const isEditing = !!cancellation

  const [formData, setFormData] = useState({
    appointmentId: cancellation?.appointmentId || 0,
    customerId: cancellation?.customerId || 0,
    reason: cancellation?.reason || "",
    refundStatus: cancellation?.refundStatus || RefundStatus.Pending,
    notes: cancellation?.notes || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.companyId) return

    setLoading(true)
    try {
      if (isEditing && cancellation) {
        await updateCancellation(cancellation.id, {
          reason: formData.reason,
          refundStatus: formData.refundStatus,
          notes: formData.notes,
        })
      } else {
        const newCancellation: CancellationFormData = {
          ...formData,
          companyId: user.companyId,
          cancelledById: user.id || 0,
          cancelledByRole: CancelledByRole.Company,
        }
        await addCancellation(newCancellation)
      }
      onClose()
    } catch (error) {
      console.error("Error saving cancellation:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      appointmentId: 0,
      customerId: 0,
      reason: "",
      refundStatus: RefundStatus.Pending,
      notes: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0f172a] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Cancellation" : "New Cancellation"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEditing
              ? "Update the cancellation details below."
              : "Fill in the details to record a service cancellation."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!isEditing && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointment" className="text-white">
                      Appointment
                    </Label>
                    <Select
                      value={formData.appointmentId.toString()}
                      onValueChange={(value) => setFormData({ ...formData, appointmentId: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="appointment" className="bg-[#1a2234] border-[#2a3349] text-white">
                        <SelectValue placeholder="Select appointment" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                        {getAppointments().map((appointment) => (
                          <SelectItem key={appointment.value} value={appointment.value.toString()}>
                            {appointment.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer" className="text-white">
                      Customer
                    </Label>
                    <Select
                      value={formData.customerId.toString()}
                      onValueChange={(value) => setFormData({ ...formData, customerId: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="customer" className="bg-[#1a2234] border-[#2a3349] text-white">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                        {getCustomers().map((customer) => (
                          <SelectItem key={customer.value} value={customer.value.toString()}>
                            {customer.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-white">
                Cancellation Reason
              </Label>
              <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
                <SelectTrigger id="reason" className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {getCancellationReasons().map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refundStatus" className="text-white">
                Refund Status
              </Label>
              <Select
                value={formData.refundStatus.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, refundStatus: Number.parseInt(value) as RefundStatus })
                }
              >
                <SelectTrigger id="refundStatus" className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value={RefundStatus.Pending.toString()}>Pending</SelectItem>
                  <SelectItem value={RefundStatus.Processed.toString()}>Processed</SelectItem>
                  <SelectItem value={RefundStatus.Rejected.toString()}>Rejected</SelectItem>
                  <SelectItem value={RefundStatus.NotApplicable.toString()}>Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">
                Notes
              </Label>
              <Textarea
                id="notes"
                className="bg-[#1a2234] border-[#2a3349] text-white min-h-[80px]"
                placeholder="Enter additional notes about the cancellation..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-[#2a3349] text-white hover:bg-[#1a2234] hover:text-white bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Cancellation" : "Create Cancellation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
