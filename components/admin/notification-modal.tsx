"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for companies and plans
const mockCompanies = [
  { id: "COMP-001", name: "CleanTech Solutions" },
  { id: "COMP-002", name: "Sparkle Cleaning Co." },
  { id: "COMP-003", name: "Fresh & Clean Services" },
  { id: "COMP-004", name: "Pristine Cleaning" },
  { id: "COMP-005", name: "EcoClean Solutions" },
]

const mockPlans = [
  { id: "PLAN-001", name: "Basic" },
  { id: "PLAN-002", name: "Standard" },
  { id: "PLAN-003", name: "Premium" },
  { id: "PLAN-004", name: "Enterprise" },
]

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notificationToEdit?: any
}

export function NotificationModal({ isOpen, onClose, notificationToEdit }: NotificationModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState("system")
  const [targetType, setTargetType] = useState("all")
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState("draft")

  useEffect(() => {
    if (notificationToEdit) {
      setTitle(notificationToEdit.title || "")
      setContent(notificationToEdit.content || "")
      setType(notificationToEdit.type || "system")
      setTargetType(notificationToEdit.targetType || "all")
      setSelectedCompanies(notificationToEdit.targetType === "company" ? notificationToEdit.targetIds : [])
      setSelectedPlans(notificationToEdit.targetType === "plan" ? notificationToEdit.targetIds : [])
      setIsScheduled(notificationToEdit.status === "scheduled")
      setScheduledDate(notificationToEdit.scheduledFor ? new Date(notificationToEdit.scheduledFor) : undefined)
      setStatus(notificationToEdit.status || "draft")
    } else {
      // Reset form for new notification
      setTitle("")
      setContent("")
      setType("system")
      setTargetType("all")
      setSelectedCompanies([])
      setSelectedPlans([])
      setIsScheduled(false)
      setScheduledDate(undefined)
      setStatus("draft")
    }
  }, [notificationToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, this would save the notification to the database
    const notificationData = {
      title,
      content,
      type,
      targetType,
      targetIds: targetType === "company" ? selectedCompanies : targetType === "plan" ? selectedPlans : [],
      status: isScheduled ? "scheduled" : status,
      scheduledFor: isScheduled ? scheduledDate?.toISOString() : null,
    }

    console.log("Notification data:", notificationData)

    // Close the modal
    onClose()

    // Show success message
    alert(notificationToEdit ? "Notification updated successfully!" : "Notification created successfully!")
  }

  const handleSendNow = () => {
    // In a real application, this would send the notification immediately
    const notificationData = {
      title,
      content,
      type,
      targetType,
      targetIds: targetType === "company" ? selectedCompanies : targetType === "plan" ? selectedPlans : [],
      status: "sent",
    }

    console.log("Sending notification now:", notificationData)

    // Close the modal
    onClose()

    // Show success message
    alert("Notification sent successfully!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{notificationToEdit ? "Edit Notification" : "New Notification"}</DialogTitle>
          <DialogDescription>
            {notificationToEdit
              ? "Update the notification information below."
              : "Fill in the information to create a new notification."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
                rows={5}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="feature">New Features</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target-type" className="text-right">
                Recipients
              </Label>
              <div className="col-span-3">
                <Select value={targetType} onValueChange={setTargetType} required>
                  <SelectTrigger id="target-type">
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    <SelectItem value="company">Specific Companies</SelectItem>
                    <SelectItem value="plan">By Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {targetType === "company" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Companies</Label>
                <div className="col-span-3 space-y-2 border rounded-md p-4">
                  {mockCompanies.map((company) => (
                    <div key={company.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`company-${company.id}`}
                        checked={selectedCompanies.includes(company.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCompanies([...selectedCompanies, company.id])
                          } else {
                            setSelectedCompanies(selectedCompanies.filter((id) => id !== company.id))
                          }
                        }}
                      />
                      <Label htmlFor={`company-${company.id}`}>{company.name}</Label>
                    </div>
                  ))}
                  {selectedCompanies.length === 0 && (
                    <p className="text-sm text-muted-foreground">Select at least one company</p>
                  )}
                </div>
              </div>
            )}

            {targetType === "plan" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Plans</Label>
                <div className="col-span-3 space-y-2 border rounded-md p-4">
                  {mockPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`plan-${plan.id}`}
                        checked={selectedPlans.includes(plan.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPlans([...selectedPlans, plan.id])
                          } else {
                            setSelectedPlans(selectedPlans.filter((id) => id !== plan.id))
                          }
                        }}
                      />
                      <Label htmlFor={`plan-${plan.id}`}>{plan.name}</Label>
                    </div>
                  ))}
                  {selectedPlans.length === 0 && (
                    <p className="text-sm text-muted-foreground">Select at least one plan</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-scheduled" className="text-right">
                Schedule Send
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="is-scheduled" checked={isScheduled} onCheckedChange={setIsScheduled} />
                <Label htmlFor="is-scheduled">
                  {isScheduled ? "Scheduled send" : "Send immediately or save as draft"}
                </Label>
              </div>
            </div>

            {isScheduled && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scheduled-date" className="text-right">
                  Date and Time
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="scheduled-date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP 'at' HH:mm") : <span>Select date and time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                      <div className="p-3 border-t border-border">
                        <Label htmlFor="scheduled-time">Time</Label>
                        <Input
                          id="scheduled-time"
                          type="time"
                          className="mt-1"
                          value={scheduledDate ? format(scheduledDate, "HH:mm") : ""}
                          onChange={(e) => {
                            if (scheduledDate) {
                              const [hours, minutes] = e.target.value.split(":").map(Number)
                              const newDate = new Date(scheduledDate)
                              newDate.setHours(hours, minutes)
                              setScheduledDate(newDate)
                            } else {
                              const now = new Date()
                              const [hours, minutes] = e.target.value.split(":").map(Number)
                              now.setHours(hours, minutes)
                              setScheduledDate(now)
                            }
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {!isScheduled && (
                <Button type="button" variant="outline" onClick={() => setStatus("draft")}>
                  Save Draft
                </Button>
              )}
              {!isScheduled && (
                <Button type="button" onClick={handleSendNow}>
                  Send Now
                </Button>
              )}
              {isScheduled && <Button type="submit">Schedule</Button>}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
