"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Calendar, Clock, DollarSign, Edit, MapPin, Trash2, User, UserCheck } from "lucide-react"

interface CompanyCancellationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  cancellation: any
}

export function CompanyCancellationDetailsModal({
  isOpen,
  onClose,
  cancellation,
}: CompanyCancellationDetailsModalProps) {
  if (!cancellation) return null

  const handleEdit = () => {
    // Handle edit functionality
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-[#0f172a] border-[#2a3349] text-white overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Cancellation Details</DialogTitle>
            <Badge
              className={`
                ${cancellation.status === "Refunded" ? "bg-red-500/20 text-red-500 hover:bg-red-500/20" : ""}
                ${cancellation.status === "Rescheduled" ? "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" : ""}
                ${cancellation.status === "Cancelled" ? "bg-orange-500/20 text-orange-500 hover:bg-orange-500/20" : ""}
                ${cancellation.status === "Partial Refund" ? "bg-purple-500/20 text-purple-500 hover:bg-purple-500/20" : ""}
              `}
            >
              {cancellation.status}
            </Badge>
          </div>
          <DialogDescription className="text-gray-400">
            ID: {cancellation.id} • Created on {new Date(cancellation.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 overflow-hidden">
          <TabsList className="bg-[#1a2234] p-1 mb-4">
            <TabsTrigger value="details" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
              Details
            </TabsTrigger>
            <TabsTrigger value="client" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
              Client
            </TabsTrigger>
            <TabsTrigger value="service" className="data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white">
              Service
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="details" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1a2234] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-[#06b6d4]" />
                      <h3 className="font-medium">Cancellation Date</h3>
                    </div>
                    <p>{new Date(cancellation.date).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 mt-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <p>{cancellation.time}</p>
                    </div>
                  </div>

                  <div className="bg-[#1a2234] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-[#06b6d4]" />
                      <h3 className="font-medium">Reason</h3>
                    </div>
                    <p>{cancellation.reason}</p>
                  </div>
                </div>

                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-[#06b6d4]" />
                    <h3 className="font-medium">Refund Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-xl font-semibold">{cancellation.refundAmount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Method</p>
                      <p>Original Payment Method</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4 text-[#06b6d4]" />
                    <h3 className="font-medium">Professional</h3>
                  </div>
                  <p>{cancellation.professional}</p>
                </div>

                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Additional Notes</h3>
                  <p className="text-gray-400">
                    {cancellation.notes || "No additional notes provided for this cancellation."}
                  </p>
                </div>

                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Cancellation Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-1 bg-[#06b6d4] rounded relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#06b6d4]"></div>
                      </div>
                      <div>
                        <p className="font-medium">Cancellation Requested</p>
                        <p className="text-sm text-gray-400">{new Date(cancellation.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1 bg-[#2a3349] rounded relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#2a3349]"></div>
                      </div>
                      <div>
                        <p className="font-medium">Cancellation Processed</p>
                        <p className="text-sm text-gray-400">
                          {new Date(new Date(cancellation.createdAt).getTime() + 30 * 60000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {cancellation.status === "Refunded" || cancellation.status === "Partial Refund" ? (
                      <div className="flex gap-3">
                        <div className="w-1 bg-[#2a3349] rounded relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#2a3349]"></div>
                        </div>
                        <div>
                          <p className="font-medium">Refund Issued</p>
                          <p className="text-sm text-gray-400">
                            {new Date(new Date(cancellation.createdAt).getTime() + 60 * 60000).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {cancellation.status === "Rescheduled" ? (
                      <div className="flex gap-3">
                        <div className="w-1 bg-[#2a3349] rounded relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#2a3349]"></div>
                        </div>
                        <div>
                          <p className="font-medium">Appointment Rescheduled</p>
                          <p className="text-sm text-gray-400">
                            {new Date(new Date(cancellation.createdAt).getTime() + 90 * 60000).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="client" className="mt-0">
              <div className="space-y-4">
                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-[#2a3349] flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{cancellation.client}</h3>
                      <p className="text-gray-400">client@example.com</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p>(555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Client Since</p>
                      <p>Jan 15, 2025</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-[#06b6d4]" />
                    <h3 className="font-medium">Address</h3>
                  </div>
                  <p>123 Main Street</p>
                  <p>Apt 4B</p>
                  <p>New York, NY 10001</p>
                </div>

                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Cancellation History</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Regular Cleaning</p>
                        <p className="text-sm text-gray-400">May 20, 2025</p>
                      </div>
                      <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/20">Refunded</Badge>
                    </div>
                    <Separator className="bg-[#2a3349]" />
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Deep Cleaning</p>
                        <p className="text-sm text-gray-400">Mar 15, 2025</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/20">Rescheduled</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="service" className="mt-0">
              <div className="space-y-4">
                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Service Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Service Type</p>
                      <p>{cancellation.service}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Duration</p>
                      <p>2 hours</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Original Price</p>
                      <p>$120.00</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Cancellation Fee</p>
                      <p>$45.00</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Service Location</h3>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <MapPin className="h-4 w-4" />
                    <p>123 Main Street, Apt 4B, New York, NY 10001</p>
                  </div>
                  <div className="bg-[#2a3349] h-32 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Map view would appear here</p>
                  </div>
                </div>

                <div className="bg-[#1a2234] p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Cancellation Policy</h3>
                  <div className="space-y-2 text-gray-400">
                    <p>• Full refund if cancelled more than 24 hours before appointment</p>
                    <p>• 50% refund if cancelled between 12-24 hours before appointment</p>
                    <p>• No refund if cancelled less than 12 hours before appointment</p>
                    <p>• Rescheduling is available at no cost with 12+ hours notice</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-[#2a3349]">
          <Button
            variant="outline"
            className="border-[#2a3349] text-white hover:bg-[#1a2234] hover:text-white"
            onClick={onClose}
          >
            Close
          </Button>
          <Button variant="outline" className="border-[#2a3349] text-red-400 hover:bg-red-500/10 hover:text-red-400">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
