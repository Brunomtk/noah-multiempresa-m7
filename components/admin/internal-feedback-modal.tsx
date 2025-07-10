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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface InternalFeedbackModalProps {
  children: React.ReactNode
  feedback?: FeedbackType
}

export function InternalFeedbackModal({ children, feedback }: InternalFeedbackModalProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const isEditing = !!feedback

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would be a server action to save the data
    // For now, we'll just show a toast notification

    if (isEditing) {
      toast({
        title: "Feedback updated",
        description: "The feedback has been updated successfully.",
      })
    } else {
      toast({
        title: "Feedback added",
        description: "The new feedback has been added successfully.",
      })
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Feedback" : "Add New Feedback"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Make changes to the internal feedback here."
              : "Fill in the details to create a new internal feedback."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  defaultValue={feedback?.title || ""}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional">Professional</Label>
                <Select defaultValue={feedback?.professional || ""}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select professional" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                    <SelectItem value="Robert Brown">Robert Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select defaultValue={feedback?.team || ""}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="Cleaning Team A">Cleaning Team A</SelectItem>
                    <SelectItem value="Maintenance Team B">Maintenance Team B</SelectItem>
                    <SelectItem value="Plumbing Team C">Plumbing Team C</SelectItem>
                    <SelectItem value="Electrical Team A">Electrical Team A</SelectItem>
                    <SelectItem value="Construction Team D">Construction Team D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={feedback?.category || ""}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Scheduling">Scheduling</SelectItem>
                    <SelectItem value="Customer Info">Customer Info</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={feedback?.status || "Pending"}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue={feedback?.priority || "Medium"}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select defaultValue={feedback?.assignedTo || ""}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                  <SelectItem value="Scheduling Manager">Scheduling Manager</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Training Coordinator">Training Coordinator</SelectItem>
                  <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={feedback?.description || ""}
                rows={4}
                className="bg-[#0f172a] border-[#2a3349] text-white resize-none"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#2a3349] bg-[#0f172a] text-white hover:bg-[#2a3349]"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              {isEditing ? "Save Changes" : "Add Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
