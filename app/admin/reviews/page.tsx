"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Star } from "lucide-react"
import { ReviewModal } from "@/components/admin/review-modal"
import { ReviewDetailsModal } from "@/components/admin/review-details-modal"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample data
const initialReviews = [
  {
    id: "REV001",
    customer: "John Smith",
    professional: "Dr. Maria Rodriguez",
    company: "MediCare Plus",
    rating: 5,
    comment: "Excellent service! Dr. Rodriguez was very professional and attentive to my needs.",
    date: "2023-05-15T10:30:00",
    status: "published",
    response: "Thank you for your kind words! We're glad you had a positive experience.",
    responseDate: "2023-05-16T14:20:00",
    service: "Medical Consultation",
  },
  {
    id: "REV002",
    customer: "Emily Johnson",
    professional: "Alex Thompson",
    company: "HomeClean Services",
    rating: 4,
    comment: "Very good cleaning service. The house looks great, but they were 15 minutes late.",
    date: "2023-05-10T15:45:00",
    status: "published",
    response: "Thank you for your feedback. We apologize for the delay and will work to improve our punctuality.",
    responseDate: "2023-05-11T09:10:00",
    service: "Home Cleaning",
  },
  {
    id: "REV003",
    customer: "Michael Brown",
    professional: "Sarah Wilson",
    company: "TechSupport Inc",
    rating: 2,
    comment: "The technician couldn't solve my computer issue and had to schedule another visit.",
    date: "2023-05-08T13:20:00",
    status: "published",
    response:
      "We're sorry to hear about your experience. We've assigned a senior technician for your next appointment.",
    responseDate: "2023-05-08T17:30:00",
    service: "Computer Repair",
  },
  {
    id: "REV004",
    customer: "Jessica Davis",
    professional: "Robert Miller",
    company: "GreenLawn Gardening",
    rating: 5,
    comment: "Robert did an amazing job with our garden. Very professional and knowledgeable.",
    date: "2023-05-05T11:00:00",
    status: "published",
    response: "",
    responseDate: "",
    service: "Garden Maintenance",
  },
  {
    id: "REV005",
    customer: "David Wilson",
    professional: "Jennifer Lee",
    company: "BeautySpot Salon",
    rating: 3,
    comment: "The haircut was okay, but not exactly what I asked for.",
    date: "2023-05-03T16:30:00",
    status: "pending",
    response: "",
    responseDate: "",
    service: "Haircut",
  },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [reviewToDelete, setReviewToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const { toast } = useToast()

  const handleAddReview = (data: any) => {
    const newReview = {
      id: `REV${String(reviews.length + 1).padStart(3, "0")}`,
      ...data,
      date: new Date().toISOString(),
    }
    setReviews([...reviews, newReview])
    setIsModalOpen(false)
    toast({
      title: "Review added successfully",
      description: `Review from ${data.customer} has been added.`,
    })
  }

  const handleEditReview = (data: any) => {
    setReviews(reviews.map((review) => (review.id === selectedReview.id ? { ...review, ...data } : review)))
    setSelectedReview(null)
    setIsModalOpen(false)
    toast({
      title: "Review updated successfully",
      description: `Review ${data.id} has been updated.`,
    })
  }

  const handleDeleteReview = () => {
    if (reviewToDelete) {
      setReviews(reviews.filter((review) => review.id !== reviewToDelete.id))
      toast({
        title: "Review deleted successfully",
        description: `Review ${reviewToDelete.id} has been removed.`,
        variant: "destructive",
      })
      setReviewToDelete(null)
    }
  }

  const handleViewDetails = (review: any) => {
    setSelectedReview(review)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (review: any) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.professional.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesRating = ratingFilter === "all" || review.rating === Number.parseInt(ratingFilter)
    return matchesSearch && matchesStatus && matchesRating
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Reviews Management</h1>
            <p className="text-gray-400">Manage customer reviews and feedback across all services.</p>
          </div>
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              setSelectedReview(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[300px] bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={
                statusFilter === "all"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
              }
            >
              All
            </Button>
            <Button
              variant={statusFilter === "published" ? "default" : "outline"}
              onClick={() => setStatusFilter("published")}
              className={
                statusFilter === "published"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
              }
            >
              Published
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
              className={
                statusFilter === "pending"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
              }
            >
              Pending
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1a2234]">
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-white">Customer</TableHead>
                <TableHead className="text-white">Professional</TableHead>
                <TableHead className="text-white">Company</TableHead>
                <TableHead className="text-white">Rating</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#2a3349] p-1.5 rounded-md">
                        <Star className="h-4 w-4 text-[#06b6d4]" />
                      </div>
                      {review.customer}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{review.professional}</TableCell>
                  <TableCell className="text-gray-400">{review.company}</TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="text-gray-400">{formatDate(review.date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        review.status === "published"
                          ? "border-green-500 text-green-500"
                          : review.status === "pending"
                            ? "border-yellow-500 text-yellow-500"
                            : "border-red-500 text-red-500"
                      }
                    >
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(review)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(review)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setReviewToDelete(review)}
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-[#2a3349]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{filteredReviews.length}</span> of{" "}
            <span className="font-medium text-white">{reviews.length}</span> reviews
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] bg-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
            >
              Next
            </Button>
          </div>
        </div>

        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedReview(null)
          }}
          onSubmit={selectedReview ? handleEditReview : handleAddReview}
          review={selectedReview}
        />

        <ReviewDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedReview(null)
          }}
          review={selectedReview}
        />

        <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the review{" "}
                <span className="font-semibold text-white">{reviewToDelete?.id}</span> from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteReview}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
