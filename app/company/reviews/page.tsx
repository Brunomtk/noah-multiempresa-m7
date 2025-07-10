import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Search, Star, StarHalf, ThumbsUp } from "lucide-react"
import { CompanyReviewModal } from "@/components/company/company-review-modal"
import { CompanyReviewDetailsModal } from "@/components/company/company-review-details-modal"

export default function CompanyReviewsPage() {
  return (
    <div className="flex flex-col space-y-6 p-6 md:p-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
        <p className="text-muted-foreground">Manage and respond to customer reviews for your services.</p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex w-full items-center space-x-2 md:w-1/2 lg:w-1/3">
          <Input
            placeholder="Search reviews..."
            className="h-10"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <Button variant="outline" size="icon" className="h-10 w-10">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <CompanyReviewModal trigger={<Button className="bg-cyan-600 hover:bg-cyan-700">Add Response</Button>} />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
          <TabsTrigger value="pending">Pending Response</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReviewSummaryCard />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positive" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {reviews
                  .filter((review) => review.rating >= 4)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="neutral" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {reviews
                  .filter((review) => review.rating === 3)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="negative" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {reviews
                  .filter((review) => review.rating < 3)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {reviews
                  .filter((review) => !review.response)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReviewSummaryCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Overall Rating</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-bold">4.7</div>
          <div className="flex text-yellow-500">
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <StarHalf className="h-5 w-5 fill-current" />
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Based on 128 reviews</p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-sm">5</div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[70%] rounded-full bg-yellow-500"></div>
            </div>
            <div className="text-sm">70%</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">4</div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[20%] rounded-full bg-yellow-500"></div>
            </div>
            <div className="text-sm">20%</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">3</div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[5%] rounded-full bg-yellow-500"></div>
            </div>
            <div className="text-sm">5%</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">2</div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[3%] rounded-full bg-yellow-500"></div>
            </div>
            <div className="text-sm">3%</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">1</div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-[2%] rounded-full bg-yellow-500"></div>
            </div>
            <div className="text-sm">2%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewCard({ review }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-muted">
                <img
                  src={review.customerAvatar || "/placeholder.svg"}
                  alt={review.customerName}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{review.customerName}</div>
                <div className="text-sm text-muted-foreground">{review.date}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-yellow-500">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted"}`} />
                ))}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm">{review.comment}</p>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>Helpful ({review.helpfulCount})</span>
            </Button>
            <CompanyReviewDetailsModal
              review={review}
              trigger={
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  View Details
                </Button>
              }
            />
          </div>
        </div>

        {review.response && (
          <div className="bg-muted/30 p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-cyan-600">
                <img src="/logo.png" alt="Company Logo" className="h-full w-full rounded-full object-cover p-1" />
              </div>
              <div>
                <div className="text-sm font-medium">Your Response</div>
                <div className="text-xs text-muted-foreground">{review.responseDate}</div>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm">{review.response}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Sample data
const reviews = [
  {
    id: 1,
    customerName: "Sarah Johnson",
    customerAvatar: "/placeholder.svg?height=40&width=40&query=portrait",
    date: "May 15, 2023",
    rating: 5,
    comment:
      "Excellent service! The team was professional, thorough, and left my home spotless. Will definitely use again.",
    helpfulCount: 12,
    response:
      "Thank you for your kind words, Sarah! We're thrilled to hear you were satisfied with our service. Looking forward to serving you again soon!",
    responseDate: "May 16, 2023",
    service: "Deep Cleaning",
    professional: "Maria Rodriguez",
    location: "123 Main St, Apt 4B",
  },
  {
    id: 2,
    customerName: "Michael Chen",
    customerAvatar: "/placeholder.svg?height=40&width=40&query=man",
    date: "May 10, 2023",
    rating: 4,
    comment:
      "Good service overall. They did miss a few spots under the furniture, but when I pointed it out, they immediately fixed it.",
    helpfulCount: 8,
    response:
      "Thank you for your feedback, Michael. We appreciate you bringing those missed spots to our attention. We're always looking to improve, and your input helps us do that!",
    responseDate: "May 11, 2023",
    service: "Regular Cleaning",
    professional: "John Smith",
    location: "456 Oak Ave",
  },
  {
    id: 3,
    customerName: "Emily Wilson",
    customerAvatar: "/placeholder.svg?height=40&width=40&query=woman",
    date: "May 5, 2023",
    rating: 2,
    comment:
      "Disappointed with the service. The cleaner arrived late and rushed through the job. Several areas were not cleaned properly.",
    helpfulCount: 15,
    response: null,
    service: "Regular Cleaning",
    professional: "David Brown",
    location: "789 Pine St",
  },
  {
    id: 4,
    customerName: "Robert Taylor",
    customerAvatar: "/placeholder.svg?height=40&width=40&query=older man",
    date: "May 3, 2023",
    rating: 5,
    comment: "Outstanding service! The attention to detail was impressive. My kitchen has never looked so clean.",
    helpfulCount: 10,
    response:
      "We're delighted to hear about your positive experience, Robert! Our team takes great pride in their attention to detail. Thank you for choosing our services!",
    responseDate: "May 4, 2023",
    service: "Kitchen Deep Clean",
    professional: "Maria Rodriguez",
    location: "101 Maple Dr",
  },
  {
    id: 5,
    customerName: "Jessica Martinez",
    customerAvatar: "/placeholder.svg?height=40&width=40&query=young woman",
    date: "April 28, 2023",
    rating: 3,
    comment: "Average service. Did the basics well but nothing exceptional for the premium price.",
    helpfulCount: 7,
    response: null,
    service: "Premium Cleaning",
    professional: "John Smith",
    location: "202 Elm St",
  },
]
