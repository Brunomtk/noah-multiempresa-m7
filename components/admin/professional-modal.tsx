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
import { Loader2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfessionalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  professional?: any
}

export function ProfessionalModal({ isOpen, onClose, onSubmit, professional }: ProfessionalModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    team: "",
    phone: "",
    email: "",
    shift: "morning",
    weeklyHours: "40",
    status: "active",
    observations: "",
    photo: "",
  })

  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name || "",
        cpf: professional.cpf || "",
        team: professional.team || "",
        phone: professional.phone || "",
        email: professional.email || "",
        shift: professional.shift || "morning",
        weeklyHours: professional.weeklyHours?.toString() || "40",
        status: professional.status || "active",
        observations: professional.observations || "",
        photo: professional.photo || "",
      })
    } else {
      setFormData({
        name: "",
        cpf: "",
        team: "",
        phone: "",
        email: "",
        shift: "morning",
        weeklyHours: "40",
        status: "active",
        observations: "",
        photo: "",
      })
    }
  }, [professional])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit({
      ...formData,
      weeklyHours: Number.parseInt(formData.weeklyHours),
    })
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const photoUrl = URL.createObjectURL(file)
      handleChange("photo", photoUrl)
    }
  }

  const teams = ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{professional ? "Edit Professional" : "New Professional"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {professional
              ? "Update the professional information below."
              : "Fill in the information to register a new professional."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-[#2a3349]">
                  <AvatarImage src={formData.photo || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#2a3349] text-[#06b6d4] text-2xl">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-[#06b6d4] hover:bg-[#0891b2] p-1.5 rounded-full cursor-pointer transition-colors"
                >
                  <Upload className="h-4 w-4 text-white" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

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
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  className="bg-[#0f172a] border-[#2a3349] text-white"
                  required
                />
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="team">Team</Label>
                <Select value={formData.team} onValueChange={(value) => handleChange("team", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    {teams.map((team) => (
                      <SelectItem key={team} value={team} className="hover:bg-[#2a3349]">
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shift">Shift</Label>
                <Select value={formData.shift} onValueChange={(value) => handleChange("shift", value)}>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder="Select a shift" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                    <SelectItem value="morning" className="hover:bg-[#2a3349]">
                      Morning
                    </SelectItem>
                    <SelectItem value="afternoon" className="hover:bg-[#2a3349]">
                      Afternoon
                    </SelectItem>
                    <SelectItem value="night" className="hover:bg-[#2a3349]">
                      Night
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weeklyHours">Weekly Hours</Label>
                <Input
                  id="weeklyHours"
                  type="number"
                  value={formData.weeklyHours}
                  onChange={(e) => handleChange("weeklyHours", e.target.value)}
                  min="1"
                  max="60"
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
                    <SelectItem value="in_service" className="hover:bg-[#2a3349]">
                      In Service
                    </SelectItem>
                    <SelectItem value="on_leave" className="hover:bg-[#2a3349]">
                      On Leave
                    </SelectItem>
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
                placeholder="Additional information about the professional"
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
