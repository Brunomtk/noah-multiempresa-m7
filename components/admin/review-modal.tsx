"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Star } from "lucide-react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  review?: any
}

export function ReviewModal({ isOpen, onClose, onSubmit, review }: ReviewModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRating, setSelectedRating] = useState(5)
  const [formData, setFormData] = useState({
    customer: "",
    professional: "",
    company: "",
    rating: 5,
    comment: "",
    status: "pending",
    service: "",
    response: "",
  })

  useEffect(() => {
    if (review) {
      setFormData({
        customer: review.customer || "",
        professional: review.professional || "",
        company: review.company || "",
        rating: review.rating || 5,
        comment: review.comment || "",
        status: review.status || "pending",
        service: review.service || "",
        response: review.response || "",
      })
      setSelectedRating(review.rating || 5)
    } else {
      setFormData({
        customer: "",
        professional: "",
        company: "",
        rating: 5,
        comment: "",
        status: "pending",
        service: "",
        response: "",
      })
      setSelectedRating(5)
    }
  }, [review])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit({
      ...formData,
      rating: selectedRating,
      id: review?.id,
    })
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
    setFormData((prev) => ({ ...prev, rating }))
  }

  // Sample data
  const professionals = ["Dr. Maria Rodriguez", "Alex Thompson", "Sarah Wilson", "Robert Miller", "Jennifer Lee"]
  const companies = [
    "MediCare Plus",
    "HomeClean Services",
    "TechSupport Inc",
    "GreenLawn Gardening",
    "BeautySpot Salon",
  ]
  const services = ["Medical Consultation", "Home Cleaning", "Computer Repair", "Garden Maintenance", "Haircut"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>{review ? "Edit Review" : "New Review"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {review ? "Update the review information below." : "Fill in the information to add a new review."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => handleChange("customer", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="professional">Professional</Label>
                <Select value={formData.professional} onValueChange={(value) => handleChange("professional", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select professional" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    {professionals.map((prof) => (
                      <SelectItem key={prof} value={prof} className="hover:bg-[#2a3349]">
                        {prof}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Select value={formData.company} onValueChange={(value) => handleChange("company", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    {companies.map((company) => (
                      <SelectItem key={company} value={company} className="hover:bg-[#2a3349]">
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    {services.map((service) => (
                      <SelectItem key={service} value={service} className="hover:bg-[#2a3349]">
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= selectedRating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-400">{selectedRating} out of 5</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="comment">Review Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white min-h-[100px]"
                placeholder="Customer's review comment"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="pending" className="hover:bg-[#2a3349]">
                    Pending
                  </SelectItem>
                  <SelectItem value="published" className="hover:bg-[#2a3349]">
                    Published
                  </SelectItem>
                  <SelectItem value="rejected" className="hover:bg-[#2a3349]">
                    Rejected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {review && (
              <div className="grid gap-2">
                <Label htmlFor="response">Company Response</Label>
                <Textarea
                  id="response"
                  value={formData.response}
                  onChange={(e) => handleChange("response", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white min-h-[80px]"
                  placeholder="Company's response to the review (optional)"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
