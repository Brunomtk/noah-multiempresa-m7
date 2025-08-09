"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useCustomers } from "@/hooks/use-customers"
import { useCompanies } from "@/hooks/use-companies"
import type { Customer } from "@/types/customer"

interface CustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
}

export function CustomerModal({ open, onOpenChange, customer }: CustomerModalProps) {
  const { createCustomer, updateCustomer, state } = useCustomers()
  const { companies } = useCompanies()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    document: "",
    phone: "",
    address: "",
    companyId: "",
    status: 1,
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        document: customer.document,
        phone: customer.phone || "",
        address: customer.address || "",
        companyId: customer.companyId,
        status: customer.status,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        document: "",
        phone: "",
        address: "",
        companyId: "",
        status: 1,
      })
    }
  }, [customer, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const selectedCompany = companies.find((c) => c.id === formData.companyId)

      const customerData = {
        ...formData,
        company: selectedCompany || null,
      }

      if (customer) {
        await updateCustomer(customer.id, customerData)
      } else {
        await createCustomer(customerData)
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error saving customer:", error)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a2234] border-[#2a3349] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{customer ? "Edit Customer" : "New Customer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-[#0f172a] border-[#2a3349] text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-[#0f172a] border-[#2a3349] text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document" className="text-gray-300">
              Document
            </Label>
            <Input
              id="document"
              value={formData.document}
              onChange={(e) => handleChange("document", e.target.value)}
              className="bg-[#0f172a] border-[#2a3349] text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="bg-[#0f172a] border-[#2a3349] text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-300">
              Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="bg-[#0f172a] border-[#2a3349] text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId" className="text-gray-300">
              Company
            </Label>
            <select
              id="companyId"
              value={formData.companyId}
              onChange={(e) => handleChange("companyId", e.target.value)}
              className="flex h-10 w-full rounded-md border border-[#2a3349] bg-[#0f172a] px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-300">
              Status
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange("status", Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-[#2a3349] bg-[#0f172a] px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-[#0f172a] border-[#2a3349] text-white hover:bg-[#2a3349]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={state.loading} className="bg-[#06b6d4] hover:bg-[#0891b2]">
              {state.loading ? "Saving..." : customer ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
