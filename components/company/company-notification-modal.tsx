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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Mock data for recipients
const mockRecipients = [
  { id: "REC-001", name: "All Professionals", type: "group" },
  { id: "REC-002", name: "Cleaning Team", type: "team" },
  { id: "REC-003", name: "Maintenance Team", type: "team" },
  { id: "REC-004", name: "John Doe", type: "individual" },
  { id: "REC-005", name: "Jane Smith", type: "individual" },
]

interface CompanyNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notificationToEdit?: any
}

export function CompanyNotificationModal({ isOpen, onClose, notificationToEdit }: CompanyNotificationModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [priority, setPriority] = useState("normal")
  const [recipientType, setRecipientType] = useState("all")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [requiresConfirmation, setRequiresConfirmation] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])

  useEffect(() => {
    if (notificationToEdit) {
      setTitle(notificationToEdit.title || "")
      setContent(notificationToEdit.content || "")
      setPriority(notificationToEdit.priority || "normal")
      setRecipientType(notificationToEdit.recipientType || "all")
      setSelectedRecipients(notificationToEdit.recipientType !== "all" ? notificationToEdit.recipientIds : [])
      setIsScheduled(!!notificationToEdit.scheduledFor)
      setScheduledDate(notificationToEdit.scheduledFor ? new Date(notificationToEdit.scheduledFor) : undefined)
      setRequiresConfirmation(notificationToEdit.requiresConfirmation || false)
      // Note: Attachments can't be pre-filled in this mock
    } else {
      // Reset form for new notification
      setTitle("")
      setContent("")
      setPriority("normal")
      setRecipientType("all")
      setSelectedRecipients([])
      setIsScheduled(false)
      setScheduledDate(undefined)
      setRequiresConfirmation(false)
      setAttachments([])
    }
  }, [notificationToEdit, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, this would save the notification to the database
    const notificationData = {
      title,
      content,
      priority,
      recipientType,
      recipientIds: recipientType !== "all" ? selectedRecipients : [],
      status: isScheduled ? "scheduled" : "draft",
      scheduledFor: isScheduled ? scheduledDate?.toISOString() : null,
      requiresConfirmation,
      // In a real app, you would upload attachments to a storage service
      attachmentCount: attachments.length,
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
      priority,
      recipientType,
      recipientIds: recipientType !== "all" ? selectedRecipients : [],
      status: "sent",
      requiresConfirmation,
      // In a real app, you would upload attachments to a storage service
      attachmentCount: attachments.length,
    }

    console.log("Sending notification now:", notificationData)

    // Close the modal
    onClose()

    // Show success message
    alert("Notification sent successfully!")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>{notificationToEdit ? "Edit Notification" : "New Notification"}</DialogTitle>
          <DialogDescription>
            {notificationToEdit
              ? "Update the notification information below."
              : "Fill in the information to create a new notification."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-2">
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
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <div className="col-span-3">
                <RadioGroup value={priority} onValueChange={setPriority} className="flex flex-wrap gap-4" id="priority">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="priority-low" />
                    <Label htmlFor="priority-low" className="font-normal">
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="priority-normal" />
                    <Label htmlFor="priority-normal" className="font-normal">
                      Normal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="priority-high" />
                    <Label htmlFor="priority-high" className="font-normal">
                      High
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="priority-urgent" />
                    <Label htmlFor="priority-urgent" className="font-normal">
                      Urgent
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient-type" className="text-right">
                Recipients
              </Label>
              <div className="col-span-3">
                <Select value={recipientType} onValueChange={setRecipientType} required>
                  <SelectTrigger id="recipient-type">
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    <SelectItem value="team">Specific Team</SelectItem>
                    <SelectItem value="individual">Specific Individuals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {recipientType !== "all" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Select Recipients</Label>
                <div className="col-span-3 space-y-2 border rounded-md p-4 max-h-48 overflow-y-auto">
                  {mockRecipients
                    .filter(
                      (recipient) =>
                        (recipientType === "team" && recipient.type === "team") ||
                        (recipientType === "individual" && recipient.type === "individual") ||
                        recipient.type === "group",
                    )
                    .map((recipient) => (
                      <div key={recipient.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`recipient-${recipient.id}`}
                          checked={selectedRecipients.includes(recipient.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRecipients([...selectedRecipients, recipient.id])
                            } else {
                              setSelectedRecipients(selectedRecipients.filter((id) => id !== recipient.id))
                            }
                          }}
                        />
                        <Label htmlFor={`recipient-${recipient.id}`} className="font-normal">
                          {recipient.name}
                        </Label>
                      </div>
                    ))}
                  {mockRecipients.filter(
                    (recipient) =>
                      (recipientType === "team" && recipient.type === "team") ||
                      (recipientType === "individual" && recipient.type === "individual") ||
                      recipient.type === "group",
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground">No recipients available for this type</p>
                  )}
                  {selectedRecipients.length === 0 &&
                    mockRecipients.filter(
                      (recipient) =>
                        (recipientType === "team" && recipient.type === "team") ||
                        (recipientType === "individual" && recipient.type === "individual") ||
                        recipient.type === "group",
                    ).length > 0 && <p className="text-sm text-muted-foreground">Select at least one recipient</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-scheduled" className="text-right">
                Schedule Send
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="is-scheduled" checked={isScheduled} onCheckedChange={setIsScheduled} />
                <Label htmlFor="is-scheduled" className="font-normal">
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requires-confirmation" className="text-right">
                Require Confirmation
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="requires-confirmation"
                  checked={requiresConfirmation}
                  onCheckedChange={setRequiresConfirmation}
                />
                <Label htmlFor="requires-confirmation" className="font-normal">
                  Recipients must confirm they've read this notification
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attachments" className="text-right">
                Attachments
              </Label>
              <div className="col-span-3">
                <Input id="attachments" type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
                {attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Selected files:</p>
                    <ul className="text-sm text-muted-foreground">
                      {Array.from(attachments).map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              {!isScheduled && (
                <Button type="button" variant="outline" onClick={() => alert("Draft saved!")}>
                  Save Draft
                </Button>
              )}
              {!isScheduled && (
                <Button type="button" onClick={handleSendNow} className="bg-[#06b6d4] hover:bg-[#0891b2]">
                  Send Now
                </Button>
              )}
              {isScheduled && (
                <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2]">
                  Schedule
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
