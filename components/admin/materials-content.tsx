"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Package,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Archive,
  Filter,
  RefreshCw,
} from "lucide-react"
import { useAdminMaterials, type Material } from "@/hooks/use-admin-materials"
import { MaterialModal } from "@/components/admin/material-modal"
import { MaterialDetailsModal } from "@/components/admin/material-details-modal"

export function MaterialsContent() {
  const {
    materials,
    loading,
    error,
    filters,
    stats,
    totalCount,
    totalPages,
    updateFilters,
    setPage,
    reloadData,
    deleteMaterial,
  } = useAdminMaterials()

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null)

  const handleSearch = (value: string) => {
    updateFilters({ search: value })
  }

  const handleCategoryFilter = (category: string) => {
    updateFilters({ category: category === "all" ? undefined : category })
  }

  const handleStatusFilter = (status: string) => {
    updateFilters({
      isActive: status === "all" ? undefined : status === "active",
    })
  }

  const handleStockFilter = (stock: string) => {
    updateFilters({
      lowStock: stock === "low" ? true : undefined,
    })
  }

  const handleSort = (sortBy: string) => {
    const newOrder = filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc"
    updateFilters({ sortBy: sortBy as any, sortOrder: newOrder })
  }

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material)
    setShowEditModal(true)
  }

  const handleDetails = (material: Material) => {
    setSelectedMaterial(material)
    setShowDetailsModal(true)
  }

  const handleDeleteClick = (material: Material) => {
    setMaterialToDelete(material)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (materialToDelete) {
      await deleteMaterial(materialToDelete.id)
      setShowDeleteDialog(false)
      setMaterialToDelete(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStockStatus = (material: Material) => {
    if (!material || material.currentStock === null || material.currentStock === undefined) {
      return { label: "Unknown", color: "bg-gray-100 text-gray-800 border-gray-200" }
    }

    if (material.currentStock <= 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" }
    }
    if (material.currentStock <= material.minimumStock) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    }
    return { label: "In Stock", color: "bg-green-100 text-green-800 border-green-200" }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Materials</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={reloadData} className="bg-[#06b6d4] hover:bg-[#0891b2]">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Materials Management</h1>
          <p className="text-gray-400">Manage your cleaning materials and supplies</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-[#06b6d4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalMaterials}</div>
            <p className="text-xs text-gray-400">{stats.activeMaterials} active</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.lowStockMaterials}</div>
            <p className="text-xs text-gray-400">Need restocking</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-gray-400">Inventory value</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Categories</CardTitle>
            <Archive className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.categories.length}</div>
            <p className="text-xs text-gray-400">Material types</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search materials..."
                value={filters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-[#0f172a] border-[#2a3349] text-white"
              />
            </div>

            <Select value={filters.category || "all"} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                <SelectItem value="all">All Categories</SelectItem>
                {stats.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.isActive === undefined ? "all" : filters.isActive ? "active" : "inactive"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.lowStock ? "low" : "all"} onValueChange={handleStockFilter}>
              <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="low">Low Stock Only</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={reloadData}
              className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <CardTitle className="text-white">Materials ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded bg-[#2a3349]" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px] bg-[#2a3349]" />
                    <Skeleton className="h-4 w-[200px] bg-[#2a3349]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-[#2a3349]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2a3349] hover:bg-[#2a3349]/50">
                    <TableHead
                      className="text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      {filters.sortBy === "name" && (
                        <TrendingUp
                          className={`ml-2 h-4 w-4 inline ${filters.sortOrder === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </TableHead>
                    <TableHead
                      className="text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("category")}
                    >
                      Category
                    </TableHead>
                    <TableHead
                      className="text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("currentStock")}
                    >
                      Stock
                    </TableHead>
                    <TableHead
                      className="text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("costPerUnit")}
                    >
                      Cost/Unit
                    </TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials
                    .filter((material) => material != null)
                    .map((material) => {
                      const stockStatus = getStockStatus(material)
                      return (
                        <TableRow
                          key={material.id}
                          className="border-[#2a3349] hover:bg-[#2a3349]/30 cursor-pointer"
                          onClick={() => handleDetails(material)}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{material.name}</div>
                              <div className="text-sm text-gray-400">{material.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[#06b6d4] border-[#06b6d4]/30">
                              {material.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-white">
                                {material.currentStock || 0} {material.unit}
                              </span>
                              <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                            </div>
                            <div className="text-sm text-gray-400">Min: {material.minimumStock}</div>
                          </TableCell>
                          <TableCell className="text-white">{formatCurrency(material.costPerUnit || 0)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                material.isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                              }
                            >
                              {material.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#1a2234] border-[#2a3349] text-white">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDetails(material)
                                  }}
                                  className="hover:bg-[#2a3349]"
                                >
                                  <Package className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(material)
                                  }}
                                  className="hover:bg-[#2a3349]"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteClick(material)
                                  }}
                                  className="hover:bg-red-600 text-red-400"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-400">
                Showing {materials.length} of {totalCount} materials
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, (filters.page || 1) - 1))}
                  disabled={filters.page === 1}
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-400">
                  Page {filters.page || 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, (filters.page || 1) + 1))}
                  disabled={filters.page === totalPages}
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
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
        onSuccess={() => {
          setShowCreateModal(false)
          reloadData()
        }}
      />

      <MaterialModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        material={selectedMaterial}
        onSuccess={() => {
          setShowEditModal(false)
          setSelectedMaterial(null)
          reloadData()
        }}
      />

      <MaterialDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        material={selectedMaterial}
        onEdit={() => {
          setShowDetailsModal(false)
          setShowEditModal(true)
        }}
        onDelete={() => {
          setShowDetailsModal(false)
          if (selectedMaterial) {
            handleDeleteClick(selectedMaterial)
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1a2234] border-[#2a3349]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Material</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{materialToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
