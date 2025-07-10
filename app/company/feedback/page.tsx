"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, AlertTriangle, CheckCircle, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for feedback
const mockFeedback = [
  {
    id: 1,
    professional: "Maria Santos",
    professionalAvatar: "/placeholder.svg?height=40&width=40&query=MS",
    date: "2023-05-15",
    client: "Acme Corporation",
    address: "123 Main St, Suite 500",
    type: "issue",
    message: "Client was not present at the scheduled time. Had to wait 20 minutes.",
    status: "resolved",
  },
  {
    id: 2,
    professional: "João Silva",
    professionalAvatar: "/placeholder.svg?height=40&width=40&query=JS",
    date: "2023-05-14",
    client: "John Smith",
    address: "456 Oak Ave",
    type: "material",
    message: "Running low on cleaning supplies. Need more glass cleaner and microfiber cloths.",
    status: "pending",
  },
  {
    id: 3,
    professional: "Ana Oliveira",
    professionalAvatar: "/placeholder.svg?height=40&width=40&query=AO",
    date: "2023-05-13",
    client: "Tech Solutions Inc",
    address: "789 Business Blvd, Floor 2",
    type: "issue",
    message: "Difficult to access some areas due to furniture arrangement. Suggested rearrangement for next visit.",
    status: "resolved",
  },
  {
    id: 4,
    professional: "Carlos Pereira",
    professionalAvatar: "/placeholder.svg?height=40&width=40&query=CP",
    date: "2023-05-12",
    client: "Sarah Johnson",
    address: "321 Pine St",
    type: "suggestion",
    message: "Client requested specific eco-friendly products for future cleanings.",
    status: "pending",
  },
  {
    id: 5,
    professional: "Fernanda Lima",
    professionalAvatar: "/placeholder.svg?height=40&width=40&query=FL",
    date: "2023-05-10",
    client: "Acme Corporation",
    address: "123 Main St, Suite 500",
    type: "issue",
    message: "Security system was activated and required additional time to coordinate entry.",
    status: "resolved",
  },
]

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredFeedback = mockFeedback.filter((feedback) => {
    const matchesSearch =
      feedback.professional.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || feedback.type === typeFilter
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case "issue":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "material":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "suggestion":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "issue":
        return "Issue"
      case "material":
        return "Material Request"
      case "suggestion":
        return "Suggestion"
      default:
        return type
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "issue":
        return "bg-amber-500/20 text-amber-500 border-amber-500"
      case "material":
        return "bg-blue-500/20 text-blue-500 border-blue-500"
      case "suggestion":
        return "bg-green-500/20 text-green-500 border-green-500"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Internal Feedback</h1>
          <p className="text-gray-400">Review feedback and issues reported by cleaning professionals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-[#06b6d4]" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">{mockFeedback.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Pending Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">
                {mockFeedback.filter((f) => f.status === "pending").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Resolved Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#2a3349] p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">
                {mockFeedback.filter((f) => f.status === "resolved").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search feedback..."
                className="pl-8 bg-[#2a3349] border-0 text-white placeholder:text-gray-500 focus-visible:ring-[#06b6d4]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#2a3349] border-0 text-white focus:ring-[#06b6d4]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="issue">Issues</SelectItem>
                  <SelectItem value="material">Material Requests</SelectItem>
                  <SelectItem value="suggestion">Suggestions</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#2a3349] border-0 text-white focus:ring-[#06b6d4]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-gray-400">Professional</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Client</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400 w-1/3">Feedback</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.length > 0 ? (
                filteredFeedback.map((feedback) => (
                  <TableRow key={feedback.id} className="border-[#2a3349] hover:bg-[#2a3349]">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={feedback.professionalAvatar || "/placeholder.svg"}
                            alt={feedback.professional}
                          />
                          <AvatarFallback className="bg-[#2a3349] text-[#06b6d4]">
                            {feedback.professional
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {feedback.professional}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        {new Date(feedback.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-400">
                        <div>{feedback.client}</div>
                        <div className="text-xs text-gray-500">{feedback.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(feedback.type)}>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(feedback.type)}
                          {getTypeLabel(feedback.type)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      <div className="line-clamp-2">{feedback.message}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          feedback.status === "resolved"
                            ? "bg-green-500/20 text-green-500 border-green-500"
                            : "bg-amber-500/20 text-amber-500 border-amber-500"
                        }
                      >
                        {feedback.status === "resolved" ? "Resolved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                        >
                          View
                        </Button>
                        {feedback.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-400">
                    No feedback found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
