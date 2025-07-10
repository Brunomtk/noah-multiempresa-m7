"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CompanyPlanUpgradeModal } from "@/components/company/company-plan-upgrade-modal"
import { CompanyPlanRenewalModal } from "@/components/company/company-plan-renewal-modal"
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CreditCard,
  Download,
  FileText,
  HelpCircle,
  Package,
  RefreshCw,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for the current plan
const currentPlan = {
  id: "plan-123",
  name: "Premium",
  description: "For growing businesses with advanced needs",
  price: 299.99,
  billingCycle: "monthly",
  startDate: "2023-10-15",
  expiryDate: "2024-10-15",
  status: "active",
  autoRenew: true,
  features: [
    "Up to 50 users",
    "Advanced scheduling",
    "Daily reports",
    "Priority support",
    "Calendar integration",
    "Performance analytics",
    "API integration",
  ],
  usedUsers: 32,
  maxUsers: 50,
  usedStorage: 7.5,
  maxStorage: 20,
}

// Mock data for available plans
const availablePlans = [
  {
    id: "plan-001",
    name: "Basic",
    description: "For small businesses just getting started",
    price: 149.99,
    billingCycle: "monthly",
    features: ["Up to 5 users", "Basic scheduling", "Monthly reports", "Email support"],
    popular: false,
  },
  {
    id: "plan-002",
    name: "Standard",
    description: "For established businesses with growing needs",
    price: 199.99,
    billingCycle: "monthly",
    features: [
      "Up to 15 users",
      "Advanced scheduling",
      "Weekly reports",
      "Email and chat support",
      "Calendar integration",
    ],
    popular: false,
  },
  {
    id: "plan-003",
    name: "Premium",
    description: "For growing businesses with advanced needs",
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
    popular: true,
    current: true,
  },
  {
    id: "plan-004",
    name: "Enterprise",
    description: "For large organizations with complex requirements",
    price: 499.99,
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
    popular: false,
  },
]

// Mock data for payment history
const paymentHistory = [
  {
    id: "pay-001",
    date: "2023-10-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2023-001",
  },
  {
    id: "pay-002",
    date: "2023-11-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2023-002",
  },
  {
    id: "pay-003",
    date: "2023-12-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2023-003",
  },
  {
    id: "pay-004",
    date: "2024-01-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2024-001",
  },
  {
    id: "pay-005",
    date: "2024-02-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2024-002",
  },
  {
    id: "pay-006",
    date: "2024-03-15",
    amount: 299.99,
    status: "paid",
    method: "Credit Card",
    invoice: "INV-2024-003",
  },
]

export default function CompanyPlanPage() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  // Calculate days remaining until expiry
  const today = new Date()
  const expiryDate = new Date(currentPlan.expiryDate)
  const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysRemaining <= 30

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleUpgrade = (plan: any) => {
    setSelectedPlan(plan)
    setIsUpgradeModalOpen(true)
  }

  const handleRenewal = () => {
    setIsRenewalModalOpen(true)
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`)
    // In a real app, this would trigger a download
    alert(`Invoice ${invoiceId} download started`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Plan</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRenewal}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Renew Plan
          </Button>
          <Button onClick={() => setIsUpgradeModalOpen(true)}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="current-plan" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current-plan">Current Plan</TabsTrigger>
          <TabsTrigger value="available-plans">Available Plans</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="current-plan" className="space-y-6">
          {isExpiringSoon && (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Plan Expiring Soon</AlertTitle>
              <AlertDescription>
                Your plan will expire in {daysRemaining} days. Please renew your subscription to avoid service
                interruption.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {currentPlan.name} Plan
                    </CardTitle>
                    <CardDescription>{currentPlan.description}</CardDescription>
                  </div>
                  <Badge className="bg-green-500">{currentPlan.status === "active" ? "Active" : "Inactive"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <CreditCard className="h-4 w-4" /> Billing Cycle
                    </p>
                    <p className="text-sm capitalize">{currentPlan.billingCycle}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Start Date
                    </p>
                    <p className="text-sm">{formatDate(currentPlan.startDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Expiry Date
                    </p>
                    <p className="text-sm font-medium text-amber-600">{formatDate(currentPlan.expiryDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <RefreshCw className="h-4 w-4" /> Auto-Renewal
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      {currentPlan.autoRenew ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" /> Enabled
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-500" /> Disabled
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Plan Usage</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> Users
                        </span>
                        <span>
                          {currentPlan.usedUsers} / {currentPlan.maxUsers}
                        </span>
                      </div>
                      <Progress value={(currentPlan.usedUsers / currentPlan.maxUsers) * 100} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Storage (GB)</span>
                        <span>
                          {currentPlan.usedStorage} / {currentPlan.maxStorage}
                        </span>
                      </div>
                      <Progress value={(currentPlan.usedStorage / currentPlan.maxStorage) * 100} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Price</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">R$ {currentPlan.price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground ml-2">/ {currentPlan.billingCycle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Plan Benefits</CardTitle>
                <CardDescription>Features included in your current plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setIsUpgradeModalOpen(true)}>
                  Compare Plans
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
              <CardDescription>Questions about your plan or billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">How do I upgrade my plan?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can upgrade your plan at any time by clicking the "Upgrade Plan" button. The price difference
                    will be prorated.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Is my payment information secure?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we use industry-standard encryption to protect your payment information. We never store your
                    full credit card details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">How does auto-renewal work?</h4>
                  <p className="text-sm text-muted-foreground">
                    With auto-renewal enabled, your plan will automatically renew at the end of your billing cycle. You
                    can disable this at any time.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="available-plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availablePlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-primary" : ""} ${plan.current ? "bg-muted/50" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">
                      <Star className="h-3 w-3 mr-1" /> Most Popular
                    </Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="outline">Current Plan</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground ml-2">/ {plan.billingCycle}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-sm text-muted-foreground">+ {plan.features.length - 4} more features</li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.current ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan)}
                    >
                      {plan.price > currentPlan.price ? "Upgrade" : "Downgrade"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plan Comparison</CardTitle>
              <CardDescription>Compare features across all available plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Feature</TableHead>
                      {availablePlans.map((plan) => (
                        <TableHead key={plan.id} className="text-center">
                          {plan.name}
                          {plan.current && <span className="ml-1 text-xs">(Current)</span>}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Price</TableCell>
                      {availablePlans.map((plan) => (
                        <TableCell key={plan.id} className="text-center">
                          R$ {plan.price.toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Users</TableCell>
                      <TableCell className="text-center">Up to 5</TableCell>
                      <TableCell className="text-center">Up to 15</TableCell>
                      <TableCell className="text-center">Up to 50</TableCell>
                      <TableCell className="text-center">Unlimited</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Storage</TableCell>
                      <TableCell className="text-center">5 GB</TableCell>
                      <TableCell className="text-center">10 GB</TableCell>
                      <TableCell className="text-center">20 GB</TableCell>
                      <TableCell className="text-center">50 GB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Support</TableCell>
                      <TableCell className="text-center">Email</TableCell>
                      <TableCell className="text-center">Email & Chat</TableCell>
                      <TableCell className="text-center">Priority</TableCell>
                      <TableCell className="text-center">24/7 Dedicated</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">API Access</TableCell>
                      <TableCell className="text-center">
                        <X className="h-4 w-4 mx-auto text-red-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-4 w-4 mx-auto text-red-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="h-4 w-4 mx-auto text-green-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="h-4 w-4 mx-auto text-green-500" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Custom Reports</TableCell>
                      <TableCell className="text-center">
                        <X className="h-4 w-4 mx-auto text-red-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-4 w-4 mx-auto text-red-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="h-4 w-4 mx-auto text-green-500" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="h-4 w-4 mx-auto text-green-500" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment History</CardTitle>
              <CardDescription>Record of all your plan payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No payment history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>{payment.invoice}</TableCell>
                          <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                payment.status === "paid"
                                  ? "bg-green-500"
                                  : payment.status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadInvoice(payment.invoice)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Invoice
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Payments</CardTitle>
                <CardDescription>Your next scheduled payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Next Payment</p>
                    <p className="text-sm">April 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-sm">R$ {currentPlan.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm">Credit Card (ending in 1234)</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Billing Information</CardTitle>
                <CardDescription>Your billing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Billing Address</p>
                  <p className="text-sm">123 Business Street</p>
                  <p className="text-sm">São Paulo, SP 01234-567</p>
                  <p className="text-sm">Brazil</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Tax ID (CNPJ)</p>
                    <p className="text-sm">12.345.678/0001-90</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CompanyPlanUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={currentPlan}
        selectedPlan={selectedPlan || availablePlans.find((p) => p.id === "plan-004")}
      />

      <CompanyPlanRenewalModal
        isOpen={isRenewalModalOpen}
        onClose={() => setIsRenewalModalOpen(false)}
        currentPlan={currentPlan}
      />
    </div>
  )
}
