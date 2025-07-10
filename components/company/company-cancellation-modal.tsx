"use client"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CompanyCancellationModalProps {
  isOpen: boolean
  onClose: () => void
  cancellation?: any
}

export function CompanyCancellationModal({ isOpen, onClose, cancellation }: CompanyCancellationModalProps) {
  const [date, setDate] = useState<Date | undefined>(cancellation ? new Date(cancellation.date) : undefined)

  const isEditing = !!cancellation

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0f172a] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Cancellation" : "Create New Cancellation"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEditing
              ? "Update the cancellation details below."
              : "Fill in the details to record a service cancellation."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client" className="text-white">
                Client
              </Label>
              <Select defaultValue={cancellation?.client || ""}>
                <SelectTrigger id="client" className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Robert Williams">Robert Williams</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                  <SelectItem value="Jennifer Miller">Jennifer Miller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service" className="text-white">
                Service
              </Label>
              <Select defaultValue={cancellation?.service || ""}>
                <SelectTrigger id="service" className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="Regular Cleaning">Regular Cleaning</SelectItem>
                  <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                  <SelectItem value="Move-out Cleaning">Move-out Cleaning</SelectItem>
                  <SelectItem value="Window Cleaning">Window Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-[#1a2234] border-[#2a3349] text-white",
                      !date && "text-gray-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1a2234] border-[#2a3349]">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="bg-[#1a2234] text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white">
                Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="time"
                  type="time"
                  className="pl-10 bg-[#1a2234] border-[#2a3349] text-white"
                  defaultValue={cancellation?.time ? "09:00" : ""}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">
                Status
              </Label>
              <Select defaultValue={cancellation?.status || "Cancelled"}>
                <SelectTrigger id="status" className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                  <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="Partial Refund">Partial Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="professional" className="text-white">
                Professional
              </Label>
              <Select defaultValue={cancellation?.professional || ""}>
                <SelectTrigger id="professional" className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select professional" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="Maria Garcia">Maria Garcia</SelectItem>
                  <SelectItem value="James Wilson">James Wilson</SelectItem>
                  <SelectItem value="Ana Martinez">Ana Martinez</SelectItem>
                  <SelectItem value="David Thompson">David Thompson</SelectItem>
                  <SelectItem value="Sofia Rodriguez">Sofia Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white">
              Cancellation Reason
            </Label>
            <Select defaultValue={cancellation?.reason || ""}>
              <SelectTrigger id="reason" className="bg-[#1a2234] border-[#2a3349] text-white">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                <SelectItem value="Client Schedule Conflict">Client Schedule Conflict</SelectItem>
                <SelectItem value="Professional Unavailable">Professional Unavailable</SelectItem>
                <SelectItem value="Client Dissatisfaction">Client Dissatisfaction</SelectItem>
                <SelectItem value="Weather Conditions">Weather Conditions</SelectItem>
                <SelectItem value="Client Request">Client Request</SelectItem>
                <SelectItem value="System Error">System Error</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refund" className="text-white">
              Refund Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">$</span>
              <Input
                id="refund"
                type="number"
                className="pl-8 bg-[#1a2234] border-[#2a3349] text-white"
                placeholder="0.00"
                defaultValue={cancellation?.refundAmount ? cancellation.refundAmount.replace("$", "") : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              className="bg-[#1a2234] border-[#2a3349] text-white min-h-[80px]"
              placeholder="Enter any additional details about the cancellation..."
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-[#2a3349] text-white hover:bg-[#1a2234] hover:text-white"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
            {isEditing ? "Update Cancellation" : "Create Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
