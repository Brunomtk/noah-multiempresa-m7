"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Package, Edit, Trash2, TrendingUp, Calendar, MapPin, Barcode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MaterialModal } from "@/components/admin/material-modal"
import { companyMaterialsApi } from "@/lib/api/company-materials"
import type { Material } from "@/types/material"
import { useToast } from "@/hooks/use-toast"

interface MaterialDetailsModalProps {
  children: React.ReactNode
  material: Material
  onSuccess?: () => void
}

export function MaterialDetailsModal({ children, material, onSuccess }: MaterialDetailsModalProps) {
  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (open) {
        setLoading(true)
        try {
          const [transactionsData, ordersData] = await Promise.all([
            companyMaterialsApi.getTransactions(material.id),
            companyMaterialsApi.getOrders(material.id),
          ])
          setTransactions(transactionsData)
          setOrders(ordersData)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load additional details.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [open, material.id, toast])

  const handleDelete = async () => {
    try {
      await companyMaterialsApi.delete(material.id)
      toast({ title: "Success", description: "Material deleted successfully" })
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      })
    }
  }

  const getMaterialStatus = () => {
    if (material.currentStock <= 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (material.currentStock <= material.minStock) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  const isNearExpiry = () => {
    const today = new Date()
    const expiry = new Date(material.expirationDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = () => {
    const today = new Date()
    const expiry = new Date(material.expirationDate)
    return expiry < today
  }

  const status = getMaterialStatus()
  const nearExpiry = isNearExpiry()
  const expired = isExpired()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#06b6d4]" />
            Material Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">View and manage material information.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#0f172a]">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="text-xl font-medium text-white">{material.name}</h3>
                    <p className="text-gray-400">{material.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <p className="text-white">{material.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Unit Price:</span>
                      <p className="text-white">${material.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {expired && <Badge variant="destructive">Expired</Badge>}
                    {nearExpiry && !expired && <Badge variant="secondary">Expiring Soon</Badge>}
                    {material.status === 1 ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Stock Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-white">{material.currentStock}</p>
                      <p className="text-sm text-gray-400">Current</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-400">{material.minStock}</p>
                      <p className="text-sm text-gray-400">Minimum</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-400">{material.maxStock}</p>
                      <p className="text-sm text-gray-400">Maximum</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Supplier & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <p className="text-white font-medium">{material.supplier}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-white">{material.location}</p>
                  </div>
                  {material.barcode && (
                    <div className="flex items-center gap-2">
                      <Barcode className="h-4 w-4 text-gray-400" />
                      <p className="text-white font-mono">{material.barcode}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Date Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Expiration</p>
                      <p className="text-white">{new Date(material.expirationDate).toLocaleDateString("en-US")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <MaterialModal material={material} onSuccess={onSuccess}>
                <Button variant="outline" size="sm" className="border-[#2a3349] hover:bg-[#2a3349] bg-transparent">
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              </MaterialModal>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="pt-4">
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Transaction history not available.</p>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="pt-4">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Purchase order history not available.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
