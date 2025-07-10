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

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  team?: any
}

export function TeamModal({ isOpen, onClose, onSubmit, team }: TeamModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    leader: "",
    region: "",
    members: "0",
    status: "active",
    description: "",
  })

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        leader: team.leader || "",
        region: team.region || "",
        members: team.members?.toString() || "0",
        status: team.status || "active",
        description: team.description || "",
      })
    } else {
      setFormData({
        name: "",
        leader: "",
        region: "",
        members: "0",
        status: "active",
        description: "",
      })
    }
  }, [team])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit({
      ...formData,
      members: Number.parseInt(formData.members),
    })
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Sample leaders for the dropdown
  const leaders = [
    "Maria Silva",
    "João Santos",
    "Ana Oliveira",
    "Carlos Mendes",
    "Patricia Costa",
    "Roberto Alves",
    "Fernanda Lima",
  ]

  // Sample regions for the dropdown
  const regions = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "New Team"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {team ? "Update the team information below." : "Fill in the information to create a new team."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="leader">Team Leader</Label>
              <Select value={formData.leader} onValueChange={(value) => handleChange("leader", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a leader" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                  {leaders.map((leader) => (
                    <SelectItem key={leader} value={leader} className="hover:bg-[#2a3349]">
                      {leader}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => handleChange("region", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  {regions.map((region) => (
                    <SelectItem key={region} value={region} className="hover:bg-[#2a3349]">
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="members">Number of Members</Label>
                <Input
                  id="members"
                  type="number"
                  value={formData.members}
                  onChange={(e) => handleChange("members", e.target.value)}
                  min="0"
                  max="50"
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

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white min-h-[80px]"
                placeholder="Team description and specializations"
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
