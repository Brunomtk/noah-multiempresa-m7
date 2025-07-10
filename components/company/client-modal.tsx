"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, MapPin } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Address {
  id?: number
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface Client {
  id?: number
  name: string
  type: "individual" | "business"
  document: string
  email: string
  phone: string
  addresses: Address[]
  status: "active" | "inactive"
  notes?: string
}

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  client?: Client | null
  isEditing?: boolean
}

export default function ClientModal({ isOpen, onClose, client, isEditing = false }: ClientModalProps) {
  const [formData, setFormData] = useState<Client>({
    name: "",
    type: "individual",
    document: "",
    email: "",
    phone: "",
    addresses: [{ street: "", city: "", state: "", zipCode: "", isDefault: true }],
    status: "active",
    notes: "",
  })

  const [currentTab, setCurrentTab] = useState("info")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with client data if editing
  useEffect(() => {
    if (client && isEditing) {
      setFormData({
        ...client,
        // Ensure we have the correct structure
        addresses:
          client.addresses?.length > 0
            ? client.addresses
            : [{ street: "", city: "", state: "", zipCode: "", isDefault: true }],
        notes: client.notes || "",
      })
    }
  }, [client, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleTypeChange = (value: "individual" | "business") => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status: checked ? "active" : "inactive",
    }))
  }

  const handleAddressChange = (index: number, field: keyof Address, value: string | boolean) => {
    setFormData((prev) => {
      const newAddresses = [...prev.addresses]
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: value,
      }
      return {
        ...prev,
        addresses: newAddresses,
      }
    })
  }

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { street: "", city: "", state: "", zipCode: "", isDefault: false }],
    }))
  }

  const handleRemoveAddress = (index: number) => {
    if (formData.addresses.length <= 1) {
      toast({
        title: "Cannot remove address",
        description: "Client must have at least one address",
        variant: "destructive",
      })
      return
    }

    setFormData((prev) => {
      const newAddresses = prev.addresses.filter((_, i) => i !== index)

      // If we removed the default address, make the first one default
      if (prev.addresses[index].isDefault && newAddresses.length > 0) {
        newAddresses[0].isDefault = true
      }

      return {
        ...prev,
        addresses: newAddresses,
      }
    })
  }

  const handleSetDefaultAddress = (index: number) => {
    setFormData((prev) => {
      const newAddresses = prev.addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index,
      }))

      return {
        ...prev,
        addresses: newAddresses,
      }
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.document.trim()) {
      newErrors.document = "Document is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    // Validate addresses
    formData.addresses.forEach((address, index) => {
      if (!address.street.trim()) {
        newErrors[`address_${index}_street`] = "Street is required"
      }
      if (!address.city.trim()) {
        newErrors[`address_${index}_city`] = "City is required"
      }
      if (!address.state.trim()) {
        newErrors[`address_${index}_state`] = "State is required"
      }
      if (!address.zipCode.trim()) {
        newErrors[`address_${index}_zipCode`] = "ZIP code is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // If there are errors in the current tab, switch to that tab
      if (Object.keys(errors).some((key) => key.startsWith("address_"))) {
        setCurrentTab("addresses")
      } else {
        setCurrentTab("info")
      }
      return
    }

    // Here you would typically send the data to your API
    console.log("Submitting client data:", formData)

    toast({
      title: isEditing ? "Client updated" : "Client created",
      description: `${formData.name} has been ${isEditing ? "updated" : "added"} successfully.`,
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a2234] text-white border-[#2a3349] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {isEditing ? "Edit Client" : "Add New Client"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="bg-[#2a3349] mb-4">
              <TabsTrigger value="info" className="data-[state=active]:bg-[#06b6d4] text-white">
                Client Information
              </TabsTrigger>
              <TabsTrigger value="addresses" className="data-[state=active]:bg-[#06b6d4] text-white">
                Addresses
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-[#06b6d4] text-white">
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type" className="text-white">
                    Client Type
                  </Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={handleTypeChange as (value: string) => void}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" className="border-[#06b6d4] text-[#06b6d4]" />
                      <Label htmlFor="individual" className="text-white">
                        Individual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" className="border-[#06b6d4] text-[#06b6d4]" />
                      <Label htmlFor="business" className="text-white">
                        Business
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="name" className="text-white">
                    {formData.type === "individual" ? "Full Name" : "Company Name"}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1"
                    placeholder={formData.type === "individual" ? "John Smith" : "Acme Corporation"}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="document" className="text-white">
                    {formData.type === "individual" ? "CPF" : "CNPJ"}
                  </Label>
                  <Input
                    id="document"
                    name="document"
                    value={formData.document}
                    onChange={handleChange}
                    className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1"
                    placeholder={formData.type === "individual" ? "123.456.789-00" : "12.345.678/0001-90"}
                  />
                  {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1"
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1"
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status === "active"}
                    onCheckedChange={handleStatusChange}
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="status" className="text-white">
                    {formData.status === "active" ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-6 mt-2">
              {formData.addresses.map((address, index) => (
                <div key={index} className="p-4 border border-[#2a3349] rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#06b6d4]" />
                      Address {index + 1}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-[#06b6d4] text-white px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {!address.isDefault && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                          onClick={() => handleSetDefaultAddress(index)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                        onClick={() => handleRemoveAddress(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`address_${index}_street`} className="text-white">
                      Street
                    </Label>
                    <Input
                      id={`address_${index}_street`}
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                      className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1"
                      placeholder="123 Main St"
                    />
                    {errors[`address_${index}_street`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_street`]}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`address_${index}_city`} className="text-white">
                        City
                      </Label>
                      <Input
                        id={`address_${index}_city`}
                        value={address.city}
                        onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                        className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1"
                        placeholder="New York"
                      />
                      {errors[`address_${index}_city`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_city`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`address_${index}_state`} className="text-white">
                        State
                      </Label>
                      <Input
                        id={`address_${index}_state`}
                        value={address.state}
                        onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                        className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1"
                        placeholder="NY"
                      />
                      {errors[`address_${index}_state`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_state`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`address_${index}_zipCode`} className="text-white">
                        ZIP Code
                      </Label>
                      <Input
                        id={`address_${index}_zipCode`}
                        value={address.zipCode}
                        onChange={(e) => handleAddressChange(index, "zipCode", e.target.value)}
                        className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1"
                        placeholder="10001"
                      />
                      {errors[`address_${index}_zipCode`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_zipCode`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-[#2a3349] text-[#06b6d4] hover:bg-[#2a3349] hover:text-[#06b6d4]"
                onClick={handleAddAddress}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Address
              </Button>
            </TabsContent>

            <TabsContent value="notes" className="mt-2">
              <div>
                <Label htmlFor="notes" className="text-white">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="bg-[#2a3349] border-0 text-white focus-visible:ring-[#06b6d4] mt-1 min-h-[150px]"
                  placeholder="Add any additional information about this client..."
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2a3349] text-white hover:bg-[#2a3349]"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              {isEditing ? "Update Client" : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
