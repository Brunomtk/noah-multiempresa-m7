"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Calendar,
  Filter,
  Package,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportChart } from "@/components/admin/report-chart"
import { MaterialConsumptionTable } from "@/components/admin/material-consumption-table"
import { toast } from "@/components/ui/use-toast"
import { companyMaterialsApi } from "@/lib/api/company-materials"
import type { Material } from "@/types/material"

export default function MaterialReportsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [dateRange, setDateRange] = useState({ from: new Date(2023, 0, 1), to: new Date() })
  const [showFilters, setShowFilters] = useState(false)
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMaterials: 0,
    lowStockItems: 0,
    totalValue: 0,
    expiringSoon: 0,
    outOfStock: 0,
    categories: [] as string[],
    suppliers: [] as string[],
  })

  // Load materials data
  useEffect(() => {
    loadMaterialsData()
  }, [])

  const loadMaterialsData = async () => {
    try {
      setLoading(true)
      const response = await companyMaterialsApi.list({
        page: 1,
        pageSize: 1000, // Get all materials for dashboard
      })

      setMaterials(response.results)
      calculateStats(response.results)
    } catch (error) {
      console.error("Error loading materials:", error)
      toast({
        title: "Error loading materials",
        description: "Failed to load materials data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (materialsData: Material[]) => {
    const totalMaterials = materialsData.length
    const lowStockItems = materialsData.filter((m) => m.currentStock <= m.minStock).length
    const outOfStock = materialsData.filter((m) => m.currentStock === 0).length
    const totalValue = materialsData.reduce((sum, m) => sum + m.currentStock * m.unitPrice, 0)

    // Calculate expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const expiringSoon = materialsData.filter((m) => {
      if (!m.expirationDate) return false
      const expiryDate = new Date(m.expirationDate)
      return expiryDate <= thirtyDaysFromNow && expiryDate > new Date()
    }).length

    const categories = [...new Set(materialsData.map((m) => m.category))]
    const suppliers = [...new Set(materialsData.map((m) => m.supplier))]

    setStats({
      totalMaterials,
      lowStockItems,
      totalValue,
      expiringSoon,
      outOfStock,
      categories,
      suppliers,
    })
  }

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      loadMaterialsData() // Refresh data
      toast({
        title: "Report generated successfully",
        description: "Material data has been updated with the latest information.",
      })
    }, 1500)
  }

  const handleExportReport = (format: string) => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: `Report exported as ${format.toUpperCase()}`,
        description: "The download will start automatically in a few seconds.",
      })
    }, 1500)
  }

  // Prepare chart data
  const categoryData = stats.categories.map((category) => {
    const categoryMaterials = materials.filter((m) => m.category === category)
    const value = categoryMaterials.reduce((sum, m) => sum + m.currentStock * m.unitPrice, 0)
    return {
      name: category,
      value: Math.round(value),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }
  })

  const stockStatusData = [
    { name: "In Stock", value: stats.totalMaterials - stats.lowStockItems - stats.outOfStock, color: "#10b981" },
    { name: "Low Stock", value: stats.lowStockItems, color: "#f59e0b" },
    { name: "Out of Stock", value: stats.outOfStock, color: "#ef4444" },
  ]

  const supplierData = stats.suppliers.slice(0, 5).map((supplier) => {
    const supplierMaterials = materials.filter((m) => m.supplier === supplier)
    const value = supplierMaterials.reduce((sum, m) => sum + m.currentStock * m.unitPrice, 0)
    return {
      name: supplier,
      value: Math.round(value),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Material Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time material inventory and usage monitoring.</p>
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
                Refreshing...
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

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.totalMaterials}</div>
                <p className="text-xs text-muted-foreground">{stats.categories.length} categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(stats.totalValue)}</div>
                <p className="text-xs text-muted-foreground">Current market value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{loading ? "..." : stats.lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{loading ? "..." : stats.expiringSoon}</div>
                <p className="text-xs text-muted-foreground">Within 30 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
                <CardDescription>Value distribution by material category</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">Loading...</div>
                  ) : (
                    <ReportChart type="pie" data={categoryData} />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stock Status</CardTitle>
                <CardDescription>Current stock level distribution</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">Loading...</div>
                  ) : (
                    <ReportChart type="pie" data={stockStatusData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>Complete list of materials with current stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <MaterialConsumptionTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {stats.outOfStock > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Out of Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700">
                    {stats.outOfStock} materials are completely out of stock and need immediate restocking.
                  </p>
                </CardContent>
              </Card>
            )}

            {stats.lowStockItems > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Low Stock Warning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">
                    {stats.lowStockItems} materials are running low and should be restocked soon.
                  </p>
                </CardContent>
              </Card>
            )}

            {stats.expiringSoon > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Expiration Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700">{stats.expiringSoon} materials will expire within the next 30 days.</p>
                </CardContent>
              </Card>
            )}

            {stats.outOfStock === 0 && stats.lowStockItems === 0 && stats.expiringSoon === 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    All Good!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700">No critical alerts at this time. All materials are properly stocked.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Suppliers by Value</CardTitle>
                <CardDescription>Suppliers with highest inventory value</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">Loading...</div>
                  ) : (
                    <ReportChart type="bar" data={supplierData} />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Health Score</CardTitle>
                <CardDescription>Overall inventory management performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stock Availability</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.totalMaterials > 0
                        ? Math.round(((stats.totalMaterials - stats.outOfStock) / stats.totalMaterials) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stock Optimization</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.totalMaterials > 0
                        ? Math.round(
                            ((stats.totalMaterials - stats.lowStockItems - stats.outOfStock) / stats.totalMaterials) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Freshness Score</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.totalMaterials > 0
                        ? Math.round(((stats.totalMaterials - stats.expiringSoon) / stats.totalMaterials) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
