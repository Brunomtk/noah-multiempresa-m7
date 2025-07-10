"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  FileText,
  ClipboardList,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Address {
  id?: number
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface Client {
  id?: number
  name: string
  type: "individual" | "business"
  document: string
  email: string
  phone: string
  addresses: Address[]
  appointments: number
  totalSpent: number
  lastService: string | null
  status: "active" | "inactive"
  createdAt: string
  notes?: string
}

interface ClientDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client
  onEdit: () => void
}

export default function ClientDetailsModal({ isOpen, onClose, client, onEdit }: ClientDetailsModalProps) {
  // Mock appointment history data
  const appointmentHistory = [
    {
      id: 1,
      date: "2023-05-15",
      time: "09:00 - 11:00",
      service: "Regular Cleaning",
      team: "Team Alpha",
      status: "completed",
      amount: 150.0,
    },
    {
      id: 2,
      date: "2023-04-01",
      time: "13:00 - 15:30",
      service: "Deep Cleaning",
      team: "Team Bravo",
      status: "completed",
      amount: 250.75,
    },
    {
      id: 3,
      date: "2023-03-15",
      time: "10:00 - 12:00",
      service: "Regular Cleaning",
      team: "Team Alpha",
      status: "completed",
      amount: 150.0,
    },
  ]

  const handleDeleteClient = () => {
    // Here you would typically call your API to delete the client
    toast({
      title: "Client deleted",
      description: `${client.name} has been deleted successfully.`,
      variant: "destructive",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a2234] text-white border-[#2a3349] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            {client.type === "business" ? (
              <Building className="h-5 w-5 mr-2 text-amber-500" />
            ) : (
              <User className="h-5 w-5 mr-2 text-blue-500" />
            )}
            {client.name}
            <Badge className="ml-3 bg-[#2a3349] text-white border-0">
              {client.type === "business" ? "Business" : "Individual"}
            </Badge>
            <Badge
              className={`ml-2 ${
                client.status === "active"
                  ? "bg-green-500/20 text-green-500 border-green-500"
                  : "bg-gray-500/20 text-gray-400 border-gray-500"
              }`}
            >
              {client.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-[#2a3349] mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#06b6d4] text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-[#06b6d4] text-white">
              Appointment History
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-[#06b6d4] text-white">
              Addresses
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-[#06b6d4] text-white">
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-[#2a3349] pb-2">Client Information</h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2a3349] flex items-center justify-center mr-3 mt-0.5">
                      <FileText className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Document ({client.type === "business" ? "CNPJ" : "CPF"})</p>
                      <p className="text-white">{client.document}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2a3349] flex items-center justify-center mr-3 mt-0.5">
                      <Mail className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{client.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2a3349] flex items-center justify-center mr-3 mt-0.5">
                      <Phone className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white">{client.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2a3349] flex items-center justify-center mr-3 mt-0.5">
                      <Calendar className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Client Since</p>
                      <p className="text-white">{new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-[#2a3349] pb-2">Service Summary</h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2a3349] flex items-center justify-center mr-3 mt-0.5">
                      <ClipboardList className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Appointments</p>
                      <p className="text-white">{client.appointments}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2a3349] flex items-center justify-center mr-3 mt-0.5">
                      <DollarSign className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                      <p className="text-white">${client.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2a3349] flex items-center justify-center mr-3 mt-0.5">
                      <Clock className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Last Service</p>
                      <p className="text-white">
                        {client.lastService ? new Date(client.lastService).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2a3349] flex items-center justify-center mr-3 mt-0.5">
                      <MapPin className="h-4 w-4 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Registered Addresses</p>
                      <p className="text-white">{client.addresses.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            {appointmentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a3349]">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Service</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Team</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentHistory.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-[#2a3349] hover:bg-[#2a3349]">
                        <td className="py-3 px-4 text-white">{new Date(appointment.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-400">{appointment.time}</td>
                        <td className="py-3 px-4 text-white">{appointment.service}</td>
                        <td className="py-3 px-4 text-gray-400">{appointment.team}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-500/20 text-green-500 border-green-500">
                            {appointment.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-white">${appointment.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">No appointment history found for this client.</div>
            )}
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            {client.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.addresses.map((address, index) => (
                  <div
                    key={address.id || index}
                    className={`p-4 rounded-lg border ${
                      address.isDefault ? "border-[#06b6d4] bg-[#06b6d4]/10" : "border-[#2a3349]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-white flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-[#06b6d4]" />
                        Address {index + 1}
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-[#06b6d4] text-white px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </h4>
                    </div>

                    <div className="space-y-1 text-gray-400">
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">No addresses found for this client.</div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="p-4 border border-[#2a3349] rounded-lg">
              {client.notes ? (
                <p className="text-gray-400 whitespace-pre-line">{client.notes}</p>
              ) : (
                <p className="text-gray-400 italic">No additional notes for this client.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between mt-6">
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
            onClick={handleDeleteClient}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Client
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="border-[#2a3349] text-white hover:bg-[#2a3349]">
              Close
            </Button>
            <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
