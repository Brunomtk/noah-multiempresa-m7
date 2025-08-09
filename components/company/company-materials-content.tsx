"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Package, AlertTriangle, TrendingUp, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

import { CompanyMaterialModal } from "./company-material-modal"
import { CompanyMaterialDetailsModal } from "./company-material-details-modal"
import { CompanyUseMaterialModal } from "./company-use-material-modal"
import { CompanyAddStockModal } from "./company-add-stock-modal"

import { useCompanyMaterials } from "@/hooks/use-company-materials"

interface Material {
  id: number
  name: string
  category: string
  supplier: string
  unitPrice: number
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  description?: string
  status: "active" | "inactive"
  lastUpdated: string
}

export function CompanyMaterialsContent() {
  const {
    materials,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilters,
    statistics,
    formatCurrency,
    formatDate,
    getStockStatusColor,
    getStockStatusLabel,
    getCategoryColor,
    reloadData,
  } = useCompanyMaterials()

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showUseModal, setShowUseModal] = useState(false)
  const [showAddStockModal, setShowAddStockModal] = useState(false)

  // Load data on component mount
  useEffect(() => {
    reloadData()
  }, [])

  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material)
    setShowDetailsModal(true)
  }

  const handleUseMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setShowUseModal(true)
  }

  const handleAddStock = (material: Material) => {
    setSelectedMaterial(material)
    setShowAddStockModal(true)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar materiais</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={reloadData} className="bg-[#06b6d4] hover:bg-[#0891b2]">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Materiais</CardTitle>
            <Package className="h-4 w-4 text-[#06b6d4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.totalMaterials}</div>
            <p className="text-xs text-gray-400">Materiais cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.lowStockCount}</div>
            <p className="text-xs text-gray-400">Materiais com estoque baixo</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Sem Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.outOfStockCount}</div>
            <p className="text-xs text-gray-400">Materiais sem estoque</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(statistics.totalValue)}</div>
            <p className="text-xs text-gray-400">Valor do estoque</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Materiais</CardTitle>
            <CompanyMaterialModal>
              <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Material
              </Button>
            </CompanyMaterialModal>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar materiais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-[#0f172a] border-[#2a3349] text-white"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.category || "Todas"}
                onValueChange={(value) => updateFilters({ ...filters, category: value || undefined })}
              >
                <SelectTrigger className="w-[180px] bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                  <SelectItem value="Todas">Todas</SelectItem>
                  <SelectItem value="Produtos de Limpeza">Produtos de Limpeza</SelectItem>
                  <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                  <SelectItem value="Descartáveis">Descartáveis</SelectItem>
                  <SelectItem value="Uniformes">Uniformes</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.supplier || "Todos"}
                onValueChange={(value) => updateFilters({ ...filters, supplier: value || undefined })}
              >
                <SelectTrigger className="w-[180px] bg-[#0f172a] border-[#2a3349] text-white">
                  <SelectValue placeholder="Fornecedor" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Fornecedor A">Fornecedor A</SelectItem>
                  <SelectItem value="Fornecedor B">Fornecedor B</SelectItem>
                  <SelectItem value="Fornecedor C">Fornecedor C</SelectItem>
                  <SelectItem value="Fornecedor D">Fornecedor D</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => updateFilters({ ...filters, lowStock: !filters.lowStock })}
                className={`border-[#2a3349] ${
                  filters.lowStock
                    ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                    : "text-white hover:bg-[#2a3349]"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Estoque Baixo
              </Button>
            </div>
          </div>

          {/* Materials Table */}
          <div className="rounded-md border border-[#2a3349]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2a3349] hover:bg-[#2a3349]/50">
                  <TableHead className="text-gray-400">Material</TableHead>
                  <TableHead className="text-gray-400">Categoria</TableHead>
                  <TableHead className="text-gray-400">Fornecedor</TableHead>
                  <TableHead className="text-gray-400">Estoque</TableHead>
                  <TableHead className="text-gray-400">Preço Unit.</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="border-[#2a3349]">
                      <TableCell>
                        <Skeleton className="h-4 w-32 bg-[#2a3349]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24 bg-[#2a3349]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28 bg-[#2a3349]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16 bg-[#2a3349]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20 bg-[#2a3349]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16 bg-[#2a3349]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24 bg-[#2a3349]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : materials.length === 0 ? (
                  <TableRow className="border-[#2a3349]">
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      Nenhum material encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((material) => (
                    <TableRow
                      key={material.id}
                      className="border-[#2a3349] hover:bg-[#2a3349]/50 cursor-pointer"
                      onClick={() => handleMaterialClick(material)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{material.name}</div>
                          <div className="text-sm text-gray-400">{material.unit}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(material.category)}>{material.category}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{material.supplier}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${getStockStatusColor(material.currentStock, material.minStock)}`}
                          >
                            {material.currentStock}
                          </span>
                          <span className="text-gray-400">/ {material.maxStock}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {getStockStatusLabel(material.currentStock, material.minStock)}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{formatCurrency(material.unitPrice)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            material.status === "active"
                              ? "bg-green-500/20 text-green-500 border-green-500/30"
                              : "bg-gray-500/20 text-gray-500 border-gray-500/30"
                          }
                        >
                          {material.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUseMaterial(material)
                            }}
                            className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                          >
                            Usar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddStock(material)
                            }}
                            className="border-[#2a3349] text-white hover:bg-[#2a3349]"
                          >
                            Adicionar
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

      {/* Modals */}
      {selectedMaterial && (
        <>
          <CompanyMaterialDetailsModal
            material={selectedMaterial}
            open={showDetailsModal}
            onOpenChange={setShowDetailsModal}
          />
          <CompanyUseMaterialModal material={selectedMaterial} open={showUseModal} onOpenChange={setShowUseModal} />
          <CompanyAddStockModal
            material={selectedMaterial}
            open={showAddStockModal}
            onOpenChange={setShowAddStockModal}
          />
        </>
      )}
    </div>
  )
}
