"use client"

import { useState } from "react"
import { Package, Pencil, Trash2 } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MaterialDetailsModal({ children, material }) {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    setIsEditing(false)
  }

  const handleDelete = () => {
    // Handle delete logic here
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#06b6d4]" />
            Material Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">View and manage material information.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0f172a]">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">Usage History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-4">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="edit-name"
                      defaultValue={material.name}
                      className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-category" className="text-right">
                      Category
                    </Label>
                    <Select defaultValue={material.category.toLowerCase()}>
                      <SelectTrigger id="edit-category" className="col-span-3 bg-[#0f172a] border-[#2a3349]">
                        <SelectValue />
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
                    <Label htmlFor="edit-stock" className="text-right">
                      Stock
                    </Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      min="0"
                      defaultValue={material.stock}
                      className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-unit" className="text-right">
                      Unit
                    </Label>
                    <Input
                      id="edit-unit"
                      defaultValue={material.unit}
                      className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-price" className="text-right">
                      Price ($)
                    </Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={material.price}
                      className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-company" className="text-right">
                      Company
                    </Label>
                    <Select defaultValue={material.company.replace(/\s+/g, "").toLowerCase()}>
                      <SelectTrigger id="edit-company" className="col-span-3 bg-[#0f172a] border-[#2a3349]">
                        <SelectValue />
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
                    <Label htmlFor="edit-description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      defaultValue={material.description}
                      className="col-span-3 bg-[#0f172a] border-[#2a3349]"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-[#2a3349] hover:bg-[#2a3349] hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square rounded-md overflow-hidden bg-[#0f172a] flex items-center justify-center">
                      <img
                        src={material.image || "/placeholder.svg"}
                        alt={material.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">{material.name}</h3>
                      <p className="text-sm text-gray-400">{material.category}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Stock:</span>
                        <span className="text-white">
                          {material.stock} {material.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white">${material.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Company:</span>
                        <span className="text-white">{material.company}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white">{material.lastUpdated}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                      <p className="text-sm text-white">{material.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          This action cannot be undone. This will permanently delete the material from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-[#2a3349] hover:bg-[#2a3349] hover:text-white"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              <div className="bg-[#0f172a] border border-[#2a3349] rounded-md p-4">
                <h4 className="text-sm font-medium text-white mb-2">Usage Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Used (Last 30 Days):</span>
                    <span className="text-white">45 {material.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Average Monthly Usage:</span>
                    <span className="text-white">52 {material.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Restock Frequency:</span>
                    <span className="text-white">Every 2 months</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Recent Transactions</h4>
                <div className="bg-[#0f172a] border border-[#2a3349] rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2a3349]">
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Date</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Type</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Quantity</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">User</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#2a3349]">
                        <td className="px-4 py-2 text-white">2023-05-15</td>
                        <td className="px-4 py-2 text-green-500">Restock</td>
                        <td className="px-4 py-2 text-white">+50 {material.unit}</td>
                        <td className="px-4 py-2 text-white">Admin User</td>
                      </tr>
                      <tr className="border-b border-[#2a3349]">
                        <td className="px-4 py-2 text-white">2023-05-12</td>
                        <td className="px-4 py-2 text-red-500">Used</td>
                        <td className="px-4 py-2 text-white">-8 {material.unit}</td>
                        <td className="px-4 py-2 text-white">John Cleaner</td>
                      </tr>
                      <tr className="border-b border-[#2a3349]">
                        <td className="px-4 py-2 text-white">2023-05-10</td>
                        <td className="px-4 py-2 text-red-500">Used</td>
                        <td className="px-4 py-2 text-white">-12 {material.unit}</td>
                        <td className="px-4 py-2 text-white">Maria Sanchez</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-white">2023-05-05</td>
                        <td className="px-4 py-2 text-red-500">Used</td>
                        <td className="px-4 py-2 text-white">-10 {material.unit}</td>
                        <td className="px-4 py-2 text-white">David Johnson</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
