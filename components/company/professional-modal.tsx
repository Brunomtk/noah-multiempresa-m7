"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

interface ProfessionalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  professional?: any
}

export function ProfessionalModal({ isOpen, onClose, onSubmit, professional }: ProfessionalModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    name: "",
    document: "",
    phone: "",
    email: "",
    address: "",
    birthDate: "",
    gender: "",
    team: "",
    shift: "",
    role: "",
    startDate: "",
    status: "active",
    skills: [] as string[],
    certifications: [] as string[],
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
    avatar: "",
  })

  // Sample teams
  const teams = ["Alpha Team", "Beta Team", "Gamma Team", "Delta Team", "Special Operations"]

  // Sample shifts
  const shifts = ["Morning (6AM-2PM)", "Afternoon (2PM-10PM)", "Evening (10PM-6AM)", "Flexible"]

  // Sample roles
  const roles = ["Cleaner", "Senior Cleaner", "Team Leader", "Supervisor", "Specialist"]

  // Sample skills
  const availableSkills = [
    "Regular Cleaning",
    "Deep Cleaning",
    "Window Cleaning",
    "Carpet Cleaning",
    "Floor Polishing",
    "Sanitization",
    "Post-construction Cleaning",
    "Commercial Cleaning",
    "Residential Cleaning",
    "Equipment Maintenance",
  ]

  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name || "",
        document: professional.document || "",
        phone: professional.phone || "",
        email: professional.email || "",
        address: professional.address || "",
        birthDate: professional.birthDate || "",
        gender: professional.gender || "",
        team: professional.team || "",
        shift: professional.shift || "",
        role: professional.role || "",
        startDate: professional.startDate || "",
        status: professional.status || "active",
        skills: professional.skills || [],
        certifications: professional.certifications || [],
        emergencyContact: professional.emergencyContact || "",
        emergencyPhone: professional.emergencyPhone || "",
        notes: professional.notes || "",
        avatar: professional.avatar || "",
      })
    } else {
      setFormData({
        name: "",
        document: "",
        phone: "",
        email: "",
        address: "",
        birthDate: "",
        gender: "",
        team: "",
        shift: "",
        role: "",
        startDate: "",
        status: "active",
        skills: [],
        certifications: [],
        emergencyContact: "",
        emergencyPhone: "",
        notes: "",
        avatar: "",
      })
    }
  }, [professional])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(formData)
    setIsLoading(false)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillToggle = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== skill),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
  }

  const handleAddCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""],
    }))
  }

  const handleUpdateCertification = (index: number, value: string) => {
    const updatedCertifications = [...formData.certifications]
    updatedCertifications[index] = value
    setFormData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }))
  }

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{professional ? "Edit Professional" : "New Professional"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {professional
              ? "Update the professional's information below."
              : "Fill in the information to add a new professional."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-[#0f172a] border border-[#2a3349]">
              <TabsTrigger value="personal" className="data-[state=active]:bg-[#2a3349]">
                Personal
              </TabsTrigger>
              <TabsTrigger value="professional" className="data-[state=active]:bg-[#2a3349]">
                Professional
              </TabsTrigger>
              <TabsTrigger value="additional" className="data-[state=active]:bg-[#2a3349]">
                Additional
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-20 w-20 mb-2 border-2 border-[#2a3349]">
                  {formData.avatar ? (
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                  ) : (
                    <AvatarFallback className="bg-[#2a3349] text-[#06b6d4] text-xl">
                      {formData.name
                        ? formData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 border-[#2a3349] text-white hover:bg-[#2a3349]"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>

              <div className="grid gap-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="document">Document (ID/CPF)</Label>
                    <Input
                      id="document"
                      value={formData.document}
                      onChange={(e) => handleChange("document", e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange("birthDate", e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
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
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                      <SelectItem value="male" className="hover:bg-[#2a3349]">
                        Male
                      </SelectItem>
                      <SelectItem value="female" className="hover:bg-[#2a3349]">
                        Female
                      </SelectItem>
                      <SelectItem value="other" className="hover:bg-[#2a3349]">
                        Other
                      </SelectItem>
                      <SelectItem value="prefer-not-to-say" className="hover:bg-[#2a3349]">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="team">Team</Label>
                    <Select value={formData.team} onValueChange={(value) => handleChange("team", value)}>
                      <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                        <SelectValue placeholder="Select team" />
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
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                      <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                        {roles.map((role) => (
                          <SelectItem key={role} value={role} className="hover:bg-[#2a3349]">
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select value={formData.shift} onValueChange={(value) => handleChange("shift", value)}>
                      <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2234] border-[#2a3349] text-white">
                        {shifts.map((shift) => (
                          <SelectItem key={shift} value={shift} className="hover:bg-[#2a3349]">
                            {shift}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status</Label>
                    <Switch
                      id="status"
                      checked={formData.status === "active"}
                      onCheckedChange={(checked) => handleChange("status", checked ? "active" : "inactive")}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    {formData.status === "active"
                      ? "This professional is active and can be assigned to services."
                      : "This professional is inactive and cannot be assigned to services."}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>Skills & Specializations</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSkills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                          className="border-[#2a3349] data-[state=checked]:bg-[#06b6d4] data-[state=checked]:border-[#06b6d4]"
                        />
                        <label
                          htmlFor={`skill-${skill}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Certifications</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCertification}
                      className="h-8 border-[#2a3349] text-white hover:bg-[#2a3349]"
                    >
                      Add Certification
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.certifications.length > 0 ? (
                      formData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={cert}
                            onChange={(e) => handleUpdateCertification(index, e.target.value)}
                            placeholder="Certification name"
                            className="bg-[#0f172a] border-[#2a3349] text-white"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCertification(index)}
                            className="h-10 w-10 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            &times;
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No certifications added yet.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleChange("emergencyContact", e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="bg-[#0f172a] border-[#2a3349] text-white min-h-[100px]"
                    placeholder="Additional notes about this professional"
                  />
                </div>
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
            <Button type="submit" disabled={isLoading} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : professional ? (
                "Update Professional"
              ) : (
                "Add Professional"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
