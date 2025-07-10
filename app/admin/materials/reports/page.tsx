"use client"

import { useState } from "react"
import { BarChart, Calendar, Filter, Package, RefreshCw, Save, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/admin/date-range-picker"
import { ReportChart } from "@/components/admin/report-chart"
import { ReportTable } from "@/components/admin/report-table"
import { MaterialReportFilters } from "@/components/admin/material-report-filters"
import { MaterialConsumptionTable } from "@/components/admin/material-consumption-table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function MaterialReportsPage() {
  const [activeTab, setActiveTab] = useState("consumption")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [dateRange, setDateRange] = useState({ from: new Date(2023, 0, 1), to: new Date() })
  const [showFilters, setShowFilters] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Report generated successfully",
        description: "Material consumption data has been updated with the latest information.",
      })
    }, 1500)
  }

  const handleExportReport = (format: string) => {
    setIsExporting(true)
    // Simulate export
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: `Report exported as ${format.toUpperCase()}`,
        description: "The download will start automatically in a few seconds.",
      })
    }, 1500)
  }

  const handleScheduleReport = () => {
    toast({
      title: "Report scheduled",
      description: "This material consumption report will be sent automatically according to the defined schedule.",
    })
  }

  // Mock data for material consumption by company
  const companyConsumptionData = [
    { name: "CleanCo Services", value: 35, color: "#06b6d4" },
    { name: "Sparkle Cleaning", value: 25, color: "#0ea5e9" },
    { name: "Fresh & Clean", value: 15, color: "#3b82f6" },
    { name: "Elite Cleaners", value: 10, color: "#6366f1" },
    { name: "Other Companies", value: 15, color: "#8b5cf6" },
  ]

  // Mock data for material consumption by category
  const categoryConsumptionData = [
    { name: "Cleaning Solutions", value: 40, color: "#06b6d4" },
    { name: "Tools & Equipment", value: 30, color: "#0ea5e9" },
    { name: "Safety Gear", value: 15, color: "#3b82f6" },
    { name: "Disposables", value: 15, color: "#6366f1" },
  ]

  // Mock data for monthly consumption trend
  const monthlyConsumptionData = [
    { name: "Jan", cleaning: 1200, tools: 800, safety: 400 },
    { name: "Feb", cleaning: 1300, tools: 750, safety: 450 },
    { name: "Mar", cleaning: 1400, tools: 900, safety: 500 },
    { name: "Apr", cleaning: 1250, tools: 850, safety: 420 },
    { name: "May", cleaning: 1500, tools: 950, safety: 480 },
    { name: "Jun", cleaning: 1600, tools: 1000, safety: 520 },
    { name: "Jul", cleaning: 1700, tools: 1050, safety: 550 },
    { name: "Aug", cleaning: 1650, tools: 980, safety: 530 },
    { name: "Sep", cleaning: 1550, tools: 920, safety: 510 },
    { name: "Oct", cleaning: 1450, tools: 880, safety: 490 },
    { name: "Nov", cleaning: 1350, tools: 830, safety: 470 },
    { name: "Dec", cleaning: 1250, tools: 800, safety: 450 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Material Consumption Reports</h1>
          <p className="text-muted-foreground">Analyze and track material usage across all companies.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
          <Select onValueChange={(value) => handleExportReport(value)}>
            <SelectTrigger className="w-[140px]" disabled={isExporting}>
              <SelectValue placeholder={isExporting ? "Exporting..." : "Export"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">Export PDF</SelectItem>
              <SelectItem value="excel">Export Excel</SelectItem>
              <SelectItem value="csv">Export CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <MaterialReportFilters onApply={() => setShowFilters(false)} />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <DatePickerWithRange dateRange={dateRange} onDateRangeChange={setDateRange} />
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-xs py-1">
            Last quarter
          </Badge>
          <Badge variant="outline" className="text-xs py-1">
            Last month
          </Badge>
          <Badge variant="outline" className="text-xs py-1">
            Last 7 days
          </Badge>
          <Badge variant="outline" className="text-xs py-1">
            Today
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="consumption" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:w-[500px]">
          <TabsTrigger value="consumption">
            <BarChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Consumption</span>
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="costs">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Costs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consumption" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543 units</div>
                <p className="text-xs text-muted-foreground">+8.2% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Used Material</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">All-Purpose Cleaner</div>
                <p className="text-xs text-muted-foreground">2,345 units (18.7% of total)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Per Appointment</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8 units</div>
                <p className="text-xs text-muted-foreground">-0.3 from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">+2.1% from previous period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Consumption by Company</CardTitle>
                <CardDescription>Material usage distribution by company</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80">
                  <ReportChart type="pie" data={companyConsumptionData} />
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Consumption by Category</CardTitle>
                <CardDescription>Material usage by category type</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80">
                  <ReportChart type="pie" data={categoryConsumptionData} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Consumption Trend</CardTitle>
              <CardDescription>Material usage over the last 12 months by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ReportChart type="bar-stacked" data={monthlyConsumptionData} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Material Consumption Details</CardTitle>
              <CardDescription>Detailed breakdown of material usage</CardDescription>
            </CardHeader>
            <CardContent>
              <MaterialConsumptionTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,876 units</div>
                <p className="text-xs text-muted-foreground">+3.2% from previous month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14 items</div>
                <p className="text-xs text-muted-foreground">-3 from previous month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$128,450</div>
                <p className="text-xs text-muted-foreground">+5.4% from previous month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2x</div>
                <p className="text-xs text-muted-foreground">+0.3 from previous month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Inventory Distribution</CardTitle>
                <CardDescription>Current inventory by material category</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="pie" />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Stock levels over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="line" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current inventory levels and status</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportTable type="operational" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Material Costs</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,230</div>
                <p className="text-xs text-muted-foreground">+7.8% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Per Appointment</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$18.45</div>
                <p className="text-xs text-muted-foreground">-2.3% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Cost Item</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Vacuum Cleaner</div>
                <p className="text-xs text-muted-foreground">$8,750 total spend</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,450</div>
                <p className="text-xs text-muted-foreground">+12.5% from previous period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Cost by Category</CardTitle>
                <CardDescription>Material costs by category</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="pie" />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Cost Trend</CardTitle>
                <CardDescription>Monthly material costs</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="line" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Detailed breakdown of material costs</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportTable type="financial" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Configure automatic material consumption reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">My Scheduled Reports</h3>
                <p className="text-sm text-muted-foreground">Reports sent automatically on schedule</p>
              </div>
              <Button onClick={handleScheduleReport}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Report
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">
                      {i === 1 ? "Monthly Material Consumption Report" : "Weekly Inventory Status Report"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 ? "Sent every 1st day of the month" : "Sent every Monday"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{i === 1 ? "Monthly" : "Weekly"}</Badge>
                    <Button variant="ghost" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
