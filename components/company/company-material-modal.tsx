"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCompanyMaterialsUtils } from "@/hooks/use-company-materials"
import type { Material } from "@/types/material"

interface CompanyMaterialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material?: Material | null
  onSuccess?: () => void
}

export function CompanyMaterialModal({ open, onOpenChange, material, onSuccess }: CompanyMaterialModalProps) {
  const companyId = 1 // Mock company ID
  const { createMaterial, updateMaterial, categories, suppliers } = useCompanyMaterialsUtils(companyId)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
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
  })

  // Reset form when modal opens/closes or material changes
  useEffect(() => {
    if (open) {
      if (material) {
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
          expirationDate: material.expirationDate ? material.expirationDate.split("T")[0] : "",
        })
      } else {
        setFormData({
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
        })
      }
    }
  }, [open, material])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        expirationDate: formData.expirationDate
          ? new Date(formData.expirationDate).toISOString()
          : new Date().toISOString(),
      }

      if (material) {
        await updateMaterial(material.id, data)
      } else {
        await createMaterial(data)
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error saving material:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{material ? "Edit Material" : "Add New Material"}</DialogTitle>
          <DialogDescription>
            {material ? "Update the material information." : "Add a new material to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Material name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Add New Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Material description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                placeholder="e.g., pieces, kg, liters"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleInputChange("barcode", e.target.value)}
                placeholder="Product barcode"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={(e) => handleInputChange("currentStock", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">Min Stock *</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => handleInputChange("minStock", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStock">Max Stock *</Label>
              <Input
                id="maxStock"
                type="number"
                min="0"
                value={formData.maxStock}
                onChange={(e) => handleInputChange("maxStock", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price (R$) *</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", Number.parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange("expirationDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Add New Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierContact">Supplier Contact</Label>
              <Input
                id="supplierContact"
                value={formData.supplierContact}
                onChange={(e) => handleInputChange("supplierContact", e.target.value)}
                placeholder="Phone or email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Storage Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Warehouse A, Shelf B1"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : material ? "Update Material" : "Create Material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
