"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  customer?: any
}

export function CustomerModal({ isOpen, onClose, onSubmit, customer }: CustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    document: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    observations: "",
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        document: customer.document || "",
        company: customer.company || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        observations: customer.observations || "",
      })
    } else {
      setFormData({
        name: "",
        document: "",
        company: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        observations: "",
      })
    }
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(formData)
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Sample companies for the dropdown
  const companies = ["Tech Solutions Ltd", "ABC Consulting", "XYZ Commerce", "Delta Industries", "Omega Services"]

  // Sample states for the dropdown
  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "New Customer"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {customer
              ? "Update the customer information below."
              : "Fill in the information to register a new customer."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">CPF/CNPJ</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => handleChange("document", e.target.value)}
                  placeholder="000.000.000-00"
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Select value={formData.company} onValueChange={(value) => handleChange("company", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {companies.map((company) => (
                    <SelectItem key={company} value={company} className="hover:bg-[#2a3349]">
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Main Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    {states.map((state) => (
                      <SelectItem key={state} value={state} className="hover:bg-[#2a3349]">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange("observations", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white min-h-[80px]"
                placeholder="Additional information about the customer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
