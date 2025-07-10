"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, Mail, MapPin, Phone, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  customer: any
}

export function CustomerDetailsModal({ isOpen, onClose, customer }: CustomerDetailsModalProps) {
  if (!customer) return null

  // Sample appointment history
  const appointments = [
    {
      id: 1,
      date: "2023-05-15",
      time: "09:00 AM",
      status: "completed",
      team: "Team Alpha",
      rating: 5,
    },
    {
      id: 2,
      date: "2023-05-22",
      time: "10:30 AM",
      status: "completed",
      team: "Team Beta",
      rating: 4,
    },
    {
      id: 3,
      date: "2023-05-29",
      time: "09:00 AM",
      status: "cancelled",
      team: "Team Alpha",
      rating: null,
    },
    {
      id: 4,
      date: "2023-06-05",
      time: "09:00 AM",
      status: "scheduled",
      team: "Team Alpha",
      rating: null,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#06b6d4]" />
            Customer Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">Complete information about the customer</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="bg-[#0f172a] border border-[#2a3349]">
            <TabsTrigger value="info" className="data-[state=active]:bg-[#2a3349]">
              Information
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-[#2a3349]">
              Appointment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{customer.name}</h3>
                <Badge
                  variant="outline"
                  className={
                    customer.status === "active" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                  }
                >
                  {customer.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Document (CPF/CNPJ)</span>
                    </div>
                    <p className="font-medium">{customer.document}</p>
                  </div>

                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">Company</span>
                    </div>
                    <p className="font-medium">{customer.company}</p>
                  </div>

                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <p className="font-medium">{customer.phone}</p>
                  </div>

                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Address</span>
                    </div>
                    <p className="font-medium">{customer.address}</p>
                    <p className="text-sm text-gray-400">
                      {customer.city}, {customer.state}
                    </p>
                  </div>

                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Member Since</span>
                    </div>
                    <p className="font-medium">January 15, 2023</p>
                  </div>
                </div>
              </div>

              {customer.observations && (
                <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                  <h4 className="font-medium mb-2">Observations</h4>
                  <p className="text-sm text-gray-400">{customer.observations}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="mt-4">
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Appointment History</CardTitle>
                <CardDescription className="text-gray-400">Recent appointments for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 border border-[#2a3349] rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-10 rounded-full ${
                            appointment.status === "completed"
                              ? "bg-green-500"
                              : appointment.status === "scheduled"
                                ? "bg-blue-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium">
                            {appointment.date} at {appointment.time}
                          </p>
                          <p className="text-sm text-gray-400">{appointment.team}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            appointment.status === "completed"
                              ? "border-green-500 text-green-500"
                              : appointment.status === "scheduled"
                                ? "border-blue-500 text-blue-500"
                                : "border-red-500 text-red-500"
                          }
                        >
                          {appointment.status === "completed"
                            ? "Completed"
                            : appointment.status === "scheduled"
                              ? "Scheduled"
                              : "Cancelled"}
                        </Badge>
                        {appointment.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-500 text-sm mr-1">★</span>
                            <span className="text-sm">{appointment.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
