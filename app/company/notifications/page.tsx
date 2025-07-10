"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/admin/date-range-picker"
import { CompanyNotificationModal } from "@/components/company/company-notification-modal"
import { CompanyNotificationDetailsModal } from "@/components/company/company-notification-details-modal"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Bell, CheckCircle2, Eye, FileText, PenSquare, Search, Send, Trash2, Users } from "lucide-react"

// Mock data for notifications
const mockNotifications = [
  {
    id: "NOT-001",
    title: "Team Meeting",
    content: "There will be a team meeting tomorrow at 10:00 AM to discuss the new cleaning protocols.",
    priority: "normal",
    status: "sent",
    readCount: 12,
    totalRecipients: 15,
    createdAt: "2023-05-15T10:30:00",
    sentAt: "2023-05-15T14:00:00",
    recipientType: "all",
    recipientIds: [],
    requiresConfirmation: true,
    confirmedCount: 10,
    recentReads: [
      { name: "John Doe", avatar: "", readAt: "2023-05-15T14:30:00" },
      { name: "Jane Smith", avatar: "", readAt: "2023-05-15T15:15:00" },
      { name: "Bob Johnson", avatar: "", readAt: "2023-05-15T16:20:00" },
    ],
  },
  {
    id: "NOT-002",
    title: "New Cleaning Supplies",
    content: "New cleaning supplies have arrived. Please pick them up from the storage room.",
    priority: "low",
    status: "sent",
    readCount: 8,
    totalRecipients: 15,
    createdAt: "2023-05-12T09:15:00",
    sentAt: "2023-05-12T10:00:00",
    recipientType: "team",
    recipientIds: ["REC-002"],
    requiresConfirmation: false,
  },
  {
    id: "NOT-003",
    title: "Urgent: Client Rescheduling",
    content: "Client #1234 has requested to reschedule their appointment for tomorrow. Please contact them ASAP.",
    priority: "urgent",
    status: "scheduled",
    readCount: 0,
    totalRecipients: 3,
    createdAt: "2023-05-16T11:45:00",
    sentAt: null,
    scheduledFor: "2023-05-20T09:00:00",
    recipientType: "individual",
    recipientIds: ["REC-004", "REC-005"],
    requiresConfirmation: true,
  },
  {
    id: "NOT-004",
    title: "Safety Reminder",
    content: "Remember to always wear protective equipment when using cleaning chemicals.",
    priority: "high",
    status: "draft",
    readCount: 0,
    totalRecipients: 15,
    createdAt: "2023-05-17T14:20:00",
    sentAt: null,
    recipientType: "all",
    recipientIds: [],
    requiresConfirmation: true,
  },
  {
    id: "NOT-005",
    title: "Monthly Performance Review",
    content: "Your monthly performance review is scheduled for next week. Please prepare your self-assessment.",
    priority: "normal",
    status: "sent",
    readCount: 15,
    totalRecipients: 15,
    createdAt: "2023-05-10T08:30:00",
    sentAt: "2023-05-10T09:00:00",
    recipientType: "all",
    recipientIds: [],
    requiresConfirmation: false,
    attachments: [
      { name: "Performance_Review_Template.docx", size: "245 KB" },
      { name: "Self_Assessment_Form.pdf", size: "180 KB" },
    ],
  },
  {
    id: "NOT-006",
    title: "Holiday Schedule",
    content: "Please note the upcoming holiday schedule and adjust your availability accordingly.",
    priority: "normal",
    status: "scheduled",
    readCount: 0,
    totalRecipients: 15,
    createdAt: "2023-05-18T16:45:00",
    sentAt: null,
    scheduledFor: "2023-05-25T10:00:00",
    recipientType: "all",
    recipientIds: [],
    requiresConfirmation: false,
    attachments: [{ name: "Holiday_Schedule_2023.pdf", size: "120 KB" }],
  },
]

export default function CompanyNotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Stats data
  const statsData = {
    totalNotifications: mockNotifications.length,
    sentNotifications: mockNotifications.filter((n) => n.status === "sent").length,
    scheduledNotifications: mockNotifications.filter((n) => n.status === "scheduled").length,
    draftNotifications: mockNotifications.filter((n) => n.status === "draft").length,
  }

  // Filter notifications based on search query, priority, and tab
  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = selectedPriority === "all" || notification.priority === selectedPriority

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "sent" && notification.status === "sent") ||
      (activeTab === "scheduled" && notification.status === "scheduled") ||
      (activeTab === "draft" && notification.status === "draft")

    return matchesSearch && matchesPriority && matchesTab
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

  const handleDelete = (notificationId: string) => {
    // In a real application, this would delete the notification
    if (confirm(`Are you sure you want to delete this notification?`)) {
      console.log(`Deleting notification ${notificationId}`)
      // For now, we'll just show an alert
      alert(`Notification ${notificationId} deleted`)
    }
  }

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
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "normal":
        return <Bell className="h-4 w-4 text-[#06b6d4]" />
      case "low":
        return <Bell className="h-4 w-4 text-gray-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button
          onClick={() => {
            setSelectedNotification(null)
            setIsNotificationModalOpen(true)
          }}
          className="bg-[#06b6d4] hover:bg-[#0891b2]"
        >
          <PenSquare className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalNotifications}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.sentNotifications}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.scheduledNotifications}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.draftNotifications}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notifications..."
              className="pl-8 bg-white dark:bg-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DatePickerWithRange dateRange={{}} onDateRangeChange={() => {}} className="w-full sm:w-auto" />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white dark:bg-gray-800 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-0 p-0">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardContent className="p-0 overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Read Rate</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Attachments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No notifications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <TableRow key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(notification.priority)}
                              <span className="truncate max-w-[200px]">{notification.title}</span>
                              {notification.requiresConfirmation && (
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" title="Requires confirmation" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
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
                          <TableCell>{new Date(notification.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {notification.attachments ? (
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {notification.attachments.length}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenDetailsModal(notification)}
                                className="h-8 px-2 text-xs"
                              >
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
                                  className="h-8 px-2 text-xs"
                                >
                                  Edit
                                </Button>
                              )}
                              {notification.status === "scheduled" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSendNow(notification.id)}
                                  className="h-8 px-2 text-xs"
                                >
                                  <Send className="h-3 w-3" />
                                </Button>
                              )}
                              {(notification.status === "draft" || notification.status === "scheduled") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(notification.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CompanyNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notificationToEdit={selectedNotification}
      />

      {selectedNotification && (
        <CompanyNotificationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          notification={selectedNotification}
        />
      )}
    </div>
  )
}
