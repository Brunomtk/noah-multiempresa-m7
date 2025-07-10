"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  FileText,
  Send,
  Trash2,
  Users,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CompanyNotificationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  notification: any
}

export function CompanyNotificationDetailsModal({
  isOpen,
  onClose,
  notification,
}: CompanyNotificationDetailsModalProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Low</Badge>
      case "normal":
        return <Badge className="bg-[#06b6d4]">Normal</Badge>
      case "high":
        return <Badge className="bg-yellow-500">High</Badge>
      case "urgent":
        return <Badge className="bg-red-500">Urgent</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500">Sent</Badge>
      case "scheduled":
        return <Badge className="bg-[#06b6d4]">Scheduled</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "high":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "normal":
        return <Bell className="h-5 w-5 text-[#06b6d4]" />
      case "low":
        return <Bell className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const handleSendNow = () => {
    // In a real application, this would send the notification immediately
    console.log(`Sending notification ${notification.id} now`)
    alert(`Notification ${notification.id} sent`)
    onClose()
  }

  const handleEdit = () => {
    // In a real application, this would open the edit modal
    console.log(`Editing notification ${notification.id}`)
    alert(`Editing notification ${notification.id}`)
    onClose()
  }

  const handleDelete = () => {
    // In a real application, this would delete the notification
    if (confirm(`Are you sure you want to delete notification "${notification.title}"?`)) {
      console.log(`Deleting notification ${notification.id}`)
      alert(`Notification ${notification.id} deleted`)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getPriorityIcon(notification.priority)}Notification Details
          </DialogTitle>
          <DialogDescription>Detailed information about the notification.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{notification.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  {getPriorityBadge(notification.priority)} {getStatusBadge(notification.status)}
                </p>
              </div>
              {notification.status === "sent" && (
                <div className="text-right">
                  <p className="text-sm font-medium">Read Rate</p>
                  <p className="text-lg font-bold flex items-center justify-end gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {Math.round((notification.readCount / notification.totalRecipients) * 100)}%
                  </p>
                </div>
              )}
            </div>

            <div className="bg-muted p-4 rounded-md">
              <p className="whitespace-pre-line">{notification.content}</p>
            </div>

            {notification.attachments && notification.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Attachments</p>
                <div className="space-y-2">
                  {notification.attachments.map((attachment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-1">
                  <Users className="h-4 w-4" /> Recipients
                </p>
                <p>{notification.recipientType === "all" ? "All Staff" : "Selected Recipients"}</p>
                <p className="text-sm text-muted-foreground">{notification.totalRecipients} recipients</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Created Date
                </p>
                <p>
                  {new Date(notification.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {notification.status === "sent" && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Send className="h-4 w-4" /> Sent Date
                  </p>
                  <p>
                    {new Date(notification.sentAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {notification.status === "scheduled" && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Scheduled for
                  </p>
                  <p>
                    {new Date(notification.scheduledFor).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {notification.requiresConfirmation && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Confirmation
                  </p>
                  <p>Required</p>
                </div>
              )}
            </div>

            {notification.status === "sent" && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Statistics</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">Sent</p>
                      <p className="text-lg font-bold">{notification.totalRecipients}</p>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">Read</p>
                      <p className="text-lg font-bold">{notification.readCount}</p>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="text-lg font-bold">{notification.confirmedCount || 0}</p>
                    </div>
                  </div>
                </div>

                {notification.readCount > 0 && notification.recentReads && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recent Reads</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {notification.recentReads.map((read: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={read.avatar || "/placeholder.svg?height=24&width=24&query=user"}
                                alt={read.name}
                              />
                              <AvatarFallback>{read.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{read.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(read.readAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            {(notification.status === "draft" || notification.status === "scheduled") && (
              <>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            {notification.status === "scheduled" && (
              <Button onClick={handleSendNow} className="bg-[#06b6d4] hover:bg-[#0891b2]">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
