"use client"

import { useState } from "react"
import {
  BarChart,
  Calendar,
  Download,
  FileText,
  Filter,
  PieChart,
  RefreshCw,
  Save,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/admin/date-range-picker"
import { ReportChart } from "@/components/admin/report-chart"
import { ReportTable } from "@/components/admin/report-table"
import { ReportFilters } from "@/components/admin/report-filters"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("financial")
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
        description: "Data has been updated with the latest information.",
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
      description: "This report will be sent automatically according to the defined schedule.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View and export detailed reports on platform performance.</p>
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
            <ReportFilters onApply={() => setShowFilters(false)} />
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

      <Tabs defaultValue="financial" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="financial">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="operational">
            <BarChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Operational</span>
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="custom">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Custom</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Ticket</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$320.50</div>
                <p className="text-xs text-muted-foreground">+2.5% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.8%</div>
                <p className="text-xs text-muted-foreground">+4.1% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancellations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">-1.1% from previous period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
                <CardDescription>Revenue distribution by service type</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="pie" />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="line" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>List of recent financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportTable type="financial" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12.3% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <p className="text-xs text-muted-foreground">+5.2% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Time</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42 min</div>
                <p className="text-xs text-muted-foreground">-3.1% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8/5</div>
                <p className="text-xs text-muted-foreground">+0.2 from previous period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Appointments by Day of Week</CardTitle>
                <CardDescription>Distribution of appointments by day</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="bar" />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Service Duration</CardTitle>
                <CardDescription>Average time by service type</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="bar-horizontal" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Professional Performance</CardTitle>
              <CardDescription>Performance metrics by professional</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportTable type="operational" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">842</div>
                <p className="text-xs text-muted-foreground">+18.2% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,427</div>
                <p className="text-xs text-muted-foreground">+7.4% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76.3%</div>
                <p className="text-xs text-muted-foreground">+2.1% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7/5</div>
                <p className="text-xs text-muted-foreground">+0.3 from previous period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New users per month</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="line" />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Demographic Distribution</CardTitle>
                <CardDescription>Users by age group and gender</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReportChart type="bar-stacked" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Latest activities recorded on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportTable type="users" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Create and manage custom reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">My Reports</h3>
                    <p className="text-sm text-muted-foreground">Previously saved reports</p>
                  </div>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    New Report
                  </Button>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Custom Report {i}</CardTitle>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>Created on {new Date().toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {i === 1 && "Professional performance analysis by region"}
                          {i === 2 && "Revenue comparison by service over the last 6 months"}
                          {i === 3 && "Customer satisfaction report by service category"}
                          {i === 4 && "Appointment trend analysis by time of day"}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {i === 1 && "Professionals"}
                            {i === 2 && "Financial"}
                            {i === 3 && "Customers"}
                            {i === 4 && "Appointments"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Updated weekly
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
                  <div>
                    <h3 className="text-lg font-medium">Scheduled Reports</h3>
                    <p className="text-sm text-muted-foreground">Reports sent automatically</p>
                  </div>
                  <Button variant="outline" onClick={handleScheduleReport}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">
                          {i === 1 ? "Monthly Financial Report" : "Weekly Performance Report"}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
