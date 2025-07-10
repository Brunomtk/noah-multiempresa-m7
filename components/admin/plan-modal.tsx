"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  planToEdit?: any
}

export function PlanModal({ isOpen, onClose, planToEdit }: PlanModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isActive, setIsActive] = useState(true)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    if (planToEdit) {
      setName(planToEdit.name || "")
      setDescription(planToEdit.description || "")
      setPrice(planToEdit.price?.toString() || "")
      setBillingCycle(planToEdit.billingCycle || "monthly")
      setIsActive(planToEdit.isActive !== undefined ? planToEdit.isActive : true)
      setFeatures(planToEdit.features || [])
    } else {
      // Reset form for new plan
      setName("")
      setDescription("")
      setPrice("")
      setBillingCycle("monthly")
      setIsActive(true)
      setFeatures([])
    }
  }, [planToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, this would save the plan to the database
    const planData = {
      name,
      description,
      price: Number.parseFloat(price),
      billingCycle,
      isActive,
      features,
    }

    console.log("Plan data:", planData)

    // Close the modal
    onClose()

    // Show success message
    alert(planToEdit ? "Plan updated successfully!" : "Plan created successfully!")
  }

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...features]
    updatedFeatures.splice(index, 1)
    setFeatures(updatedFeatures)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{planToEdit ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          <DialogDescription>
            {planToEdit ? "Update the plan information below." : "Fill in the information to create a new plan."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="billing-cycle" className="text-right">
                Cycle
              </Label>
              <div className="col-span-3">
                <Select value={billingCycle} onValueChange={setBillingCycle} required>
                  <SelectTrigger id="billing-cycle">
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-active" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="is-active">{isActive ? "Plan active" : "Plan inactive"}</Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Features</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addFeature} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {features.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No features added</p>
                  ) : (
                    features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span className="text-sm">{feature}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
