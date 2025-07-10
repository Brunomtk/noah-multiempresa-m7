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
import { Bell, BellRing, Calendar, CheckCheck, Clock, Edit, Eye, Send, Users } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface NotificationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  notification: any
}

export function NotificationDetailsModal({ isOpen, onClose, notification }: NotificationDetailsModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500">Sent</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "system":
        return "System"
      case "maintenance":
        return "Maintenance"
      case "marketing":
        return "Marketing"
      case "feature":
        return "New Features"
      case "feedback":
        return "Feedback"
      case "legal":
        return "Legal"
      default:
        return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "system":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "maintenance":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "marketing":
        return <Users className="h-5 w-5 text-purple-500" />
      case "feature":
        return <BellRing className="h-5 w-5 text-green-500" />
      case "feedback":
        return <CheckCheck className="h-5 w-5 text-orange-500" />
      case "legal":
        return <Bell className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case "all":
        return "All Companies"
      case "company":
        return "Specific Companies"
      case "plan":
        return "By Plan"
      default:
        return targetType
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(notification.type)}Notification Details
          </DialogTitle>
          <DialogDescription>Detailed information about the notification.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{notification.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {getTypeLabel(notification.type)} {getStatusBadge(notification.status)}
              </p>
            </div>
            {notification.status === "sent" && (
              <div className="text-right">
                <p className="text-sm font-medium">Read Rate</p>
                <p className="text-lg font-bold flex items-center justify-end gap-1">
                  <Eye className="h-4 w-4" />
                  {Math.round((notification.readCount / notification.totalRecipients) * 100)}%
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted p-4 rounded-md">
            <p className="whitespace-pre-line">{notification.content}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-1">
                <Users className="h-4 w-4" /> Recipients
              </p>
              <p>{getTargetTypeLabel(notification.targetType)}</p>
              <p className="text-sm text-muted-foreground">{notification.totalRecipients} companies</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Created Date
              </p>
              <p>
                {new Date(notification.createdAt).toLocaleDateString("pt-BR", {
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
                  {new Date(notification.sentAt).toLocaleDateString("pt-BR", {
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
                  {new Date(notification.scheduledFor).toLocaleDateString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>

          {notification.status === "sent" && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Statistics</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Sent</p>
                  <p className="text-lg font-bold">{notification.totalRecipients}</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Read</p>
                  <p className="text-lg font-bold">{notification.readCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            {(notification.status === "draft" || notification.status === "scheduled") && (
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {notification.status === "scheduled" && (
              <Button onClick={handleSendNow}>
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
