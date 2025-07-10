"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, User, Users, Building, Calendar, Phone, Mail, Filter, Download, ArrowUpDown } from "lucide-react"
import ClientModal from "@/components/company/client-modal"
import ClientDetailsModal from "@/components/company/client-details-modal"

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: "John Smith",
    type: "individual",
    document: "123.456.789-00",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    addresses: [
      {
        id: 1,
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        isDefault: true,
      },
    ],
    appointments: 8,
    totalSpent: 1250.75,
    lastService: "2023-05-15",
    status: "active",
    createdAt: "2022-10-05",
  },
  {
    id: 2,
    name: "Acme Corporation",
    type: "business",
    document: "12.345.678/0001-90",
    email: "contact@acmecorp.com",
    phone: "(555) 987-6543",
    addresses: [
      {
        id: 2,
        street: "100 Corporate Ave",
        city: "New York",
        state: "NY",
        zipCode: "10010",
        isDefault: true,
      },
      {
        id: 3,
        street: "200 Branch St",
        city: "Boston",
        state: "MA",
        zipCode: "02108",
        isDefault: false,
      },
    ],
    appointments: 15,
    totalSpent: 4500.0,
    lastService: "2023-06-01",
    status: "active",
    createdAt: "2022-08-15",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    type: "individual",
    document: "987.654.321-00",
    email: "sarah.j@example.com",
    phone: "(555) 555-5555",
    addresses: [
      {
        id: 4,
        street: "789 Park Ave",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        isDefault: true,
      },
    ],
    appointments: 3,
    totalSpent: 450.25,
    lastService: "2023-05-28",
    status: "active",
    createdAt: "2023-01-10",
  },
  {
    id: 4,
    name: "Tech Solutions Inc",
    type: "business",
    document: "98.765.432/0001-10",
    email: "info@techsolutions.com",
    phone: "(555) 333-2222",
    addresses: [
      {
        id: 5,
        street: "500 Tech Blvd",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        isDefault: true,
      },
    ],
    appointments: 0,
    totalSpent: 0,
    lastService: null,
    status: "inactive",
    createdAt: "2023-02-20",
  },
  {
    id: 5,
    name: "Michael Brown",
    type: "individual",
    document: "456.789.123-00",
    email: "michael.b@example.com",
    phone: "(555) 444-3333",
    addresses: [
      {
        id: 6,
        street: "321 Oak St",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        isDefault: true,
      },
    ],
    appointments: 5,
    totalSpent: 875.5,
    lastService: "2023-04-10",
    status: "active",
    createdAt: "2022-11-15",
  },
  {
    id: 6,
    name: "Global Enterprises LLC",
    type: "business",
    document: "45.678.901/0001-23",
    email: "contact@globalent.com",
    phone: "(555) 777-8888",
    addresses: [
      {
        id: 7,
        street: "800 Global Way",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        isDefault: true,
      },
      {
        id: 8,
        street: "900 Branch Rd",
        city: "San Diego",
        state: "CA",
        zipCode: "92101",
        isDefault: false,
      },
    ],
    appointments: 12,
    totalSpent: 6800.0,
    lastService: "2023-06-05",
    status: "active",
    createdAt: "2022-07-01",
  },
  {
    id: 7,
    name: "Emily Wilson",
    type: "individual",
    document: "789.123.456-00",
    email: "emily.w@example.com",
    phone: "(555) 222-1111",
    addresses: [
      {
        id: 9,
        street: "456 Pine St",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        isDefault: true,
      },
    ],
    appointments: 2,
    totalSpent: 320.0,
    lastService: "2023-03-15",
    status: "inactive",
    createdAt: "2023-02-01",
  },
]

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentTab, setCurrentTab] = useState("all")

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  // Filter and sort clients
  const filteredClients = mockClients
    .filter((client) => {
      // Search filter
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.document.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)

      // Status filter
      const matchesStatus = statusFilter === "all" || client.status === statusFilter

      // Type filter
      const matchesType = typeFilter === "all" || client.type === typeFilter

      // Tab filter
      const matchesTab =
        currentTab === "all" ||
        (currentTab === "active" && client.status === "active") ||
        (currentTab === "inactive" && client.status === "inactive") ||
        (currentTab === "business" && client.type === "business") ||
        (currentTab === "individual" && client.type === "individual")

      return matchesSearch && matchesStatus && matchesType && matchesTab
    })
    .sort((a, b) => {
      // Sort logic
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "appointments") {
        return sortDirection === "asc" ? a.appointments - b.appointments : b.appointments - a.appointments
      } else if (sortField === "totalSpent") {
        return sortDirection === "asc" ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent
      } else if (sortField === "lastService") {
        // Handle null values for lastService
        if (!a.lastService) return sortDirection === "asc" ? -1 : 1
        if (!b.lastService) return sortDirection === "asc" ? 1 : -1

        return sortDirection === "asc"
          ? new Date(a.lastService) - new Date(b.lastService)
          : new Date(b.lastService) - new Date(a.lastService)
      }
      return 0
    })

  // Statistics
  const totalClients = mockClients.length
  const activeClients = mockClients.filter((c) => c.status === "active").length
  const businessClients = mockClients.filter((c) => c.type === "business").length
  const individualClients = mockClients.filter((c) => c.type === "individual").length
  const totalAppointments = mockClients.reduce((sum, client) => sum + client.appointments, 0)
  const totalRevenue = mockClients.reduce((sum, client) => sum + client.totalSpent, 0)

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle client selection for details or edit
  const handleViewDetails = (client) => {
    setSelectedClient(client)
    setIsDetailsModalOpen(true)
  }

  const handleEditClient = (client) => {
    setSelectedClient(client)
    setIsEditModalOpen(true)
  }

  const handleAddClient = () => {
    setSelectedClient(null)
    setIsAddModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Client Management</h1>
          <p className="text-gray-400">Manage your client database and view their service history</p>
        </div>
        <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white" onClick={handleAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-[#06b6d4]" />
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalClients}</div>
            <p className="text-gray-400 text-sm">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-green-500" />
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{activeClients}</div>
            <p className="text-gray-400 text-sm">
              {Math.round((activeClients / totalClients) * 100)}% of total clients
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-500" />
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalAppointments}</div>
            <p className="text-gray-400 text-sm">Avg {(totalAppointments / totalClients).toFixed(1)} per client</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center">
              <Building className="h-5 w-5 mr-2 text-amber-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
            <p className="text-gray-400 text-sm">Avg ${(totalRevenue / activeClients).toFixed(2)} per active client</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <TabsList className="bg-[#2a3349]">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#06b6d4] text-white">
                  All Clients
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-[#06b6d4] text-white">
                  Active
                </TabsTrigger>
                <TabsTrigger value="inactive" className="data-[state=active]:bg-[#06b6d4] text-white">
                  Inactive
                </TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-[#06b6d4] text-white">
                  Business
                </TabsTrigger>
                <TabsTrigger value="individual" className="data-[state=active]:bg-[#06b6d4] text-white">
                  Individual
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-8 bg-[#2a3349] border-0 text-white placeholder:text-gray-500 focus-visible:ring-[#06b6d4] w-full sm:w-[200px] md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Button
                  variant="outline"
                  className="border-[#2a3349] bg-[#2a3349] text-white hover:bg-[#3a4359] hover:text-white"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>

                <Button
                  variant="outline"
                  className="border-[#2a3349] bg-[#2a3349] text-white hover:bg-[#3a4359] hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a3349]">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                      Client
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Contact</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("appointments")}>
                      Appointments
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("totalSpent")}>
                      Total Spent
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("lastService")}>
                      Last Service
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="border-b border-[#2a3349] hover:bg-[#2a3349]">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full mr-3 ${client.type === "business" ? "bg-amber-500/20" : "bg-blue-500/20"}`}
                          >
                            {client.type === "business" ? (
                              <Building
                                className={`h-5 w-5 ${client.type === "business" ? "text-amber-500" : "text-blue-500"}`}
                              />
                            ) : (
                              <User
                                className={`h-5 w-5 ${client.type === "business" ? "text-amber-500" : "text-blue-500"}`}
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white">{client.name}</div>
                            <div className="text-sm text-gray-400">{client.document}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-500" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-500" />
                            {client.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            client.type === "business"
                              ? "bg-amber-500/20 text-amber-500 border-amber-500"
                              : "bg-blue-500/20 text-blue-500 border-blue-500"
                          }
                        >
                          {client.type === "business" ? "Business" : "Individual"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{client.appointments}</td>
                      <td className="py-3 px-4 text-gray-400">${client.totalSpent.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {client.lastService ? new Date(client.lastService).toLocaleDateString() : "Never"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            client.status === "active"
                              ? "bg-green-500/20 text-green-500 border-green-500"
                              : "bg-gray-500/20 text-gray-400 border-gray-500"
                          }
                        >
                          {client.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                            onClick={() => handleViewDetails(client)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                            onClick={() => handleEditClient(client)}
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">
                      No clients found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Client Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <ClientModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
          }}
          client={selectedClient}
          isEditing={isEditModalOpen}
        />
      )}

      {/* Client Details Modal */}
      {isDetailsModalOpen && selectedClient && (
        <ClientDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          client={selectedClient}
          onEdit={() => {
            setIsDetailsModalOpen(false)
            setIsEditModalOpen(true)
          }}
        />
      )}
    </div>
  )
}
