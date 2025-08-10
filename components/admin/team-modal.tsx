"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Building2, User, MapPin, Calendar, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id: number
  name: string
  cnpj: string
  responsible: string
  email: string
  phone: string
  status: number
}

interface Professional {
  id: number
  name: string
  email: string
  phone: string
  companyId: number
  status: string
}

interface Team {
  id?: number
  name: string
  description: string
  companyId: number
  companyName?: string
  leaderId?: number
  leaderName?: string
  membersCount?: number
  status: number
  createdDate?: string
  updatedDate?: string
}

interface TeamModalProps {
  team?: Team
  companies: Company[]
  professionals: Professional[]
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function TeamModal({ team, companies, professionals, onSubmit, onCancel }: TeamModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    companyId: "",
    leaderId: "",
    status: "1",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([])
  const { toast } = useToast()

  // Initialize form data when team prop changes
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        description: team.description || "",
        companyId: team.companyId?.toString() || "",
        leaderId: team.leaderId?.toString() || "",
        status: team.status?.toString() || "1",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        companyId: "",
        leaderId: "",
        status: "1",
      })
    }
  }, [team])

  // Filter professionals based on selected company
  useEffect(() => {
    if (formData.companyId) {
      const companyProfessionals = professionals.filter((prof) => prof.companyId.toString() === formData.companyId)
      setFilteredProfessionals(companyProfessionals)
    } else {
      setFilteredProfessionals(professionals)
    }
  }, [formData.companyId, professionals])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Reset leader when company changes
    if (field === "companyId") {
      setFormData((prev) => ({
        ...prev,
        leaderId: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Team name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.companyId) {
      toast({
        title: "Validation Error",
        description: "Please select a company",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const teamData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        companyId: Number.parseInt(formData.companyId),
        leaderId: formData.leaderId ? Number.parseInt(formData.leaderId) : null,
        status: Number.parseInt(formData.status),
      }

      await onSubmit(teamData)
    } catch (error) {
      console.error("Error submitting team:", error)
      toast({
        title: "Error",
        description: "Failed to save team",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSelectedCompany = () => {
    return companies.find((company) => company.id.toString() === formData.companyId)
  }

  const getSelectedLeader = () => {
    return filteredProfessionals.find((prof) => prof.id.toString() === formData.leaderId)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              {team ? "Update the team's basic information" : "Enter the basic information for the new team"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter team description (optional)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Assignment
            </CardTitle>
            <CardDescription>Select which company this team belongs to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Select value={formData.companyId} onValueChange={(value) => handleInputChange("companyId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.length === 0 ? (
                    <SelectItem value="no-companies" disabled>
                      No companies available
                    </SelectItem>
                  ) : (
                    companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{company.name}</span>
                          <span className="text-sm text-muted-foreground">{company.cnpj}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Company Info */}
            {getSelectedCompany() && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">{getSelectedCompany()?.name}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>CNPJ: {getSelectedCompany()?.cnpj}</p>
                      <p>Responsible: {getSelectedCompany()?.responsible}</p>
                      <p>Email: {getSelectedCompany()?.email}</p>
                    </div>
                  </div>
                  <Badge variant={getSelectedCompany()?.status === 1 ? "default" : "secondary"}>
                    {getSelectedCompany()?.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Leader */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Team Leader
            </CardTitle>
            <CardDescription>Assign a team leader (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leader">Team Leader</Label>
              <Select
                value={formData.leaderId}
                onValueChange={(value) => handleInputChange("leaderId", value)}
                disabled={!formData.companyId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !formData.companyId
                        ? "Select a company first"
                        : filteredProfessionals.length === 0
                          ? "No professionals available"
                          : "Select a team leader"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">No leader assigned</span>
                  </SelectItem>
                  {filteredProfessionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{professional.name}</span>
                        <span className="text-sm text-muted-foreground">{professional.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Leader Info */}
            {getSelectedLeader() && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">{getSelectedLeader()?.name}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Email: {getSelectedLeader()?.email}</p>
                      <p>Phone: {getSelectedLeader()?.phone}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{getSelectedLeader()?.status}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Summary */}
        {team && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Team Summary
              </CardTitle>
              <CardDescription>Current team information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{team.membersCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm text-muted-foreground">
                    {team.createdDate ? new Date(team.createdDate).toLocaleDateString() : "N/A"}
                  </div>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm font-medium">Status</div>
                  <Badge variant={team.status === 1 ? "default" : "secondary"} className="mt-1">
                    {team.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {team ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{team ? "Update Team" : "Create Team"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
