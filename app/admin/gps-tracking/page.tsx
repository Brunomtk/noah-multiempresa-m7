"use client"

import { useState } from "react"
import { Plus, Search, Eye, Edit, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { GpsTrackingModal } from "@/components/admin/gps-tracking-modal"
import { GpsTrackingDetailsModal } from "@/components/admin/gps-tracking-details-modal"

// Sample data
const initialGpsData = [
  {
    id: "GPS001",
    professional: "John Smith",
    company: "CleanCo Services",
    latitude: 40.7128,
    longitude: -74.006,
    address: "123 Broadway, New York, NY 10001",
    speed: 0,
    status: "active",
    lastUpdate: "2023-05-15T09:30:00",
    vehicle: "Toyota Corolla - ABC1234",
    battery: 85,
    accuracy: 5,
    notes: "On route to client",
  },
  {
    id: "GPS002",
    professional: "Emily Johnson",
    company: "GreenThumb Landscaping",
    latitude: 34.0522,
    longitude: -118.2437,
    address: "456 Hollywood Blvd, Los Angeles, CA 90028",
    speed: 35,
    status: "active",
    lastUpdate: "2023-05-15T10:15:00",
    vehicle: "Ford F-150 - XYZ5678",
    battery: 72,
    accuracy: 8,
    notes: "Heading to next job site",
  },
  {
    id: "GPS003",
    professional: "Michael Brown",
    company: "CleanCo Services",
    latitude: 41.8781,
    longitude: -87.6298,
    address: "789 Michigan Ave, Chicago, IL 60611",
    speed: 0,
    status: "inactive",
    lastUpdate: "2023-05-15T11:00:00",
    vehicle: "Honda Civic - DEF9012",
    battery: 45,
    accuracy: 10,
    notes: "Lunch break",
  },
  {
    id: "GPS004",
    professional: "Sarah Wilson",
    company: "ElectroPro Solutions",
    latitude: 29.7604,
    longitude: -95.3698,
    address: "101 Main St, Houston, TX 77002",
    speed: 28,
    status: "active",
    lastUpdate: "2023-05-15T13:45:00",
    vehicle: "Chevrolet Express - GHI3456",
    battery: 90,
    accuracy: 3,
    notes: "Emergency call",
  },
  {
    id: "GPS005",
    professional: "David Martinez",
    company: "GreenThumb Landscaping",
    latitude: 33.4484,
    longitude: -112.074,
    address: "202 Central Ave, Phoenix, AZ 85004",
    speed: 0,
    status: "active",
    lastUpdate: "2023-05-15T14:30:00",
    vehicle: "Nissan Frontier - JKL7890",
    battery: 65,
    accuracy: 7,
    notes: "At client location",
  },
]

export default function GpsTrackingPage() {
  const [gpsData, setGpsData] = useState(initialGpsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedGps, setSelectedGps] = useState<any>(null)
  const [gpsToDelete, setGpsToDelete] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const { toast } = useToast()

  const handleAddGps = (data: any) => {
    const newGps = {
      id: `GPS${String(gpsData.length + 1).padStart(3, "0")}`,
      ...data,
      lastUpdate: new Date().toISOString(),
    }
    setGpsData([...gpsData, newGps])
    setIsModalOpen(false)
    toast({
      title: "GPS tracking added successfully",
      description: `GPS tracking for ${data.professional} has been added.`,
    })
  }

  const handleEditGps = (data: any) => {
    setGpsData(gpsData.map((gps) => (gps.id === selectedGps.id ? { ...gps, ...data } : gps)))
    setSelectedGps(null)
    setIsModalOpen(false)
    toast({
      title: "GPS tracking updated successfully",
      description: `GPS tracking for ${data.professional} has been updated.`,
    })
  }

  const handleDeleteGps = () => {
    if (gpsToDelete) {
      setGpsData(gpsData.filter((gps) => gps.id !== gpsToDelete.id))
      toast({
        title: "GPS tracking deleted successfully",
        description: `GPS tracking for ${gpsToDelete.professional} has been removed.`,
        variant: "destructive",
      })
      setGpsToDelete(null)
    }
  }

  const handleViewDetails = (gps: any) => {
    setSelectedGps(gps)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (gps: any) => {
    setSelectedGps(gps)
    setIsModalOpen(true)
  }

  const filteredGpsData = gpsData.filter((gps) => {
    const matchesSearch =
      gps.professional.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gps.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gps.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || gps.status === statusFilter
    const matchesCompany = companyFilter === "all" || gps.company === companyFilter
    return matchesSearch && matchesStatus && matchesCompany
  })

  const companies = [...new Set(gpsData.map((gps) => gps.company))]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">GPS Tracking</h1>
            <p className="text-gray-400">Monitor and manage GPS tracking for all professionals across companies.</p>
          </div>
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              setSelectedGps(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add GPS Tracking
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by professional, address, or vehicle..."
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
                <TableHead className="text-white">Professional</TableHead>
                <TableHead className="text-white">Company</TableHead>
                <TableHead className="text-white">Location</TableHead>
                <TableHead className="text-white">Speed</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Last Update</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGpsData.map((gps) => (
                <TableRow key={gps.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#2a3349] p-1.5 rounded-md">
                        <MapPin className="h-4 w-4 text-[#06b6d4]" />
                      </div>
                      <div>
                        <div>{gps.professional}</div>
                        <div className="text-xs text-gray-400">{gps.vehicle}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{gps.company}</TableCell>
                  <TableCell className="text-gray-400">
                    <div className="max-w-[200px]">
                      <div className="truncate">{gps.address}</div>
                      <div className="text-xs">
                        {gps.latitude.toFixed(4)}, {gps.longitude.toFixed(4)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{gps.speed} km/h</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        gps.status === "active" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                      }
                    >
                      {gps.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">{formatDate(gps.lastUpdate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(gps)}
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
                            onClick={() => handleEdit(gps)}
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
                            onClick={() => setGpsToDelete(gps)}
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
            Showing <span className="font-medium text-white">{filteredGpsData.length}</span> of{" "}
            <span className="font-medium text-white">{gpsData.length}</span> GPS tracking records
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

        <GpsTrackingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedGps(null)
          }}
          onSubmit={selectedGps ? handleEditGps : handleAddGps}
          gpsData={selectedGps}
        />

        <GpsTrackingDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedGps(null)
          }}
          gpsData={selectedGps}
        />

        <AlertDialog open={!!gpsToDelete} onOpenChange={() => setGpsToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the GPS tracking record for{" "}
                <span className="font-semibold text-white">{gpsToDelete?.professional}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteGps} className="bg-red-600 hover:bg-red-700 text-white border-0">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
