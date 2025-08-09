"use client"

import { useState } from "react"
import { Plus, Search, Filter, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminMaterials } from "@/hooks/use-admin-materials"
import { MaterialModal } from "./material-modal"
import { MaterialDetailsModal } from "./material-details-modal"
import { PageLoading } from "@/components/ui/page-loading"

export function MaterialsContent() {
  const {
    materials,
    loading,
    error,
    filters,
    stats,
    totalCount,
    totalPages,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
    updateStock,
    updateFilters,
    setPage,
    reloadData,
  } = useAdminMaterials()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)

  if (loading && materials.length === 0) {
    return <PageLoading />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading materials: {error}</p>
          <Button onClick={reloadData}>Try Again</Button>
        </div>
      </div>
    )
  }

  const handleViewDetails = async (material: any) => {
    setSelectedMaterial(material)
    setShowDetailsModal(true)
  }

  const handleEdit = async (material: any) => {
    setSelectedMaterial(material)
    setShowCreateModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this material?")) {
      await deleteMaterial(id)
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
  }

  const getStockStatus = (material: any) => {
    if (!material || typeof material.currentStock !== "number" || typeof material.minimumStock !== "number") {
      return <Badge variant="secondary">Unknown</Badge>
    }

    if (material.currentStock <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }

    if (material.currentStock <= material.minimumStock) {
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-600">
          Low Stock
        </Badge>
      )
    }

    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        In Stock
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Materials Management</h1>
          <p className="text-muted-foreground">Manage your inventory and materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaterials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMaterials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockMaterials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={filters.search || ""}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => updateFilters({ category: value === "all" ? undefined : value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {stats.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
              onValueChange={(value) =>
                updateFilters({
                  isActive: value === "all" ? undefined : value === "true",
                })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => updateFilters({ lowStock: !filters.lowStock })}
              className={filters.lowStock ? "bg-orange-100 border-orange-300" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              Low Stock Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Materials ({totalCount})</CardTitle>
          <CardDescription>
            Showing {materials.length} of {totalCount} materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No materials found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Cost per Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.category}</TableCell>
                      <TableCell>{typeof material.currentStock === "number" ? material.currentStock : "N/A"}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>
                        ${typeof material.costPerUnit === "number" ? material.costPerUnit.toFixed(2) : "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(material.isActive)}</TableCell>
                      <TableCell>{getStockStatus(material)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(material)}>
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(material)}>
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(material.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {filters.page || 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((filters.page || 1) - 1)}
                  disabled={!filters.page || filters.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((filters.page || 1) + 1)}
                  disabled={!filters.page || filters.page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <MaterialModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        material={selectedMaterial}
        onSave={async (data) => {
          if (selectedMaterial) {
            await updateMaterial(selectedMaterial.id, data)
          } else {
            await createMaterial(data)
          }
          setShowCreateModal(false)
          setSelectedMaterial(null)
        }}
      />

      <MaterialDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        material={selectedMaterial}
        onEdit={() => {
          setShowDetailsModal(false)
          setShowCreateModal(true)
        }}
        onDelete={async () => {
          if (selectedMaterial) {
            await handleDelete(selectedMaterial.id)
            setShowDetailsModal(false)
            setSelectedMaterial(null)
          }
        }}
      />
    </div>
  )
}
