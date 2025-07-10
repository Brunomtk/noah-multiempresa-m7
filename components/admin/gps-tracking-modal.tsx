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

interface GpsTrackingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  gpsData?: any
}

export function GpsTrackingModal({ isOpen, onClose, onSubmit, gpsData }: GpsTrackingModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    professional: "",
    company: "",
    latitude: "",
    longitude: "",
    address: "",
    speed: "0",
    status: "active",
    vehicle: "",
    battery: "100",
    accuracy: "5",
    notes: "",
  })

  useEffect(() => {
    if (gpsData) {
      setFormData({
        professional: gpsData.professional || "",
        company: gpsData.company || "",
        latitude: gpsData.latitude?.toString() || "",
        longitude: gpsData.longitude?.toString() || "",
        address: gpsData.address || "",
        speed: gpsData.speed?.toString() || "0",
        status: gpsData.status || "active",
        vehicle: gpsData.vehicle || "",
        battery: gpsData.battery?.toString() || "100",
        accuracy: gpsData.accuracy?.toString() || "5",
        notes: gpsData.notes || "",
      })
    } else {
      setFormData({
        professional: "",
        company: "",
        latitude: "",
        longitude: "",
        address: "",
        speed: "0",
        status: "active",
        vehicle: "",
        battery: "100",
        accuracy: "5",
        notes: "",
      })
    }
  }, [gpsData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit({
      ...formData,
      latitude: Number.parseFloat(formData.latitude),
      longitude: Number.parseFloat(formData.longitude),
      speed: Number.parseInt(formData.speed),
      battery: Number.parseInt(formData.battery),
      accuracy: Number.parseInt(formData.accuracy),
    })
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Sample professionals
  const professionals = [
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Wilson",
    "David Martinez",
    "Jessica Taylor",
    "Robert Anderson",
  ]

  // Sample companies
  const companies = ["CleanCo Services", "GreenThumb Landscaping", "ElectroPro Solutions", "QuickFix Plumbing"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>{gpsData ? "Edit GPS Tracking" : "New GPS Tracking"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {gpsData
              ? "Update the GPS tracking information below."
              : "Fill in the information to add a new GPS tracking record."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="professional">Professional</Label>
                <Select value={formData.professional} onValueChange={(value) => handleChange("professional", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select professional" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    {professionals.map((prof) => (
                      <SelectItem key={prof} value={prof} className="hover:bg-[#2a3349]">
                        {prof}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Select value={formData.company} onValueChange={(value) => handleChange("company", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select company" />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
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
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Input
                  id="vehicle"
                  value={formData.vehicle}
                  onChange={(e) => handleChange("vehicle", e.target.value)}
                  placeholder="e.g., Toyota Corolla - ABC1234"
                  className="bg-[#0f172a] border-[#2a3349] text-white"
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
                    <SelectItem value="active" className="hover:bg-[#2a3349]">
                      Active
                    </SelectItem>
                    <SelectItem value="inactive" className="hover:bg-[#2a3349]">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="speed">Speed (km/h)</Label>
                <Input
                  id="speed"
                  type="number"
                  min="0"
                  value={formData.speed}
                  onChange={(e) => handleChange("speed", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="battery">Battery (%)</Label>
                <Input
                  id="battery"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.battery}
                  onChange={(e) => handleChange("battery", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="accuracy">Accuracy (m)</Label>
                <Input
                  id="accuracy"
                  type="number"
                  min="0"
                  value={formData.accuracy}
                  onChange={(e) => handleChange("accuracy", e.target.value)}
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white min-h-[80px]"
                placeholder="Additional notes or observations"
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
