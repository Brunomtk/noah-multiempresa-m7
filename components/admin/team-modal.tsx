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
import { getApiUrl } from "@/lib/api/utils"

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  team?: any
  companies: any[]
  leaders: any[]
}

export function TeamModal({ isOpen, onClose, onSubmit, team, companies }: TeamModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [leaders, setLeaders] = useState<any[]>([])
  const [loadingLeaders, setLoadingLeaders] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    description: "",
    companyId: "",
    leaderId: "",
    status: "1",
  })

  // Helper function to get auth token
  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("noah_token")
    }
    return null
  }

  // Helper function to create headers
  const createHeaders = (): HeadersInit => {
    const token = getAuthToken()
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  // Load leaders when modal opens
  useEffect(() => {
    if (isOpen) {
      loadLeaders()
    }
  }, [isOpen])

  const loadLeaders = async () => {
    setLoadingLeaders(true)

    const endpoints = ["/api/Leader", "/api/Professional", "/api/User", "/api/Users"]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying to load leaders from: ${endpoint}`)
        const response = await fetch(`${getApiUrl()}${endpoint}`, {
          headers: createHeaders(),
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`Successfully loaded from ${endpoint}:`, data)

          let leadersData = []

          if (data.results) {
            leadersData = data.results
          } else if (Array.isArray(data)) {
            leadersData = data
          } else {
            leadersData = [data]
          }

          // Filter for leadership roles if using User endpoints
          if (endpoint.includes("User")) {
            leadersData = leadersData.filter(
              (user: any) =>
                user.role &&
                (user.role.toLowerCase().includes("leader") ||
                  user.role.toLowerCase().includes("manager") ||
                  user.role.toLowerCase().includes("admin") ||
                  user.role.toLowerCase().includes("supervisor")),
            )
          }

          setLeaders(leadersData)
          setLoadingLeaders(false)
          return
        }
      } catch (error) {
        console.log(`Failed to load from ${endpoint}:`, error)
        continue
      }
    }

    console.log("All leader endpoints failed, using empty array")
    setLeaders([])
    setLoadingLeaders(false)
  }

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        region: team.region || "",
        description: team.description || "",
        companyId: team.companyId?.toString() || "",
        leaderId: team.leaderId?.toString() || "",
        status: team.status?.toString() || "1",
      })
    } else {
      setFormData({
        name: "",
        region: "",
        description: "",
        companyId: "",
        leaderId: "",
        status: "1",
      })
    }
  }, [team])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const teamData = {
      name: formData.name,
      region: formData.region,
      description: formData.description,
      companyId: Number.parseInt(formData.companyId),
      leaderId: Number.parseInt(formData.leaderId),
      status: Number.parseInt(formData.status),
    }

    onSubmit(teamData)
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
                placeholder="Enter team name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleChange("region", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white"
                placeholder="Enter region"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Select value={formData.companyId} onValueChange={(value) => handleChange("companyId", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a company" />
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
              <Label htmlFor="leader">Team Leader</Label>
              <Select
                value={formData.leaderId}
                onValueChange={(value) => handleChange("leaderId", value)}
                disabled={loadingLeaders}
              >
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder={loadingLeaders ? "Loading leaders..." : "Select a leader"} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                  {leaders.length > 0 ? (
                    leaders.map((leader) => (
                      <SelectItem key={leader.id} value={leader.id.toString()} className="hover:bg-[#2a3349]">
                        {leader.name || leader.professionalName || leader.username || `Leader #${leader.id}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-leaders" disabled className="hover:bg-[#2a3349]">
                      {loadingLeaders ? "Loading..." : "No leaders available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                  <SelectItem value="1" className="hover:bg-[#2a3349]">
                    Active
                  </SelectItem>
                  <SelectItem value="0" className="hover:bg-[#2a3349]">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="bg-[#0f172a] border-[#2a3349] text-white min-h-[80px]"
                placeholder="Enter team description"
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
