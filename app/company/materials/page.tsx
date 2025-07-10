"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Plus, BarChart } from "lucide-react"

export default function CompanyMaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // State for different modals
  const [useModalOpen, setUseModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)

  // Function to open the details modal with the selected material
  const openDetailsModal = (material: any) => {
    setSelectedMaterial(material)
    setDetailsModalOpen(true)
  }

  // Function to open the use material modal
  const openUseModal = (material: any) => {
    setSelectedMaterial(material)
    setUseModalOpen(true)
  }

  // Function to open the add material modal
  const openAddModal = (material: any = null) => {
    setSelectedMaterial(material)
    setAddModalOpen(true)
  }

  // Mock data for materials
  const materials = [
    {
      id: 1,
      name: "Cleaning Solution",
      category: "Cleaning",
      quantity: 25,
      unit: "Liters",
      status: "In Stock",
      lastUsed: "2023-05-20",
    },
    {
      id: 2,
      name: "Microfiber Cloths",
      category: "Cleaning",
      quantity: 150,
      unit: "Pieces",
      status: "In Stock",
      lastUsed: "2023-05-22",
    },
    {
      id: 3,
      name: "Disinfectant Spray",
      category: "Cleaning",
      quantity: 8,
      unit: "Bottles",
      status: "Low Stock",
      lastUsed: "2023-05-21",
    },
    {
      id: 4,
      name: "Gloves",
      category: "Safety",
      quantity: 200,
      unit: "Pairs",
      status: "In Stock",
      lastUsed: "2023-05-19",
    },
    {
      id: 5,
      name: "Face Masks",
      category: "Safety",
      quantity: 50,
      unit: "Pieces",
      status: "Low Stock",
      lastUsed: "2023-05-18",
    },
  ]

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Mock transaction history data
  const transactionHistory = [
    { id: 1, type: "in", quantity: 20, date: "2023-05-15", reason: "Initial stock", by: "John Doe" },
    { id: 2, type: "out", quantity: 5, date: "2023-05-18", reason: "Appointment #1234", by: "Jane Smith" },
    { id: 3, type: "in", quantity: 10, date: "2023-05-20", reason: "Restock", by: "John Doe" },
    { id: 4, type: "out", quantity: 3, date: "2023-05-21", reason: "Appointment #1235", by: "Mike Johnson" },
    { id: 5, type: "out", quantity: 2, date: "2023-05-22", reason: "Appointment #1236", by: "Jane Smith" },
  ]

  // Material Usage Modal (Outgoing)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Materials Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => openAddModal()}>
            <Plus className="h-4 w-4" />
            Add Material
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Inventory</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-[200px]"
                  prefix={<Search className="h-4 w-4 text-muted-foreground" />}
                />
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.category}</TableCell>
                    <TableCell>
                      {material.quantity} {material.unit}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={material.status === "In Stock" ? "outline" : "destructive"}
                        className={
                          material.status === "In Stock"
                            ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                            : "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                        }
                      >
                        {material.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{material.lastUsed}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openUseModal(material)}>
                        Use
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDetailsModal(material)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between pt-3">
            <div className="text-xs text-muted-foreground">
              Showing {filteredMaterials.length} of {materials.length} materials
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/company/materials/reports">
                <BarChart className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Usage</CardTitle>
              <CardDescription>Recent material consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Cleaning Solution</p>
                    <p className="text-xs text-muted-foreground">Used 5L this week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">20% increase</p>
                    <p className="text-xs text-muted-foreground">vs last week</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Microfiber Cloths</p>
                    <p className="text-xs text-muted-foreground">Used 25 this week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">5% decrease</p>
                    <p className="text-xs text-muted-foreground">vs last week</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Gloves</p>
                    <p className="text-xs text-muted-foreground">Used 30 pairs this week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Same</p>
                    <p className="text-xs text-muted-foreground">vs last week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Orders</CardTitle>
              <CardDescription>Materials scheduled for delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Disinfectant Spray</p>
                    <p className="text-xs text-muted-foreground">Arriving May 28</p>
                  </div>
                  <Badge>Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Face Masks</p>
                    <p className="text-xs text-muted-foreground">Arriving May 30</p>
                  </div>
                  <Badge>Confirmed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Material Usage Modal (Outgoing) */}
      <Dialog open={useModalOpen} onOpenChange={setUseModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Use Material (Inventory Out)</DialogTitle>
            <DialogDescription>Record material consumption for your appointment or task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="material" className="text-right text-sm">
                Material
              </label>
              <div className="col-span-3 font-medium">{selectedMaterial?.name || "Select a material"}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="current-quantity" className="text-right text-sm">
                Current Stock
              </label>
              <div className="col-span-3">
                {selectedMaterial?.quantity || 0} {selectedMaterial?.unit || "units"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right text-sm">
                Quantity Used
              </label>
              <Input
                id="quantity"
                type="number"
                defaultValue="1"
                min="1"
                max={selectedMaterial?.quantity || 1}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reason" className="text-right text-sm">
                Reason
              </label>
              <Select defaultValue="appointment">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="damaged">Damaged/Expired</SelectItem>
                  <SelectItem value="transfer">Transfer to Another Location</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="appointment" className="text-right text-sm">
                Appointment
              </label>
              <Select defaultValue="">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select appointment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app-1">Residential Cleaning #1242</SelectItem>
                  <SelectItem value="app-2">Office Cleaning #1243</SelectItem>
                  <SelectItem value="app-3">Deep Cleaning #1244</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right text-sm">
                Notes
              </label>
              <Input id="notes" placeholder="Optional notes about usage" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUseModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUseModalOpen(false)}>Record Usage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Material Modal (Incoming) */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Material (Inventory In)</DialogTitle>
            <DialogDescription>Record new materials added to your inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="material" className="text-right text-sm">
                Material
              </label>
              {selectedMaterial ? (
                <div className="col-span-3 font-medium">{selectedMaterial.name}</div>
              ) : (
                <Select defaultValue="">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning-solution">Cleaning Solution</SelectItem>
                    <SelectItem value="microfiber">Microfiber Cloths</SelectItem>
                    <SelectItem value="disinfectant">Disinfectant Spray</SelectItem>
                    <SelectItem value="gloves">Gloves</SelectItem>
                    <SelectItem value="masks">Face Masks</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="current-quantity" className="text-right text-sm">
                Current Stock
              </label>
              <div className="col-span-3">
                {selectedMaterial?.quantity || 0} {selectedMaterial?.unit || "units"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right text-sm">
                Quantity Added
              </label>
              <Input id="quantity" type="number" defaultValue="1" min="1" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="source" className="text-right text-sm">
                Source
              </label>
              <Select defaultValue="purchase">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">New Purchase</SelectItem>
                  <SelectItem value="transfer">Transfer from Another Location</SelectItem>
                  <SelectItem value="return">Returned Unused</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="invoice" className="text-right text-sm">
                Invoice #
              </label>
              <Input id="invoice" placeholder="Optional invoice number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="cost" className="text-right text-sm">
                Cost
              </label>
              <Input id="cost" type="number" placeholder="0.00" step="0.01" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="expiry" className="text-right text-sm">
                Expiry Date
              </label>
              <Input id="expiry" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right text-sm">
                Notes
              </label>
              <Input id="notes" placeholder="Optional notes" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddModalOpen(false)}>Add to Inventory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Details Modal with Transaction History */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Material Details</DialogTitle>
            <DialogDescription>Complete information and transaction history.</DialogDescription>
          </DialogHeader>

          {selectedMaterial && (
            <div className="space-y-6">
              {/* Material Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p>{selectedMaterial.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p>{selectedMaterial.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Current Stock</h3>
                  <p>
                    {selectedMaterial.quantity} {selectedMaterial.unit}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge
                    variant={selectedMaterial.status === "In Stock" ? "outline" : "destructive"}
                    className={
                      selectedMaterial.status === "In Stock"
                        ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        : "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                    }
                  >
                    {selectedMaterial.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Used</h3>
                  <p>{selectedMaterial.lastUsed}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Minimum Stock Level</h3>
                  <p>10 {selectedMaterial.unit}</p>
                </div>
              </div>

              {/* Transaction History */}
              <div>
                <h3 className="text-sm font-medium mb-2">Transaction History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Recorded By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionHistory.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              transaction.type === "in"
                                ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                                : "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                            }
                          >
                            {transaction.type === "in" ? "IN" : "OUT"}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>{transaction.reason}</TableCell>
                        <TableCell>{transaction.by}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Usage Analytics */}
              <div>
                <h3 className="text-sm font-medium mb-2">Usage Analytics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-muted-foreground">Monthly Average</p>
                    <p className="text-lg font-medium">15 {selectedMaterial.unit}</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-muted-foreground">Reorder Frequency</p>
                    <p className="text-lg font-medium">Every 45 days</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-muted-foreground">Cost per Unit</p>
                    <p className="text-lg font-medium">$2.50</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => openUseModal(selectedMaterial)}>
                Record Usage
              </Button>
              <Button variant="outline" onClick={() => openAddModal(selectedMaterial)}>
                Add Stock
              </Button>
            </div>
            <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
