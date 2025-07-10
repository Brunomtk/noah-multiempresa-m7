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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type FeedbackType = {
  id: string
  title: string
  professional: string
  team: string
  category: string
  status: string
  date: string
  description: string
  priority: string
  assignedTo: string
  comments: Array<{
    author: string
    date: string
    text: string
  }>
}

interface InternalFeedbackDetailsModalProps {
  children: React.ReactNode
  feedback: FeedbackType
}

export function InternalFeedbackDetailsModal({ children, feedback }: InternalFeedbackDetailsModalProps) {
  const [open, setOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()

  const handleAddComment = () => {
    if (!newComment.trim()) return

    // In a real app, this would be a server action to save the comment
    // For now, we'll just show a toast notification

    toast({
      title: "Comment added",
      description: "Your comment has been added to the feedback.",
    })

    setNewComment("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View detailed information about this feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
              <p className="text-white">#{feedback.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date Submitted</h3>
              <p className="text-white">{feedback.date}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
            <p className="text-white font-medium">{feedback.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Professional</h3>
              <p className="text-white">{feedback.professional}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Team</h3>
              <p className="text-white">{feedback.team}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2a3349] text-white mt-1">
                {feedback.category}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusStyles(
                  feedback.status,
                )}`}
              >
                {feedback.status}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getPriorityStyles(
                  feedback.priority,
                )}`}
              >
                {feedback.priority}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
            <p className="text-white">{feedback.assignedTo}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <div className="mt-1 p-3 bg-[#0f172a] rounded-md border border-[#2a3349] text-white">
              {feedback.description}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Comments</h3>
            {feedback.comments.length > 0 ? (
              <div className="space-y-3">
                {feedback.comments.map((comment, index) => (
                  <div key={index} className="p-3 bg-[#0f172a] rounded-md border border-[#2a3349]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-white">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-muted-foreground">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No comments yet.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-comment">Add Comment</Label>
            <Textarea
              id="new-comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your comment here..."
              rows={3}
              className="bg-[#0f172a] border-[#2a3349] text-white resize-none"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-[#2a3349] bg-[#0f172a] text-white hover:bg-[#2a3349]"
          >
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Add Comment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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

// Helper function to get priority styles
function getPriorityStyles(priority: string) {
  switch (priority) {
    case "Low":
      return "border-green-500 text-green-500"
    case "Medium":
      return "border-yellow-500 text-yellow-500"
    case "High":
      return "border-red-500 text-red-500"
    default:
      return "border-gray-500 text-gray-500"
  }
}
