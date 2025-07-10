"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, User, Eye, Edit, Trash2, History } from "lucide-react"
import { CustomerModal } from "@/components/admin/customer-modal"
import { CustomerDetailsModal } from "@/components/admin/customer-details-modal"
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
const initialCustomers = [
  {
    id: 1,
    name: "John Smith",
    document: "123.456.789-00",
    company: "Tech Solutions Ltd",
    phone: "(11) 98765-4321",
    email: "john.smith@email.com",
    status: "active",
    address: "123 Main St, Downtown",
    city: "New York",
    state: "NY",
    observations: "VIP customer, prefers morning appointments",
  },
  {
    id: 2,
    name: "Mary Johnson",
    document: "987.654.321-00",
    company: "ABC Consulting",
    phone: "(11) 91234-5678",
    email: "mary.johnson@email.com",
    status: "active",
    address: "456 Oak Ave, Westside",
    city: "Los Angeles",
    state: "CA",
    observations: "",
  },
  {
    id: 3,
    name: "Charles Brown",
    document: "456.789.012-34",
    company: "XYZ Commerce",
    phone: "(11) 94567-8901",
    email: "charles.brown@email.com",
    status: "inactive",
    address: "789 Pine St, Eastside",
    city: "Chicago",
    state: "IL",
    observations: "Requires special cleaning products",
  },
  {
    id: 4,
    name: "Anna Davis",
    document: "345.678.901-23",
    company: "Delta Industries",
    phone: "(11) 93456-7890",
    email: "anna.davis@email.com",
    status: "active",
    address: "101 Maple Dr, Northside",
    city: "Houston",
    state: "TX",
    observations: "",
  },
  {
    id: 5,
    name: "Robert Wilson",
    document: "567.890.123-45",
    company: "Omega Services",
    phone: "(11) 95678-9012",
    email: "robert.wilson@email.com",
    status: "active",
    address: "202 Elm St, Southside",
    city: "Miami",
    state: "FL",
    observations: "Has pets, needs extra care",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerToDelete, setCustomerToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const handleAddCustomer = (data: any) => {
    const newCustomer = {
      id: customers.length + 1,
      ...data,
      status: "active",
    }
    setCustomers([...customers, newCustomer])
    setIsModalOpen(false)
    toast({
      title: "Customer added successfully",
      description: `${data.name} has been added to the system.`,
    })
  }

  const handleEditCustomer = (data: any) => {
    setCustomers(
      customers.map((customer) => (customer.id === selectedCustomer.id ? { ...customer, ...data } : customer)),
    )
    setSelectedCustomer(null)
    setIsModalOpen(false)
    toast({
      title: "Customer updated successfully",
      description: `${data.name} has been updated.`,
    })
  }

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((customer) => customer.id !== customerToDelete.id))
      toast({
        title: "Customer deleted successfully",
        description: `${customerToDelete.name} has been removed from the system.`,
        variant: "destructive",
      })
      setCustomerToDelete(null)
    }
  }

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleViewHistory = (customer: any) => {
    toast({
      title: "Appointment History",
      description: `Viewing appointment history for ${customer.name}`,
    })
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.document.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Customer Management</h1>
            <p className="text-gray-400">Manage all customers in the system.</p>
          </div>
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              setSelectedCustomer(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Customer
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, document or email..."
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
              variant={statusFilter === "active" ? "default" : "outline"}
              onClick={() => setStatusFilter("active")}
              className={
                statusFilter === "active"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
              }
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "outline"}
              onClick={() => setStatusFilter("inactive")}
              className={
                statusFilter === "inactive"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
              }
            >
              Inactive
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1a2234]">
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Document</TableHead>
                <TableHead className="text-white">Company</TableHead>
                <TableHead className="text-white">Phone</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#2a3349] p-1.5 rounded-md">
                        <User className="h-4 w-4 text-[#06b6d4]" />
                      </div>
                      {customer.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{customer.document}</TableCell>
                  <TableCell className="text-gray-400">{customer.company}</TableCell>
                  <TableCell className="text-gray-400">{customer.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        customer.status === "active" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                      }
                    >
                      {customer.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(customer)}
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
                            onClick={() => handleEdit(customer)}
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
                            onClick={() => handleViewHistory(customer)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View History</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCustomerToDelete(customer)}
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
            Showing <span className="font-medium text-white">{filteredCustomers.length}</span> of{" "}
            <span className="font-medium text-white">{customers.length}</span> customers
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
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
            >
              3
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

        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCustomer(null)
          }}
          onSubmit={selectedCustomer ? handleEditCustomer : handleAddCustomer}
          customer={selectedCustomer}
        />

        <CustomerDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedCustomer(null)
          }}
          customer={selectedCustomer}
        />

        <AlertDialog open={!!customerToDelete} onOpenChange={() => setCustomerToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the customer{" "}
                <span className="font-semibold text-white">{customerToDelete?.name}</span> from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCustomer}
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
