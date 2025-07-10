"use client"

import { Button } from "@/components/ui/button"
import { InternalFeedbackModal } from "@/components/admin/internal-feedback-modal"
import { InternalFeedbackDetailsModal } from "@/components/admin/internal-feedback-details-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"

export default function InternalFeedbackPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#2a3349]">
        <div>
          <h1 className="text-2xl font-bold text-white">Internal Feedback</h1>
          <p className="text-sm text-muted-foreground">Manage internal feedback from professionals and team members</p>
        </div>
        <InternalFeedbackModal>
          <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Feedback
          </Button>
        </InternalFeedbackModal>
      </div>

      <Tabs defaultValue="all" className="flex-1 p-4">
        <TabsList className="bg-[#1a2234] border border-[#2a3349]">
          <TabsTrigger value="all">All Feedbacks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="rounded-md border border-[#2a3349] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1a2234] border-b border-[#2a3349]">
                    <th className="h-12 px-4 text-left align-middle font-medium text-white">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-white">Title</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-white">Professional</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-white">Team</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-white">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-white">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-white">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((feedback) => (
                    <tr key={feedback.id} className="border-b border-[#2a3349] bg-[#0f172a] hover:bg-[#1a2234]">
                      <td className="p-4 align-middle text-white">#{feedback.id}</td>
                      <td className="p-4 align-middle text-white">{feedback.title}</td>
                      <td className="p-4 align-middle text-white">{feedback.professional}</td>
                      <td className="p-4 align-middle text-white">{feedback.team}</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2a3349] text-white">
                          {feedback.category}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                            feedback.status,
                          )}`}
                        >
                          {feedback.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">{feedback.date}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <InternalFeedbackDetailsModal feedback={feedback}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                            >
                              <span className="sr-only">View details</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Button>
                          </InternalFeedbackDetailsModal>
                          <InternalFeedbackModal feedback={feedback}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                            >
                              <span className="sr-only">Edit</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Button>
                          </InternalFeedbackModal>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-[#2a3349]"
                            onClick={() => handleDelete(feedback.id)}
                          >
                            <span className="sr-only">Delete</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-[#2a3349] bg-[#0f172a]">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>24</strong> feedbacks
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-[#2a3349] bg-[#1a2234] text-white hover:bg-[#2a3349]"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-[#2a3349] bg-[#1a2234] text-white hover:bg-[#2a3349]"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          {/* Similar table structure for pending feedbacks */}
          <div className="text-center p-8 text-muted-foreground">Filter applied for pending feedbacks</div>
        </TabsContent>
        <TabsContent value="resolved" className="mt-4">
          {/* Similar table structure for resolved feedbacks */}
          <div className="text-center p-8 text-muted-foreground">Filter applied for resolved feedbacks</div>
        </TabsContent>
        <TabsContent value="in-progress" className="mt-4">
          {/* Similar table structure for in-progress feedbacks */}
          <div className="text-center p-8 text-muted-foreground">Filter applied for in-progress feedbacks</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Sample data
const feedbacks = [
  {
    id: "FB001",
    title: "Equipment issues during service",
    professional: "John Doe",
    team: "Cleaning Team A",
    category: "Equipment",
    status: "Pending",
    date: "2023-05-15",
    description: "The vacuum cleaner stopped working during the service. Need a replacement ASAP.",
    priority: "High",
    assignedTo: "Operations Manager",
    comments: [
      {
        author: "Operations Manager",
        date: "2023-05-16",
        text: "Replacement equipment has been ordered. Will be delivered tomorrow.",
      },
    ],
  },
  {
    id: "FB002",
    title: "Schedule conflict with another appointment",
    professional: "Jane Smith",
    team: "Maintenance Team B",
    category: "Scheduling",
    status: "Resolved",
    date: "2023-05-14",
    description: "Two appointments were scheduled at the same time. Need better coordination.",
    priority: "Medium",
    assignedTo: "Scheduling Manager",
    comments: [
      {
        author: "Scheduling Manager",
        date: "2023-05-14",
        text: "Issue resolved. Implemented new check to prevent overlapping appointments.",
      },
    ],
  },
  {
    id: "FB003",
    title: "Customer provided wrong address",
    professional: "Mike Johnson",
    team: "Plumbing Team C",
    category: "Customer Info",
    status: "In Progress",
    date: "2023-05-16",
    description: "Customer gave incorrect address. Wasted 30 minutes finding the correct location.",
    priority: "Low",
    assignedTo: "Customer Service",
    comments: [
      {
        author: "Customer Service",
        date: "2023-05-16",
        text: "Contacting customer to verify all address information in our system.",
      },
    ],
  },
  {
    id: "FB004",
    title: "Need additional training on new software",
    professional: "Sarah Williams",
    team: "Electrical Team A",
    category: "Training",
    status: "Pending",
    date: "2023-05-13",
    description: "The new invoicing software is difficult to use in the field. Need more training.",
    priority: "Medium",
    assignedTo: "Training Coordinator",
    comments: [],
  },
  {
    id: "FB005",
    title: "Safety concern at customer site",
    professional: "Robert Brown",
    team: "Construction Team D",
    category: "Safety",
    status: "In Progress",
    date: "2023-05-17",
    description: "Unsafe conditions observed at the worksite. Need safety assessment before continuing work.",
    priority: "High",
    assignedTo: "Safety Officer",
    comments: [
      {
        author: "Safety Officer",
        date: "2023-05-17",
        text: "Scheduling inspection for tomorrow morning. Work paused until then.",
      },
    ],
  },
]

// Helper function to get status styles
function getStatusStyles(status: string) {
  switch (status) {
    case "Pending":
      return "border-yellow-500 text-yellow-500"
    case "Resolved":
      return "border-green-500 text-green-500"
    case "In Progress":
      return "border-blue-500 text-blue-500"
    default:
      return "border-gray-500 text-gray-500"
  }
}

// Function to handle delete (would be implemented with server actions in a real app)
function handleDelete(id: string) {
  // This would be a server action in a real implementation
  console.log(`Deleting feedback with ID: ${id}`)
  // Show toast notification
  // toast({
  //   title: "Feedback deleted",
  //   description: `Feedback #${id} has been deleted successfully.`,
  // })
}
