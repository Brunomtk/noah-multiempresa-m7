import type { Metadata } from "next"
import { ArrowDownUp, Calendar, CreditCard, DollarSign, Download, Filter, Plus, RefreshCcw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CompanyPaymentModal } from "@/components/company/company-payment-modal"
import { CompanyPaymentDetailsModal } from "@/components/company/company-payment-details-modal"

export const metadata: Metadata = {
  title: "Payments | Noah Company",
  description: "Manage your company payments",
}

export default function CompanyPaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Payments</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <CompanyPaymentModal>
            <Button size="sm" className="h-9 gap-1">
              <Plus className="h-4 w-4" />
              <span>New Payment</span>
            </Button>
          </CompanyPaymentModal>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-[#06b6d4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$24,560.00</div>
            <p className="text-xs text-gray-400 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$3,840.00</div>
            <p className="text-xs text-gray-400 mt-1">8 payments pending</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Overdue Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$1,250.00</div>
            <p className="text-xs text-gray-400 mt-1">3 payments overdue</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Completed Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$19,470.00</div>
            <p className="text-xs text-gray-400 mt-1">42 payments completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-[#1a2234]">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#2a3349]">
              All
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-[#2a3349]">
              Completed
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-[#2a3349]">
              Pending
            </TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-[#2a3349]">
              Overdue
            </TabsTrigger>
          </TabsList>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search payments..."
                className="w-full bg-[#1a2234] border-[#2a3349] pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 bg-[#1a2234] border-[#2a3349]">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-[#1a2234] border-[#2a3349]">
                <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>Last 3 months</DropdownMenuItem>
                <DropdownMenuItem>Last year</DropdownMenuItem>
                <DropdownMenuItem>All time</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" className="h-9 w-9 bg-[#1a2234] border-[#2a3349]">
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#2a3349] border-[#2a3349]">
                    <TableHead className="text-white">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Invoice
                        <ArrowDownUp className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-white">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Amount
                        <ArrowDownUp className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-white">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Date
                        <ArrowDownUp className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Method</TableHead>
                    <TableHead className="text-white">Client</TableHead>
                    <TableHead className="text-white text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-[#2a3349] border-[#2a3349]">
                      <TableCell className="font-medium text-white">INV-{2023 + i}</TableCell>
                      <TableCell className="text-white">${(Math.random() * 1000).toFixed(2)}</TableCell>
                      <TableCell className="text-white">
                        {new Date(2023, i % 12, (i + 1) * 2).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            i % 3 === 0
                              ? "border-green-500 text-green-500"
                              : i % 3 === 1
                                ? "border-amber-500 text-amber-500"
                                : "border-red-500 text-red-500"
                          }
                        >
                          {i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Overdue"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{i % 2 === 0 ? "Credit Card" : "Bank Transfer"}</TableCell>
                      <TableCell className="text-white">
                        {["Acme Inc", "Globex Corp", "Stark Industries", "Wayne Enterprises", "Umbrella Corp"][i % 5]}
                      </TableCell>
                      <TableCell className="text-right">
                        <CompanyPaymentDetailsModal
                          paymentId={`payment-${i}`}
                          paymentData={{
                            id: `payment-${i}`,
                            invoice: `INV-${2023 + i}`,
                            amount: (Math.random() * 1000).toFixed(2),
                            date: new Date(2023, i % 12, (i + 1) * 2).toLocaleDateString(),
                            status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Overdue",
                            method: i % 2 === 0 ? "Credit Card" : "Bank Transfer",
                            client: [
                              "Acme Inc",
                              "Globex Corp",
                              "Stark Industries",
                              "Wayne Enterprises",
                              "Umbrella Corp",
                            ][i % 5],
                          }}
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Search className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </CompanyPaymentDetailsModal>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-400">
              Showing <strong>1-10</strong> of <strong>53</strong> payments
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8 bg-[#1a2234] border-[#2a3349]">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="h-8 bg-[#1a2234] border-[#2a3349]">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="m-0">
          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardContent className="p-4 text-center text-gray-400">
              <p>Showing completed payments</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="m-0">
          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardContent className="p-4 text-center text-gray-400">
              <p>Showing pending payments</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="m-0">
          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardContent className="p-4 text-center text-gray-400">
              <p>Showing overdue payments</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
