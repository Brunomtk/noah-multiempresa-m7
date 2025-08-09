"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  User,
  Users,
  Building,
  Calendar,
  Phone,
  Mail,
  Filter,
  Download,
  ArrowUpDown,
  Trash2,
} from "lucide-react"
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
import ClientModal from "@/components/company/client-modal"
import ClientDetailsModal from "@/components/company/client-details-modal"
import { useAuth } from "@/contexts/auth-context"
import { customersApi } from "@/lib/api/customers"
import { toast } from "@/components/ui/use-toast"
import type { Customer } from "@/types/customer"

export default function ClientsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentTab, setCurrentTab] = useState("all")

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Customer | null>(null)

  // Delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      if (!user?.companyId) return

      try {
        setLoading(true)
        const response = await customersApi.getAll({
          companyId: user.companyId.toString(),
          pageNumber: 1,
          pageSize: 100,
        })
        setClients(response.data || [])
      } catch (error) {
        console.error("Error fetching clients:", error)
        toast({
          title: "Error",
          description: "Failed to load clients",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [user?.companyId])

  // Transform Customer to Client format for compatibility
  const transformedClients = clients.map((customer) => ({
    id: Number.parseInt(customer.id),
    name: customer.name,
    type: customer.document.includes("/") ? "business" : "individual",
    document: customer.document,
    email: customer.email,
    phone: customer.phone,
    addresses: [
      {
        id: 1,
        street: customer.address,
        city: "City", // API doesn't provide separate city
        state: "State", // API doesn't provide separate state
        zipCode: "00000", // API doesn't provide zipCode
        isDefault: true,
      },
    ],
    appointments: 0, // Would need to fetch from appointments API
    totalSpent: 0, // Would need to calculate from appointments
    lastService: null, // Would need to fetch from appointments API
    status: customer.status === 1 ? "active" : "inactive",
    createdAt: customer.createdDate,
    notes: "",
  }))

  // Filter and sort clients
  const filteredClients = transformedClients
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
          ? new Date(a.lastService).getTime() - new Date(b.lastService).getTime()
          : new Date(b.lastService).getTime() - new Date(a.lastService).getTime()
      }
      return 0
    })

  // Statistics
  const totalClients = transformedClients.length
  const activeClients = transformedClients.filter((c) => c.status === "active").length
  const businessClients = transformedClients.filter((c) => c.type === "business").length
  const individualClients = transformedClients.filter((c) => c.type === "individual").length
  const totalAppointments = transformedClients.reduce((sum, client) => sum + client.appointments, 0)
  const totalRevenue = transformedClients.reduce((sum, client) => sum + client.totalSpent, 0)

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle client selection for details or edit
  const handleViewDetails = (client: any) => {
    setSelectedClient(client)
    setIsDetailsModalOpen(true)
  }

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setIsEditModalOpen(true)
  }

  const handleAddClient = () => {
    setSelectedClient(null)
    setIsAddModalOpen(true)
  }

  // Handle delete client
  const handleDeleteClient = (client: any) => {
    setClientToDelete(client)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return

    try {
      setIsDeleting(true)
      await customersApi.delete(clientToDelete.id)

      // Remove client from local state
      setClients((prev) => prev.filter((c) => Number.parseInt(c.id) !== clientToDelete.id))

      toast({
        title: "Client deleted",
        description: `${clientToDelete.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting client:", error)
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setClientToDelete(null)
    }
  }

  // Handle client creation/update
  const handleClientSaved = async () => {
    // Refresh clients list
    if (!user?.companyId) return

    try {
      const response = await customersApi.getAll({
        companyId: user.companyId.toString(),
        pageNumber: 1,
        pageSize: 100,
      })
      setClients(response.data || [])
    } catch (error) {
      console.error("Error refreshing clients:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading clients...</div>
      </div>
    )
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
              {totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}% of total clients
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center">
              <Building className="h-5 w-5 mr-2 text-amber-500" />
              Business Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{businessClients}</div>
            <p className="text-gray-400 text-sm">{individualClients} individual clients</p>
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
            <p className="text-gray-400 text-sm">
              Avg {totalClients > 0 ? (totalAppointments / totalClients).toFixed(1) : 0} per client
            </p>
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
                            className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                            onClick={() => handleViewDetails(client)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                            onClick={() => handleEditClient(client)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500 bg-transparent"
                            onClick={() => handleDeleteClient(client)}
                          >
                            <Trash2 className="h-3 w-3" />
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
          onSaved={handleClientSaved}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a2234] border-[#2a3349]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Client</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <span className="font-medium text-white">{clientToDelete?.name}</span>?
              This action cannot be undone and will permanently remove all client data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClient}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Client"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
