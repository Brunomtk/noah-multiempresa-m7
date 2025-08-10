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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getApiUrl } from "@/lib/api/utils"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  appointment?: any
}

export function AppointmentModal({ isOpen, onClose, onSubmit, appointment }: AppointmentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [professionals, setProfessionals] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [formData, setFormData] = useState({
    companyId: "",
    customerId: "",
    professionalId: "",
    serviceType: "",
    scheduledDate: undefined as Date | undefined,
    scheduledTime: "",
    address: "",
    notes: "",
    status: "1",
  })

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("noah_token")

    if (!token) {
      throw new Error("No authentication token found")
    }

    // Clean endpoint to avoid double /api
    const cleanEndpoint = endpoint.startsWith("/api/") ? endpoint.substring(4) : endpoint
    const url = `${getApiUrl()}/${cleanEndpoint}`

    console.log("Making API call to:", url)

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen])

  useEffect(() => {
    if (appointment) {
      setFormData({
        companyId: appointment.companyId?.toString() || "",
        customerId: appointment.customerId?.toString() || "",
        professionalId: appointment.professionalId?.toString() || "",
        serviceType: appointment.serviceType || "",
        scheduledDate: appointment.scheduledDate ? new Date(appointment.scheduledDate) : undefined,
        scheduledTime: appointment.scheduledTime || "",
        address: appointment.address || "",
        notes: appointment.notes || "",
        status: appointment.status?.toString() || "1",
      })
    } else {
      setFormData({
        companyId: "",
        customerId: "",
        professionalId: "",
        serviceType: "",
        scheduledDate: undefined,
        scheduledTime: "",
        address: "",
        notes: "",
        status: "1",
      })
    }
  }, [appointment])

  const loadInitialData = async () => {
    setLoadingData(true)
    try {
      const [companiesData, customersData, professionalsData] = await Promise.all([
        apiCall("Companies/paged?PageNumber=1&PageSize=100"),
        apiCall("Customer?PageNumber=1&PageSize=100"),
        apiCall("Professional?PageNumber=1&PageSize=100"),
      ])

      setCompanies(companiesData.result || companiesData.results || [])
      setCustomers(customersData.result || customersData.results || [])
      setProfessionals(professionalsData.result || professionalsData.results || [])
    } catch (error) {
      console.error("Error loading initial data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const appointmentData = {
        companyId: Number.parseInt(formData.companyId),
        customerId: Number.parseInt(formData.customerId),
        professionalId: Number.parseInt(formData.professionalId),
        serviceType: formData.serviceType,
        scheduledDate: formData.scheduledDate?.toISOString(),
        scheduledTime: formData.scheduledTime,
        address: formData.address,
        notes: formData.notes,
        status: Number.parseInt(formData.status),
      }

      await onSubmit(appointmentData)
    } catch (error) {
      console.error("Error submitting appointment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment ? "Edit Appointment" : "New Appointment"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {appointment
              ? "Update the appointment information below."
              : "Fill in the information to create a new appointment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => handleChange("companyId", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder={loadingData ? "Loading..." : "Select a company"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()} className="hover:bg-[#2a3349]">
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => handleChange("customerId", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder={loadingData ? "Loading..." : "Select a customer"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()} className="hover:bg-[#2a3349]">
                        {customer.name || customer.customerName || `Customer #${customer.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="professional">Professional</Label>
                <Select
                  value={formData.professionalId}
                  onValueChange={(value) => handleChange("professionalId", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder={loadingData ? "Loading..." : "Select a professional"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    {professionals.map((professional) => (
                      <SelectItem
                        key={professional.id}
                        value={professional.id.toString()}
                        className="hover:bg-[#2a3349]"
                      >
                        {professional.name || professional.professionalName || `Professional #${professional.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleChange("serviceType", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="residential" className="hover:bg-[#2a3349]">
                      Residential Cleaning
                    </SelectItem>
                    <SelectItem value="commercial" className="hover:bg-[#2a3349]">
                      Commercial Cleaning
                    </SelectItem>
                    <SelectItem value="deep" className="hover:bg-[#2a3349]">
                      Deep Cleaning
                    </SelectItem>
                    <SelectItem value="maintenance" className="hover:bg-[#2a3349]">
                      Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal bg-[#0f172a] border-[#2a3349] text-white hover:bg-[#2a3349]",
                        !formData.scheduledDate && "text-gray-400",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1a2234] border-[#2a3349]" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.scheduledDate}
                      onSelect={(date) => handleChange("scheduledDate", date)}
                      initialFocus
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => handleChange("scheduledTime", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                placeholder="Enter service address"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="1" className="hover:bg-[#2a3349]">
                    Scheduled
                  </SelectItem>
                  <SelectItem value="2" className="hover:bg-[#2a3349]">
                    In Progress
                  </SelectItem>
                  <SelectItem value="3" className="hover:bg-[#2a3349]">
                    Completed
                  </SelectItem>
                  <SelectItem value="0" className="hover:bg-[#2a3349]">
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white min-h-[80px]"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || loadingData}
              className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            >
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
