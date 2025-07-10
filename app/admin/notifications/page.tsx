"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/admin/date-range-picker"
import { NotificationModal } from "@/components/admin/notification-modal"
import { NotificationDetailsModal } from "@/components/admin/notification-details-modal"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, BellRing, CheckCheck, Clock, Eye, Search, Send, Users } from "lucide-react"

// Mock data for notifications
const mockNotifications = [
  {
    id: "NOT-001",
    title: "System Update",
    content: "A new system update is available. Check out the new features!",
    type: "system",
    status: "sent",
    readCount: 45,
    totalRecipients: 63,
    createdAt: "2023-05-15T10:30:00",
    sentAt: "2023-05-15T14:00:00",
    targetType: "all",
    targetIds: [],
  },
  {
    id: "NOT-002",
    title: "Scheduled Maintenance",
    content: "We inform you that there will be scheduled maintenance on the system on 05/20/2023 from 10 PM to 2 AM.",
    type: "maintenance",
    status: "sent",
    readCount: 38,
    totalRecipients: 63,
    createdAt: "2023-05-12T09:15:00",
    sentAt: "2023-05-12T10:00:00",
    targetType: "all",
    targetIds: [],
  },
  {
    id: "NOT-003",
    title: "Plan Promotion",
    content: "Take advantage of our special promotion! Upgrade to Premium plan with 20% discount until 05/30/2023.",
    type: "marketing",
    status: "scheduled",
    readCount: 0,
    totalRecipients: 28,
    createdAt: "2023-05-16T11:45:00",
    sentAt: null,
    scheduledFor: "2023-05-20T09:00:00",
    targetType: "plan",
    targetIds: ["PLAN-001", "PLAN-002"],
  },
  {
    id: "NOT-004",
    title: "New Features Available",
    content: "We've launched new features for the Enterprise plan. Check it out now!",
    type: "feature",
    status: "draft",
    readCount: 0,
    totalRecipients: 8,
    createdAt: "2023-05-17T14:20:00",
    sentAt: null,
    targetType: "plan",
    targetIds: ["PLAN-004"],
  },
  {
    id: "NOT-005",
    title: "Feedback Requested",
    content: "We would like to hear your opinion about our services. Please respond to our satisfaction survey.",
    type: "feedback",
    status: "sent",
    readCount: 12,
    totalRecipients: 63,
    createdAt: "2023-05-10T08:30:00",
    sentAt: "2023-05-10T09:00:00",
    targetType: "all",
    targetIds: [],
  },
  {
    id: "NOT-006",
    title: "Terms of Service Update",
    content: "We have updated our terms of service. Please read and accept the new terms.",
    type: "legal",
    status: "scheduled",
    readCount: 0,
    totalRecipients: 63,
    createdAt: "2023-05-18T16:45:00",
    sentAt: null,
    scheduledFor: "2023-05-25T10:00:00",
    targetType: "all",
    targetIds: [],
  },
]

// Stats data
const statsData = {
  totalNotifications: mockNotifications.length,
  sentNotifications: mockNotifications.filter((n) => n.status === "sent").length,
  scheduledNotifications: mockNotifications.filter((n) => n.status === "scheduled").length,
  draftNotifications: mockNotifications.filter((n) => n.status === "draft").length,
  averageReadRate: Math.round(
    (mockNotifications.filter((n) => n.status === "sent").reduce((acc, n) => acc + n.readCount / n.totalRecipients, 0) /
      mockNotifications.filter((n) => n.status === "sent").length) *
      100,
  ),
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Filter notifications based on search query, type, and tab
  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || notification.type === selectedType

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "sent" && notification.status === "sent") ||
      (activeTab === "scheduled" && notification.status === "scheduled") ||
      (activeTab === "draft" && notification.status === "draft")

    return matchesSearch && matchesType && matchesTab
  })

  const handleOpenDetailsModal = (notification: any) => {
    setSelectedNotification(notification)
    setIsDetailsModalOpen(true)
  }

  const handleSendNow = (notificationId: string) => {
    // In a real application, this would send the notification immediately
    console.log(`Sending notification ${notificationId} now`)
    // For now, we'll just show an alert
    alert(`Notification ${notificationId} sent`)
  }

  const handleDuplicate = (notification: any) => {
    // In a real application, this would duplicate the notification
    console.log(`Duplicating notification ${notification.id}`)
    // For now, we'll just show an alert
    alert(`Notification ${notification.id} duplicated`)
  }

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
        return <Bell className="h-4 w-4 text-blue-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "marketing":
        return <Users className="h-4 w-4 text-purple-500" />
      case "feature":
        return <BellRing className="h-4 w-4 text-green-500" />
      case "feedback":
        return <CheckCheck className="h-4 w-4 text-orange-500" />
      case "legal":
        return <Bell className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notification Management</h1>
        <Button
          onClick={() => {
            setSelectedNotification(null)
            setIsNotificationModalOpen(true)
          }}
        >
          <Send className="h-4 w-4 mr-2" />
          New Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.sentNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.scheduledNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.draftNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Read Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.averageReadRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notifications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="feature">New Features</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DatePickerWithRange dateRange={{}} onDateRangeChange={() => {}} />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Read Rate</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No notifications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(notification.type)}
                            <span>{getTypeLabel(notification.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {notification.totalRecipients}
                          </div>
                        </TableCell>
                        <TableCell>
                          {notification.status === "sent" ? (
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              {Math.round((notification.readCount / notification.totalRecipients) * 100)}%
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(notification.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenDetailsModal(notification)}>
                              View
                            </Button>
                            {(notification.status === "draft" || notification.status === "scheduled") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedNotification(notification)
                                  setIsNotificationModalOpen(true)
                                }}
                              >
                                Edit
                              </Button>
                            )}
                            {notification.status === "scheduled" && (
                              <Button variant="outline" size="sm" onClick={() => handleSendNow(notification.id)}>
                                Send
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => handleDuplicate(notification)}>
                              Duplicate
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notificationToEdit={selectedNotification}
      />

      {selectedNotification && (
        <NotificationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          notification={selectedNotification}
        />
      )}
    </div>
  )
}
