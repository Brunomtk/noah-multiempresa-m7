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
import type { Team, Leader, Company } from "@/types"
import { fetchApi } from "@/lib/api/utils"

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  team?: Team | null
  leaders: Leader[]
}

export function TeamModal({ isOpen, onClose, onSubmit, team, leaders }: TeamModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    leaderId: "",
    region: "",
    description: "",
    status: "active",
    companyId: "",
  })

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        leaderId: team.leaderId?.toString() || "",
        region: team.region || "",
        description: team.description || "",
        status: team.status === 1 ? "active" : "inactive",
        companyId: team.companyId?.toString() || "",
      })
    } else {
      setFormData({
        name: "",
        leaderId: "",
        region: "",
        description: "",
        status: "active",
        companyId: "",
      })
    }
  }, [team])

  // Load companies when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCompanies()
    }
  }, [isOpen])

  const loadCompanies = async () => {
    setLoadingCompanies(true)
    try {
      const response = await fetchApi("/Companies/paged?pageNumber=1&pageSize=100")
      if (response && response.data) {
        setCompanies(response.data)
      }
    } catch (error) {
      console.error("Failed to load companies:", error)
    } finally {
      setLoadingCompanies(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Sample regions for the dropdown
  const regions = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone", "Sudeste", "Sul", "Nordeste"]

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
              <Select value={formData.leaderId} onValueChange={(value) => handleChange("leaderId", value)}>
                <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Select a leader" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                  {leaders.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-gray-400">No leaders available</div>
                  ) : (
                    leaders.map((leader) => (
                      <SelectItem key={leader.id} value={leader.id.toString()} className="hover:bg-[#2a3349]">
                        {leader.name}
                      </SelectItem>
                    ))
                  )}
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
                <Label htmlFor="company">Company</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => handleChange("companyId", value)}
                  disabled={loadingCompanies}
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                    <SelectValue placeholder={loadingCompanies ? "Loading companies..." : "Select a company"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white max-h-[200px]">
                    {loadingCompanies ? (
                      <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading companies...
                      </div>
                    ) : companies.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-gray-400">No companies found</div>
                    ) : (
                      companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()} className="hover:bg-[#2a3349]">
                          {company.name}
                        </SelectItem>
                      ))
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
