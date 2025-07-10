"use client"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function MaterialModal({ children }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#06b6d4]" />
            Add New Material
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to add a new material to the inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter material name"
                className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select required>
                <SelectTrigger id="category" className="col-span-3 bg-[#0f172a] border-[#2a3349]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="Enter quantity"
                className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unit
              </Label>
              <Input
                id="unit"
                placeholder="e.g., bottles, pcs, pairs"
                className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter price"
                className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Select required>
                <SelectTrigger id="company" className="col-span-3 bg-[#0f172a] border-[#2a3349]">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                  <SelectItem value="cleanCo">CleanCo</SelectItem>
                  <SelectItem value="maidPro">MaidPro</SelectItem>
                  <SelectItem value="serviceMaster">ServiceMaster</SelectItem>
                  <SelectItem value="all">All Companies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter material description"
                className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="col-span-3 bg-[#0f172a] border-[#2a3349] file:bg-[#2a3349] file:text-white file:border-0"
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
            <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              Add Material
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
