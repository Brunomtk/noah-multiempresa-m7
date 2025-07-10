"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlanModal } from "@/components/admin/plan-modal"
import { PlanDetailsModal } from "@/components/admin/plan-details-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Edit, Plus, Search, Trash, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Mock data for plans
const mockPlans = [
  {
    id: "PLAN-001",
    name: "Basic",
    description: "Basic plan for small businesses",
    price: 149.99,
    billingCycle: "monthly",
    features: ["Up to 5 users", "Basic scheduling", "Monthly reports", "Email support"],
    isActive: true,
    companiesCount: 12,
  },
  {
    id: "PLAN-002",
    name: "Standard",
    description: "Standard plan for growing businesses",
    price: 199.99,
    billingCycle: "monthly",
    features: [
      "Up to 15 users",
      "Advanced scheduling",
      "Weekly reports",
      "Email and chat support",
      "Calendar integration",
    ],
    isActive: true,
    companiesCount: 28,
  },
  {
    id: "PLAN-003",
    name: "Premium",
    description: "Premium plan for established businesses",
    price: 299.99,
    billingCycle: "monthly",
    features: [
      "Up to 50 users",
      "Advanced scheduling",
      "Daily reports",
      "Priority support",
      "Calendar integration",
      "Performance analytics",
      "API integration",
    ],
    isActive: true,
    companiesCount: 15,
  },
  {
    id: "PLAN-004",
    name: "Enterprise",
    description: "Enterprise plan for large organizations",
    price: 399.99,
    billingCycle: "monthly",
    features: [
      "Unlimited users",
      "All features",
      "Custom reports",
      "24/7 support",
      "Dedicated account manager",
      "Advanced API integration",
      "Custom training",
    ],
    isActive: true,
    companiesCount: 8,
  },
  {
    id: "PLAN-005",
    name: "Basic Annual",
    description: "Annual basic plan with discount",
    price: 1499.9,
    billingCycle: "annual",
    features: ["Up to 5 users", "Basic scheduling", "Monthly reports", "Email support"],
    isActive: false,
    companiesCount: 3,
  },
]

// Stats data
const statsData = {
  totalPlans: mockPlans.length,
  activePlans: mockPlans.filter((plan) => plan.isActive).length,
  totalCompanies: mockPlans.reduce((acc, plan) => acc + plan.companiesCount, 0),
  averagePrice: mockPlans.reduce((acc, plan) => acc + plan.price, 0) / mockPlans.length,
}

export default function PlansPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showInactive, setShowInactive] = useState(false)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  // Filter plans based on search query and active status
  const filteredPlans = mockPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = showInactive ? true : plan.isActive

    return matchesSearch && matchesStatus
  })

  const handleOpenDetailsModal = (plan: any) => {
    setSelectedPlan(plan)
    setIsDetailsModalOpen(true)
  }

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan)
    setIsPlanModalOpen(true)
  }

  const handleDeletePlan = (planId: string) => {
    // In a real application, this would delete the plan from the database
    console.log(`Deleting plan ${planId}`)
    // For now, we'll just show an alert
    alert(`Plan ${planId} deleted`)
  }

  const handleTogglePlanStatus = (planId: string, currentStatus: boolean) => {
    // In a real application, this would update the plan status in the database
    console.log(`Toggling plan ${planId} status to ${!currentStatus}`)
    // For now, we'll just show an alert
    alert(`Plan ${planId} status changed to ${!currentStatus ? "active" : "inactive"}`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plan Management</h1>
        <Button
          onClick={() => {
            setSelectedPlan(null)
            setIsPlanModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalPlans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.activePlans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscriber Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalCompanies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {statsData.averagePrice.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plans..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="show-inactive" checked={showInactive} onCheckedChange={setShowInactive} />
          <Label htmlFor="show-inactive">Show inactive plans</Label>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No plans found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                    <TableCell>R$ {plan.price.toFixed(2)}</TableCell>
                    <TableCell>{plan.billingCycle === "monthly" ? "Monthly" : "Annual"}</TableCell>
                    <TableCell>
                      {plan.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {plan.companiesCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDetailsModal(plan)}>
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePlanStatus(plan.id, plan.isActive)}
                        >
                          {plan.isActive ? (
                            <>
                              <Trash className="h-4 w-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        {plan.companiesCount === 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} planToEdit={selectedPlan} />

      {selectedPlan && (
        <PlanDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          plan={selectedPlan}
        />
      )}
    </div>
  )
}
