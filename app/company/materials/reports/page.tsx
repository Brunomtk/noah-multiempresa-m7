"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { CalendarIcon, Download, Filter, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function CompanyMaterialsReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/company/materials">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Material Reports</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245 units</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Used Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Cleaning Solution</div>
            <p className="text-xs text-muted-foreground">320 liters this month</p>
          </CardContent>
        </Card>
        <Card className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.25 / appointment</div>
            <p className="text-xs text-muted-foreground">-8% from last month</p>
          </CardContent>
        </Card>
        <Card className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18%</div>
            <p className="text-xs text-muted-foreground">Improvement since last quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Material Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="safety">Safety</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="team-a">Team A</SelectItem>
            <SelectItem value="team-b">Team B</SelectItem>
            <SelectItem value="team-c">Team C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="consumption">
        <TabsList>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
        </TabsList>
        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Consumption Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Consumption trend chart would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consumption by Material</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity Used</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Usage Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Cleaning Solution</TableCell>
                    <TableCell>Cleaning</TableCell>
                    <TableCell>320</TableCell>
                    <TableCell>Liters</TableCell>
                    <TableCell className="text-green-600">↑ 12%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Microfiber Cloths</TableCell>
                    <TableCell>Cleaning</TableCell>
                    <TableCell>450</TableCell>
                    <TableCell>Pieces</TableCell>
                    <TableCell className="text-red-600">↓ 5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Disinfectant Spray</TableCell>
                    <TableCell>Cleaning</TableCell>
                    <TableCell>85</TableCell>
                    <TableCell>Bottles</TableCell>
                    <TableCell className="text-green-600">↑ 8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gloves</TableCell>
                    <TableCell>Safety</TableCell>
                    <TableCell>620</TableCell>
                    <TableCell>Pairs</TableCell>
                    <TableCell>No change</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Face Masks</TableCell>
                    <TableCell>Safety</TableCell>
                    <TableCell>250</TableCell>
                    <TableCell>Pieces</TableCell>
                    <TableCell className="text-red-600">↓ 15%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Inventory levels chart would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Delivery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Cleaning Solution</TableCell>
                    <TableCell>25 Liters</TableCell>
                    <TableCell>20 Liters</TableCell>
                    <TableCell className="text-green-600">OK</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Microfiber Cloths</TableCell>
                    <TableCell>150 Pieces</TableCell>
                    <TableCell>100 Pieces</TableCell>
                    <TableCell className="text-green-600">OK</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Disinfectant Spray</TableCell>
                    <TableCell>8 Bottles</TableCell>
                    <TableCell>10 Bottles</TableCell>
                    <TableCell className="text-amber-600">Low</TableCell>
                    <TableCell>May 28, 2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gloves</TableCell>
                    <TableCell>200 Pairs</TableCell>
                    <TableCell>150 Pairs</TableCell>
                    <TableCell className="text-green-600">OK</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Face Masks</TableCell>
                    <TableCell>50 Pieces</TableCell>
                    <TableCell>75 Pieces</TableCell>
                    <TableCell className="text-red-600">Critical</TableCell>
                    <TableCell>May 30, 2023</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Cost analysis chart would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Material Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Monthly Usage</TableHead>
                    <TableHead>Monthly Cost</TableHead>
                    <TableHead>Cost Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Cleaning Solution</TableCell>
                    <TableCell>$12.50/L</TableCell>
                    <TableCell>320 Liters</TableCell>
                    <TableCell>$4,000.00</TableCell>
                    <TableCell className="text-red-600">↑ 5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Microfiber Cloths</TableCell>
                    <TableCell>$1.25/pc</TableCell>
                    <TableCell>450 Pieces</TableCell>
                    <TableCell>$562.50</TableCell>
                    <TableCell className="text-green-600">↓ 2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Disinfectant Spray</TableCell>
                    <TableCell>$8.75/bottle</TableCell>
                    <TableCell>85 Bottles</TableCell>
                    <TableCell>$743.75</TableCell>
                    <TableCell className="text-red-600">↑ 3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gloves</TableCell>
                    <TableCell>$0.50/pair</TableCell>
                    <TableCell>620 Pairs</TableCell>
                    <TableCell>$310.00</TableCell>
                    <TableCell>No change</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Face Masks</TableCell>
                    <TableCell>$0.75/pc</TableCell>
                    <TableCell>250 Pieces</TableCell>
                    <TableCell>$187.50</TableCell>
                    <TableCell className="text-green-600">↓ 10%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
