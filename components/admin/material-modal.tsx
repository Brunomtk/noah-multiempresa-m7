"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { companyMaterialsApi } from "@/lib/api/company-materials"
import type { Material, CreateMaterialRequest, UpdateMaterialRequest } from "@/types/material"
import { useToast } from "@/hooks/use-toast"

interface MaterialModalProps {
  children: React.ReactNode
  material?: Material
  onSuccess?: () => void
}

const initialFormData = {
  name: "",
  description: "",
  category: "",
  unit: "",
  currentStock: 0,
  minStock: 0,
  maxStock: 0,
  unitPrice: 0,
  supplier: "",
  supplierContact: "",
  barcode: "",
  location: "",
  expirationDate: "",
  status: "1",
  companyId: 1, // Assuming a default or logged-in user's companyId
}

export function MaterialModal({ children, material, onSuccess }: MaterialModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const { toast } = useToast()

  useEffect(() => {
    if (material && open) {
      setFormData({
        name: material.name,
        description: material.description,
        category: material.category,
        unit: material.unit,
        currentStock: material.currentStock,
        minStock: material.minStock,
        maxStock: material.maxStock,
        unitPrice: material.unitPrice,
        supplier: material.supplier,
        supplierContact: material.supplierContact,
        barcode: material.barcode,
        location: material.location,
        expirationDate: material.expirationDate.split("T")[0], // Format for <input type="date">
        status: String(material.status),
        companyId: material.companyId,
      })
    } else if (!material && open) {
      setFormData(initialFormData)
    }
  }, [material, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (material) {
        const updateData: UpdateMaterialRequest = {
          ...formData,
          currentStock: Number(formData.currentStock),
          minStock: Number(formData.minStock),
          maxStock: Number(formData.maxStock),
          unitPrice: Number(formData.unitPrice),
        }
        await companyMaterialsApi.update(material.id, updateData)
        toast({ title: "Success", description: "Material updated successfully" })
      } else {
        const createData: CreateMaterialRequest = {
          ...formData,
          currentStock: Number(formData.currentStock),
          minStock: Number(formData.minStock),
          maxStock: Number(formData.maxStock),
          unitPrice: Number(formData.unitPrice),
          companyId: Number(formData.companyId),
        }
        await companyMaterialsApi.create(createData)
        toast({ title: "Success", description: "Material created successfully" })
      }
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#06b6d4]" />
            {material ? "Edit Material" : "Add New Material"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {material ? "Update the material information." : "Fill in the details to add a new material."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349]"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349]"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unit">Unit *</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">Unit Price *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange("unitPrice", Number(e.target.value) || 0)}
                  className="bg-[#0f172a] border-[#2a3349]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentStock">Current Stock *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) => handleInputChange("currentStock", Number(e.target.value) || 0)}
                  className="bg-[#0f172a] border-[#2a3349]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="minStock">Min Stock *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", Number(e.target.value) || 0)}
                  className="bg-[#0f172a] border-[#2a3349]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxStock">Max Stock</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) => handleInputChange("maxStock", Number(e.target.value) || 0)}
                  className="bg-[#0f172a] border-[#2a3349]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange("supplier", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="supplierContact">Supplier Contact</Label>
                <Input
                  id="supplierContact"
                  value={formData.supplierContact}
                  onChange={(e) => handleInputChange("supplierContact", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349]"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#2a3349] hover:bg-[#2a3349] hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              {loading ? "Saving..." : material ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
